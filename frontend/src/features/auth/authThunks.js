import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginRequest, getMeRequest, logoutRequest } from './authService';
import { logout } from './authSlice';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await loginRequest(credentials);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Invalid email or password',
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    try {
      await logoutRequest();
    } catch (e) {
      // ignore backend failure
    }

    dispatch(logout());
    return true;
  },
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { getState, fulfillWithValue }) => {
    const { manualLogout } = getState().auth;

    if (manualLogout) return fulfillWithValue(null);

    try {
      const res = await getMeRequest();
      return res.data;
    } catch {
      return fulfillWithValue(null);
    }
  },
);
