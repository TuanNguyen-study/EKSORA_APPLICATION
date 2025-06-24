import AxiosInstance from "../services/AxiosInstance";

export const getUserProfile = async (token) => {
  try {
    const response = await AxiosInstance.get('/api/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Lấy thông tin người dùng thành công:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error.response?.data || error.message);
    throw error;
  }
};

export const updateUserProfile = async (token, profileData) => {
  try {
    const response = await AxiosInstance.put('/api/profile', profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Cập nhật thông tin người dùng thành công:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin người dùng:', error.response?.data || error.message);
    throw error;
  }
};
