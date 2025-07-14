import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cart = await AsyncStorage.getItem('cart');
        if (cart) {
          setCartItems(JSON.parse(cart));
        }
      } catch (error) {
        console.error('Lỗi khi tải giỏ hàng:', error);
      }
    };
    loadCart();
  }, []);

  const addToCart = async (item) => {
    try {
      const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        alert('Tour này đã có trong giỏ hàng!');
        return;
      }
      const updatedCart = [...cartItems, item];
      setCartItems(updatedCart);
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      const updatedCart = cartItems.filter((item) => item.id !== id);
      setCartItems(updatedCart);
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Lỗi khi xóa khỏi giỏ hàng:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);