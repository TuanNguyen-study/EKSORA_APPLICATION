import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

// Lấy kích thước màn hình
const { width } = Dimensions.get('window');

// Cập nhật CARD_WIDTH và IMAGE_HEIGHT để linh hoạt với kích thước màn hình
const CARD_WIDTH = width * 0.42;  
const IMAGE_HEIGHT = CARD_WIDTH * (3 / 4); 

const SuggestionCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
    {/* Chỉ hiển thị hình ảnh đầu tiên trong mảng */}
    <Image source={{ uri: item.image }} style={styles.cardImage} />

    {item.discount && (
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>{item.discount}%</Text>
      </View>
    )}
    <View style={styles.infoContainer}>
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#FACC15" />
        <Text style={styles.ratingText}>{item.rating} ()</Text>
      </View>

      <Text style={styles.currentPrice}>Từ {item.price.toLocaleString('vi-VN')}đ</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    marginBottom: 20,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    width: CARD_WIDTH, 
  },
  cardImage: {
    width: '100%',
    height: IMAGE_HEIGHT, 
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
  infoContainer: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 8,
    minHeight: 32,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  currentPrice: {
    fontSize: 15,
    color: COLORS.primary,
  },
});

export default SuggestionCard;
