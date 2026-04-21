// patientSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  createAppointment,
  fetchActiveAppointment,
  fetchAppointmentByToken,
  fetchAllAppointments,
  cancelAppointment,
  rescheduleAppointment,
  fetchAvailableDoctors,
  createAppointmentManualAssign,
  askPriocareAssistant,
  fetchAssistantConversation,
  fetchAssistantConversations,
  escalateAssistantConversation,
  fetchAssistantAppointmentContext,
  fetchIntakeAutofill,
  deleteAssistantConversation,
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

const cloneIntake = (intake) => ({
  ...intake,
  symptoms: Array.isArray(intake.symptoms) ? [...intake.symptoms] : [],
  comorbidities: Array.isArray(intake.comorbidities)
    ? [...intake.comorbidities]
    : [],
  vitals: {
    ...(intake.vitals || {}),
  },
});

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

  assistant: {
    isOpen: false,
    sending: false,
    loadingConversation: false,
    loadingConversations: false,
    conversationId: null,
    conversations: [],
    messages: [],
    error: null,
    lastSafetyNotice: null,
    requiresEscalation: false,
    escalationReason: null,
    context: null,
  },

  intakeAutofill: {
    loading: false,
    error: null,
    lastResult: null,
    showPreview: false,
    lastAppliedSnapshot: null,
    lastAppliedAt: null,
    lastAppliedSource: null,
  },
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
      s.intakeAutofill.lastAppliedSnapshot = null;
      s.intakeAutofill.lastAppliedAt = null;
      s.intakeAutofill.lastAppliedSource = null;
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

    openAssistant: (s) => {
      s.assistant.isOpen = true;
    },

    closeAssistant: (s) => {
      s.assistant.isOpen = false;
    },

    clearAssistantError: (s) => {
      s.assistant.error = null;
    },

    openAutofillPreview: (s) => {
      s.intakeAutofill.showPreview = true;
    },

    closeAutofillPreview: (s) => {
      s.intakeAutofill.showPreview = false;
    },

    resetAutofill: (s) => {
      s.intakeAutofill.lastResult = null;
      s.intakeAutofill.error = null;
      s.intakeAutofill.showPreview = false;
      s.intakeAutofill.lastAppliedAt = null;
      s.intakeAutofill.lastAppliedSource = null;
    },

    undoIntakeAutofill: (s) => {
      if (s.intakeAutofill.lastAppliedSnapshot) {
        s.intake = cloneIntake(s.intakeAutofill.lastAppliedSnapshot);
        s.intakeAutofill.lastAppliedSnapshot = null;
        s.intakeAutofill.lastAppliedAt = null;
        s.intakeAutofill.lastAppliedSource = null;
      }
    },

    applyIntakeAutofill: (s, a) => {
      s.intakeAutofill.lastAppliedSnapshot = cloneIntake(s.intake);
      const payload = a.payload || {};
      const { _source, ...data } = payload;
      const allowOverride = _source === 'chat';
      const intake = s.intake;

      if ((allowOverride || !intake.description) && data.description) {
        intake.description = data.description;
      }

      if (Array.isArray(data.symptoms) && data.symptoms.length > 0) {
        const merged = new Set([...(intake.symptoms || []), ...data.symptoms]);
        intake.symptoms = Array.from(merged);
      }

      if (Array.isArray(data.comorbidities) && data.comorbidities.length > 0) {
        const merged = new Set([
          ...(intake.comorbidities || []),
          ...data.comorbidities,
        ]);
        intake.comorbidities = Array.from(merged);
      }

      if (!intake.age && data.age) {
        intake.age = String(data.age);
      }

      if (data.vitals) {
        intake.vitals = {
          ...intake.vitals,
          heartRate: intake.vitals.heartRate || data.vitals.heartRate || '',
          bloodPressure:
            intake.vitals.bloodPressure || data.vitals.bloodPressure || '',
          temperature:
            intake.vitals.temperature || data.vitals.temperature || '',
        };
      }

      s.intakeAutofill.showPreview = false;
      s.intakeAutofill.lastAppliedAt = new Date().toISOString();
      s.intakeAutofill.lastAppliedSource = _source || 'manual';
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
      s.intakeAutofill.lastAppliedSnapshot = null;
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
      s.intakeAutofill.lastAppliedSnapshot = null;
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

    // RESCHEDULE
    b.addCase(rescheduleAppointment.fulfilled, (s, a) => {
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

    b.addCase(askPriocareAssistant.pending, (s, a) => {
      s.assistant.sending = true;
      s.assistant.error = null;

      const question = a.meta?.arg?.question;
      if (question) {
        s.assistant.messages.push({
          role: 'patient',
          content: question,
          createdAt: new Date().toISOString(),
        });
      }
    });
    b.addCase(askPriocareAssistant.fulfilled, (s, a) => {
      s.assistant.sending = false;

      const askData = a.payload?.ask || null;
      const conversation = a.payload?.conversation || null;

      if (askData?.conversationId) {
        s.assistant.conversationId = askData.conversationId;
      }

      if (conversation?.messages) {
        s.assistant.messages = conversation.messages;
      } else if (askData?.answer) {
        s.assistant.messages.push({
          role: 'assistant',
          content: askData.answer,
          createdAt: new Date().toISOString(),
          confidence: askData.confidence,
          safetyNotice: askData.safetyNotice,
        });
      }

      s.assistant.lastSafetyNotice = askData?.safetyNotice || null;
      s.assistant.requiresEscalation = Boolean(askData?.requiresEscalation);
      s.assistant.escalationReason = askData?.escalationReason || null;
    });
    b.addCase(askPriocareAssistant.rejected, (s, a) => {
      s.assistant.sending = false;
      s.assistant.error = a.payload || 'Assistant failed to respond';
    });

    b.addCase(fetchAssistantConversation.pending, (s) => {
      s.assistant.loadingConversation = true;
      s.assistant.error = null;
    });
    b.addCase(fetchAssistantConversation.fulfilled, (s, a) => {
      s.assistant.loadingConversation = false;
      s.assistant.conversationId = a.payload?._id || null;
      s.assistant.messages = a.payload?.messages || [];
      s.assistant.requiresEscalation = Boolean(
        a.payload?.escalation?.isEscalated,
      );
      s.assistant.escalationReason = a.payload?.escalation?.reason || null;
    });
    b.addCase(fetchAssistantConversation.rejected, (s, a) => {
      s.assistant.loadingConversation = false;
      s.assistant.error = a.payload || 'Failed to load conversation';
    });

    b.addCase(fetchAssistantConversations.pending, (s) => {
      s.assistant.loadingConversations = true;
      s.assistant.error = null;
    });
    b.addCase(fetchAssistantConversations.fulfilled, (s, a) => {
      s.assistant.loadingConversations = false;
      s.assistant.conversations = a.payload || [];
    });
    b.addCase(fetchAssistantConversations.rejected, (s, a) => {
      s.assistant.loadingConversations = false;
      s.assistant.error = a.payload || 'Failed to load conversations';
    });

    b.addCase(escalateAssistantConversation.fulfilled, (s, a) => {
      s.assistant.requiresEscalation = Boolean(
        a.payload?.escalation?.isEscalated,
      );
      s.assistant.escalationReason = a.payload?.escalation?.reason || null;
    });

    b.addCase(fetchAssistantAppointmentContext.fulfilled, (s, a) => {
      s.assistant.context = a.payload || null;
    });

    b.addCase(fetchIntakeAutofill.pending, (s) => {
      s.intakeAutofill.loading = true;
      s.intakeAutofill.error = null;
    });
    b.addCase(fetchIntakeAutofill.fulfilled, (s, a) => {
      s.intakeAutofill.loading = false;
      s.intakeAutofill.lastResult = a.payload || null;
      s.intakeAutofill.error = a.payload?.error || null;
      s.intakeAutofill.showPreview = !a.payload?.error;
    });
    b.addCase(fetchIntakeAutofill.rejected, (s, a) => {
      s.intakeAutofill.loading = false;
      s.intakeAutofill.error = a.payload || 'Unable to generate suggestions';
    });

    b.addCase(deleteAssistantConversation.fulfilled, (s, a) => {
      const deletedId = a.payload;
      s.assistant.conversations = s.assistant.conversations.filter(
        (c) => c._id !== deletedId,
      );
      if (s.assistant.conversationId === deletedId) {
        s.assistant.conversationId = null;
        s.assistant.messages = [];
        s.assistant.requiresEscalation = false;
        s.assistant.escalationReason = null;
        s.assistant.lastSafetyNotice = null;
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
  setAssignmentMode,
  openDoctorPicker,
  closeDoctorPicker,
  selectDoctor,
  clearSelectedDoctor,
  openAssistant,
  closeAssistant,
  clearAssistantError,
  openAutofillPreview,
  closeAutofillPreview,
  resetAutofill,
  undoIntakeAutofill,
  applyIntakeAutofill,
} = patientSlice.actions;

export default patientSlice.reducer;
