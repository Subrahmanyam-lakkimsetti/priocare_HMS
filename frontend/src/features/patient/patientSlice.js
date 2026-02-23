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

const persisted = loadIntake();

const initialState = {
  submitting: false,
  success: false,
  error: null,
  showReview: false,

  activeAppointment: null,
  loadingAppointment: false,

  appointments: [],
  loadingAppointmentsList: false,

  intake: persisted || {
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
  },
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,

  reducers: {
    setField: (s, a) => {
      s.intake = { ...s.intake, ...a.payload };
      saveIntake(s.intake); // ⭐ auto save
    },

    setVitals: (s, a) => {
      s.intake.vitals = { ...s.intake.vitals, ...a.payload };
      saveIntake(s.intake); // ⭐ auto save
    },

    toggleArrayValue: (s, a) => {
      const { key, value } = a.payload;
      const arr = s.intake[key];

      s.intake[key] = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];

      saveIntake(s.intake); // ⭐ auto save
    },

    openReview: (s) => {
      s.showReview = true;
    },
    closeReview: (s) => {
      s.showReview = false;
    },

    resetIntake: (s) => {
      clearIntake();

      s.intake = {
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

      s.success = false;
      s.error = null;
      s.showReview = false;
    },
  },

  extraReducers: (b) => {
    b.addCase(createAppointment.pending, (s) => {
      s.submitting = true;
    });

    b.addCase(createAppointment.fulfilled, (s) => {
      s.submitting = false;
      s.success = true;
      clearIntake();

      s.intake = {
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
    });

    b.addCase(createAppointment.rejected, (s, a) => {
      s.submitting = false;
      s.error = a.payload;
    });

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
      s.appointments = s.appointments.map((appt) =>
        appt._id === a.payload ? { ...appt, status: 'cancelled' } : appt,
      );
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
} = patientSlice.actions;

export default patientSlice.reducer;
