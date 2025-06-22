import AxiosInstance from "./AxiosInstance";

//API lấy danh sách yêu thích
export const getFavorites = async (user_id) => {
  try {
    const response = await AxiosInstance.get(`/api/favorites/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách favorites:", error);
    throw error;
  }
};

export const deleteFavorites = async (ids) => {
  try {
    const response = await AxiosInstance.delete(`/api/favorites`, {
      data: { ids },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xoá favorites:", error);
    throw error;
  }
};

const addFavorites = async (userId, tourId) => {
  try {
    const response = await AxiosInstance.post(`/api/favorites`, {
      user_id: userId,
      tour_id: tourId,
    });

    if (response.data.success) {
      console.log("Đã thêm vào yêu thích:", response.data.data);
    }
  } catch (error) {
    console.error(
      "Lỗi khi thêm vào yêu thích:",
      error?.response?.data || error.message
    );
  }
};

// servicesFavorite.js
export const toggleFavorite = async (userId, tourId, isFavorite) => {
  try {
    if (isFavorite) {
      // Nếu đã yêu thích, xoá khỏi danh sách
      await deleteFavorites([tourId]);
      return { removed: true };
    } else {
      // Nếu chưa yêu thích, thêm vào danh sách
      await addFavorites(userId, tourId);
      return { added: true };
    }
  } catch (err) {
    console.error('Lỗi toggleFavorite:', err);
    throw err;
  }
};



