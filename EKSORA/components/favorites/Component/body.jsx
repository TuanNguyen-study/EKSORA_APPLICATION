import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

// API services
import { getFavoriteToursByUser } from "../../../API/services/servicesFavorite";
import { fetchTourDetail } from '../../../API/services/tourService';

import { parseDescription } from '../../../utils/tourDetailHelpers';

// Components
import FavoriteItem from "../FavoriteItem";
import SuggestionModal from "./SuggestionModal";

export default function Body() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const loadFavoriteTours = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("ACCESS_TOKEN");
      const userId = await AsyncStorage.getItem("USER_ID");
      if (!token || !userId) {
        setTours([]);
        return;
      }

      const res = await getFavoriteToursByUser(userId, token);
      const favoriteList = res?.data || [];

      const formattedTours = await Promise.all(
        favoriteList
          .filter(item => item.tour_id && typeof item.tour_id === "object")
          .map(async (item) => {
            const tourId = item.tour_id._id;
            let detail = {};
            let reviewCount = 0;
            try {
              const res = await fetchTourDetail(tourId);
              detail = res?.tour || {};
              reviewCount = res?.reviews?.length || res?.tour?.reviews?.length || 0;
            } catch (err) {
              console.warn(`Không thể lấy chi tiết cho tour ${tourId}:`, err);
            }

            // Lấy description thô từ API
            const rawDescription = detail.description || item.tour_id.description || '';
            // Gọi hàm parseDescription đã import và lọc ra để tạo một chuỗi mô tả ngắn gọn
            const shortDescriptionText = parseDescription(rawDescription)
              .filter(part => part.type === 'text') // Chỉ lấy các phần là văn bản
              .map(part => part.content)          // Lấy nội dung của chúng
              .join(' ')                           // Nối chúng lại thành một câu
              .trim();                             // Cắt bỏ khoảng trắng thừa

            return {
              id: tourId,
              title: detail.name || item.tour_id.name,
              price: detail.price || item.tour_id.price,
              location: detail.location || item.tour_id.location || "Địa điểm chưa có",
              image:
                Array.isArray(detail.image) && detail.image.length > 0
                  ? detail.image[0]
                  : "https://via.placeholder.com/300",
              rating: detail.rating || 0,
              totalReviews: reviewCount,
              shortDescription: shortDescriptionText,
            };
          })
      );
      setTours(formattedTours);
    } catch (error) {
      console.error("Lỗi khi load danh sách tour yêu thích:", error);
      setError("Không thể tải danh sách yêu thích. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavoriteTours();
    }, [loadFavoriteTours])
  );
  
  const handleCloseModal = (shouldReload) => {
    setModalVisible(false);
    if (shouldReload) {
      loadFavoriteTours();
    }
  };

  // --- PHẦN RENDER --
  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#007bff" /></View>;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={loadFavoriteTours} style={styles.exploreButton}>
          <Text style={styles.exploreButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  if (tours.length === 0) {
    return (
      <View style={styles.center}>
        <Image
          source={require("../../../assets/images/favoritesUnmatched.png")}
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={styles.noResults}>Chưa có hoạt động nào ở đây</Text>
        <Text style={styles.explore}>Bắt đầu khám phá và thêm vào Yêu thích</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.exploreButton, { marginTop: 16 }]}>
          <Text style={styles.exploreButtonText}>Bắt đầu</Text>
        </TouchableOpacity>
        
        <SuggestionModal
          isVisible={modalVisible}
          onClose={handleCloseModal}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tours}
        renderItem={({ item }) => (
          <FavoriteItem
            {...item} 
            reviewCount={item.totalReviews}
            onPress={() => router.push(`/trip-detail/${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={{ padding: 16 }}
      />

      <SuggestionModal
        isVisible={modalVisible}
        onClose={handleCloseModal}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  center: {
    flex: 1,
    paddingTop: 150,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  errorText: {
    fontSize: 16,
    color: '#d9534f',
    textAlign: 'center',
    marginBottom: 16, 
  },
  emptyImage: {
    width: 200,
    height: 150,
    marginBottom: 16,
  },
  noResults: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  explore: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
  },
  exploreButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  exploreButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});