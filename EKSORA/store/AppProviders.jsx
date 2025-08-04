import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteProvider } from './FavoriteContext';
import { VoucherProvider } from './VoucherContext';
import { ReviewProvider } from './ReviewContext';
import { CartProvider } from './CartContext';

export const AppProviders = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  // Lấy userId và token từ AsyncStorage khi component mount
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('USER_ID');
        const storedToken = await AsyncStorage.getItem('ACCESS_TOKEN');
        
        console.log('AppProviders - Loaded userId:', storedUserId);
        console.log('AppProviders - Loaded token:', storedToken);

        setUserId(storedUserId);
        setToken(storedToken);
      } catch (error) {
        console.error('Lỗi khi lấy userId và token từ AsyncStorage:', error);
      }
    };

    loadAuthData();
  }, []);

  return (
    <FavoriteProvider>
      <VoucherProvider>
        <ReviewProvider>
          <CartProvider userId={userId} token={token}>
            {children}
          </CartProvider>
        </ReviewProvider>
      </VoucherProvider>
    </FavoriteProvider>
  );
};