import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { sendotp, verifyOtp, resetPassword } from './passwordActions';
import axios from 'axios';

// Tạo instance Axios
const AxiosInstance = axios.create({
  baseURL: 'https://api-eksora-app.onrender.com',
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

      if (token) {
        await AsyncStorage.setItem('ACCESS_TOKEN', token);
      }
      if (userId) {
        await AsyncStorage.setItem('USER_ID', userId);
      }

      return res.data;
    } catch (err) {
      console.error('🔥 Lỗi loginUser:', err);
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



// Interceptor
// ...existing code...
AxiosInstance.interceptors.request.use(
  async (config) => {
    // Nếu đã có Authorization (ví dụ khi reset password), không ghi đè
    if (!config.headers.Authorization) {
      const token = await AsyncStorage.getItem('ACCESS_TOKEN');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// ...existing code...

export default AxiosInstance;