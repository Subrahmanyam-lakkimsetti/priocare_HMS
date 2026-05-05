import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getMyDoctorProfileRequest,
  createDoctorProfileRequest,
  updateDoctorProfileRequest,
} from './profileService';

export const fetchMyDoctorProfile = createAsyncThunk(
  'doctorProfile/fetchMyProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyDoctorProfileRequest();
      return res.data.data;
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const createDoctorProfile = createAsyncThunk(
  'doctorProfile/createProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await createDoctorProfileRequest(formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const updateDoctorProfile = createAsyncThunk(
  'doctorProfile/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await updateDoctorProfileRequest(formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);
