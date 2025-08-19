// services/bookingService.js
import AxiosInstance from './AxiosInstance';

// API tạo booking mới
export const createBooking = async (bookingData) => {
  try {
    // Log complete request details
    console.log('>>> [BOOKING SERVICE] Creating booking with data:', JSON.stringify(bookingData, null, 2));
    console.log('>>> [BOOKING SERVICE] API URL:', AxiosInstance.defaults.baseURL + '/api/bookings');

    // Add error handling for missing required fields
    const requiredFields = ['user_id', 'tour_id', 'travel_date', 'quantity_nguoiLon', 'totalPrice'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Thiếu thông tin bắt buộc: ${missingFields.join(', ')}`);
    }

    const response = await AxiosInstance.post('/api/bookings', bookingData);
    
    // Log complete response for debugging
    console.log('>>> [BOOKING SERVICE] Raw server response:', response);
    console.log('>>> [BOOKING SERVICE] Response data type:', typeof response.data);
    console.log('>>> [BOOKING SERVICE] Response data:', JSON.stringify(response.data, null, 2));
    
    if (!response.data) {
      throw new Error('Server không trả về dữ liệu');
    }
    
    // Check if response.data might be a string that needs parsing
    let bookingResponse = response.data;
    if (typeof response.data === 'string') {
      try {
        bookingResponse = JSON.parse(response.data);
        console.log('>>> [BOOKING SERVICE] Parsed response:', bookingResponse);
      } catch (e) {
        console.error('>>> [BOOKING SERVICE] Failed to parse response:', e);
      }
    }
    
    // Look for booking ID in multiple possible locations
    const bookingId = bookingResponse._id || 
                     bookingResponse.id || 
                     bookingResponse.bookingId ||
                     (bookingResponse.booking && bookingResponse.booking._id);
    
    if (!bookingId) {
      console.error('>>> [BOOKING SERVICE] Response structure:', bookingResponse);
      throw new Error('Không tìm thấy mã đơn hàng trong phản hồi. Cấu trúc phản hồi: ' + 
        JSON.stringify(bookingResponse, null, 2));
    }
    
    // Return standardized response
    const standardizedResponse = {
      _id: bookingId,
      ...bookingResponse
    };
    
    return standardizedResponse;
  } catch (error) {
    // Log detailed error information
    console.error('>>> [BOOKING SERVICE] Error details:', {
      name: error.name,
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers
    });
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const serverMessage = error.response.data?.message || error.response.data?.error;
      throw new Error(serverMessage || `Lỗi từ server: ${error.response.status}`);
    } else if (error.request) {
      // Request made but no response received
      throw new Error('Không nhận được phản hồi từ server - kiểm tra kết nối mạng');
    } else {
      // Error before making request
      throw new Error(error.message || 'Không thể tạo đơn hàng');
    }
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

