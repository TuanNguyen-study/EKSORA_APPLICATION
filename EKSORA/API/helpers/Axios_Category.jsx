import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://api-eksora-app.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

/// lấy danh mục sản phẩm
export const getCategory = createAsyncThunk(
  'category/getCategory',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/api/categories');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Lấy danh mục thất bại');
    }
  }
);

//api lấy tour theo id
export const getToursByCategory = createAsyncThunk(
  'tour/getToursByCategory',
  async (catelD, { rejectWithValue }) => {
    try {
      const res = await API.get(`/api/tours?catelD=${catelD}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Lấy tour thất bại');
    }
  }
);