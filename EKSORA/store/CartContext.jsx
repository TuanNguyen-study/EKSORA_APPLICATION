// file: store/CartContext.js

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const CART_STORAGE_KEY = 'cart';
const PAID_BOOKINGS_KEY = '@paid_bookings';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Sử dụng useFocusEffect để tự động dọn dẹp giỏ hàng
  useFocusEffect(
    useCallback(() => {
      const cleanupPaidCartItems = async () => {
        if (!isCartLoaded) return;
        try {
          const paidBookingsJson = await AsyncStorage.getItem(PAID_BOOKINGS_KEY);
          if (!paidBookingsJson) return;
          
          const paidBookings = JSON.parse(paidBookingsJson);
          if (paidBookings.length === 0) return;
          
          const paidItemsIdentifiers = new Set(
            paidBookings.map(booking => {
                const date = new Date(booking.travel_date);
                const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                return `${booking.tour_id}_${formattedDate}`;
            })
          );
          
          const currentCart = [...cartItems]; 
          const itemsToKeep = currentCart.filter(cartItem => {
            const itemIdentifier = `${cartItem.tour_id}_${cartItem.travelDate}`;
            return !paidItemsIdentifiers.has(itemIdentifier);
          });

          if (itemsToKeep.length < currentCart.length) {
            console.log('Phát hiện sản phẩm đã thanh toán. Đang dọn dẹp giỏ hàng...');
            setCartItems(itemsToKeep);
            await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(itemsToKeep));
          }
        } catch (error) {
          console.error('Lỗi khi dọn dẹp giỏ hàng:', error);
        }
      };

      cleanupPaidCartItems();
    }, [isCartLoaded, cartItems])
  );

  // Tải giỏ hàng từ storage khi app khởi động
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartJson = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (cartJson) {
          setCartItems(JSON.parse(cartJson));
        }
      } catch (error) {
        console.error('Lỗi khi tải giỏ hàng:', error);
      } finally {
        setIsCartLoaded(true);
      }
    };
    loadCart();
  }, []);

  const addToCart = async (item) => {
    try {
      const existingItem = cartItems.find(
        (cartItem) => cartItem.tour_id === item.tour_id && cartItem.travelDate === item.travelDate
      );

      if (existingItem) {
        alert('Tour cho ngày này đã có trong giỏ hàng!');
        return;
      }
      const updatedCart = [...cartItems, item];
      setCartItems(updatedCart);
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      const updatedCart = cartItems.filter((item) => item.id !== id);
      setCartItems(updatedCart);
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Lỗi khi xóa khỏi giỏ hàng:', error);
    }
  };

  // =================    HÀM CẬP NHẬT MỚI    =================
  /**
   * Cập nhật một sản phẩm trong giỏ hàng.
   * @param {string} itemId - ID của sản phẩm cần cập nhật.
   * @param {object} updatedData - Object chứa các thuộc tính cần thay đổi.
   */
  const updateCartItem = async (itemId, updatedData) => {
    try {
      const updatedCart = cartItems.map(item =>
        item.id === itemId
          ? { ...item, ...updatedData } // Tìm thấy item, merge với dữ liệu mới
          : item // Không phải item cần tìm, giữ nguyên
      );
      
      setCartItems(updatedCart);
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));

    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm trong giỏ hàng:', error);
    }
  };

  const clearCart = async () => {
    try {
      setCartItems([]);
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Lỗi khi xóa sạch giỏ hàng:', error);
    }
  };

  // Thêm `updateCartItem` vào value của Provider để có thể sử dụng ở các component khác
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);