import AxiosInstance from '../AxiosInstance';

//API lấy danh sách ưu đãi
export const getPromotion = async () => {
  try {
    const response = await AxiosInstance().get('/api/vouchers');
    return response; 
  } catch (error) {
    console.error('Lỗi khi lấy danh sách Promotion:', error);
    throw error;
  }
};