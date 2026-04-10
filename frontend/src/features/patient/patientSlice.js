// patientSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  createAppointment,
  fetchActiveAppointment,
  fetchAppointmentByToken,
  fetchAllAppointments,
  cancelAppointment,
  fetchAvailableDoctors,
  createAppointmentManualAssign,
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

  // Manual doctor assignment state
  assignmentMode: 'auto', // 'auto' | 'manual'
  showDoctorPicker: false,
  availableDoctors: [],
  doctorPickerTriage: null, // triage info returned alongside doctors
  loadingDoctors: false,
  doctorsError: null,
  selectedDoctor: null,
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
      const userId = a.payload;
      if (userId) clearIntake(userId);
      s.intake = { ...emptyIntake };
      s.success = false;
      s.error = null;
      s.showReview = false;
      s.assignmentMode = 'auto';
      s.showDoctorPicker = false;
      s.availableDoctors = [];
      s.doctorPickerTriage = null;
      s.selectedDoctor = null;
    },

    // Assignment mode actions
    setAssignmentMode: (s, a) => {
      s.assignmentMode = a.payload; // 'auto' | 'manual'
      if (a.payload === 'auto') {
        s.selectedDoctor = null;
        s.showDoctorPicker = false;
      }
    },

    openDoctorPicker: (s) => {
      s.showDoctorPicker = true;
    },

    closeDoctorPicker: (s) => {
      s.showDoctorPicker = false;
    },

    selectDoctor: (s, a) => {
      s.selectedDoctor = a.payload;
      s.showDoctorPicker = false;
    },

    clearSelectedDoctor: (s) => {
      s.selectedDoctor = null;
    },
  },

  extraReducers: (b) => {
    // CREATE (auto assign)
    b.addCase(createAppointment.pending, (s) => {
      s.submitting = true;
    });
    b.addCase(createAppointment.fulfilled, (s, a) => {
      s.submitting = false;
      s.success = true;
      if (a.meta?.arg?.userId) clearIntake(a.meta.arg.userId);
      s.intake = { ...emptyIntake };
      s.assignmentMode = 'auto';
      s.selectedDoctor = null;
    });
    b.addCase(createAppointment.rejected, (s, a) => {
      s.submitting = false;
      s.error = a.payload;
    });

    // CREATE (manual assign)
    b.addCase(createAppointmentManualAssign.pending, (s) => {
      s.submitting = true;
    });
    b.addCase(createAppointmentManualAssign.fulfilled, (s, a) => {
      s.submitting = false;
      s.success = true;
      if (a.meta?.arg?.intake?.userId) clearIntake(a.meta.arg.intake.userId);
      s.intake = { ...emptyIntake };
      s.assignmentMode = 'auto';
      s.selectedDoctor = null;
      s.availableDoctors = [];
      s.doctorPickerTriage = null;
    });
    b.addCase(createAppointmentManualAssign.rejected, (s, a) => {
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

    // FETCH AVAILABLE DOCTORS
    b.addCase(fetchAvailableDoctors.pending, (s) => {
      s.loadingDoctors = true;
      s.doctorsError = null;
      s.availableDoctors = [];
      s.doctorPickerTriage = null;
    });
    b.addCase(fetchAvailableDoctors.fulfilled, (s, a) => {
      s.loadingDoctors = false;
      // The API returns doctors mixed with triage fields (priorityScore, etc.)
      // Extract numeric-keyed entries as doctors and triage metadata separately
      const raw = a.payload;
      const doctors = Object.entries(raw)
        .filter(([key]) => !isNaN(Number(key)))
        .map(([, val]) => val);
      s.availableDoctors = doctors;
      s.doctorPickerTriage = {
        priorityScore: raw.priorityScore,
        severityLevel: raw.severityLevel,
        recommendedSpecialization: raw.recommendedSpecialization,
      };
    });
    b.addCase(fetchAvailableDoctors.rejected, (s, a) => {
      s.loadingDoctors = false;
      s.doctorsError = a.payload;
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
  setAssignmentMode,
  openDoctorPicker,
  closeDoctorPicker,
  selectDoctor,
  clearSelectedDoctor,
} = patientSlice.actions;

export default patientSlice.reducer;
