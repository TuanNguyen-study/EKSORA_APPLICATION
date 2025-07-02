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
    try {
      const res = await AxiosInstance.post('/api/Register', userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Đăng ký thất bại');
    }
  }
);

// Login Email
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await AxiosInstance.post('/api/login-email', userData);
      const token = res.data?.token;
      const userId = res.data?.userId;
      const user = res.data?.user;

      if (token) {
        await AsyncStorage.setItem('ACCESS_TOKEN', token);
      }
      if (userId) {
        await AsyncStorage.setItem('USER_ID', userId);
      }
      if (user) {
        await AsyncStorage.setItem('USER_PROFILE', JSON.stringify(user));
      }

      return res.data;
    } catch (err) {
      console.error('Lỗi loginUser:', err);
      return rejectWithValue(
        extractErrorMessage(err, 'Đăng nhập thất bại')
      );
    }
  }
);

// Login Phone
export const loginphone = createAsyncThunk(
  'auth/phone-login',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await AxiosInstance.post('/api/login-phone', userData);
      const token = res.data?.token;
      const userId = res.data?.userId;
      if (token) {
        await AsyncStorage.setItem('ACCESS_TOKEN', token);
      }
      if (userId) {
        await AsyncStorage.setItem('USER_ID', userId);
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, 'Đăng nhập thất bại')
      );
    }
  }
);

// Send OTP
export const sendotp = createAsyncThunk(
  'auth/send-otp',
  async (email, { rejectWithValue }) => {
    try {
      const res = await AxiosInstance.post('/api/password/send-otp', { email });
      if (res.status !== 200) {
        throw new Error('Gửi OTP thất bại');
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, 'Gửi OTP thất bại')
      );
    }
  }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
  'auth/verify-otp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await AxiosInstance.post('/api/password/verify-otp', { email, otp });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        extractErrorMessage(err, 'Xác thực OTP thất bại')
      );
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ newPassword }, { getState, rejectWithValue }) => {
    const state = getState();
    if (!state || !state.auth) {
      return rejectWithValue('Redux state is undefined');
    }
    const resetToken = state.auth.resetToken;
    if (!resetToken) return rejectWithValue('Không có token để reset mật khẩu');

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
      return res.data;
    } catch (err) {

      return rejectWithValue(err.response?.data?.message || 'đặt lại mật khẩu thất bại');
    }
  }
);

// Interceptor
AxiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('ACCESS_TOKEN');
    //console.log('[Interceptor] ACCESS_TOKEN từ AsyncStorage:', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    //console.log('[Interceptor] Headers gửi đi:', config.headers);
    //console.log('[Interceptor] URL:', config.baseURL + config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

export default AxiosInstance;