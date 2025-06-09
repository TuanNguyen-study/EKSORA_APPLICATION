import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = axios.create({
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
      const res = await API.post('/api/Register', userData);
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
      console.log('Dữ liệu gửi lên API:', userData); // Log dữ liệu gửi đi
      const res = await API.post('/api/login-email', userData);
      console.log('Kết quả trả về:', res.data); // Log kết quả trả về
      return res.data;
    } catch (err) {
      console.log('Lỗi khi gọi API:', err, err?.response); // Log lỗi chi tiết
      return rejectWithValue(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);


/// login-phone
export const loginphone = createAsyncThunk(
  'auth/phone-login',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await API.post('/api/login-phone', userData);
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
    const res = await API.post('/api/password/send-otp', { email });
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
      const res = await API.post('/api/password/verify-otp', { email, otp });
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
      const res = await API.post(
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
