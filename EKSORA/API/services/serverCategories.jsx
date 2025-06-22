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

// API lấy danh sách các tour theo category ID
export const getToursByLocation = async (cateID) => {
  try {
    console.log('Gọi API với cateID:', cateID);
    const response = await AxiosInstance().get('/api/categories/tours-by-location', {
      params: {
        cateID: cateID,
      },
    });
    //console.log('Response đầy đủ:', response);
    //console.log('Data từ API:', response);
    return response; 
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tour theo cateID:', error);
    throw error;
  }
};