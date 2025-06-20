import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: 'https://api-eksora-app.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});


// helpers/errorUtils.js
export const extractErrorMessage = (err, defaultMessage = 'Có lỗi xảy ra') => {
  const message = err?.response?.data?.message;

  if (typeof message === 'string') return message;

  if (typeof message === 'object') return JSON.stringify(message);

  return defaultMessage;
};


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

// hhàm đăng nhập 
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

      return {
        token: res.data.token,
        userId: res.data.userId,
        user: res.data.user,  // 👈 Thêm dòng này nếu backend trả về user
      }; // 👈 phải return đầy đủ { token, userId }
    } catch (err) {
      console.error('🔥 Lỗi loginUser:', err); // Thêm log
      return rejectWithValue(err?.response?.data?.message || err.message || 'Đăng nhập thất bại');
    }
  }
);


/// login-phone
export const loginphone = createAsyncThunk(
  'auth/phone-login',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await AxiosInstance.post('/api/login-phone', userData);
      const token = res.data?.token;
      if (token) {
        await AsyncStorage.setItem('ACCESS_TOKEN', token); // ✅ Lưu token
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);


//sendotp 
export const sendotp = createAsyncThunk('auth/send-otp',
  async (email, { rejectWithValue }) => {
    try {
      const res = await AxiosInstance.post('/api/password/send-otp', { email });
      if (res.status !== 200) {
        throw new Error('Gửi OTP thất bại');
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Gửi OTP thất bại');
    }
  }
);

// verify otp
export const verifyOtp = createAsyncThunk('auth/verify-otp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await AxiosInstance.post('/api/password/verify-otp', { email, otp });
      return res.data; // ✅ res.data = { resetToken, ... }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Xác thực OTP thất bại');
    }
  }
);


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

AxiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('ACCESS_TOKEN');
    console.log('🔐 [Interceptor] ACCESS_TOKEN từ AsyncStorage:', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 [Interceptor] Headers gửi đi:', config.headers);
    console.log('📤 [Interceptor] URL:', config.baseURL + config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

export default AxiosInstance;
