const Appointment = require('../../../../models/appointment.model');
const Doctor = require('../../../../models/doctor.model');
const Patient = require('../../../../models/patient.model');
const { Receptionist } = require('../../../../models/receptionist.model');
const { getDayRange } = require('../../../../utils/dayRange.util');

const getStats = async () => {
  const [
    totalDoctors,
    totalReceptionists,
    totalPatients,
    totalAppointments,
    totalAppointmentsCanceled,
  ] = await Promise.all([
    Doctor.countDocuments(),
    Receptionist.countDocuments(),
    Patient.countDocuments(),
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: 'cancelled' }),
  ]);

  return {
    totalDoctors,
    totalReceptionists,
    totalPatients,
    totalAppointments,
    totalAppointmentsCanceled,
  };
};

const getTodayStats = async ({ date }) => {
  const { start, end } = getDayRange(date);
  console.log(start, end);

  const pipeline = [
    {
      $match: {
        scheduledDate: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: null,

        totalAppointmentsToday: { $sum: 1 },

        newPatientsToday: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $gte: ['$createdAt', start] },
                  { $lte: ['$createdAt', end] },
                ],
              },
              1,
              0,
            ],
          },
        },

        totalCheckInPatientsToday: {
          $sum: {
            $cond: [
              { $not: [{ $in: ['$status', ['confirmed', 'cancelled']] }] },
              1,
              0,
            ],
          },
        },

        totalInConsultationNow: {
          $sum: {
            $cond: [{ $eq: ['$status', 'in_consultation'] }, 1, 0],
          },
        },

        waitingPatientsNow: {
          $sum: {
            $cond: [{ $eq: ['$status', 'checked_in'] }, 1, 0],
          },
        },

        totalCompletedConsultations: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0],
          },
        },

        todayAppointmentsCanelled: {
          $sum: {
            $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0],
          },
        },
      },
    },
  ];

  const todayAppointmentStats = await Appointment.aggregate(pipeline);

  return todayAppointmentStats[0] || [];
};

module.exports = {
  getStats,
  getTodayStats,
};