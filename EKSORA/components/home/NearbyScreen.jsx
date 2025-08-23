import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// API Services
import {
  getCategories,
  getToursByLocation,
  getTours,
} from "../../API/services/serverCategories";
// Components
import CurrentLocationMap from "./CurrentLocationMap";
// Constants
import { COLORS } from "../../constants/colors";

const TourResultCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
    <Image source={{ uri: item.image }} style={styles.cardImage} />
    <View style={styles.cardInfo}>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.cardPrice}>
        {item.price.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
      </Text>
    </View>
  </TouchableOpacity>
);

export default function NearbyScreen() {
  const router = useRouter();
  const [nearbyTours, setNearbyTours] = useState([]);
  const [isFinding, setIsFinding] = useState(true);
  const [error, setError] = useState(null);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);

  // Thay đổi cách hoạt động của Animated:
  const panelHeight = useRef(new Animated.Value(350)).current;

  const togglePanel = () => {
    const toValue = isPanelExpanded ? 100 : 350;
    Animated.timing(panelHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsPanelExpanded(!isPanelExpanded);
  };

  const handlePressSuggestion = (tourId) => {
    if (!tourId) return;
    router.push(`/trip-detail/${tourId}`);
  };

  const findTours = async (location) => {
    setIsFinding(true);
    setError(null);
    
    try {
      // Validate location object
      if (!location || !location.coords) {
        throw new Error('Invalid location data');
      }

      const categoriesData = await getCategories();
      const allCategories = Array.isArray(categoriesData)
        ? categoriesData
        : categoriesData.data || [];

      let geocodedAddresses;
      try {
        geocodedAddresses = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (geocodeError) {
        console.log("Geocoding error:", geocodeError);
        setLocationName("Việt Nam");
        
        // Fallback với thông tin mặc định
        const allToursData = await getTours();
        const processedTours = (
          Array.isArray(allToursData) ? allToursData : allToursData.data || []
        )
          .filter((tour) => tour && tour.price > 0)
          .slice(0, 10)
          .map((tour) => ({
            ...tour,
            image: Array.isArray(tour.image) ? tour.image[0] : tour.image || "https://via.placeholder.com/300",
          }));
        
        setNearbyTours(processedTours);
        setIsFinding(false);
        return;
      }

      if (!geocodedAddresses?.length) {
        throw new Error("Không thể xác định địa chỉ của bạn.");
      }
      
      const regionName = geocodedAddresses[0].region;
      if (!regionName) {
        throw new Error("Không nhận diện được tỉnh/thành phố.");
      }
      
      const cleanedLocationName = regionName
        .replace(/Thành phố|Tỉnh/i, "")
        .trim();
      setLocationName(cleanedLocationName);
      
      const foundCategory = allCategories.find(
        (cat) => cat.name.toLowerCase() === cleanedLocationName.toLowerCase()
      );
      
      if (!foundCategory) {
        throw new Error(
          `Rất tiếc, chúng tôi chưa có tour nào tại ${cleanedLocationName}.`
        );
      }
      
      const toursData = await getToursByLocation(foundCategory._id);
      const processedTours = (
        Array.isArray(toursData) ? toursData : toursData.data || []
      )
        .filter((tour) => tour && tour.price > 0)
        .map((tour) => ({
          ...tour,
          image: Array.isArray(tour.image) ? tour.image[0] : tour.image || "https://via.placeholder.com/300",
        }));
      
      if (processedTours.length === 0) {
        throw new Error(
          `Không tìm thấy tour nào ở gần ${cleanedLocationName}.`
        );
      }
      
      setNearbyTours(processedTours);
    } catch (err) {
      console.error('Find tours error:', err);
      setError(err.message || "Đã xảy ra lỗi không xác định.");
    } finally {
      setIsFinding(false);
    }
  };

  const handleLocationFound = (location) => {
    if (!searchTriggered && location) {
      setSearchTriggered(true);
      findTours(location);
    }
  };

  const handleLocationError = (errorMessage) => {
    console.error('Location error:', errorMessage);
    setError(errorMessage);
    setIsFinding(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Bản đồ - LOẠI BỎ customMapStyle prop */}
      <CurrentLocationMap
        onLocationFound={handleLocationFound}
        onLocationError={handleLocationError}
        tourData={nearbyTours} // Đảm bảo luôn là array
        onMarkerPress={handlePressSuggestion}
        // Loại bỏ customMapStyle prop vì không được sử dụng
      />

      {/* Nút thoát */}
      <TouchableOpacity style={styles.exitButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>

      {/* Panel kết quả */}
      <Animated.View
        style={[styles.resultsContainer, { height: panelHeight }]}
        pointerEvents="box-none"
      >
        <View style={styles.panelContentWrapper}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle} numberOfLines={1}>
              {isFinding
                ? "Đang tìm kiếm..."
                : `Kết quả tại ${locationName || "vị trí của bạn"}`}
            </Text>
            <TouchableOpacity onPress={togglePanel} style={styles.toggleButton}>
              <Ionicons
                name={
                  isPanelExpanded
                    ? "chevron-down-outline"
                    : "chevron-up-outline"
                }
                size={28}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {isPanelExpanded && (
            <View style={styles.listContainer}>
              {isFinding && nearbyTours.length === 0 ? (
                <ActivityIndicator
                  size="large"
                  color={COLORS.primary}
                  style={{ marginTop: 40 }}
                />
              ) : (
                <FlatList
                  data={nearbyTours}
                  renderItem={({ item }) => (
                    <TourResultCard
                      item={item}
                      onPress={() => handlePressSuggestion(item._id)}
                    />
                  )}
                  keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
                  contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 20,
                  }}
                  ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>
                        {error || "Không có tour nào được tìm thấy."}
                      </Text>
                    </View>
                  )}
                />
              )}
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  exitButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
  },
  resultsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  panelContentWrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
    overflow: "hidden",
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  toggleButton: {
    padding: 5,
  },
  listContainer: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    flex: 1,
    marginRight: 10,
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 8,
  },
  emptyContainer: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});