// authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { verifyOtp } from '../server/AxiosInstance'; // chỗ bạn define verifyOtp

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    resetToken: null, // ✅ thêm dòng này
  },
  reducers: {
    clearResetToken: (state) => {
      state.resetToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.resetToken = action.payload.resetToken; // ✅ lưu resetToken vào Redux
      });
  },
});

export const { clearResetToken } = authSlice.actions;
export default authSlice.reducer;
