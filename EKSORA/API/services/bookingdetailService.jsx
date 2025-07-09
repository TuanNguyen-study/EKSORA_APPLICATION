import AxiosInstance from './AxiosInstance'; // đường dẫn tùy vào cấu trúc thư mục của bạn

/**
 * Lấy chi tiết đơn hàng booking theo ID
 * @param {string} bookingId 
 * @returns {Promise<any>}
 */
export const getBookingDetailById = async (bookingId) => {
  try {
    const response = await AxiosInstance.get(`/api/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    throw error;
  }
};
export const cancelBookingById = async (id) => {
  const response = await AxiosInstance.put(`/api/bookings/cancel/${id}`);
  return response.data;
};
