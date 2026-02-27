import { createSlice } from '@reduxjs/toolkit';
import {
  fetchMyProfile,
  createProfile,
  updateProfile,
  updatePassword,
} from './profileThunks';

const initialState = {
  profile: null,
  loading: false,
  error: null,
  passwordUpdating: false,
  passwordSuccess: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearPasswordStatus: (s) => {
      s.passwordSuccess = false;
      s.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchMyProfile.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchMyProfile.fulfilled, (s, a) => {
        s.loading = false;
        s.profile = a.payload;
      })
      .addCase(fetchMyProfile.rejected, (s) => {
        s.loading = false;
        s.profile = null;
      })

      // CREATE
      .addCase(createProfile.fulfilled, (s, a) => {
        s.profile = a.payload;
      })

      // UPDATE
      .addCase(updateProfile.fulfilled, (s, a) => {
        s.profile = a.payload;
      })

      // PASSWORD
      .addCase(updatePassword.pending, (s) => {
        s.passwordUpdating = true;
      })
      .addCase(updatePassword.fulfilled, (s) => {
        s.passwordUpdating = false;
        s.passwordSuccess = true;
      })
      .addCase(updatePassword.rejected, (s, a) => {
        s.passwordUpdating = false;
        s.error = a.payload;
      });
  },
});

export const { clearPasswordStatus } = profileSlice.actions;
export default profileSlice.reducer;
