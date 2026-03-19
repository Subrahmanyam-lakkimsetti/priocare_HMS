const Appointment = require('../../../../models/appointment.model');
const AppError = require('../../../../utils/AppError.util');

const getAppointmentsByDepartment = async () => {
  const pipeline = [
    {
      $lookup: {
        from: 'doctors',
        let: { doctorId: '$doctorId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$$doctorId', '$_id'],
              },
            },
          },

          {
            $project: {
              department: 1,
            },
          },
        ],
        as: 'doctor',
      },
    },

    {
      $unwind: '$doctor',
    },

    {
      $lookup: {
        from: 'patients',
        let: { patientId: '$patientId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$$patientId', '$_id'],
              },
            },
          },

          {
            $project: {
              firstName: 1,
              lastName: 1,
              age: 1,
              address: 1,
              phoneNumber: 1,
              gender: 1,
            },
          },
        ],
        as: 'patient',
      },
    },

    {
      $unwind: '$patient',
    },

    {
      $group: {
        _id: '$doctor.department',
        totalAppointments: { $sum: 1 },

        totalAppointmentsCompleted: {
          $sum: {
            $cond: [
              {
                $eq: ['$status', 'completed'],
              },
              1,
              0,
            ],
          },
        },

        totalAppointmentsCancelled: {
          $sum: {
            $cond: [
              {
                $eq: ['$status', 'cancelled'],
              },
              1,
              0,
            ],
          },
        },

        totalAppointmentsInProgress: {
          $sum: {
            $cond: [
              { $not: { $in: ['$status', ['completed', 'cancelled']] } },
              1,
              0,
            ],
          },
        },

        appointments: {
          $push: {
            token: '$token',
            scheduledDate: '$scheduledDate',
            status: '$status',
            patient: '$patient',
          },
        },
      },
    },

    {
      $sort: { _id: 1 },
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
  ];

  return Appointment.aggregate(pipeline);
};

const cancelAppointment = async ({ token }) => {
  const appointment = await Appointment.findOne({ token });

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  if (appointment.status !== 'confirmed') {
    throw new AppError('appointment cannot cancelled', 401);
  }

  appointment.status = 'cancelled';

  appointment.save();

  return appointment;
};

// const appointmentByToken = async ({ token }) => {
//   const appointment = await Appointment.findOne({ token });

//   if (!appointment) {
//     throw new AppError('appointment not found', 404);
//   }

//   return appointment;
// };

module.exports = {
  getAppointmentsByDepartment,
  cancelAppointment,
};