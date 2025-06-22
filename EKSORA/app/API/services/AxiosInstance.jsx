import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://api-eksora-app.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
export const loginEmail = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await API.post('/api/login-email', userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);



//send otp

export const sendotp = createAsyncThunk('auth/send-otp',
  async (email, { rejectWithValue }) => {
    try {
      const res = await API.post('/api/send-otp', {input: email });
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
      const res = await API.post('/api/verify-otp', { email, otp });
      if (res.status !== 200) {
        throw new Error('Xác thực OTP thất bại');
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Xác thực OTP thất bại');
    }
  }
);


// reset password 
export const resetPassword = createAsyncThunk('auth/update-password',
  async ({ input, newPassword }, { rejectWithValue }) => {
    try {
      const res = await API.post('/api/update-password', { input, newPassword });
      if (res.status !== 200) {
        throw new Error('Đặt lại mật khẩu thất bại');
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Đặt lại mật khẩu thất bại');
    }
  }
);