import { createSlice } from '@reduxjs/toolkit';
import { loginGoogle } from '../services/googleService';
import { loginFacebook } from '../services/FacebookService';
import AxiosInstance from './AxiosInstance';
import { getFacebookAuthInfo } from './FacebookService';

const initialState = {
  user: null,
  token: null,
  loading: false,
  // ...existing code...
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ...existing code...
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginGoogle.fulfilled, (state, action) => {
        state.user = action.payload?.user || null;
        state.token = action.payload?.token || null;
        state.loading = false;
        console.log('[authSlice] user cập nhật từ Google:', state.user);
      })
      .addCase(loginFacebook.fulfilled, (state, action) => {
        state.user = action.payload?.user || null;
        state.token = action.payload?.token || null;
        state.loading = false;
        console.log('[authSlice] user cập nhật từ Facebook:', state.user);
      })
      // ...existing code...
  },
});

export default authSlice.reducer;

export const bookTour = async (tourData) => {
  const { token, userId } = await getFacebookAuthInfo();
  console.log('[bookTour] Token lấy ra:', token);
  if (!token) {
    throw new Error('Bạn chưa đăng nhập. Token rỗng!');
  }
  // Truyền token vào header
  const response = await AxiosInstance.post(
    '/api/book-tour',
    { ...tourData, userId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};