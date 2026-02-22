import { createSlice } from '@reduxjs/toolkit';
import { loginUser, fetchCurrentUser } from './authThunks';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  sessionInitialized: false,
  manualLogout: false, // ⭐ NEW
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.sessionInitialized = true;
      state.manualLogout = true; // ⭐ prevents session restore
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionInitialized = true;
        state.manualLogout = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.sessionInitialized = true;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionInitialized = true;

        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })

      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.sessionInitialized = true;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
