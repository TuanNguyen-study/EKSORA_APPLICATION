import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../../../constants/colors';
import BookingModalContent from './Modal'; 

const StickyBookingFooter = ({
  priceInfo,
  eksoraPoints,
  onAddToCart,
  onBookNow,
  onEksoraPointsPress,
  tourName
}) => {
  const router = useRouter();

  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);

  const handleBookNow = () => {
    if (onBookNow) {
      onBookNow();
    } else {
      router.push('/acount/bookingScreen');
    }
  };

  const formatPrice = (price) => {
    const value = typeof price === 'number' ? price : parseFloat(price);
    if (isNaN(value)) return '0 đ';
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    });
  };

  return (
    <View
      style={[

        styles.outerContainer,
        {
          paddingBottom:
            insets.bottom > 0 ? insets.bottom : Platform.OS === 'ios' ? 20 : 16,
        },
      ]}
    >
      <View style={styles.innerContainer}>
        <View style={styles.topRow}>
          <Text style={styles.priceText}>
            {formatPrice(priceInfo?.current)}
          </Text>

          {eksoraPoints && (
            <TouchableOpacity
              style={styles.eksoraPointsChip}
              onPress={onEksoraPointsPress}
            >
              <Text style={styles.eksoraPointsText}>EKSORA Xu +{eksoraPoints}</Text>
              <Ionicons name="chevron-forward-outline" size={12} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.buttonBase, styles.addToCartButton]}
            onPress={onAddToCart}
          >
            <Text style={[styles.buttonTextBase, styles.addToCartButtonText]}>
              Thêm vào giỏ hàng
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonBase, styles.bookNowButton]}
            onPress={handleBookNow}
          >
            <Text style={[styles.buttonTextBase, styles.bookNowButtonText]}>
              Đặt ngay
            </Text>

          </TouchableOpacity>
        </View>
      </View>
    
      <Modal visible={modalVisible} animationType="slide" transparent>
        <BookingModalContent onClose={() => setModalVisible(false)}
         priceInfo={priceInfo}
         tourName={tourName} />
          
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  innerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  eksoraPointsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A5D6A7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  eksoraPointsText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '500',
    marginRight: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonBase: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  addToCartButton: {
    backgroundColor: '#FF7E7E',
  },
  bookNowButton: {
    backgroundColor: COLORS.primary,
  },
  buttonTextBase: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addToCartButtonText: {
    color: COLORS.white,
  },
  bookNowButtonText: {
    color: COLORS.white,
  },
});

export default StickyBookingFooter;
