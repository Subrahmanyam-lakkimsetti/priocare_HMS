require('dotenv').config();
const { default: mongoose } = require('mongoose');
const User = require('../models/user.model');
const AppError = require('../utils/AppError.util');
const bcrypt = require('bcrypt');

(async () => {
  const connectionURL = process.env.DB_CONNECTION_STRING;

  mongoose.connect(connectionURL);

  const isAdminExists = await User.findOne({ role: 'admin' });
  if (isAdminExists) {
    throw new AppError('Admin already exists!', 409);
  }

  const hashedPassword = await bcrypt.hash('admin@123', 12);

  await User.create({
    email: 'admin@priocare.in',
    password: hashedPassword,
    role: 'admin',
    isActive: true,
  });

  console.log('Admin created sucessfully');
  process.exit();
})();
