import AxiosInstance from '../AxiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getPromotion = async () => {
  try {
    const response = await AxiosInstance().get('/api/vouchers');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách Promotion:', error);
    throw error;
  }
};


export const saveUserVoucher = async (userId, voucherId) => {
  try {
    const response = await AxiosInstance().post('/api/user-vouchers/save', {
      user_id: userId,
      voucher_id: voucherId,
    });
    return response;
  } catch (error) {
    console.error('Lỗi khi lưu voucher:', error);
    throw error;
  }
};

export const getUserSavedVouchers = async (userId) => {
  try {
    const response = await AxiosInstance().get(`/api/user-vouchers/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy voucher đã lưu của người dùng:', error);
    return [];
  }
};



const SAVED_VOUCHERS_KEY = 'SAVED_VOUCHERS';

export const getSavedVoucherIds = async () => {
  try {
    const data = await AsyncStorage.getItem(SAVED_VOUCHERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Lỗi khi lấy saved vouchers:', error);
    return [];
  }
};

export const saveVoucherId = async (voucherId) => {
  try {
    const saved = await getSavedVoucherIds();
    if (!saved.includes(voucherId)) {
      saved.push(voucherId);
      await AsyncStorage.setItem(SAVED_VOUCHERS_KEY, JSON.stringify(saved));
    }
  } catch (error) {
    console.error('Lỗi khi lưu voucher:', error);
  }
};
