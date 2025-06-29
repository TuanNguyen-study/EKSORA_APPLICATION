import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance, { extractErrorMessage } from './AxiosInstance';

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
// ...existing code...

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ newPassword, resetToken }, { rejectWithValue }) => {
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
// ...existing code...