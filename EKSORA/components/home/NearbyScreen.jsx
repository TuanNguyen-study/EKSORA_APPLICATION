import React, { useRef, useState } from 'react';
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
  View
} from 'react-native';

import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// API Services
import { getCategories, getToursByLocation } from '../../API/services/serverCategories';
// Components
import CurrentLocationMap from './CurrentLocationMap';
// Constants
import { COLORS } from '../../constants/colors';

// Dữ liệu style bản đồ không đổi
const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [ { "color": "#f8f9fa" } ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [ { "visibility": "off" } ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [ { "color": "#555555" } ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [ { "color": "#ffffff" } ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [ { "visibility": "off" } ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [ { "color": "#7a7a7a" } ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [ { "color": "#eeeeee" } ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [ { "color": "#757575" } ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [ { "color": "#e0e9d8" } ] // Màu công viên xanh lá cây nhạt
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [ { "color": "#9e9e9e" } ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [ { "color": "#ffffff" } ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [ { "color": "#fdfdfd" } ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [ { "color": "#e9ecef" } ] // Màu đường cao tốc xám nhạt
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [ { "color": "#ced4da" } ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [ { "color": "#616161" } ]
  },
  {
    "featureType": "road.local",
    "stylers": [ { "visibility": "off" } ] // Ẩn đường nhỏ để đỡ rối
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [ { "color": "#f2f2f2" } ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [ { "color": "#cce0e9" } ] // Màu nước xanh pastel
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [ { "color": "#9e9e9e" } ]
  }
];

const TourResultCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
    <Image source={{ uri: item.image }} style={styles.cardImage} />
    <View style={styles.cardInfo}>
      <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.cardPrice}>
        {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
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
  // Giờ nó sẽ điều khiển chiều cao (height) của panel
  const panelHeight = useRef(new Animated.Value(350)).current; // Chiều cao ban đầu

  const togglePanel = () => {
    const toValue = isPanelExpanded ? 100 : 350; // Chiều cao khi thu gọn và mở rộng
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
      const categoriesData = await getCategories();
      const allCategories = Array.isArray(categoriesData) ? categoriesData : categoriesData.data || [];
      const geocodedAddresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (!geocodedAddresses?.length) throw new Error("Không thể xác định địa chỉ của bạn.");
      const regionName = geocodedAddresses[0].region;
      if (!regionName) throw new Error("Không nhận diện được tỉnh/thành phố.");
      const cleanedLocationName = regionName.replace(/Thành phố|Tỉnh/i, '').trim();
      setLocationName(cleanedLocationName);
      const foundCategory = allCategories.find(
        (cat) => cat.name.toLowerCase() === cleanedLocationName.toLowerCase()
      );
      if (!foundCategory) throw new Error(`Rất tiếc, chúng tôi chưa có tour nào tại ${cleanedLocationName}.`);
      const toursData = await getToursByLocation(foundCategory._id);
      const processedTours = (Array.isArray(toursData) ? toursData : toursData.data || []).map(tour => ({
        ...tour,
        image: tour.image?.[0] || 'https://via.placeholder.com/300',
      }));
      if (processedTours.length === 0) throw new Error(`Không tìm thấy tour nào ở gần ${cleanedLocationName}.`);
      setNearbyTours(processedTours);
    } catch (err) {
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
    setError(errorMessage);
    setIsFinding(false);
  };

  return (
    // Sử dụng View thay cho SafeAreaView để kiểm soát toàn bộ màn hình
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Bản đồ sẽ nằm ở lớp dưới cùng */}
      <CurrentLocationMap
        onLocationFound={handleLocationFound}
        onLocationError={handleLocationError}
        tourData={nearbyTours}
        onMarkerPress={handlePressSuggestion}
        customMapStyle={mapStyle}
      />

      {/* Nút thoát giờ nằm riêng biệt và có zIndex cao */}
      <TouchableOpacity style={styles.exitButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>
      
      {/* 
        Container của panel được đặt tuyệt đối ở dưới cùng.
        Nó sẽ cho phép touch "xuyên qua" các vùng trống của nó.
      */}
      <Animated.View 
        style={[styles.resultsContainer, { height: panelHeight }]}
        pointerEvents="box-none"
      >
        {/* 
          Wrapper này chứa giao diện panel và sẽ bắt các sự kiện chạm.
          Nó có pointerEvents="auto" (mặc định)
        */}
        <View style={styles.panelContentWrapper}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle} numberOfLines={1}>
              {isFinding ? "Đang tìm kiếm..." : `Kết quả tại ${locationName || 'vị trí của bạn'}`}
            </Text>
            <TouchableOpacity onPress={togglePanel} style={styles.toggleButton}>
              <Ionicons name={isPanelExpanded ? "chevron-down-outline" : "chevron-up-outline"} size={28} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          
          {isPanelExpanded && (
            <View style={styles.listContainer}>
              {isFinding && nearbyTours.length === 0 ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }}/>
              ) : (
                <FlatList
                  data={nearbyTours}
                  renderItem={({ item }) => (
                    <TourResultCard item={item} onPress={() => handlePressSuggestion(item._id)} />
                  )}
                  keyExtractor={(item) => item._id.toString()}
                  contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                  ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>{error || "Không có tour nào được tìm thấy."}</Text>
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
    // Đặt nút thoát ở góc trên cùng bên trái, nằm trên tất cả
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Đảm bảo nó nổi lên trên
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
  },
  // Container cho panel, đặt ở dưới cùng màn hình
  resultsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // Chiều cao được điều khiển bằng Animated.Value
  },
  // Wrapper cho nội dung panel để bắt sự kiện chạm
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
    overflow: 'hidden',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  toggleButton: {
    padding: 5,
  },
  listContainer: {
    flex: 1, // Để FlatList chiếm hết không gian còn lại
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1, // Cho phép title co giãn và tránh đẩy nút toggle ra ngoài
    marginRight: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 8,
  },
  emptyContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});