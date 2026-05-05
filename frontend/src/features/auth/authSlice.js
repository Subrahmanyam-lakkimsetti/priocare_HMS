import { createSlice } from '@reduxjs/toolkit';
import {
  loginUser,
  fetchCurrentUser,
  registerUser,
  sendOtp,
  resendOtp,
  forgetPassword,
  resetPassword,
} from './authThunks';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  sessionInitialized: false,
  manualLogout: false,
  error: null,
  otpSent: false,
  otpLoading: false,
  otpError: null,
  forgetPasswordLoading: false,
  forgetPasswordError: null,
  forgetPasswordSuccess: false,
  resetPasswordLoading: false,
  resetPasswordError: null,
  resetPasswordSuccess: false,
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
      state.otpSent = false;
      state.otpLoading = false;
      state.otpError = null;
    },
    clearError: (state) => {
      state.error = null;
      state.otpError = null;
    },
    resetOtpState: (state) => {
      state.otpSent = false;
      state.otpLoading = false;
      state.otpError = null;
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

      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.otpLoading = true;
        state.otpError = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.otpLoading = false;
        state.otpSent = true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpError = action.payload;
      })

      // Resend OTP
      .addCase(resendOtp.pending, (state) => {
        state.otpLoading = true;
        state.otpError = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.otpLoading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpError = action.payload;
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
      })

      // Forget Password
      .addCase(forgetPassword.pending, (state) => {
        state.forgetPasswordLoading = true;
        state.forgetPasswordError = null;
        state.forgetPasswordSuccess = false;
      })
      .addCase(forgetPassword.fulfilled, (state) => {
        state.forgetPasswordLoading = false;
        state.forgetPasswordSuccess = true;
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.forgetPasswordLoading = false;
        state.forgetPasswordError = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordLoading = true;
        state.resetPasswordError = null;
        state.resetPasswordSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPasswordLoading = false;
        state.resetPasswordSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordError = action.payload;
      });
  },
});

export const { logout, clearError, resetOtpState } = authSlice.actions;
export default authSlice.reducer;
