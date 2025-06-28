import AxiosInstance from '../AxiosInstance';

export const getPromotion = async () => {
  try {
    const response = await AxiosInstance().get('/api/vouchers');
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách Promotion:', error);
    throw error;
  }
};
