import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import { COLORS } from '@/constants/colors'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import { useState } from 'react';
import BookingModalContent from '../components/Modal'; // Modal content tách riêng

const StickyBookingFooter = ({ priceInfo, eksoraPoints, onAddToCart, onBookNow, onEksoraPointsPress }) => {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);

  const formatPrice = (price) => {
    if (typeof price !== 'number') return 'N/A';
    return price.toLocaleString('vi-VN');
  };

  return (
    <>
    <View style={[
        styles.outerContainer,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : (Platform.OS === 'ios' ? 20 : 16) }
    ]}>
      <View style={styles.innerContainer}>
        <View style={styles.topRow}>
          <Text style={styles.priceText}>
            {priceInfo?.currency || 'đ'}{formatPrice(priceInfo?.current)}
          </Text>
          {eksoraPoints && (
            <TouchableOpacity style={styles.eksoraPointsChip} onPress={onEksoraPointsPress}>
              <Text style={styles.eksoraPointsText}>EKSORA Xu +{eksoraPoints}</Text>
              <Ionicons name="chevron-forward-outline" size={12} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.buttonBase, styles.addToCartButton]} onPress={onAddToCart}>
            <Text style={[styles.buttonTextBase, styles.addToCartButtonText]}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttonBase, styles.bookNowButton]} onPress={ () => setModalVisible(true)}>
            <Text style={[styles.buttonTextBase, styles.bookNowButtonText]} >Đặt ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
      
    </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <BookingModalContent onClose={() => setModalVisible(false)} />
      </Modal>
    </>
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