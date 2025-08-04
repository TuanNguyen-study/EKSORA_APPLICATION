// services/bookingService.js
import AxiosInstance from './AxiosInstance';

// API tạo booking mới
export const createBooking = async (bookingData) => {
  try {
    const response = await AxiosInstance.post('/api/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo booking:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data, // Ghi lại dữ liệu lỗi từ server (nếu có)
      config: error.config, // Thông tin cấu hình yêu cầu
    });
    throw error;
  }
};
