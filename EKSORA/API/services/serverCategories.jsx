import AxiosInstance from '../AxiosInstance';

// API lấy danh sách categories
export const getCategories = async () => {
  try {
    const response = await AxiosInstance().get('/api/categories');
    return response; 
  } catch (error) {
    console.error('Lỗi khi lấy danh sách categories:', error);
    throw error;
  }
};

// API lấy danh sách các tour
export const getTours = async () => {
  try {
    const response = await AxiosInstance().get('/api/tours');
    return response;  
  } catch (error) {
    console.error('Lỗi khi lấy danh sách các tour:', error);
    throw error; 
  }
};

// API lấy danh sách các tour theo tỉnh
export const getToursByLocation = async (province) => {
    try {
        const response = await AxiosInstance().get(`/api/categories/tours-by-location?province=${encodeURIComponent(province)}`);
        return response; 
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tour:', error);
        throw error; 
    }
};

// API lấy thông tin chi tiết của một tour
export const getTourDetails = async (tourId) => {
  try {
    const response = await AxiosInstance().get(`/api/tours/${tourId}`);
    return response; // Trả về dữ liệu chi tiết của tour
  } catch (error) {
    console.error('Lỗi khi lấy thông tin chi tiết tour:', error);
    throw error;
  }
};



