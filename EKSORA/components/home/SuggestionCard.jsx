// components/home/SuggestionCard.jsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const SuggestionCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
    <Image source={item.image} style={styles.cardImage} />
    {item.discount && (
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>{item.discount}%</Text>
      </View>
    )}
    <View style={styles.infoContainer}>
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color={COLORS.warning} />
        <Text style={styles.ratingText}>{item.rating} ({item.reviews})</Text>
      </View>
      {item.originalPrice && (
        <Text style={styles.originalPrice}>Từ đ {item.originalPrice.toLocaleString()}</Text>
      )}
      <Text style={styles.currentPrice}>Từ đ {item.price.toLocaleString()}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    marginBottom: 20,
    marginHorizontal: 5, // Cho trường hợp numColumns={2}
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden', // Quan trọng để discount badge không tràn
    // width: '100%', // Nếu là 1 cột
    flex: 1, // Cho trường hợp numColumns={2}
  },
  cardImage: {
    width: '100%',
    height: 150, // Điều chỉnh chiều cao ảnh
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  discountText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
    minHeight: 38, // Đảm bảo chiều cao cho 2 dòng
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default SuggestionCard;