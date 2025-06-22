import AxiosInstance from "../services/AxiosInstance";
//import AxiosInstance from "../AxiosInstance";

//API lấy danh sách yêu thích
export const getFavoriteToursByUser = async (userId) => {
  try {
    const response = await AxiosInstance.get(`/api/favorites/${userId}`);
    return response;
  } catch (error) {
    console.error(' Lỗi khi lấy danh sách tour yêu thích:', error);
    throw error;
  }
};
export const deleteFavorites = async (ids) => {
  try {
    const response = await AxiosInstance().delete(`/api/favorites`, {
      data: { ids },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xoá favorites:", error);
    throw error;
  }
};


export const addFavoriteTour = async (userId, tourId) => {
  try {
    const response = await AxiosInstance.post('/api/favorites', {
      user_id: userId,
      tour_id: tourId,
    });

    console.log(' Thêm tour yêu thích thành công:', response);
    return response;
  } catch (error) {
    console.error(' Lỗi khi thêm tour yêu thích:', error.response?.data || error.message);
    throw error;
  }
};
