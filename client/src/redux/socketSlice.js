import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    isConnected: false,
    error: null,
  },
  reducers: {
    setSocketConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setSocketError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setSocketConnected, setSocketError } = socketSlice.actions;
export default socketSlice.reducer;
