import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getMyReceptionistProfileRequest,
  createReceptionistProfileRequest,
  updateReceptionistProfileRequest,
} from './profileService';

export const fetchMyReceptionistProfile = createAsyncThunk(
  'receptionistProfile/fetchMyProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyReceptionistProfileRequest();
      return res.data.data;
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const createReceptionistProfile = createAsyncThunk(
  'receptionistProfile/createProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await createReceptionistProfileRequest(formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const updateReceptionistProfile = createAsyncThunk(
  'receptionistProfile/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await updateReceptionistProfileRequest(formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);
