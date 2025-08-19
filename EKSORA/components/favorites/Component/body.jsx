import React, { useState, useCallback, useContext, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";

// API services
import { getFavoriteToursByUser } from "../../../API/services/servicesFavorite";
import { fetchTourDetail } from "../../../API/services/tourService";

import { parseDescription } from "../../../utils/tourDetailHelpers";

// Components
import FavoriteItem from "../FavoriteItem";
import SuggestionModal from "./SuggestionModal";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import { FavoriteContext } from "../../../store/FavoriteContext";

export default function Body() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  // State để theo dõi người dùng đã đăng nhập hay chưa.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // States cho tính năng chọn nhiều
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());

  const router = useRouter();

  // Lắng nghe thay đổi từ FavoriteContext
  const { likedTours, removeFavorite } = useContext(FavoriteContext);

  const loadFavoriteTours = useCallback(async () => {
    setLoading(true);
    setError(null); // Luôn reset lỗi mỗi khi tải lại

    try {
      const token = await AsyncStorage.getItem("ACCESS_TOKEN");
      const userId = await AsyncStorage.getItem("USER_ID");

      // BƯỚC 1: KIỂM TRA ĐIỀU KIỆN ĐĂNG NHẬP
      // Nếu không tìm thấy token hoặc userId, đây là khách truy cập.
      if (!token || !userId) {
        setIsLoggedIn(false); // Cập nhật state: CHƯA ĐĂNG NHẬP
        setTours([]); // Xóa dữ liệu cũ
        setLoading(false); // Dừng màn hình loading
        return; // <<< Thoát khỏi hàm ngay lập tức để không gọi API
      }

      // Nếu code chạy tới đây, người dùng chắc chắn đã đăng nhập.
      setIsLoggedIn(true); // Cập nhật state: ĐÃ ĐĂNG NHẬP

      // BƯỚC 2: GỌI API VÌ ĐÃ CÓ THÔNG TIN XÁC THỰC
      const res = await getFavoriteToursByUser(userId, token);
      const favoriteList = res?.data || [];

      // BƯỚC 3: XỬ LÝ DỮ LIỆU NHẬN ĐƯỢC
      const formattedTours = await Promise.all(
        favoriteList
          .filter((item) => item.tour_id && typeof item.tour_id === "object")
          .map(async (item) => {
            const tourId = item.tour_id._id;
            let detail = {};
            let reviewCount = 0;
            try {
              const res = await fetchTourDetail(tourId);
              detail = res?.tour || {};
              reviewCount =
                res?.reviews?.length || res?.tour?.reviews?.length || 0;
            } catch (err) {
              console.warn(`Không thể lấy chi tiết cho tour ${tourId}:`, err);
            }

            const rawDescription =
              detail.description || item.tour_id.description || "";
            const shortDescriptionText = parseDescription(rawDescription)
              .filter((part) => part.type === "text")
              .map((part) => part.content)
              .join(" ")
              .trim();

            return {
              id: tourId,
              title: detail.name || item.tour_id.name,
              price: detail.price || item.tour_id.price,
              location:
                detail.location || item.tour_id.location || "Địa điểm chưa có",
              image:
                Array.isArray(detail.image) && detail.image.length > 0
                  ? detail.image[0]
                  : "https://via.placeholder.com/300",
              rating: detail.rating || 0,
              totalReviews: reviewCount,
              shortDescription: shortDescriptionText,
            };
          })
      );
      setTours(formattedTours);
    } catch (apiError) {
      // Khối catch này bây giờ chỉ xử lý lỗi thực sự
      // cho người dùng đã đăng nhập.
      console.error("Lỗi API khi tải danh sách yêu thích:", apiError);
      setError("Không thể tải danh sách yêu thích. Vui lòng thử lại.");
    } finally {
      setLoading(false); // Luôn dừng loading sau khi hoàn tất
    }
  }, []);

  // Tải dữ liệu mỗi khi màn hình được người dùng focus
  useFocusEffect(
    useCallback(() => {
      loadFavoriteTours();
    }, [loadFavoriteTours])
  );

  // Lắng nghe thay đổi từ FavoriteContext để cập nhật ngay lập tức
  useEffect(() => {
    if (isLoggedIn && likedTours) {
      // Lọc ra những tour còn trong danh sách yêu thích
      setTours((prevTours) =>
        prevTours.filter(
          (tour) =>
            likedTours.includes(tour.id.toString()) ||
            likedTours.includes(tour.id)
        )
      );
    }
  }, [likedTours, isLoggedIn]);

  const handleCloseModal = (shouldReload) => {
    setModalVisible(false);
    if (shouldReload) {
      loadFavoriteTours();
    }
  };

  const handleViewSuggestions = () => {
    router.push({
      pathname: "/(stack)/suggestions",
      params: {
        location: "all",
        locationName: "Tất cả",
        source: "favorites",
      },
    });
  };

  // Các hàm xử lý cho tính năng chọn nhiều
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedItems(new Set());
  };

  const toggleItemSelection = (itemId) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(itemId)) {
      newSelectedItems.delete(itemId);
    } else {
      newSelectedItems.add(itemId);
    }
    setSelectedItems(newSelectedItems);
  };

  const selectAllItems = () => {
    if (selectedItems.size === tours.length) {
      // Nếu đã chọn tất cả, bỏ chọn tất cả
      setSelectedItems(new Set());
    } else {
      // Chọn tất cả
      setSelectedItems(new Set(tours.map((tour) => tour.id)));
    }
  };

  const deleteSelectedItems = async () => {
    if (selectedItems.size === 0) return;

    try {
      // Xóa từng item đã chọn
      const deletePromises = Array.from(selectedItems).map((itemId) =>
        removeFavorite(itemId)
      );
      await Promise.all(deletePromises);

      // Thoát khỏi selection mode và clear selections
      setIsSelectionMode(false);
      setSelectedItems(new Set());
    } catch (error) {
      console.error("Lỗi khi xóa các item đã chọn:", error);
    }
  };

  // --- PHẦN HIỂN THỊ GIAO DIỆN (RENDER) THEO THỨ TỰ ƯU TIÊN ---

  // 1. Luôn hiển thị màn hình loading nếu đang trong quá trình tải
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  // 2. ƯU TIÊN HIỂN THỊ "YÊU CẦU ĐĂNG NHẬP" NẾU NGƯỜI DÙNG LÀ KHÁCH
  if (!isLoggedIn) {
    return (
      <View style={styles.center}>
        <Image
          source={require("../../../assets/images/favoritesUnmatched.png")}
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={styles.noResults}>
          Hãy đăng nhập để khám phá nhiều hơn
        </Text>
        <Text style={styles.explore}>
          bạn cần đăng nhập để thực hiện chức năng này
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(stack)/login/loginEmail")}
          style={[styles.exploreButton, { marginTop: 24 }]}
        >
          <Text style={styles.exploreButtonText}>Đăng nhập / Đăng ký</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3. Hiển thị lỗi chỉ khi người dùng ĐÃ ĐĂNG NHẬP nhưng API gặp sự cố
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          onPress={loadFavoriteTours}
          style={styles.exploreButton}
        >
          <Text style={styles.exploreButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 4. Hiển thị khi người dùng ĐÃ ĐĂNG NHẬP nhưng chưa có mục yêu thích nào
  if (tours.length === 0) {
    return (
      <View style={styles.center}>
        <Image
          source={require("../../../assets/images/favoritesUnmatched.png")}
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={styles.noResults}>Chưa có hoạt động nào ở đây</Text>
        <Text style={styles.explore}>
          Bắt đầu khám phá và thêm vào Yêu thích
        </Text>
        <TouchableOpacity
          onPress={handleViewSuggestions}
          style={[
            styles.exploreButton,
            {
              marginTop: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            },
          ]}
        >
          <Ionicons name="search" size={20} color="#fff" />
          <Text style={styles.exploreButtonText}>Gợi ý cho bạn</Text>
        </TouchableOpacity>

        {/*<SuggestionModal
          isVisible={modalVisible}
          onClose={handleCloseModal}
        />*/}
      </View>
    );
  }

  // 5. Hiển thị danh sách yêu thích khi đã đăng nhập và có dữ liệu
  return (
    <View style={styles.container}>
      {/* Header với các nút chọn */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={toggleSelectionMode}
          style={styles.headerButton}
        >
          <Ionicons
            name={isSelectionMode ? "close" : "checkmark-circle-outline"}
            size={24}
            color="#007bff"
          />
          <Text style={styles.headerButtonText}>
            {isSelectionMode ? "Hủy" : "Chọn"}
          </Text>
        </TouchableOpacity>

        {isSelectionMode && (
          <View style={styles.selectionActions}>
            <TouchableOpacity
              onPress={selectAllItems}
              style={styles.headerButton}
            >
              <Ionicons
                name={
                  selectedItems.size === tours.length
                    ? "checkbox"
                    : "checkbox-outline"
                }
                size={24}
                color="#007bff"
              />
              <Text style={styles.headerButtonText}>
                {selectedItems.size === tours.length
                  ? "Bỏ chọn tất cả"
                  : "Chọn tất cả"}
              </Text>
            </TouchableOpacity>

            {selectedItems.size > 0 && (
              <TouchableOpacity
                onPress={deleteSelectedItems}
                style={[styles.headerButton, styles.deleteButton]}
              >
                <Ionicons name="trash" size={24} color="#fff" />
                <Text style={[styles.headerButtonText, { color: "#fff" }]}>
                  Xóa ({selectedItems.size})
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <FlatList
        data={tours}
        renderItem={({ item }) => (
          <FavoriteItem
            {...item}
            reviewCount={item.totalReviews}
            onPress={() => {
              if (isSelectionMode) {
                toggleItemSelection(item.id);
              } else {
                router.push(`/trip-detail/${item.id}`);
              }
            }}
            isSelectionMode={isSelectionMode}
            isSelected={selectedItems.has(item.id)}
            onToggleSelection={() => toggleItemSelection(item.id)}
          />
        )}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      />
    </View>
  );
}

// --- PHẦN STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007bff",
  },
  headerButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#007bff",
  },
  selectionActions: {
    flexDirection: "row",
    gap: 8,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    borderColor: "#dc3545",
  },
  center: {
    paddingTop: 100,
    flex: 1,
    //justifyContent: 'center', // Canh giữa nội dung theo chiều dọc
    alignItems: "center", // Canh giữa nội dung theo chiều ngang
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  errorText: {
    fontSize: 16,
    color: "#d9534f",
    textAlign: "center",
    marginBottom: 16,
  },
  emptyImage: {
    width: 200,
    height: 150,
    marginBottom: 24,
  },
  noResults: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 8,
  },
  explore: {
    fontSize: 15,
    textAlign: "center",
    color: "#666",
    lineHeight: 24,
  },
  exploreButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  exploreButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
