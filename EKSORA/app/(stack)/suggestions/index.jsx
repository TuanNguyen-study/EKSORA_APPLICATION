import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// API Services
import {
  getTours,
  getToursByLocation,
  getCategories,
  getAllToursByLocation,
} from "../../../API/services/serverCategories";

// Components
import SuggestionCard from "../../../components/home/SuggestionCard";

// Constants
import { COLORS } from "../../../constants/colors";

export default function SuggestionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract params
  const selectedLocation = params.location || "all";
  const selectedLocationName = params.locationName || "Tất cả";
  const sourceScreen = params.source || "home"; // Để biết callback về đâu

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States cho categories filter
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTours();
  }, [selectedLocation, selectedCategory]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const categoriesData = await getCategories();
      const processedCategories = Array.isArray(categoriesData)
        ? categoriesData
        : categoriesData.data || [];

      // Thêm option "Tất cả" vào đầu danh sách
      setCategories([{ _id: "all", name: "Tất cả" }, ...processedCategories]);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);

      let toursData;

      // Logic lấy tours dựa trên location và category
      if (selectedCategory !== "all") {
        // Nếu có chọn category cụ thể, dùng getAllToursByLocation
        toursData = await getAllToursByLocation(selectedCategory);
      } else if (selectedLocation === "all") {
        // Nếu không chọn category và location là "all"
        toursData = await getTours();
      } else {
        // Nếu không chọn category nhưng có location cụ thể
        toursData = await getToursByLocation(selectedLocation);
      }

      const processedTours = (
        Array.isArray(toursData) ? toursData : toursData.data || []
      )
        .map((tour) => ({
          ...tour,
          image: tour.image?.[0] || "https://via.placeholder.com/300",
        }))
        .filter((tour) => {
          // Lọc bỏ các tour có giá 0 đồng
          const price = tour.price || 0;
          return price > 0;
        });

      setTours(processedTours);
    } catch (err) {
      console.error("Error fetching tours:", err);
      setError("Không thể tải danh sách tour. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleTourPress = (tour) => {
    if (!tour?._id) return;
    router.push(`/trip-detail/${tour._id}`);
  };

  const handleBack = () => {
    if (sourceScreen === "favorites") {
      router.push("/(tabs)/favorites");
    } else {
      router.back();
    }
  };

  const renderTourItem = ({ item, index }) => (
    <View
      style={[
        styles.cardContainer,
        index % 2 === 0 ? styles.leftCard : styles.rightCard,
      ]}
    >
      <SuggestionCard item={item} onPress={handleTourPress} />
    </View>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item._id && styles.selectedCategoryItem,
      ]}
      onPress={() => setSelectedCategory(item._id)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item._id && styles.selectedCategoryText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerInfo}>
      <Text style={styles.locationTitle}>
        {selectedLocationName === "Tất cả"
          ? "Tất cả gợi ý cho bạn"
          : `Gợi ý tại ${selectedLocationName}`}
      </Text>

      {/* Categories Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Lọc theo địa điểm</Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item._id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />
      </View>

      <Text style={styles.tourCount}>
        {tours.length} tour được tìm thấy
        {selectedCategory !== "all" && (
          <Text style={styles.filterInfo}>
            {" • "}
            {categories.find((cat) => cat._id === selectedCategory)?.name || ""}
          </Text>
        )}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gợi ý cho bạn</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải gợi ý...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gợi ý cho bạn</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={48}
              color={COLORS.error}
            />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchTours}>
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={tours}
            keyExtractor={(item) => item._id?.toString()}
            renderItem={renderTourItem}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={styles.row}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="location-outline"
                  size={48}
                  color={COLORS.gray}
                />
                <Text style={styles.emptyText}>
                  Không có tour nào được tìm thấy
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || "#F5F5F5",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 12 : 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40, // Same width as back button for centering
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  headerInfo: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 10,
  },
  locationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  tourCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  filterInfo: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  filterSection: {
    marginTop: 16,
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingVertical: 4,
  },
  categoryItem: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  selectedCategoryItem: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: COLORS.white,
    fontWeight: "600",
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 8,
  },
  row: {
    justifyContent: "space-between",
    // paddingHorizontal: 10,
  },
  cardContainer: {
    width: "48%", // width cố định cho mỗi item
    marginHorizontal: 0, // bỏ margin ngang
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 210,
  },
  leftCard: {
    marginRight: 8,
  },
  rightCard: {
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: "center",
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginTop: 16,
  },
});
