import { createSlice } from '@reduxjs/toolkit';
import {
  fetchMyDoctorProfile,
  createDoctorProfile,
  updateDoctorProfile,
} from './profileThunks';

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const doctorProfileSlice = createSlice({
  name: 'doctorProfile',
  initialState,
  reducers: {
    clearDoctorProfileError: (s) => {
      s.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchMyDoctorProfile.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchMyDoctorProfile.fulfilled, (s, a) => {
        s.loading = false;
        s.profile = a.payload;
      })
      .addCase(fetchMyDoctorProfile.rejected, (s) => {
        s.loading = false;
        s.profile = null;
      })

      // CREATE
      .addCase(createDoctorProfile.fulfilled, (s, a) => {
        s.profile = a.payload;
      })

      // UPDATE
      .addCase(updateDoctorProfile.fulfilled, (s, a) => {
        s.profile = a.payload;
      });
  },
});

export const { clearDoctorProfileError } = doctorProfileSlice.actions;
export default doctorProfileSlice.reducer;
