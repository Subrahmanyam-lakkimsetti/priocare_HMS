const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    specializations: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    department: {
      type: String,
      required: true,
    },
    experienceYears: {
      type: Number,
      min: 0,
      required: true,
    },
    consultationFee: {
      type: Number,
      min: 50,
      required: true,
    },
    MaxDailyAppointments: {
      type: Number,
      default: 20,
      min: 1,
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'unavailable'],
      required: true,
    },
    workingHours: {
      start: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/,
      },
      end: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/,
      },
    },
    availableDays: [
      {
        type: String,
        enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        trim: true,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

doctorSchema.index({
  specializations: 1,
  availabilityStatus: 1,
  isActive: true,
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
