const mongoose = require('mongoose');

const prescriptionScheema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
    unique: true,
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },

  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },

  diagnosis: {
    type: String,
    required: true,
  },

  medications: [
    {
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String,
    },
  ],

  notes: String,
  followUpDate: Date,

  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

const Prescription = mongoose.model('Prescription', prescriptionScheema);

module.exports = Prescription;
