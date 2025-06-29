import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { deleteFavoriteTour } from '../../API/services/servicesFavorite';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from 'react-native-gesture-handler';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

export default function FavoriteItem({
  id,
  title,
  price,
  image,
  onPress,
  rating,
  reviewCount,
  description
}) {
  const [isVisible, setIsVisible] = useState(true);

  const handleRemoveFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem("ACCESS_TOKEN");
      const userId = await AsyncStorage.getItem("USER_ID");

      if (!userId || !id || !token) {
        console.warn("Thiếu thông tin userId, id hoặc token");
        return;
      }

      await deleteFavoriteTour(userId, id, token);
      console.log("Đã xoá khỏi yêu thích:", id);
      setIsVisible(false);
    } catch (error) {
      console.error("Lỗi khi xoá yêu thích:", error);
    }
  };

  const renderRightActions = () => (
    <View style={styles.deleteBox}>
      <Text style={styles.deleteText}>Xóa</Text>
    </View>
  );

  if (!isVisible) return null;

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      onSwipeableRightOpen={handleRemoveFavorite}
    >
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <View style={styles.heartIconWrapper}>
              <AntDesign name="heart" size={20} color="red" />
            </View>
          </View>

          <View style={styles.content}>
            <View>
              <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                {title}
              </Text>
              <Text style={styles.description} numberOfLines={2}>
                {description}
              </Text>
              <View style={styles.ratingContainer}>
                <FontAwesome name="star" size={14} color="#FFB800" />
                <Text style={styles.ratingText}> {rating}</Text>
                <Text style={styles.reviewText}> ({reviewCount})</Text>
              </View>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.currentPrice}>Từ {price?.toLocaleString('vi-VN')}đ</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  imageContainer: {
    width: 100,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  heartIconWrapper: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1a1a1a',
    lineHeight: 22,
  },
  description: {
    fontSize: 13,
    color: COLORS.textLight,
    minHeight: 32,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#757575',
  },
  reviewText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  currentPrice: {
    fontSize: 15,
    color: COLORS.primary,
  },
  deleteBox: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
