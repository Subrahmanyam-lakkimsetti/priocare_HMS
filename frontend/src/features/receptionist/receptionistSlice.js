import { createSlice } from '@reduxjs/toolkit';
import {
  fetchDashboardStats,
  fetchTodaysAppointments,
  fetchQueueStatus,
  fetchRecentCheckins,
  checkinPatient,
  fetchAppointmentByToken,
} from './receptionistThunks';

const initialState = {
  stats: null,
  appointments: [],
  queueStatus: [],
  recentCheckins: [],
  tokenAppointment: null,
  tokenLoading: false,
  tokenError: null, // ← tracks "No appointment found!" message
  lastCheckedIn: null,
  checkinError: null, // ← tracks check-in error message
  loading: {
    stats: false,
    appointments: false,
    queue: false,
    checkins: false,
    checkin: false,
  },
};

const receptionistSlice = createSlice({
  name: 'receptionist',
  initialState,
  reducers: {
    clearTokenAppointment(state) {
      state.tokenAppointment = null;
      state.tokenError = null;
    },
    clearLastCheckedIn(state) {
      state.lastCheckedIn = null;
      state.checkinError = null;
    },
  },
  extraReducers: (builder) => {
    // Dashboard stats
    builder
      .addCase(fetchDashboardStats.pending, (s) => {
        s.loading.stats = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (s, a) => {
        s.loading.stats = false;
        s.stats = a.payload;
      })
      .addCase(fetchDashboardStats.rejected, (s) => {
        s.loading.stats = false;
      });

    // Today's appointments
    builder
      .addCase(fetchTodaysAppointments.pending, (s) => {
        s.loading.appointments = true;
      })
      .addCase(fetchTodaysAppointments.fulfilled, (s, a) => {
        s.loading.appointments = false;
        s.appointments = a.payload;
      })
      .addCase(fetchTodaysAppointments.rejected, (s) => {
        s.loading.appointments = false;
      });

    // Queue
    builder
      .addCase(fetchQueueStatus.pending, (s) => {
        s.loading.queue = true;
      })
      .addCase(fetchQueueStatus.fulfilled, (s, a) => {
        s.loading.queue = false;
        s.queueStatus = a.payload;
      })
      .addCase(fetchQueueStatus.rejected, (s) => {
        s.loading.queue = false;
      });

    // Recent check-ins
    builder
      .addCase(fetchRecentCheckins.pending, (s) => {
        s.loading.checkins = true;
      })
      .addCase(fetchRecentCheckins.fulfilled, (s, a) => {
        s.loading.checkins = false;
        s.recentCheckins = a.payload;
      })
      .addCase(fetchRecentCheckins.rejected, (s) => {
        s.loading.checkins = false;
      });

    // Check-in patient
    builder
      .addCase(checkinPatient.pending, (s) => {
        s.loading.checkin = true;
        s.checkinError = null;
        s.lastCheckedIn = null;
      })
      .addCase(checkinPatient.fulfilled, (s, a) => {
        s.loading.checkin = false;
        s.lastCheckedIn = a.payload;
        s.checkinError = null;
      })
      .addCase(checkinPatient.rejected, (s, a) => {
        s.loading.checkin = false;
        s.lastCheckedIn = null; // ← ensure no stale shell object
        s.checkinError = a.payload || 'Check-in failed';
      });

    // Token search
    builder
      .addCase(fetchAppointmentByToken.pending, (s) => {
        s.tokenLoading = true;
        s.tokenAppointment = null;
        s.tokenError = null;
      })
      .addCase(fetchAppointmentByToken.fulfilled, (s, a) => {
        s.tokenLoading = false;
        s.tokenAppointment = a.payload;
        s.tokenError = null;
      })
      .addCase(fetchAppointmentByToken.rejected, (s, a) => {
        s.tokenLoading = false;
        s.tokenAppointment = null; // ← always null on failure
        s.tokenError = a.payload || 'No appointment found';
      });
  },
});

export const { clearTokenAppointment, clearLastCheckedIn } =
  receptionistSlice.actions;
export default receptionistSlice.reducer;