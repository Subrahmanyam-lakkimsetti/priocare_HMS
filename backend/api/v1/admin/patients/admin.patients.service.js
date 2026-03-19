const Patient = require('../../../../models/patient.model');
const User = require('../../../../models/user.model');
const AppError = require('../../../../utils/AppError.util');

const getPatientsWithStats = async () => {
  const pipeline = [
    {
      $lookup: {
        from: 'appointments',
        let: { patientId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$patientId', '$$patientId'],
              },
            },
          },

          {
            $project: {
              scheduledDate: 1,
              token: 1,
              status: 1,
            },
          },
        ],
        as: 'appointments',
      },
    },

    {
      $addFields: {
        totalAppointments: { $size: '$appointments' },

        totalCompletedAppointments: {
          $size: {
            $filter: {
              input: '$appointments',
              as: 'appt',
              cond: { $eq: ['$$appt.status', 'completed'] },
            },
          },
        },

        cancelledAppointments: {
          $size: {
            $filter: {
              input: '$appointments',
              as: 'appt',
              cond: { $eq: ['$$appt.status', 'cancelled'] },
            },
          },
        },

        inprogress: {
          $size: {
            $filter: {
              input: '$appointments',
              as: 'appt',
              cond: {
                $not: {
                  $in: ['$$appt.status', ['completed', 'cancelled']],
                },
              },
            },
          },
        },
      },
    },

    {
      $set: {
        appointments: {
          $sortArray: {
            input: '$appointments',
            sortBy: { scheduledDate: -1 },
          },
        },
      },
    },

    {
      $sort: { createdAt: -1 },
    },
  ];

  const patients = await Patient.aggregate(pipeline);

  return patients;
};

const frequentelyVisitedPatients = async () => {
  const pipeline = [
    {
      $lookup: {
        from: 'appointments',
        localField: '_id',
        foreignField: 'patientId',
        as: 'appointments',
      },
    },

    {
      $addFields: {
        totalAppointments: { $size: '$appointments' },
      },
    },

    {
      $sort: { totalAppointments: -1 },
    },

    {
      $project: {
        appointments: 0,
      },
    },
  ];

  return Patient.aggregate(pipeline);
};

const deActivatePatient = async ({ id }) => {
  const patient = await Patient.findById(id);
  const user = await User.findById(patient.userId);

  if (user.role !== 'patient') {
    throw new AppError('forbidden', 403);
  }

  if (patient.isActive) {
    patient.isActive = false;
    user.isActive = false;
    patient.save();
    user.save();
  }

  return patient;
};

const activatePatient = async ({ id }) => {
  const patient = await Patient.findById(id);
  const user = await User.findById(patient.userId);

  if (user.role !== 'patient') {
    throw new AppError('forbidden', 403);
  }

  if (!patient.isActive) {
    patient.isActive = true;
    user.isActive = true;
    patient.save();
    user.save();
  }

  return patient;
};

module.exports = {
  getPatientsWithStats,
  frequentelyVisitedPatients,
  deActivatePatient,
  activatePatient,
};