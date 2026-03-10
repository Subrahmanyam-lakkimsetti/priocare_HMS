// patientSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  createAppointment,
  fetchActiveAppointment,
  fetchAppointmentByToken,
  fetchAllAppointments,
  cancelAppointment,
} from './patientThunks';
import {
  loadIntake,
  saveIntake,
  clearIntake,
} from '../../utils/patientStorage';

const emptyIntake = {
  description: '',
  symptoms: [],
  comorbidities: [],
  age: '',
  vitals: {
    heartRate: '',
    bloodPressure: '',
    temperature: '',
  },
  scheduledDate: '',
};

const initialState = {
  submitting: false,
  success: false,
  error: null,
  showReview: false,

  activeAppointment: null,
  loadingAppointment: false,

  appointments: [],
  loadingAppointmentsList: false,

  // No longer preloading here — loaded after login via initIntake
  intake: { ...emptyIntake },
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,

  reducers: {
    // Called after login/register to load the correct user's intake
    initIntake: (s, a) => {
      const userId = a.payload;
      const persisted = loadIntake(userId);
      s.intake = persisted || { ...emptyIntake };
    },

    setField: (s, a) => {
      s.intake = { ...s.intake, ...a.payload };
      saveIntake(a.payload._userId || s._userId, s.intake);
    },

    setVitals: (s, a) => {
      s.intake.vitals = { ...s.intake.vitals, ...a.payload };
    },

    toggleArrayValue: (s, a) => {
      const { key, value, userId } = a.payload;
      const arr = s.intake[key];
      s.intake[key] = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      saveIntake(userId, s.intake);
    },

    saveIntakeForUser: (s, a) => {
      const { userId, intake } = a.payload;
      s.intake = intake;
      saveIntake(userId, intake);
    },

    openReview: (s) => {
      s.showReview = true;
    },
    closeReview: (s) => {
      s.showReview = false;
    },

    resetIntake: (s, a) => {
      const userId = a.payload; // pass userId when dispatching
      if (userId) clearIntake(userId);
      s.intake = { ...emptyIntake };
      s.success = false;
      s.error = null;
      s.showReview = false;
    },
  },

  extraReducers: (b) => {
    // CREATE
    b.addCase(createAppointment.pending, (s) => {
      s.submitting = true;
    });
    b.addCase(createAppointment.fulfilled, (s, a) => {
      s.submitting = false;
      s.success = true;
      // userId passed as meta from thunk
      if (a.meta?.arg?.userId) clearIntake(a.meta.arg.userId);
      s.intake = { ...emptyIntake };
    });
    b.addCase(createAppointment.rejected, (s, a) => {
      s.submitting = false;
      s.error = a.payload;
    });

    // FETCH ACTIVE
    b.addCase(fetchActiveAppointment.pending, (s) => {
      s.loadingAppointment = true;
    });
    b.addCase(fetchActiveAppointment.fulfilled, (s, a) => {
      s.loadingAppointment = false;
      s.activeAppointment = a.payload;
    });
    b.addCase(fetchActiveAppointment.rejected, (s) => {
      s.loadingAppointment = false;
      s.activeAppointment = null;
    });

    // FETCH BY TOKEN
    b.addCase(fetchAppointmentByToken.pending, (s) => {
      s.loadingAppointment = true;
    });
    b.addCase(fetchAppointmentByToken.fulfilled, (s, a) => {
      s.loadingAppointment = false;
      s.activeAppointment = a.payload;
    });
    b.addCase(fetchAppointmentByToken.rejected, (s) => {
      s.loadingAppointment = false;
    });

    // FETCH ALL
    b.addCase(fetchAllAppointments.pending, (s) => {
      s.loadingAppointmentsList = true;
    });
    b.addCase(fetchAllAppointments.fulfilled, (s, a) => {
      s.loadingAppointmentsList = false;
      s.appointments = a.payload;
    });
    b.addCase(fetchAllAppointments.rejected, (s) => {
      s.loadingAppointmentsList = false;
    });

    // CANCEL
    b.addCase(cancelAppointment.fulfilled, (s, a) => {
      const updated = a.payload;
      s.appointments = s.appointments.map((appt) =>
        appt._id === updated._id ? updated : appt,
      );
      if (s.activeAppointment?._id === updated._id) {
        s.activeAppointment = updated;
      }
    });
  },
});

export const {
  setField,
  toggleArrayValue,
  setVitals,
  openReview,
  closeReview,
  resetIntake,
  initIntake,
  saveIntakeForUser,
} = patientSlice.actions;

export default patientSlice.reducer;
