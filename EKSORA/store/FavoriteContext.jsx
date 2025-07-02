import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addFavoriteTour, deleteFavoriteTour, getFavoriteToursByUser } from '../API/services/servicesFavorite';

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [likedTours, setLikedTours] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

const loadFavorites = useCallback(async () => {
  try {
    setIsLoading(true);
    const userId = await AsyncStorage.getItem('USER_ID');
    //console.log('[FavoriteContext] loadFavorites, userId:', userId);
    if (!userId) {
      console.warn('[FavoriteContext] Thiếu userId, không thể tải favorites');
      return;
    }

    const res = await getFavoriteToursByUser(userId);
    //console.log('[FavoriteContext] getFavoriteToursByUser response:', res);
    const favoriteTours = res?.data || [];
    const tourIds = favoriteTours.map(item => item.tourId);
    //console.log('[FavoriteContext] tourIds from server:', tourIds);
    setLikedTours(tourIds);
    await AsyncStorage.setItem('likedTours', JSON.stringify(tourIds));
    //console.log('[FavoriteContext] Đã lưu likedTours vào AsyncStorage:', tourIds);
  } catch (error) {
    //console.error('[FavoriteContext] Lỗi khi tải favorites:', error.message);
    const storedTours = await AsyncStorage.getItem('likedTours');
    if (storedTours) {
      setLikedTours(JSON.parse(storedTours));
      console.log('[FavoriteContext] Đã tải favoriteTours từ AsyncStorage:', JSON.parse(storedTours));
    }
  } finally {
    setIsLoading(false);
  }
}, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Thêm tour yêu thích
  const addFavorite = async (tourId) => {
    try {
      const userId = await AsyncStorage.getItem('USER_ID');
      if (!userId || !tourId) {
        console.warn('[FavoriteContext] Thiếu userId hoặc tourId');
        return;
      }
      console.log('[FavoriteContext] Gọi addFavoriteTour, tourId:', tourId);
      await addFavoriteTour(userId, tourId);
      setLikedTours(prev => {
        if (!prev.includes(tourId)) {
          const newTours = [...prev, tourId];
          AsyncStorage.setItem('likedTours', JSON.stringify(newTours));
          return newTours;
        }
        return prev;
      });
    } catch (error) {
      console.error('[FavoriteContext] Lỗi khi thêm favorite:', error.message);
      throw error;
    }
  };

  // Xóa tour yêu thích
const removeFavorite = async (tourId) => {
  try {
    const userId = await AsyncStorage.getItem('USER_ID');
    const token = await AsyncStorage.getItem('ACCESS_TOKEN');
    if (!userId || !token || !tourId) {
      console.warn('[FavoriteContext] Thiếu userId, token hoặc tourId');
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để xóa tour yêu thích');
      return;
    }
    //console.log('[FavoriteContext] Gọi deleteFavoriteTour, tourId:', tourId, 'userId:', userId);
    const response = await deleteFavoriteTour(userId, tourId, token);
    //console.log('[FavoriteContext] deleteFavoriteTour response:', response);

    // Cập nhật trạng thái và chờ lưu AsyncStorage
    setLikedTours(prev => {
      const newTours = prev.filter(id => id !== tourId);
      //console.log('[FavoriteContext] new likedTours:', newTours);
      AsyncStorage.setItem('likedTours', JSON.stringify(newTours))
        .then(() => console.log('[FavoriteContext] Đã lưu AsyncStorage thành công'))
        .catch(err => console.error('[FavoriteContext] Lỗi lưu AsyncStorage:', err));
      return newTours;
    });

    // Tải lại từ server để xác nhận
    await loadFavorites();
    //console.log('[FavoriteContext] Đã tải lại favorites sau khi xóa');
  } catch (error) {
    console.error('[FavoriteContext] Lỗi khi xóa favorite:', error.message, 'status:', error.response?.status);
    if (error.response?.status === 404) {
      //console.log('[FavoriteContext] Lỗi 404, reload favorites từ server');
      await loadFavorites();
    } else {
      Alert.alert('Lỗi', 'Không thể xóa tour yêu thích. Vui lòng thử lại.');
    }
  }
};

  return (
    <FavoriteContext.Provider value={{ likedTours, addFavorite, removeFavorite, isLoading }}>
      {children}
    </FavoriteContext.Provider>
  );
};