// services/facebookService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from './AxiosInstance';

export const loginFacebook = createAsyncThunk(
  'auth/facebook-login',
  async (facebookData, { rejectWithValue }) => {
    try {
      console.log('Calling Facebook login API with data:', facebookData);
      
      // Validate required data
      if (!facebookData.facebookUid) {
        throw new Error('Facebook UID là bắt buộc');
      }
      
      if (!facebookData.email) {
        throw new Error('Email là bắt buộc');
      }

      // Prepare request payload
      const requestData = {
        facebookUid: facebookData.facebookUid,
        firstName: facebookData.firstName || '',
        lastName: facebookData.lastName || '',
        email: facebookData.email,
        phone: facebookData.phone || '',
        address: facebookData.address || '',
        avatarUrl: facebookData.avatarUrl || '',
      };
      
      const response = await AxiosInstance.post('/api/facebook-login', requestData);
      
      console.log('Facebook login API response:', response.data);
      
      // Validate response structure
      if (!response.data) {
        throw new Error('Không nhận được phản hồi từ server');
      }

      // Check if response indicates success based on actual API structure
      // API trả về message thay vì success flag
      if (response.data.message && response.data.message.includes('thất bại')) {
        const errorMessage = response.data.message || 'Login failed';
        throw new Error(errorMessage);
      }
      
      const { token, user, userId } = response.data;

      // Validate essential data
      if (!token) {
        throw new Error('Không nhận được token từ server');
      }

      if (!user) {
        throw new Error('Không nhận được thông tin user từ server');
      }

      // Chuẩn hóa dữ liệu user
      const normalizedUser = {
        _id: user._id || user.id,
        email: user.email || facebookData.email || '',
        name: user.name || user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        avatar: user.avatar || facebookData.avatarUrl || '',
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role || 'user',
        loginType: 'facebook'
      };

      // Save token and user info to AsyncStorage
      try {
        await AsyncStorage.setItem('ACCESS_TOKEN', token);
        console.log('Facebook token saved to AsyncStorage');
        
        // Use userId from response or user.id as fallback
        const userIdToSave = userId || user.id;
        if (userIdToSave) {
          await AsyncStorage.setItem('USER_ID', userIdToSave.toString());
          console.log('Facebook user ID saved to AsyncStorage');
        }
        
        await AsyncStorage.setItem('USER_PROFILE', JSON.stringify(normalizedUser));
        console.log('Facebook user profile saved to AsyncStorage');
        
        await AsyncStorage.setItem('LOGIN_TYPE', 'facebook');
        console.log('Login type saved to AsyncStorage');
      } catch (storageError) {
        console.error('Error saving to AsyncStorage:', storageError);
        throw new Error('Không thể lưu thông tin đăng nhập');
      }

      return {
        token,
        user: normalizedUser
      };
      
    } catch (error) {
      console.error('[loginFacebook error]', error);
      
      // Log response data if available
      if (error.response?.data) {
        console.error('[loginFacebook error response]', error.response.data);
      }
      
      let errorMessage = 'Đăng nhập Facebook thất bại';
      
      // Handle different error types
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors array
        if (Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors.join(', ');
        } else {
          errorMessage = error.response.data.errors;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Handle network errors
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.';
      }
      
      // Handle timeout errors
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Kết nối quá chậm. Vui lòng thử lại.';
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutFacebook = createAsyncThunk(
  'auth/facebook-logout',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Starting Facebook logout process');
      
      // Clear data from AsyncStorage
      await AsyncStorage.multiRemove([
        'ACCESS_TOKEN', 
        'USER_ID', 
        'USER_PROFILE'
      ]);
      
      console.log('Facebook user data cleared from AsyncStorage');
      
      return { success: true };
      
    } catch (error) {
      console.error('[logoutFacebook error]', error);
      return rejectWithValue('Đăng xuất thất bại');
    }
  }
);

// Additional helper function to check Facebook login status
export const checkFacebookLoginStatus = createAsyncThunk(
  'auth/check-facebook-status',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('ACCESS_TOKEN');
      const userProfile = await AsyncStorage.getItem('USER_PROFILE');
      
      if (!token || !userProfile) {
        return { isLoggedIn: false };
      }
      
      const user = JSON.parse(userProfile);
      
      return {
        isLoggedIn: true,
        token,
        user
      };
      
    } catch (error) {
      console.error('[checkFacebookLoginStatus error]', error);
      return rejectWithValue('Không thể kiểm tra trạng thái đăng nhập');
    }
  }
);

// Helper: lấy token và userId từ AsyncStorage để dùng cho các API cần xác thực
export const getFacebookAuthInfo = async () => {
  try {
    const token = await AsyncStorage.getItem('ACCESS_TOKEN');
    const userId = await AsyncStorage.getItem('USER_ID');
    console.log('[getFacebookAuthInfo] token:', token, 'userId:', userId);
    return { token, userId };
  } catch (error) {
    console.error('[getFacebookAuthInfo error]', error);
    return { token: null, userId: null };
  }
};

// Khi gọi API đặt tour, nên dùng:
// const { token, userId } = await getFacebookAuthInfo();
// rồi truyền token vào header hoặc body theo yêu cầu backend