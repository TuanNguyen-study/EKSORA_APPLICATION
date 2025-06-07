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
    const response = await AxiosInstance().get(`/api/categories/tours-by-location?province=${province}`);
    return response;  
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách các tour tại tỉnh ${province}:`, error);
    throw error;
  }
};


