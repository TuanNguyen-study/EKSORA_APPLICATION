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

export const deleteFavorites = async (userId, ids) => {
  try {
    const response = await AxiosInstance().delete(`/api/favorites/${userId}`, {
      data: { ids },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xoá favorites:', error);
    throw error;
  }
};
