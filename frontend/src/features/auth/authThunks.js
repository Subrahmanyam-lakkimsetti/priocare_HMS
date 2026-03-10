// authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginRequest,
  getMeRequest,
  logoutRequest,
  registerRequest,
} from './authService';
import { logout } from './authSlice';
import { initIntake, resetIntake } from '../patient/patientSlice';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const res = await registerRequest(userData);
      const user = res.data;
      // Load this user's intake (will be empty for new users)
      dispatch(initIntake(user._id));
      return user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Registration failed. Please try again.',
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const res = await loginRequest(credentials);
      const user = res.data;
      // Load THIS user's persisted intake from localStorage
      dispatch(initIntake(user._id));
      return user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Invalid email or password',
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch, getState }) => {
    try {
      await logoutRequest();
    } catch {
      // ignore backend failure
    }

    const userId = getState().auth.user?._id;
    // Clear this user's intake from Redux (NOT from localStorage — keep it for when they log back in)
    dispatch(resetIntake()); // no userId = just clears Redux state
    dispatch(logout());
    return true;
  },
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { dispatch, getState, fulfillWithValue }) => {
    const { manualLogout } = getState().auth;
    if (manualLogout) return fulfillWithValue(null);

    try {
      const res = await getMeRequest();
      const user = res.data;
      // Restore this user's intake on page refresh
      dispatch(initIntake(user._id));
      return user;
    } catch {
      return fulfillWithValue(null);
    }
  },
);
