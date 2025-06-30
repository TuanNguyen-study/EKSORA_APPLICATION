import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from '../services/AxiosInstance';
import { verifyOtp } from '../services/passwordActions';
// ...existing code... // ✅ Thêm loginUser vào đây

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    resetToken: null,
  },
  reducers: {
    clearResetToken: (state) => {
      state.resetToken = null;
    },
    logout: (state) => {
      state.user = null;
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
      });
  },
});

export const { clearResetToken, logout } = authSlice.actions;
export default authSlice.reducer;
