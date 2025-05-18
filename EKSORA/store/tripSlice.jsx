import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedTrip: null,
};

const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setSelectedTrip: (state, action) => {
      state.selectedTrip = action.payload;
    },
    clearTrip: (state) => {
      state.selectedTrip = null;
    },
  },
});

export const { setSelectedTrip, clearTrip } = tripSlice.actions;
export default tripSlice.reducer;
