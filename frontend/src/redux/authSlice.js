import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Ensure credentials are sent with requests
axios.defaults.withCredentials = true;

// Get the API URL from the environment variable
const API_URL = import.meta.env.VITE_API_URL;

export const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, status: 'idle', error: null },
  reducers: {
    loginStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload;
    },
    loginFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.status = 'idle'; 
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// Async thunk for login
export const login = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    dispatch(loginSuccess(response.data)); 
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(loginFailure(errorMessage));
  }
};

// Async thunk for logout
export const logoutUser = () => async (dispatch) => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    dispatch(logout());
  } catch (error) {
    console.error('Logout failed:', error.response?.data?.message || error.message);
  }
};

export default authSlice.reducer;
