import { createSlice } from '@reduxjs/toolkit';
import { loginGoogle } from '../API/services/googleService';
import { loginFacebook } from '../API/services/FacebookService';

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