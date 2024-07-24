import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../main";

export const checkAuthStatus = createAsyncThunk(
  "user/checkAuthStatus",
  async (_, { dispatch }) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      dispatch(logout());
      return null;
    }
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      dispatch(logout());
      return null;
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    authUser: null,
    otherUsers: null,
    selectedUser: null,
    onlineUsers: [],
    isLoading: true,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
      state.isLoading = false;
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.authUser = null;
      state.isLoading = false;
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isLoading = false;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.authUser = null;
        state.isLoading = false;
      });
  },
});

export const {
  setAuthUser,
  setOtherUsers,
  setSelectedUser,
  setOnlineUsers,
  setLoading,
  logout,
} = userSlice.actions;
export default userSlice.reducer;
