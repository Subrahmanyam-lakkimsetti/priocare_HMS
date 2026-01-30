const { boolean } = require('joi');
const mongoose = require('mongoose');

const patientScheema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // ensures only one profile present
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: true,
    },
    insuranceDetails: {
      type: String,
    },
    isTemporary: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Patient = mongoose.model('Patient', patientScheema);

module.exports = Patient;
