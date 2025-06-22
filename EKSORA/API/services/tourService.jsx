// API/services/tourService.js

import AxiosInstance from '../AxiosInstance';

export const fetchTourDetail = async (tourId) => {
  if (!tourId) throw new Error('Tour ID không được cung cấp.');

  const axios = AxiosInstance();
  try {
    const response = await axios.get(`/api/tours/${tourId}`);
    console.log('👉 raw axios response:', response);
    const payload = response.data ?? response;
    console.log('👉 payload to return:', payload);
    return payload;
  } catch (err) {
    console.error(`❌ Error calling /api/tours/${tourId}:`, err.response || err);
    if (err.response?.status === 404) {
      throw new Error('Không tìm thấy tour với ID đã cho.');
    }
    throw new Error('Không thể kết nối đến server hoặc đã có lỗi xảy ra.');
  }
};

