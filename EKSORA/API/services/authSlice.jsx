import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from '../services/AxiosInstance';
import { verifyOtp } from '../services/passwordActions';


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    resetToken: null,
    redirectPath: null, // Thêm redirectPath vào state
  },
  reducers: {
    clearResetToken: (state) => {
      state.resetToken = null;
    },
    logout: (state) => {
      state.user = null;
    },
    setRedirectPath: (state, action) => {
      console.log('Setting redirectPath in Redux:', action.payload);
      state.redirectPath = action.payload;
    },
    clearRedirectPath: (state) => {
      console.log('Clearing redirectPath in Redux');
      state.redirectPath = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.resetToken = action.payload.resetToken;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = {
          ...action.payload.user,
          id: action.payload.userId, 
        };
      })
      .addCase(loginUser.rejected, (state) => {
        // Khi đăng nhập lỗi, xóa user khỏi state
        state.user = null;
      });
  },
});

export const { clearResetToken, logout, setRedirectPath, clearRedirectPath } = authSlice.actions;
export default authSlice.reducer;
