// store/VoucherContext.js
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getPromotion, saveUserVoucher, getSavedVoucherIds, saveVoucherId } from '../API/services/servicesPromotion';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VoucherContext = createContext();

export const VoucherProvider = ({ children }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPromotion();
      const savedIds = await getSavedVoucherIds();

      const mapped = response.map(item => ({
        id: item._id,
        title: 'Mã giảm giá',
        discount: item.discount ? `Giảm ${item.discount}%` : 'Ưu đãi',
        condition: item.condition || `Áp dụng đơn từ...`,
        buttonText: savedIds.includes(item._id) ? 'Đã lưu' : 'Lưu',
        isSaved: savedIds.includes(item._id),
        expiry: item.end_date,
      }));
      setCoupons(mapped);
    } catch (error) {
      console.error('Lỗi lấy danh sách voucher:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveVoucher = async (voucherId) => {
    try {
      const userId = await AsyncStorage.getItem('USER_ID');
      if (!userId) return;

      await saveUserVoucher(userId, voucherId);
      await saveVoucherId(voucherId);

      setCoupons(prev =>
        prev.map(c =>
          c.id === voucherId ? { ...c, buttonText: 'Đã lưu', isSaved: true } : c
        )
      );
    } catch (error) {
      console.error('Lỗi lưu voucher:', error);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  return (
    <VoucherContext.Provider value={{ coupons, loading, fetchPromotions, saveVoucher }}>
      {children}
    </VoucherContext.Provider>
  );
};

export const useVoucher = () => useContext(VoucherContext);
