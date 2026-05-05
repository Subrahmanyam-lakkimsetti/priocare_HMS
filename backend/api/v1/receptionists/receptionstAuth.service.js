const { Receptionist } = require('../../../models/receptionist.model');
const User = require('../../../models/user.model');
const AppError = require('../../../utils/AppError.util');

const createReceptionist = async (userId, payload, file) => {
  if (file) {
    payload.photo = file.path;
  }

  // check is Exists
  const isReceptionistExists = await Receptionist.findOne({ userId });

  if (isReceptionistExists) {
    throw new AppError('profile already exists', 409);
  }

  const receptionistProfile = await Receptionist.create({
    userId,
    ...payload,
  });

  await User.findOneAndUpdate({ _id: userId }, { isProfileComplete: true });
  return receptionistProfile;
};

const getReceptionists = async () => {
  return await Receptionist.find().populate('userId');
};

const getReceptionist = async ({ id }) => {
  const receptionist = await Receptionist.findById(id).populate('userId');

  if (!receptionist) {
    throw new AppError('Not found!', 404);
  }

  return receptionist;
};

const updateReceptionist = async (id, updateData, file) => {
  if (file) {
    updateData.photo = file.path;
  }

  let updatedReceptionist = await Receptionist.findOneAndUpdate(
    { userId: id },
    updateData,
    {
      new: true,
    },
  ).populate('userId');

  if (!updatedReceptionist) {
    updatedReceptionist = await Receptionist.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate('userId');
  }

  if (!updatedReceptionist) {
    throw new AppError('Not found!', 404);
  }

  // Also update the user's isProfileComplete flag
  await User.findOneAndUpdate(
    { _id: updatedReceptionist.userId._id },
    { isProfileComplete: true },
  );

  return updatedReceptionist;
};

const getMe = async (userId) => {
  const receptionist = await Receptionist.findOne({ userId }).populate(
    'userId',
  );

  if (!receptionist) {
    throw new AppError('Profile not found', 404);
  }

  return receptionist;
};

module.exports = {
  createReceptionist,
  getReceptionists,
  getReceptionist,
  updateReceptionist,
  getMe,
};
