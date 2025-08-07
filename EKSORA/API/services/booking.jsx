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

// API lấy chi tiết 1 booking theo ID
export const getBookingById = async (bookingId, token) => {
  try {
    const response = await AxiosInstance.get(`/api/bookings/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết booking:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });
    throw error;
  }
};

export const cancelBookingById = async (id, token) => {
  try {
    const response = await AxiosInstance.put(`/api/bookings/cancel/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi hủy đơn hàng:', error);
    throw new Error(error.response?.data?.message || 'Lỗi khi hủy đơn hàng');
  }
};

