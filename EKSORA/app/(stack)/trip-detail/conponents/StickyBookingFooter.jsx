// app/(stack)/trip-detail/components/StickyBookingFooter.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { COLORS } from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const StickyBookingFooter = ({ priceInfo, onAddToCart, onBookNow }) => {
  const insets = useSafeAreaInsets();

  const formatPrice = (price) => {
    if (typeof price !== 'number') return 'N/A';
    return price.toLocaleString('vi-VN');
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }]}>
      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Giá chỉ từ</Text>
        <Text style={styles.priceText}>
          {formatPrice(priceInfo?.current)} {priceInfo?.currency || 'đ'}
          <Text style={styles.priceUnit}> / {priceInfo?.unit || 'khách'}</Text>
        </Text>
        {priceInfo?.original && priceInfo.original > priceInfo.current && (
          <Text style={styles.originalPrice}>
            {formatPrice(priceInfo.original)} {priceInfo?.currency || 'đ'}
          </Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.addToCartButton]} onPress={onAddToCart}>
          <Text style={[styles.buttonText, styles.addToCartButtonText]}>Thêm giỏ hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.bookNowButton]} onPress={onBookNow}>
          <Text style={[styles.buttonText, styles.bookNowButtonText]}>Đặt ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingTop: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8, // Shadow cho Android
    shadowColor: '#000', // Shadow cho iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  priceContainer: {
    flex: 1,
    marginRight: 10,
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.danger, 
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: 'normal',
    color: COLORS.textSecondary,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
  },
  buttonContainer: {
    flexDirection: 'row',
    flex: 1.2, 
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: 8,
  },
  bookNowButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  addToCartButtonText: {
    color: COLORS.primary,
  },
  bookNowButtonText: {
    color: COLORS.white,
  },
});

export default StickyBookingFooter;