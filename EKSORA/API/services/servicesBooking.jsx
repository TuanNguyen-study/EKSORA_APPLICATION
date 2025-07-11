import AxiosInstance from './AxiosInstance';

//API lấy danh sách chuyến đi
export const getTrips = async (userId) => {
  try {
    const response = await AxiosInstance.get(`/api/bookings/user/${userId}`);
    
    return response.data;
    
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bookings:', error);
    throw error;
  }
};
