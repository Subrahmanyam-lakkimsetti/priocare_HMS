const Appointment = require('../../../models/appointment.model');
const Doctor = require('../../../models/doctor.model');
const AppError = require('../../../utils/AppError.util');
const { getDayRange } = require('../../../utils/dayRange.util');
const { getDoctorQueue } = require('../appointments/doctorQueue.service');

const callPatient = async (userId, date) => {
  const { start, end } = getDayRange(date);

  const doctor = await Doctor.findOne({ userId });

  if (!doctor) {
    throw new AppError('Doctor not found!', 404);
  }

  const queue = await getDoctorQueue(doctor._id, date);

  if (!queue.isQueueActive || queue.patients.length === 0) {
    throw new AppError('No waiting patients');
  }

  const isAlreadyCalled = await Appointment.findOne({
    doctorId: doctor._id,
    scheduledDate: { $gte: start, $lte: end },
    status: { $in: ['called'] },
  });

  if (isAlreadyCalled) {
    throw new AppError('Patient Already called', 409);
  }

  const firstPatient = queue.patients[0];

  const calledPatient = await Appointment.findOneAndUpdate(
    {
      _id: firstPatient._id,
      status: 'checked_in',
    },
    {
      $set: { status: 'called' },
      calledAt: new Date(),
    },
    {
      new: true,
    },
  );

  if (!calledPatient) {
    throw new AppError('Patient already called by another request', 409);
  }

  return calledPatient;
};

const startConsultation = async (userId, date) => {
  const { start, end } = getDayRange(date);

  const doctor = await Doctor.findOne({ userId });

  if (!doctor) {
    throw new AppError('No Doctor found!', 404);
  }

  const isInConsultation = await Appointment.findOne({
    doctorId: doctor._id,
    scheduledDate: { $gte: start, $lte: end },
    status: 'in_consultation',
  });

  if (isInConsultation) {
    throw new AppError('already in consultation', 409);
  }

  const pipeline = [
    {
      $match: {
        doctorId: doctor._id,
        scheduledDate: { $gte: start, $lte: end },
        status: 'called',
      },
    },

    {
      $lookup: {
        from: 'patients',
        localField: 'patientId',
        foreignField: '_id',
        as: 'patientDetails',
      },
    },

    {
      $unwind: '$patientDetails',
    },

    {
      $limit: 1,
    },
  ];

  const [appt] = await Appointment.aggregate(pipeline);

  if (!appt) {
    throw new AppError('No one is called for appointment yet', 404);
  }

  const appointment = await Appointment.findOneAndUpdate(
    {
      _id: appt._id,
      status: 'called',
      doctorId: doctor._id,
      scheduledDate: { $gte: start, $lte: end },
    },
    {
      status: 'in_consultation',
      consulationStartsAt: new Date(),
    },
    { new: true },
  );

  if (!appointment) {
    throw new AppError(
      'Already in consultation or taken by another request',
      409,
    );
  }

  const appointmentObj = appointment.toObject();

  appointmentObj.patient = {
    name: appt.patientDetails.firstName + ' ' + appt.patientDetails.lastName,
    age: appt.patientDetails.age,
    gender: appt.patientDetails.gender,
    bloodGroup: appt.patientDetails.bloodGroup,
    phoneNumber: appt.patientDetails.phoneNumber,
  };

  delete appointment.patientDetails;

  return appointmentObj;
};

module.exports = {
  callPatient,
  startConsultation,
};
