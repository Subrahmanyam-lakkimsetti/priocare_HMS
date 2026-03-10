const Appointment = require('../../../models/appointment.model');
const AppError = require('../../../utils/AppError.util');
const { getDayRange } = require('../../../utils/dayRange.util');

const patientCheckin = async ({ token }) => {
  const appointment = await Appointment.findOne({ token }).populate([
    {
      path: 'doctorId',
      select: 'firstName lastName',
    },
    {
      path: 'patientId',
      select: 'firstName lastName',
    },
  ]);

  if (!appointment) {
    throw new AppError('No appointment found!', 404);
  }

  if (appointment.status !== 'confirmed') {
    throw new AppError(
      `Check-in not allowed for ${appointment.status} patients`,
    );
  }

  appointment.status = 'checked_in';
  appointment.checkedInAt = new Date();

  appointment.save();

  return appointment;
  // const appointment = await Appointment.findOneAndUpdate(
  //   { token, status: 'confirmed' },
  //   {
  //     $set: { status: 'checked_in' },
  //     $currentDate: { checkedInAt: true },
  //   },
  //   { new: true },
  // );

  // if (!appointment) {
  //   throw new AppError('No appointment found', 404);
  // }

  // return appointment;
};

const dashboardStats = async (date) => {
  const { start, end } = getDayRange(date);

  const pipeline = [
    {
      $match: {
        scheduledDate: { $gte: start, $lte: end },
      },
    },

    {
      $group: {
        _id: null,

        totalAppointments: { $sum: 1 },

        checkedInPatients: {
          $sum: {
            $cond: [
              {
                $in: [
                  '$status',
                  ['checked_in', 'called', 'in_consultation', 'completed'],
                ],
              },
              1,
              0,
            ],
          },
        },

        waitingPatients: {
          $sum: { $cond: [{ $eq: ['$status', 'checked_in'] }, 1, 0] },
        },

        completedConsultations: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0],
          },
        },
      },
    },
  ];

  const stats = await Appointment.aggregate(pipeline);

  return (
    stats[0] || {
      totalAppointments: 0,
      checkedInPatients: 0,
      waitingPatients: 0,
      completedConsultations: 0,
    }
  );
};

const todaysAppointments = async (date) => {
  const { start, end } = getDayRange(date);

  const pipeline = [
    {
      $match: {
        scheduledDate: { $gte: start, $lte: end },
      },
    },

    {
      $project: {
        checkedInAt: 1,
        status: 1,
        bookedOn: '$createdAt',
        token: 1,

        'patientDetails.firstName': 1,
        'patientDetails.lastName': 1,
        'patientDetails.age': 1,
        'patientDetails.gender': 1,
        'patientDetails.phoneNumber': 1,
        'patientDetails.address': 1,
        'patientDetails.insuranceDetails': 1,

        'doctorDetails.firstName': 1,
        'doctorDetails.lastName': 1,
        'doctorDetails.department': 1,
        'doctorDetails.consultationFee': 1,
        'doctorDetails.availabilityStatus': 1,
        'doctorDetails.workingHours': 1,
      },
    },
  ];

  const appts = await Appointment.aggregate(pipeline);

  return appts;
};

const appointmentBytoken = async (token) => {
  const pipeline = [
    {
      $match: {
        token,
      },
    },

    {
      $project: {
        scheduledDate: 1,
        checkedInAt: 1,
        status: 1,
        bookedOn: '$createdAt',
        token: 1,
        createdBy: 1,
        calledAt: 1,
        consulationStartsAt: 1,
        consulationEndsAt: 1,

        'patientDetails.firstName': 1,
        'patientDetails.lastName': 1,
        'patientDetails.age': 1,
        'patientDetails.gender': 1,
        'patientDetails.phoneNumber': 1,
        'patientDetails.address': 1,
        'patientDetails.insuranceDetails': 1,

        'doctorDetails.firstName': 1,
        'doctorDetails.lastName': 1,
        'doctorDetails.department': 1,
        'doctorDetails.consultationFee': 1,
        'doctorDetails.availabilityStatus': 1,
        'doctorDetails.workingHours': 1,
      },
    },
  ];

  const appt = await Appointment.aggregate(pipeline);

  return appt[0] || {};
};

const queueStatus = async (date) => {
  const { start, end } = getDayRange(date);

  const pipeline = [
    {
      $match: {
        scheduledDate: { $gte: start, $lte: end },
      },
    },

    {
      $group: {
        _id: '$doctorId',

        totalAppointments: { $sum: 1 },

        nonCheckedInPatients: {
          $push: {
            $cond: [{ $eq: ['$status', 'confirmed'] }, '$token', '$$REMOVE'],
          },
        },

        waitingPatients: {
          $push: {
            $cond: [{ $eq: ['$status', 'checked_in'] }, '$token', '$$REMOVE'],
          },
        },

        waitingCont: {
          $sum: {
            $cond: [{ $eq: ['$status', 'checked_in'] }, 1, 0],
          },
        },

        inConsultation: {
          $push: {
            $cond: [
              { $eq: ['$status', 'in_consultation'] },
              '$token',
              '$$REMOVE',
            ],
          },
        },

        consultationsCompleted: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0],
          },
        },
      },
    },

    {
      $lookup: {
        from: 'doctors',
        localField: '_id',
        foreignField: '_id',
        as: 'doctorDetails',
      },
    },

    {
      $unwind: '$doctorDetails',
    },

    {
      $project: {
        totalAppointments: 1,
        nonCheckedInPatients: 1,
        waitingPatients: 1,
        waitingCont: 1,
        inConsultation: 1,
        consultationsCompleted: 1,
        'doctorDetails.firstName': 1,
        'doctorDetails.lastName': 1,
        'doctorDetails.department': 1,
      },
    },
  ];

  const stats = await Appointment.aggregate(pipeline);

  return stats;
};

const recentCheckins = async () => {
  const pipeline = [
    {
      $match: {
        status: {
          $in: ['checked_in', 'called', 'in_consultation', 'completed'],
        },
      },
    },

    {
      $sort: {
        checkedInAt: -1,
      },
    },

    {
      $project: {
        token: 1,
        appointmentBookedAt: '$checkedInAt',
        checkedInAt: 1,

        'patientDetails.firstName': 1,
        'patientDetails.lastName': 1,

        'doctorDetails.firstName': 1,
        'doctorDetails.lastName': 1,
        'doctorDetails.department': 1,
      },
    },
  ];

  const appts = await Appointment.aggregate(pipeline);

  return appts;
};

module.exports = {
  patientCheckin,
  dashboardStats,
  todaysAppointments,
  appointmentBytoken,
  queueStatus,
  recentCheckins,
};