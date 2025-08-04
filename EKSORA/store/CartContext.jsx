import React, { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  useCallback 
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { getUserBookings } from '../API/services/servicesUser';

// --- Khai báo các khóa lưu trữ ---
const CART_STORAGE_KEY = 'cart';
const PAID_BOOKINGS_KEY = '@paid_bookings';

// --- Helper để ghi log ngắn gọn, có tiền tố để dễ lọc ---
const log = (level, message, data) => {
  const logData = data ? `: ${JSON.stringify(data)}` : '';
  console[level](`[CartContext] ${message}${logData}`);
};

// --- Tạo Context ---
const CartContext = createContext();

// --- Component Provider ---
export const CartProvider = ({ children, userId, token }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  /**
   * Chuẩn hóa ngày tháng về định dạng DD/MM/YYYY.
   */
  const normalizeDate = (dateInput) => {
    if (!dateInput) return null;

    try {
      // Xử lý chuỗi có dạng "D/M/YYYY" hoặc "DD/MM/YYYY"
      if (typeof dateInput === 'string') {
        const parts = dateInput.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (parts) {
          const day = parseInt(parts[1], 10);
          const month = parseInt(parts[2], 10);
          const year = parseInt(parts[3], 10);
          const date = new Date(year, month - 1, day);
          if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
            throw new Error('Thành phần ngày không hợp lệ');
          }
          const formattedDay = String(date.getDate()).padStart(2, '0');
          const formattedMonth = String(date.getMonth() + 1).padStart(2, '0');
          return `${formattedDay}/${formattedMonth}/${year}`;
        }
      }

      // Xử lý các định dạng khác
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        throw new Error('Định dạng không nhận diện được');
      }

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;

    } catch (error) {
      log('error', 'Không thể chuẩn hóa ngày', { dateInput, error: error.message });
      return null;
    }
  };

  /**
   * Effect chạy mỗi khi màn hình có Cart được focus.
   */
  useFocusEffect(
    useCallback(() => {
      const cleanupPaidCartItems = async () => {
        if (!userId || !token) {
          log('info', 'Bỏ qua dọn dẹp: Thiếu userId hoặc token.');
          return;
        }

        try {
          const bookings = await getUserBookings(userId, token);
          if (!Array.isArray(bookings)) {
            log('warn', 'Không tìm thấy booking hoặc phản hồi không phải là một mảng.');
            return;
          }

          const paidBookings = bookings.filter(b => b.status === 'paid');
          if (paidBookings.length === 0) {
            log('info', 'Không có booking đã thanh toán nào để dọn dẹp.');
            return;
          }

          const paidItemsIdentifiers = new Set(
            paidBookings.map(booking => {
              const tourId = booking.tour_id?._id || booking.tour_id;
              const normalizedDate = normalizeDate(booking.travel_date);
              if (!tourId || !normalizedDate) return null;
              return `${tourId}_${normalizedDate}`;
            }).filter(Boolean)
          );
          
          log('info', 'Đã tìm thấy các mã định danh đã thanh toán', Array.from(paidItemsIdentifiers));

          const currentCart = [...cartItems];
          const itemsToKeep = currentCart.filter(cartItem => {
            const tourId = cartItem.tour_id;
            const normalizedDate = normalizeDate(cartItem.travelDate);
            const itemIdentifier = `${tourId}_${normalizedDate}`;
            return !paidItemsIdentifiers.has(itemIdentifier);
          });
          
          if (itemsToKeep.length < currentCart.length) {
            const removedCount = currentCart.length - itemsToKeep.length;
            log('info', `Dọn dẹp giỏ hàng. Đang xóa ${removedCount} sản phẩm đã thanh toán.`);
            setCartItems(itemsToKeep);
            await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(itemsToKeep));
          } else {
            log('info', 'Giỏ hàng đã được cập nhật. Không có sản phẩm nào bị xóa.');
          }

        } catch (error) {
          log('error', 'Lỗi trong quá trình dọn dẹp giỏ hàng', { message: error.message });
        }
      };

      if (isCartLoaded) {
         cleanupPaidCartItems();
      }
    }, [userId, token, isCartLoaded])
  );

  /**
   * Effect chạy 1 lần duy nhất để tải giỏ hàng từ bộ nhớ.
   */
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartJson = await AsyncStorage.getItem(CART_STORAGE_KEY);
        const loadedItems = cartJson ? JSON.parse(cartJson) : [];
        setCartItems(loadedItems);
        log('info', `Đã tải giỏ hàng từ bộ nhớ với ${loadedItems.length} sản phẩm.`);
      } catch (error) {
        log('error', 'Lỗi khi tải giỏ hàng từ bộ nhớ', error);
      } finally {
        setIsCartLoaded(true);
      }
    };
    loadCart();
  }, []);

  // --- Các hàm tương tác với giỏ hàng ---

  const addToCart = async (item) => {
    const normalizedTravelDate = normalizeDate(item.travelDate);
    if (!normalizedTravelDate) {
      alert('Ngày đi tour không hợp lệ!');
      return;
    }
    
    const itemToAdd = { ...item, travelDate: normalizedTravelDate };

    const existingItem = cartItems.find(
      (cartItem) => cartItem.tour_id === itemToAdd.tour_id && cartItem.travelDate === itemToAdd.travelDate
    );

    if (existingItem) {
      alert('Tour cho ngày này đã có trong giỏ hàng!');
      return;
    }

    try {
      const updatedCart = [...cartItems, itemToAdd];
      setCartItems(updatedCart);
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      log('info', 'Đã thêm sản phẩm vào giỏ hàng', { tour_id: itemToAdd.tour_id, travelDate: itemToAdd.travelDate });
    } catch (error) {
      log('error', 'Lỗi khi thêm sản phẩm vào giỏ hàng', error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      const updatedCart = cartItems.filter((item) => item.id !== id);
      setCartItems(updatedCart);
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      log('info', 'Đã xóa sản phẩm khỏi giỏ hàng', { id });
    } catch (error) {
      log('error', 'Lỗi khi xóa sản phẩm khỏi giỏ hàng', error);
    }
  };

  const updateCartItem = async (itemId, updatedData) => {
    try {
      const updatedCart = cartItems.map(item =>
        item.id === itemId ? { ...item, ...updatedData } : item
      );
      setCartItems(updatedCart);
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      log('info', 'Đã cập nhật sản phẩm trong giỏ hàng', { id: itemId });
    } catch (error) {
      log('error', 'Lỗi khi cập nhật sản phẩm trong giỏ hàng', error);
    }
  };

  const clearCart = async () => {
    try {
      setCartItems([]);
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
      log('info', 'Giỏ hàng đã được xóa sạch.');
    } catch (error) {
      log('error', 'Lỗi khi xóa sạch giỏ hàng', error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, isCartLoaded, addToCart, removeFromCart, updateCartItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => useContext(CartContext);