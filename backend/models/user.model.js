const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

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

userSchema.pre('save', async function () {
  // Hash the password before saving the user document
  if (!this.isModified('password')) return;

  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
});

userSchema.methods.comparePasswords = async function (userprovidedPassword) {
  
  return await bcrypt.compare(userprovidedPassword, this.password);
};

const User = mongoose.model('user', userSchema);

module.exports = User;
