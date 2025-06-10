import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import FavoriteItem from "../FavoriteItem";
import { getFavorites } from "../../../API/services/servicesFavorite";
import { getTours } from "../../../API/services/serverCategories";
import SuggestionCard from "../../home/SuggestionCard"; // Kiểm tra đường dẫn

export default function Body({ filterData }) {

  const { user_id, selectedDestination, selectedCategory, selectedTime } = filterData;

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestionTours, setSuggestionTours] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {

    if (!user_id) {
      console.warn('Chưa có userId để lấy danh sách favorites');

      setLoading(false);
      return;
    }

    const fetchTours = async () => {
      try {

        const data = await getFavorites(user_id); // SỬ DỤNG userId ở đây
        setTours(data);z

      } catch (error) {
        console.error("Lỗi khi tải tour:", error);
        setError("Không thể tải danh sách tour yêu thích");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const filteredTours = tours.filter((tour) => {
    if (!tour?.id) return false;

    let matches = true;

    if (
      selectedDestination &&
      tour.location?.toLowerCase().trim() !==
        selectedDestination.toLowerCase().trim()
    ) {
      matches = false;
    }

    if (selectedCategory && tour.category !== selectedCategory) {
      matches = false;
    }

    if (selectedTime && tour.createdAt) {
      const currentDate = new Date();
      const tourDate = new Date(tour.createdAt);
      const timeDiff = Math.floor(
        (currentDate - tourDate) / (1000 * 3600 * 24)
      );

      if (selectedTime === "Trong 7 ngày trước" && timeDiff > 7) {
        matches = false;
      } else if (selectedTime === "Trong 30 ngày trước" && timeDiff > 30) {
        matches = false;
      } else if (selectedTime === "Trong 6 tháng trước" && timeDiff > 180) {
        matches = false;
      } else if (selectedTime === "Trong 12 tháng trước" && timeDiff > 365) {
        matches = false;
      } else if (selectedTime === "Trong hơn 1 năm trước" && timeDiff <= 365) {
        matches = false;
      }
    }

    return matches;
  });

  const handleStartPress = async () => {
    setSuggestionLoading(true);
    setError(null);
    try {
      const data = await getTours();
      console.log("Dữ liệu từ getTours:", data); // Debug dữ liệu
      const processedData = data.map((tour) => ({
        ...tour,
        image: Array.isArray(tour.image) ? tour.image[0] : (tour.image || "https://via.placeholder.com/300"), // Fallback ảnh
      }));
      setSuggestionTours(processedData || []);
      setModalVisible(true);
    } catch (error) {
      console.error("Lỗi khi tải gợi ý tour:", error);
      setError("Không thể tải gợi ý tour");
    } finally {
      setSuggestionLoading(false);
    }
  };

  const handleCardPress = (item) => {
    console.log("Đã chọn tour:", item.title);
    // Thêm logic điều hướng nếu cần (ví dụ: router.push('/trip-detail'))
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          onPress={() => setError(null)}
          style={[styles.exploreButton, { marginTop: 16 }]}
        >
          <Text style={styles.exploreButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredTours}
        renderItem={({ item }) => <FavoriteItem {...item} />}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={
          filteredTours.length === 0 ? styles.noResultsContainer : { padding: 16 }
        }
        ListEmptyComponent={
          <View style={styles.noResultsContent}>
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
              onPress={handleStartPress}
              style={{ marginTop: 16 }}
            >
              <Text style={styles.exploreButton}>Bắt đầu</Text>
            </TouchableOpacity>
           
          </View>
        }
      />
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Thêm vào Yêu thích</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          {suggestionLoading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                onPress={handleStartPress}
                style={[styles.exploreButton, { marginTop: 16 }]}
              >
                <Text style={styles.exploreButtonText}>Thử lại</Text>
              </TouchableOpacity>
            </View>
          ) : suggestionTours.length === 0 ? (
            <View style={styles.noResultsContent}>
              <Text style={styles.noResults}>Không có gợi ý nào</Text>
            </View>
          ) : (
            <FlatList
              data={suggestionTours}
              renderItem={({ item }) => (
                <SuggestionCard
                  item={item}
                  onPress={handleCardPress}
                  source={{ uri: item.image[0] }} style={styles.cardImage} 
                />
              )}
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
              contentContainerStyle={styles.suggestionList}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
            />
          )}
           <TouchableOpacity
              onPress={() => console.log("Xem danh sách yêu thích")} 
              style={[styles.exploreButton, { marginTop: 8 }]}
            >
              <Text style={styles.exploreButtonText}>Xem danh sách yêu thích</Text>
            </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noResultsContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  noResultsContent: {
    alignItems: "center",
    marginTop: 32,
  },
  emptyImage: {
    width: 200,
    height: 150,
    marginBottom: 16,
  },
  noResults: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#999",
  },
  explore: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: "#999",
    marginTop: 8,
  },
  exploreButton: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#666",
  },
  suggestionList: {
    paddingBottom: 16,
  },
  errorContainer: {
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#d9534f",
    textAlign: "center",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginHorizontal: 4,
  },
});