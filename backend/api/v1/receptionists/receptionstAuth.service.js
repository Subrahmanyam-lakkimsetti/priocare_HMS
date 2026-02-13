const { Receptionist } = require('../../../models/receptionist.model');
const AppError = require('../../../utils/AppError.util');

const createReceptionist = async (userId, payload) => {
  // check is Exists
  const isReceptionistExists = await Receptionist.findOne({ userId });

  if (isReceptionistExists) {
    throw new AppError('profile already exists', 409);
  }

  const receptionistProfile = await Receptionist.create({
    userId,
    ...payload,
  });

  return receptionistProfile;
};

module.exports = {
  createReceptionist,
};
