const Doctor = require('../../../../models/doctor.model');
const { Receptionist } = require('../../../../models/receptionist.model');
const User = require('../../../../models/user.model');
const AppError = require('../../../../utils/AppError.util');
const { getDayRange } = require('../../../../utils/dayRange.util');

const getAllDoctorsByDepartment = async () => {
  const { start, end } = getDayRange(new Date());

  const pipeline = [
    {
      $lookup: {
        from: 'appointments',
        localField: '_id',
        foreignField: 'doctorId',
        as: 'appointments',
      },
    },

    {
      $addFields: {
        totalAppointments: { $size: '$appointments' },

        // totalConfirmedAppointments
        totalAppointmentsConfirmed: {
          $size: {
            $filter: {
              input: '$appointments',
              as: 'appt',
              cond: { $not: { $in: ['$$appt.status', ['cancelled']] } },
            },
          },
        },

        // totalCnacelledAppointments
        totalCancelledAppointments: {
          $size: {
            $filter: {
              input: '$appointments',
              as: 'appt',
              cond: { $eq: ['$$appt.status', 'cancelled'] },
            },
          },
        },

        // today stats

        // todayTotalappointments
        todayTotalAppointments: {
          $size: {
            $filter: {
              input: '$appointments',
              as: 'appt',
              cond: {
                $and: [
                  { $gte: ['$$appt.scheduledDate', start] },
                  { $lte: ['$$appt.scheduledDate', end] },
                ],
              },
            },
          },
        },

        // todayConfirmed
        todayConfirmed: {
          $size: {
            $filter: {
              input: '$appointments',
              as: 'appt',
              cond: {
                $and: [
                  { $gte: ['$$appt.scheduledDate', start] },
                  { $lte: ['$$appt.scheduledDate', end] },
                  { $not: { $in: ['$$appt.status', ['cancelled']] } },
                ],
              },
            },
          },
        },

        // todaycancelled
        todayCancelled: {
          $size: {
            $filter: {
              input: '$appointments',
              as: 'appt',
              cond: {
                $and: [
                  { $gte: ['$$appt.scheduledDate', start] },
                  { $lte: ['$$appt.scheduledDate', end] },
                  { $in: ['$$appt.status', ['cancelled']] },
                ],
              },
            },
          },
        },

        // today completed
        todayCompleted: {
          $size: {
            $filter: {
              input: '$appointments',
              as: 'appt',
              cond: {
                $and: [
                  { $gte: ['$$appt.scheduledDate', start] },
                  { $lte: ['$$appt.scheduledDate', end] },
                  { $in: ['$$appt.status', ['completed']] },
                ],
              },
            },
          },
        },
      },
    },

    {
      $project: {
        appointments: 0,
      },
    },

    {
      $group: {
        _id: '$department',
        doctors: { $push: '$$ROOT' },
      },
    },

    {
      $sort: { _id: 1 },
    },

    {
      $set: {
        doctors: {
          $sortArray: {
            input: '$doctors',
            sortBy: { createdAt: -1 },
          },
        },
      },
    },
    
  ];

  const doctors = await Doctor.aggregate(pipeline);

  return doctors;
};

const getAllReceptionists = async () => {
  const receptionists = await Receptionist.find();

  if (!receptionists) {
    throw new AppError('receptionists not found', 404);
  }

  return receptionists;
};

const deActivateDoctor = async ({ id }) => {
  const doctor = await Doctor.findById(id);

  const user = await User.findById(doctor.userId);

  if (doctor.isActive) {
    doctor.isActive = false;
    user.isActive = false;
    doctor.save();
    user.save();
  }

  return doctor;
};

const activateDoctor = async ({ id }) => {
  const doctor = await Doctor.findById(id);

  const user = await User.findById(doctor.userId);

  if (!doctor.isActive) {
    doctor.isActive = true;
    user.isActive = true;
    doctor.save();
    user.save();
  }

  return doctor;
};

const deActivateReceptionist = async ({ id }) => {
  const receptionist = await Receptionist.findById(id);

  const user = await User.findById(receptionist.userId);

  if (receptionist.isActive) {
    receptionist.isActive = false;
    user.isActive = false;
    receptionist.save();
    user.save();
  }

  return receptionist;
};

const activateReceptionist = async ({ id }) => {
  const receptionist = await Receptionist.findById(id);
  const user = await User.findById(receptionist.userId);

  if (!receptionist.isActive) {
    receptionist.isActive = true;
    user.isActive = true;
    receptionist.save();
    user.save();
  }

  return receptionist;
};

const getAllStaffWithPendingProfiles = async ({ role }) => {
  const users = await User.find({
    role,
    isProfileComplete: false,
  });

  if (!users) {
    throw new AppError('no users found', 404);
  }

  return users;
};

const deletePendingStaff = async ({ id }) => {
  const user = await User.deleteOne({ _id: id });

  console.log(user);
  return user;
};

module.exports = {
  getAllDoctorsByDepartment,
  getAllReceptionists,
  deActivateDoctor,
  activateDoctor,
  deActivateReceptionist,
  activateReceptionist,
  getAllStaffWithPendingProfiles,
  deletePendingStaff,
};