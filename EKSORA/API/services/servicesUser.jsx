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
export const postReview = async (userId, tourId, rating, comment, images, token) => {
  try {
    const payload = {
      userId: userId, 
      tourId: tourId, 
      rating: rating,
      comment: comment,
      images: images,
    };

    // Tạo bản sao cho logging
    const payloadForLogging = {
      ...payload,
      images: `[${Array.isArray(payload.images) ? payload.images.length : 0} ảnh Base64]`
    };

    //console.log('Payload sắp gửi lên server (đã ẩn Base64):', JSON.stringify(payloadForLogging, null, 2));

    const response = await AxiosInstance.post('/api/reviews', payload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi khi gửi đánh giá (từ Axios):', error.response ? error.response.data : error.message);
    throw error;
  }
};




