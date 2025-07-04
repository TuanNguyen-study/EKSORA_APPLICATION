// API/services/tourService.js

// API/services/tourService.js
import axios from './AxiosInstance'; 

export const fetchTourDetail = async (tourId) => {
  if (!tourId) throw new Error('Tour ID không được cung cấp.');

  try {
    const response = await axios.get(`/api/tours/${tourId}`);
    //console.log('👉 raw axios response:', response);
    //console.log('👉 raw response.data:', response.data);
    return response.data ?? response;
  } catch (err) {
    //console.error(`❌ Error calling /api/tours/${tourId}:`, err.response || err);
    if (err.response?.status === 404) {
      throw new Error('Không tìm thấy tour với ID đã cho.');
    }
    throw new Error('Không thể kết nối đến server hoặc đã có lỗi xảy ra.');
  }
};


