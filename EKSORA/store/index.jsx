import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../API/services/authSlice'; 

const store = configureStore({
  reducer: { auth: authReducer },
});
export default store;
