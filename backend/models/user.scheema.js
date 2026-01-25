const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  // email (unique)
  // password
  // role - admin, doctor, nurse, receptionist, patient, lab_tech
  // lab_tech
  // isActive
  // createdAt

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email address, invalid email : {VALUE}',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'nurse', 'receptionist', 'patient', 'lab_tech'],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('user', userSchema);

module.exports = User;
