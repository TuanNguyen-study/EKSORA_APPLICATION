import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Tạo instance Axios
const AxiosInstance = axios.create({
  baseURL: 'http://160.250.246.76:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helpers
export const extractErrorMessage = (err, defaultMessage = 'Có lỗi xảy ra') => {
  const message = err?.response?.data?.message;
  if (typeof message === 'string') return message;
  if (typeof message === 'object') return JSON.stringify(message);
  return defaultMessage;
};

// Register
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    // console.log('[Register] Sending data:', userData);
    try {
      const res = await AxiosInstance.post('/api/Register', userData);
      // console.log('[Register] Response:', res.data);
      return res.data;
    } catch (err) {
      // console.error('[Register] Error:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || 'Đăng ký thất bại');
    }
  }
);

// Login Email
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    // console.log('[Login Email] Sending data:', userData);
    try {
      const res = await AxiosInstance.post('/api/login-email', userData);
      // console.log('[Login Email] Response:', res.data);

      const token = res.data?.token;
      const userId = res.data?.userId;
      const user = res.data?.user;

      if (token) {
        await AsyncStorage.setItem('ACCESS_TOKEN', token);
        // console.log('[Login Email] Token stored:', token);
      }
      if (userId) {
        await AsyncStorage.setItem('USER_ID', userId);
        // console.log('[Login Email] UserId stored:', userId);
      }
      if (user) {
        await AsyncStorage.setItem('USER_PROFILE', JSON.stringify(user));
        // console.log('[Login Email] User stored:', user);
      }

      return res.data;
    } catch (err) {
      // console.error('[Login Email] Error:', err.response?.data || err.message);
      return rejectWithValue(extractErrorMessage(err, 'Đăng nhập thất bại'));
    }
  }
);

// Login Phone
export const loginphone = createAsyncThunk(
  'auth/phone-login',
  async (userData, { rejectWithValue }) => {
    // console.log('[Login Phone] Sending data:', userData);
    try {
      const res = await AxiosInstance.post('/api/login-phone', userData);
      // console.log('[Login Phone] Response:', res.data);

      const token = res.data?.token;
      const userId = res.data?.userId;

      if (token) {
        await AsyncStorage.setItem('ACCESS_TOKEN', token);
        // console.log('[Login Phone] Token stored:', token);
      }
      if (userId) {
        await AsyncStorage.setItem('USER_ID', userId);
        // console.log('[Login Phone] UserId stored:', userId);
      }

      return res.data;
    } catch (err) {
      // console.error('[Login Phone] Error:', err.response?.data || err.message);
      return rejectWithValue(extractErrorMessage(err, 'Đăng nhập thất bại'));
    }
  }
);

// Send OTP
export const sendotp = createAsyncThunk(
  'auth/send-otp',
  async (email, { rejectWithValue }) => {
    // console.log('[Send OTP] Email:', email);
    try {
      const res = await AxiosInstance.post('/api/password/send-otp', { email });
      // console.log('[Send OTP] Response:', res.data);
      return res.data;
    } catch (err) {
      // console.error('[Send OTP] Error:', err.response?.data || err.message);
      return rejectWithValue(extractErrorMessage(err, 'Gửi OTP thất bại'));
    }
  }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
  'auth/verify-otp',
  async ({ email, otp }, { rejectWithValue }) => {
    // console.log('[Verify OTP] Sending:', { email, otp });
    try {
      const res = await AxiosInstance.post('/api/password/verify-otp', { email, otp });
      // console.log('[Verify OTP] Response:', res.data);
      return res.data;
    } catch (err) {
      // console.error('[Verify OTP] Error:', err.response?.data || err.message);
      return rejectWithValue(extractErrorMessage(err, 'Xác thực OTP thất bại'));
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ newPassword }, { getState, rejectWithValue }) => {
    const state = getState();
    const resetToken = state?.auth?.resetToken;

    // console.log('[Reset Password] State:', state?.auth);
    if (!resetToken) {
      // console.warn('[Reset Password] Missing reset token!');
      return rejectWithValue('Không có token để reset mật khẩu');
    }

    try {
      const res = await AxiosInstance.post(
        '/api/password/reset-password',
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${resetToken}`,
            'x-client-id': 'af5b66e1-254c-4934-b883-937882df00f4',
            'x-api-key': '8d75fba6-789f-4ea4-8a3f-af375140662d',
          },
        }
      );
      // console.log('[Reset Password] Response:', res.data);
      return res.data;
    } catch (err) {
      // console.error('[Reset Password] Error:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || 'Đặt lại mật khẩu thất bại');
    }
  }
);

// Interceptor
AxiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('ACCESS_TOKEN');
    // console.log('[Interceptor] ACCESS_TOKEN:', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // console.log('[Interceptor] Request Headers:', config.headers);
    // console.log('[Interceptor] Request URL:', config.baseURL + config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

export default AxiosInstance;
