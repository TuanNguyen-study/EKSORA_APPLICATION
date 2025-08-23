// services/googleService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance, { extractErrorMessage } from './AxiosInstance';

export const loginGoogle = createAsyncThunk(
  'auth/google-login',
  async (googleData, { rejectWithValue }) => {
    try {
      if (!googleData?.token) {
        return rejectWithValue('Không tìm thấy Google ID Token');
      }

      const res = await AxiosInstance.post('/api/google-login', googleData);
      console.log('[GoogleLogin] API response:', res.data);

      const { token, user } = res.data;

      if (!token || !user) {
        throw new Error('Invalid server response: missing token or user data');
      }

      // Chuẩn hóa dữ liệu user để đảm bảo format nhất quán với các login khác
      const normalizedUser = {
        _id: user._id || user.id, // Đảm bảo có _id
        email: user.email,
        name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        avatar: user.avatar,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role || 'user',
        loginType: 'google'
        // KHÔNG include trường 'id' để tránh confusion
      };

      console.log('[GoogleLogin] Normalized user:', normalizedUser);

      // Lưu thông tin với Promise.all để đảm bảo tất cả đều được lưu
      await Promise.all([
        AsyncStorage.setItem('ACCESS_TOKEN', token),
        AsyncStorage.setItem('USER_ID', normalizedUser._id),
        AsyncStorage.setItem('USER_PROFILE', JSON.stringify(normalizedUser)),
        AsyncStorage.setItem('LOGIN_TYPE', 'google')
      ]);

      // Verify data was saved correctly
      const savedProfile = await AsyncStorage.getItem('USER_PROFILE');
      console.log('[GoogleLogin] Saved profile verification:', savedProfile);

      return {
        token,
        user: normalizedUser
      };
    } catch (err) {
      console.error('[GoogleLogin] Error:', err);
      return rejectWithValue(err.message || 'Đăng nhập Google thất bại');
    }
  }
);

// Helper function to get user profile with retry logic
export const getUserProfile = async (retryCount = 3) => {
  for (let i = 0; i < retryCount; i++) {
    try {
      const profile = await AsyncStorage.getItem('USER_PROFILE');
      console.log(`[getUserProfile] Attempt ${i + 1}:`, profile);
      
      if (!profile) {
        console.log(`[getUserProfile] Profile not found, attempt ${i + 1}/${retryCount}`);
        if (i < retryCount - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
          continue;
        }
        return null;
      }

      const parsedProfile = JSON.parse(profile);
      const loginType = await AsyncStorage.getItem('LOGIN_TYPE');

      // Đảm bảo có loginType
      return {
        ...parsedProfile,
        loginType: loginType || parsedProfile.loginType || 'unknown'
      };
    } catch (error) {
      console.error(`[getUserProfile] Error attempt ${i + 1}:`, error);
      if (i === retryCount - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return null;
};

// New function to verify storage state
export const verifyUserStorage = async () => {
  const items = await AsyncStorage.multiGet([
    'ACCESS_TOKEN',
    'USER_ID',
    'USER_PROFILE',
    'LOGIN_TYPE'
  ]);
  
  console.log('[Storage Verification]', {
    hasToken: !!items[0][1],
    hasUserId: !!items[1][1],
    hasProfile: !!items[2][1],
    loginType: items[3][1],
    profileData: items[2][1] ? JSON.parse(items[2][1]) : null
  });
  
  return items;
};