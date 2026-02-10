const { default: mongoose } = require('mongoose');

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
  createdAt: Date.now(),
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
    scheduledTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'confirmed',
        'checked_in',
        'in_consulation',
        'completed',
        'cancelled',
        'no_show',
      ],
      default: 'confirmed',
    },
    triage: {
      type: triageSchema,
      required: true,
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
  scheduledTime: 1,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
