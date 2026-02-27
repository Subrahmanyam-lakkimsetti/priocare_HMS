import { createSlice } from '@reduxjs/toolkit';
import { loginUser, fetchCurrentUser, registerUser } from './authThunks';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  sessionInitialized: false,
  manualLogout: false,
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
      state.manualLogout = true;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
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

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionInitialized = true;
        state.manualLogout = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.sessionInitialized = true;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Fetch current user
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

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
