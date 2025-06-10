import AxiosInstance from './AxiosInstance';

//API hiển thị user
export const getUser = async () => {
  try {
    const response = await AxiosInstance.get(`/api/profile`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi hiển thị User:', error);
    throw error;
  }
};