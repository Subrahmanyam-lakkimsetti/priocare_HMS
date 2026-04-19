import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginRequest,
  getMeRequest,
  logoutRequest,
  registerRequest,
  sendOtpRequest,
  resendOtpRequest,
} from './authService';
import { logout } from './authSlice';
import { initIntake, resetIntake } from '../patient/patientSlice';

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await sendOtpRequest({ email });
      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to send OTP. Please try again.',
      );
    }
  },
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await resendOtpRequest({ email });
      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to resend OTP.',
      );
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const res = await registerRequest(userData);
      const user = res.data;
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
      // ignore
    }
    dispatch(resetIntake());
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
      dispatch(initIntake(user._id));
      return user;
    } catch {
      return fulfillWithValue(null);
    }
  },
);