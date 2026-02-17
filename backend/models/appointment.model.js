const mongoose = require('mongoose');

const triageSchema = new mongoose.Schema({
  symptoms: [String],
  vitals: {
    heartRate: Number,
    bloodPressure: String,
    temperature: Number,
  },
  comorbidities: [String],
  age: Number,
  description: String,
  priorityScore: Number,
  severityLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
  },
  recomendedSpecilization: String,
  source: String,
});

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },

    scheduledDate: {
      type: Date,
      required: true,
    },

    token: {
      type: String,
      required: true,
    },

    preferedTime: {
      type: String,
    },

    status: {
      type: String,
      enum: [
        'confirmed',
        'checked_in',
        'called',
        'in_consultation',
        'completed',
        'cancelled',
      ],
      default: 'confirmed',
    },
    triage: {
      type: triageSchema,
      required: true,
    },

    aiSummary: {
      type: Object,
      default: null,
    },

    aisummaryUpdatedAt: {
      type: Date,
      default: null,
    },

    checkedInAt: {
      type: Date,
      default: null,
    },

    calledAt: {
      type: Date,
      default: null,
    },

    consulationStartsAt: {
      type: Date,
      default: null,
    },
    consulationEndsAt: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: String,
      enum: ['patient', 'staff'],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

appointmentSchema.index({
  doctorId: 1,
  scheduledDate: 1,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
