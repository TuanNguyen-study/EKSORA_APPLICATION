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
      //console.log('[FavoriteContext] Gọi addFavoriteTour, tourId:', tourId);
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
      return;
    }
    
    // Gọi API để xóa trên server
    await deleteFavoriteTour(userId, tourId, token);

    // Chỉ cập nhật trạng thái local và AsyncStorage. KHÔNG fetch lại.
    setLikedTours(prev => {
      const newTours = prev.filter(id => id !== tourId);
      AsyncStorage.setItem('likedTours', JSON.stringify(newTours));
      return newTours;
    });

  } catch (error) {
    console.error('[FavoriteContext] Lỗi khi xóa favorite:', error.message);

  }
};

  return (
    <FavoriteContext.Provider value={{ likedTours, addFavorite, removeFavorite, isLoading }}>
      {children}
    </FavoriteContext.Provider>
  );
};