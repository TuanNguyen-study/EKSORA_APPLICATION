import AxiosInstance from '../AxiosInstance';

// API lấy danh sách categories
export const getCategories = async () => {
  try {
    const response = await AxiosInstance().get('/api/categories');
    return response; 
  } catch (error) {
    console.error('Lỗi khi lấy danh sách categories:', error);
    throw error;
  }
};