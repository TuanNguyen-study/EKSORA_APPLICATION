import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Các hằng số này thuộc về item, nên đặt chúng ở đây.
const { width } = Dimensions.get("window");
const GRID_PADDING = 16;
const GAP = 16;
const CARD_WIDTH = (width - (16 * 2) - (GRID_PADDING * 2) - GAP) / 2;


// Component này chỉ nhận dữ liệu qua props và hiển thị, không chứa logic fetch data.
export default function PromotionItem({ item, isLiked, onToggleLike }) {
  // Trích xuất dữ liệu từ props để code dễ đọc hơn
  const tour = item.tour_id;
  const discount = item.discount || 0;
  const tourLocation = tour.location || "Địa điểm đang cập nhật";

  // Tính toán giá cả
  const finalPrice = tour.price - (tour.price * discount) / 100;
  const finalPriceFormatted = finalPrice.toLocaleString("vi-VN");
  const originalPriceFormatted = tour.price.toLocaleString("vi-VN");

  // Hàm xử lý việc nhấn nút yêu thích, gọi lại hàm từ component cha
  const handleLikePress = () => {
    onToggleLike(tour._id);
  };

  // Hàm xử lý việc nhấn vào card để xem chi tiết
  const handleCardPress = () => {
    router.push({ pathname: "/(stack)/trip-detail/[id]", params: { id: tour._id } });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleCardPress}
    >
      <ImageBackground source={{ uri: tour.image[0] }} style={styles.image} imageStyle={{ borderRadius: 12 }} resizeMode="cover">
        <LinearGradient colors={['rgba(0,0,0,0.4)', 'transparent']} style={styles.gradient} />
        <View style={styles.topRow}>
          {discount > 0 && (
            <View style={styles.discountTag}>
              <FontAwesome name="tag" size={11} color="white" />
              <Text style={styles.discountText}>GIẢM {discount}%</Text>
            </View>
          )}
          <TouchableOpacity style={styles.heartIcon} onPress={handleLikePress}>
            <FontAwesome name={isLiked ? "heart" : "heart-o"} size={18} color={isLiked ? "#FF6B00" : "white"} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <View style={styles.contentContainer}>
        <View style={styles.locationContainer}>
          <FontAwesome name="map-marker" size={14} color="#888" />
          <Text style={styles.locationText} numberOfLines={1}>{tourLocation}</Text>
        </View>
        <Text style={styles.cardTitle} numberOfLines={2}>{tour.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.finalPrice}>{finalPriceFormatted} ₫</Text>
          {discount > 0 && <Text style={styles.originalPrice}>{originalPriceFormatted} ₫</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginBottom: GAP,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '50%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  discountTag: {
    backgroundColor: '#f95656ff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  heartIcon: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 10,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: "#333",
    minHeight: 34,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  finalPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E63946',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
});