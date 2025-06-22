import { Image, StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import React, { useState } from 'react';
import { deleteFavoriteTour } from '../../API/services/servicesFavorite';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from 'react-native-gesture-handler';

export default function FavoriteItem({
  id,
  title,
  description,
  price,
  location,
  image,
  onPress,
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

  // Render action khi vuốt
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
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {title}
              </Text>
            </View>

            <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
              {description}
            </Text>

            <View style={styles.bottomRow}>
              <Text style={styles.location} numberOfLines={1} ellipsizeMode="tail">
                {location}
              </Text>
              <Text style={styles.price}>Từ {price} đ</Text>
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
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f6fafd',
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 12,
  },
  content: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    maxWidth: 170,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e63946',
    textAlign: 'right',
    minWidth: 90,
    flexShrink: 0,
    flexGrow: 0,
  },
  deleteBox: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 10,
    marginVertical: 10,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
