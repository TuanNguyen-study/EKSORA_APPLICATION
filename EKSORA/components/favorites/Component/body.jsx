import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FavoriteItem from "../FavoriteItem";
import {
  getFavoriteToursByUser,
  addFavorites,
} from "../../../API/services/servicesFavorite";
import { getTours } from "../../../API/services/serverCategories";
import { fetchTourDetail } from '../../../API/services/tourService';
import SuggestionCard from "../../home/SuggestionCard";
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function Body() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestionTours, setSuggestionTours] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const loadFavoriteTours = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("ACCESS_TOKEN");
      const userId = await AsyncStorage.getItem("USER_ID");
      if (!token || !userId) {
        console.warn("Không tìm thấy token hoặc userId");
        return;
      }

      const res = await getFavoriteToursByUser(userId, token);
      const favoriteList = res?.data || [];

      const formatted = await Promise.all(
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

            return {
              id: tourId,
              title: detail.name || item.tour_id.name,
              description: detail.description || item.tour_id.description,
              price: detail.price || item.tour_id.price,
              location: detail.location || item.tour_id.location || "Địa điểm chưa có",
              image:
                Array.isArray(detail.image) && detail.image.length > 0
                  ? detail.image[0]
                  : "https://via.placeholder.com/300",
              createdAt: detail.createdAt || item.tour_id.createdAt,
              category: detail.category || item.tour_id.category,
              rating: detail.rating || 0,
              totalReviews: reviewCount,
            };
          })
      );

      setTours(formatted);
    } catch (error) {
      console.error("Lỗi khi load danh sách tour yêu thích:", error);
      setError("Không thể tải danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavoriteTours();
    }, [])
  );

  const handleStartPress = async () => {
    setSuggestionLoading(true);
    setError(null);

    try {
      const data = await getTours();
      const processedData = Array.isArray(data)
        ? data.map((tour) => ({
            ...tour,
            image:
              Array.isArray(tour.image) && tour.image.length > 0
                ? tour.image[0]
                : "https://via.placeholder.com/300",
          }))
        : [];

      setSuggestionTours(processedData);
      setModalVisible(true);
    } catch (error) {
      console.error("Lỗi khi tải gợi ý tour:", error);
      setError("Không thể tải gợi ý tour");
    } finally {
      setSuggestionLoading(false);
    }
  };

  const handlePressSuggestion = async (item) => {
    const user_id = await AsyncStorage.getItem("USER_ID");
    if (!user_id || !item?._id) {
      console.warn("Thiếu user_id hoặc tour_id");
      return;
    }

    try {
      await addFavorites(user_id, item._id);
      setModalVisible(false);
      await loadFavoriteTours();
    } catch (error) {
      console.error("Lỗi khi thêm tour vào yêu thích:", error);
      setError("Không thể thêm tour vào yêu thích");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => setError(null)} style={[styles.exploreButton, { marginTop: 16 }]}>
          <Text style={styles.exploreButtonText}>Thử lại</Text>
        </TouchableOpacity>
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
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={tours.length === 0 ? styles.noResultsContainer : { padding: 16 }}
        ListEmptyComponent={
          <View style={styles.noResultsContent}>
            <Image
              source={require("../../../assets/images/favoritesUnmatched.png")}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.noResults}>Chưa có hoạt động nào ở đây</Text>
            <Text style={styles.explore}>Bắt đầu khám phá và thêm vào Yêu thích</Text>
            <TouchableOpacity onPress={handleStartPress} style={{ marginTop: 16 }}>
              <Text style={styles.exploreButton}>Bắt đầu</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Thêm vào Yêu thích</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {suggestionLoading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={handleStartPress} style={[styles.exploreButton, { marginTop: 16 }]}>
                <Text style={styles.exploreButtonText}>Thử lại</Text>
              </TouchableOpacity>
            </View>
          ) : suggestionTours.length === 0 ? (
            <View style={styles.noResultsContent}>
              <Text style={styles.noResults}>Không có gợi ý nào</Text>
            </View>
          ) : (
            <FlatList
              data={suggestionTours}
              renderItem={({ item }) => (
                <SuggestionCard item={item} onPress={() => handlePressSuggestion(item)} />
              )}
              keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
              contentContainerStyle={styles.suggestionList}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
            />
          )}

          <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.exploreButton, { marginTop: 8 }]}>
            <Text style={styles.exploreButtonText}>Xem danh sách yêu thích</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  noResultsContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  noResultsContent: {
    alignItems: "center",
    marginTop: 32,
  },
  emptyImage: {
    width: 200,
    height: 150,
    marginBottom: 16,
  },
  noResults: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#999",
  },
  explore: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: "#999",
    marginTop: 8,
  },
  exploreButton: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#666",
  },
  suggestionList: {
    paddingBottom: 16,
  },
  errorContainer: {
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#d9534f",
    textAlign: "center",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginHorizontal: 4,
  },
});
