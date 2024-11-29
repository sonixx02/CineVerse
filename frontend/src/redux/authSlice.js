import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

axios.defaults.withCredentials = true;

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
    signupSuccess: (state, action) => {
     
      state.status = 'succeeded';
      state.user = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, signupSuccess } = authSlice.actions;


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

export const logoutUser = () => async (dispatch) => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    dispatch(logout());
  } catch (error) {
    console.error('Logout failed:', error.response?.data?.message || error.message);
  }
};


export const signup = createAsyncThunk(
  'auth/signup',
  async (formData, { rejectWithValue }) => {
    try {
      
      const response = await axios.post(`${API_URL}/register`, formData);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data); 
    }
  }
);
export default authSlice.reducer;
