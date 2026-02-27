import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getMyProfileRequest,
  createProfileRequest,
  updateProfileRequest,
  updatePasswordRequest,
} from './profileService';

export const fetchMyProfile = createAsyncThunk(
  'profile/fetchMyProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyProfileRequest();
      return res.data.data;
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const createProfile = createAsyncThunk(
  'profile/createProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await createProfileRequest(formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await updateProfileRequest(formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const updatePassword = createAsyncThunk(
  'profile/updatePassword',
  async (payload, { rejectWithValue }) => {
    try {
      await updatePasswordRequest(payload);
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);
