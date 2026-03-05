import { createSlice } from '@reduxjs/toolkit';
import {
  fetchQueue,
  startConsultation,
  fetchAiSummary,
  endConsultation,
  callNextPatient,
  fetchActiveConsultation,
  fetchTreatedHistory,
} from './doctorThunks';

const initialState = {
  queue: [],
  calledPatient: null,
  activePatient: null,
  aiSummary: null,
  patientHistory: [],
  historyLoading: false,
  loading: false,
  error: null,
};

const attachPatient = (appt) => {
  if (!appt) return null;
  const pd = appt.patientDetails;
  if (!pd) return appt;
  const details = Array.isArray(pd) ? pd[0] : pd;
  if (!details) return appt;
  const { patientDetails, ...rest } = appt;
  return {
    ...rest,
    patient: {
      name: `${details.firstName} ${details.lastName}`,
      age: details.age,
      gender: details.gender,
      bloodGroup: details.bloodGroup,
      phoneNumber: details.phoneNumber,
    },
  };
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    clearConsultation(state) {
      state.activePatient = null;
      state.aiSummary = null;
      state.calledPatient = null;
    },
  },
  extraReducers: (builder) => {
    // fetchQueue
    builder.addCase(fetchQueue.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchQueue.fulfilled, (state, action) => {
      state.queue = action.payload?.patients || [];
      state.loading = false;
    });
    builder.addCase(fetchQueue.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // callNextPatient
    builder.addCase(callNextPatient.fulfilled, (state, action) => {
      state.calledPatient = action.payload;
    });

    // startConsultation
    builder.addCase(startConsultation.fulfilled, (state, action) => {
      state.activePatient = action.payload;
      state.calledPatient = null;
      state.aiSummary = null;
    });

    // endConsultation
    builder.addCase(endConsultation.fulfilled, (state) => {
      state.activePatient = null;
      state.aiSummary = null;
      state.calledPatient = null;
    });

    // fetchAiSummary
    builder.addCase(fetchAiSummary.fulfilled, (state, action) => {
      if (action.payload?.aiSummary) {
        state.aiSummary = action.payload;
      }
    });

    // fetchActiveConsultation
    builder.addCase(fetchActiveConsultation.fulfilled, (state, action) => {
      const appointments = action.payload;
      if (!Array.isArray(appointments) || appointments.length === 0) return;

      const activeAppt = appointments.find(
        (a) => a.status === 'in_consultation',
      );
      const calledAppt = appointments.find((a) => a.status === 'called');

      if (activeAppt && !state.activePatient) {
        state.activePatient = attachPatient(activeAppt);
      }
      if (calledAppt && !state.calledPatient) {
        state.calledPatient = {
          tokenNumber: calledAppt.token,
          calledAt: calledAppt.calledAt,
        };
      }
    });

    // fetchTreatedHistory
    builder.addCase(fetchTreatedHistory.pending, (state) => {
      state.historyLoading = true;
    });
    builder.addCase(fetchTreatedHistory.fulfilled, (state, action) => {
      state.patientHistory = action.payload || [];
      state.historyLoading = false;
    });
    builder.addCase(fetchTreatedHistory.rejected, (state) => {
      state.historyLoading = false;
    });
  },
});

export const { clearConsultation } = doctorSlice.actions;
export default doctorSlice.reducer;
