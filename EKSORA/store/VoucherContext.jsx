import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getPromotion, saveUserVoucher, getVouchersByUserId } from '../API/services/servicesPromotion';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tạo Context với các giá trị mặc định, bao gồm cả các hàm mới
const VoucherContext = createContext({
  coupons: [],
  loading: false,
  fetchPromotions: () => {},
  saveVoucher: async () => {},
  handleLogout: () => {}, 
});

export const VoucherProvider = ({ children }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  // fetchPromotions bây giờ không cần useCallback nữa vì nó sẽ được gọi chủ động
  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('USER_ID');

      // Nếu không có userId (vừa đăng xuất hoặc chưa đăng nhập), dọn dẹp và dừng lại
      if (!userId) {
        setCoupons([]);
        setLoading(false);
        return;
      }

      const [allPromotionsResponse, savedVouchersResponse] = await Promise.all([
        getPromotion(),
        getVouchersByUserId(userId)
      ]);

      const savedVoucherData = savedVouchersResponse || [];
      const savedIds = savedVoucherData.map(savedVoucher => savedVoucher.voucher_id?._id).filter(Boolean);
      const allPromotionsData = allPromotionsResponse?.data || allPromotionsResponse || [];
      const unsavedPromotions = allPromotionsData.filter(item => !savedIds.includes(item._id));

      const mapped = unsavedPromotions.map(item => ({
        id: item._id,
        title: 'Mã giảm giá',
        discount: item.discount ? `Giảm ${item.discount}%` : 'Ưu đãi',
        condition: item.condition || `Áp dụng đơn từ...`,
        buttonText: 'Lưu',
        isSaved: false,
        expiry: item.end_date,
      }));

      setCoupons(mapped);
    } catch (error) {
      console.error('Lỗi khi tải voucher:', error);
      setCoupons([]); 
    } finally {
      setLoading(false);
    }
  };
  
  // Hàm saveVoucher không đổi
  const saveVoucher = async (voucherId) => {
    try {
      const userId = await AsyncStorage.getItem('USER_ID');
      if (!userId) return;
      await saveUserVoucher(userId, voucherId);
      setCoupons(prev => prev.filter(c => c.id !== voucherId));
    } catch (error) {
      if (error.response?.status === 400) {
        setCoupons(prev => prev.filter(c => c.id !== voucherId));
      } else {
        alert('Đã có lỗi xảy ra.');
      }
    }
  };

  // === HÀM MỚI DÙNG KHI ĐĂNG XUẤT ===
  const handleLogout = () => {
    console.log("Đã đăng xuất, dọn dẹp voucher state...");
    setCoupons([]); 
  };

  // useEffect này chỉ chạy 1 lần lúc app khởi động để lấy dữ liệu cho người dùng đầu tiên
  useEffect(() => {
    fetchPromotions();
  }, []); // Chỉ chạy 1 lần

  // Tạo giá trị cho Provider, bao gồm cả hàm handleLogout và fetchPromotions (để gọi khi đăng nhập thành công)
  const contextValue = {
    coupons,
    loading,
    saveVoucher,
    handleLogout,
    fetchPromotions 
  };

  return (
    <VoucherContext.Provider value={contextValue}>
      {children}
    </VoucherContext.Provider>
  );
};

export const useVoucher = () => useContext(VoucherContext);