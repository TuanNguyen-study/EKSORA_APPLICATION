import AxiosInstance from '../AxiosInstance';
// Không cần import AsyncStorage ở đây nữa
// import AsyncStorage from '@react-native-async-storage/async-storage';

export const getPromotion = async () => {
  try {
    const response = await AxiosInstance().get('/api/vouchers');
    return response;
  } catch (error) {
    // console.error('Lỗi khi lấy danh sách Promotion:', error);
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
    // console.error('Lỗi khi lưu voucher:', error);
    throw error;
  }
};

export const getUserSavedVouchers = async (userId) => {
  try {
    const response = await AxiosInstance().get(`/api/user-vouchers/user/${userId}`);
    return response.data;
  } catch (error) {
    // console.error('Lỗi khi lấy voucher đã lưu của người dùng:', error?.response?.data || error.message);
    return [];
  }
};

export const getVouchersByUserId = async (userId) => {
  try {
    const response = await AxiosInstance().get(`/api/user-vouchers/user/${userId}`);
    const data = response.data || response;
    if (!data || (Array.isArray(data) && data.length === 0)) {
      // Không ném lỗi ở đây nữa để tránh log không cần thiết khi user chưa lưu voucher nào
      return [];
    }
    return Array.isArray(data) ? data : [];
  } catch (error) {
    // console.error('Lỗi khi lấy danh sách voucher theo userId:', {
    //   message: error.message,
    //   status: error?.response?.status,
    //   data: error?.response?.data,
    // });
    return [];
  }
};

