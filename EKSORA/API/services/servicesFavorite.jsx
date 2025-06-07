import AxiosInstance from '../AxiosInstance';

//API lấy danh sách yêu thích
export const getFavorites = async (userId) => {
  try {
    const response = await AxiosInstance().get(`/api/favorites/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách favorites:', error);
    throw error;
  }
};
