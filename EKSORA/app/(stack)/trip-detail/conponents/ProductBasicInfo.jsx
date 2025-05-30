// app/(stack)/trip-detail/components/ProductBasicInfo.jsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

// Component nhỏ để hiển thị sao (có thể tách ra file riêng nếu dùng nhiều nơi)
const StarRating = ({ rating, size = 16, color = COLORS.warning }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  let stars = [];
  for (let i = 0; i < fullStars; i++) stars.push(<Ionicons key={`full_${i}`} name="star" size={size} color={color} />);
  if (halfStar) stars.push(<Ionicons key="half" name="star-half-sharp" size={size} color={color} />);
  for (let i = 0; i < emptyStars; i++) stars.push(<Ionicons key={`empty_${i}`} name="star-outline" size={size} color={color} />);
  return <View style={styles.starContainer}>{stars}</View>;
};


const ProductBasicInfo = ({ name, supplier, rating, price }) => {

  const formatPrice = (p) => {
    if (typeof p !== 'number') return '';
    return p.toLocaleString('vi-VN');
  };

  return (
    <View style={styles.container}>
      {/* Nhà cung cấp và tag */}
      {supplier && (
        <View style={styles.supplierRow}>
          {supplier.logoUrl && <Image source={{ uri: supplier.logoUrl }} style={styles.supplierLogo} />}
          <Text style={styles.supplierName}>{supplier.name}</Text>
          {supplier.tag && (
            <View style={styles.supplierTag}>
              <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.primary} />
              <Text style={styles.supplierTagText}>{supplier.tag}</Text>
            </View>
          )}
        </View>
      )}

      {/* Tên sản phẩm */}
      <Text style={styles.productName}>{name}</Text>

      {/* Đánh giá */}
      {rating && (
        <View style={styles.ratingRow}>
          <StarRating rating={rating.stars} />
          <Text style={styles.ratingText}>{rating.stars.toFixed(1)}</Text>
          <Text style={styles.ratingCount}>({rating.detailsText || `${rating.count} đánh giá`})</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllReviews}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Giá */}
      {price && (
        <View style={styles.priceSection}>
          <View style={styles.currentPriceContainer}>
            <Text style={styles.currentPrice}>
              {formatPrice(price.current)} {price.currency || 'đ'}
            </Text>
            {price.original && price.original > price.current && (
              <Text style={styles.originalPrice}>
                {formatPrice(price.original)} {price.currency || 'đ'}
              </Text>
            )}
          </View>
          {price.discountPercentage > 0 && (
             <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{price.discountPercentage}%</Text>
             </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    backgroundColor: COLORS.white,
  },
  supplierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  supplierLogo: {
    width: 60, // Kích thước ví dụ
    height: 20, // Kích thước ví dụ
    resizeMode: 'contain',
    marginRight: 8,
  },
  supplierName: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  supplierTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 8,
  },
  supplierTagText: {
    fontSize: 11,
    color: COLORS.primary,
    marginLeft: 3,
    fontWeight: 'bold',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
    lineHeight: 28,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starContainer: {
    flexDirection: 'row',
  },
  ratingText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 6,
  },
  ratingCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  seeAllReviews: {
    fontSize: 14,
    color: COLORS.primary,
    textDecorationLine: 'underline',
    marginLeft: 10,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Để discount badge thẳng hàng
    justifyContent: 'space-between',
  },
  currentPriceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Giá cũ và giá mới thẳng hàng
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.danger, // Hoặc COLORS.primary
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
    marginBottom: 2, // Căn chỉnh với giá hiện tại
  },
  discountBadge: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default ProductBasicInfo;