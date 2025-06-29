import AxiosInstance from "../services/AxiosInstance";

// API hiển thị user
export const getUser = async () => {
  try {
    const response = await AxiosInstance.get(`/api/profile`);

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Dữ liệu trả về không hợp lệ");
    }
  } catch (error) {
    console.error("Lỗi khi hiển thị User:", error.message || error);
    throw error; 
  }
};

// API lấy danh sách đơn đặt hàng của User
export const getUserBookings = async (userId, token) => {
  try {
    const response = await AxiosInstance.get(
      `/api/bookings/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Dữ liệu đơn đặt hàng trả về không hợp lệ");
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn đặt hàng:", error.message || error);
    throw error;
  }
};
// API gửi đánh giá tour đã đặt
export const postReview = async (userId, tourId, rating, comment) => {
  try {
    const response = await AxiosInstance.post('/api/reviews', {
      userId: userId,
      tourId: tourId,
      rating: rating,
      comment: comment,
      status: 'pending' 
    });

    return response.data;

  } catch (error) {
    console.error('Lỗi khi gửi đánh giá:', error);
    throw error;
  }
};




