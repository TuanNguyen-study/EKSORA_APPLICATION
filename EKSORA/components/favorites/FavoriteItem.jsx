import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { deleteFavoriteTour } from '../../API/services/servicesFavorite';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';

export default function FavoriteItem({
  id,
  title,
  price,
  image,
  onPress,
  rating,
  reviewCount,
  bookedCount,
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

  const renderRightActions = () => {
    return (
      <View style={styles.deleteBox}>
        <Text style={styles.deleteText}>Xóa</Text>
      </View>
    );
  };

  if (!isVisible) return null;

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      onSwipeableRightOpen={handleRemoveFavorite}
    >
      <TouchableOpacity onPress={onPress} style={styles.touchable}>
        <View style={styles.container}>
          {/* Cột bên trái: Ảnh và icon trái tim */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <View style={styles.heartIconWrapper}>
              <AntDesign name="heart" size={20} color="red" />
            </View>
          </View>

          {/* Cột bên phải: Toàn bộ thông tin */}
          <View style={styles.content}>
            {/* Phần trên: Title, tags, rating */}
            <View>
              <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                {title}
              </Text>

              {/* <View style={styles.tagsContainer}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Đặt ngay hôm nay</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Miễn phí huỷ</Text>
                </View>
              </View> */}

              <View style={styles.ratingContainer}>
                <Text style={styles.starIcon}>★</Text>
                <Text style={styles.ratingText}> {rating}</Text>
                <Text style={styles.reviewText}> ({reviewCount})</Text>
                <Text style={styles.separator}> • </Text>
                <Text style={styles.reviewText}>{bookedCount}+ Đã đặt</Text>
              </View>
            </View>

            {/* Phần dưới: Giá tiền */}
            <View style={styles.priceContainer}>
              <Text style={styles.pricePrefix}>Từ </Text>
              <Text style={styles.priceValue}>
                <Text style={styles.currencySymbol}>₫</Text>
                {price}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  touchable: {
    //backgroundColor: 'white',
  },
  container: {
    flexDirection: 'row',
    padding: 10,
    //backgroundColor: 'white',
  },
  // --- CỘT BÊN TRÁI ---
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
  // --- CỘT BÊN PHẢI ---
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
  // --- Tags ---
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
  },
  tagText: {
    fontSize: 11,
    color: '#555',
    fontWeight: '500',
  },
  // --- Rating ---
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  starIcon: {
    color: '#FFB800', 
    fontSize: 14,
  },
  ratingText: {
    color: '#FFB800',
    fontWeight: 'bold',
    fontSize: 14,
  },
  reviewText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 4,
  },
  separator: {
    color: '#666',
    fontSize: 14,
    marginHorizontal: 4,
  },
  // --- Price ---
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end', 
    marginTop: 8,
  },
  pricePrefix: {
    fontSize: 14,
    color: '#333',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  currencySymbol: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  // --- Delete Box ---
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