// components/home/PromoBanner.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const PromoBanner = () => (
  <View style={styles.bannerOuterContainer}>
    <View style={styles.bannerInnerContainer}>
      <Text style={styles.bannerText}>Mã giảm giá cho người mới</Text>
      <View style={styles.pointsContainer}>
        <Ionicons name="pricetags" size={18} color={COLORS.danger} /> 
        <Text style={styles.pointsAmountText}>4</Text>
        <Ionicons name="ellipse" size={6} color={COLORS.danger} style={styles.separatorDot} />
        <Text style={styles.pointsDetailText}>250 điểm</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  bannerOuterContainer: {
    paddingHorizontal: 15, 
  },
  bannerInnerContainer: {
    backgroundColor: COLORS.white, 
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  bannerText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 15,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsAmountText: {
    color: COLORS.danger,
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  pointsDetailText: {
    color: COLORS.text, 
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 4,
  },
  separatorDot: {
    marginHorizontal: 8,
    color: COLORS.danger, 
  }
});

export default PromoBanner;