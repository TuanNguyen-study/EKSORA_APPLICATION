import AsyncStorage from '@react-native-async-storage/async-storage';
import AxiosInstance from './AxiosInstance';

//API lấy danh sách chuyến đi
export const getTrips = async (userId) => {
  try {
    // console.log('>>> [TRIPS] Fetching trips for user:', userId);
    
    const token = await AsyncStorage.getItem('ACCESS_TOKEN');
    if (!token) {
      throw new Error('Không tìm thấy token đăng nhập');
    }
    
    AxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    const response = await AxiosInstance.get(`/api/bookings/user/${userId}`);
    // console.log('>>> [TRIPS] Server response:', response.data);
    
    if (!Array.isArray(response.data)) {
      // console.error('>>> [TRIPS] Invalid response format:', response.data);
      throw new Error('Dữ liệu không hợp lệ từ server');
    }
    
    return response.data;
    
  } catch (error) {
    // console.error('>>> [TRIPS] Error details:', {
    //   message: error.message,
    //   status: error.response?.status,
    //   data: error.response?.data,
    // });
    throw new Error(error.response?.data?.message || 'Không thể tải danh sách chuyến đi');
  }
};
