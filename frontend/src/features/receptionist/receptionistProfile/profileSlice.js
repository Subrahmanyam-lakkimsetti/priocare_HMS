import { createSlice } from '@reduxjs/toolkit';
import {
  fetchMyReceptionistProfile,
  createReceptionistProfile,
  updateReceptionistProfile,
} from './profileThunks';

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const receptionistProfileSlice = createSlice({
  name: 'receptionistProfile',
  initialState,
  reducers: {
    clearReceptionistProfileError: (s) => {
      s.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchMyReceptionistProfile.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchMyReceptionistProfile.fulfilled, (s, a) => {
        s.loading = false;
        s.profile = a.payload;
      })
      .addCase(fetchMyReceptionistProfile.rejected, (s) => {
        s.loading = false;
        s.profile = null;
      })

      // CREATE
      .addCase(createReceptionistProfile.fulfilled, (s, a) => {
        s.profile = a.payload;
      })

      // UPDATE
      .addCase(updateReceptionistProfile.fulfilled, (s, a) => {
        s.profile = a.payload;
      });
  },
});

export const { clearReceptionistProfileError } =
  receptionistProfileSlice.actions;
export default receptionistProfileSlice.reducer;
