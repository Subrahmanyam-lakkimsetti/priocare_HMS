const Appointment = require('../../../models/appointment.model');
const Doctor = require('../../../models/doctor.model');
const AppError = require('../../../utils/AppError.util');
const { getDayRange } = require('../../../utils/dayRange.util');
const { getDoctorQueue } = require('../appointments/doctorQueue.service');
const { generateSummary } = require('./prompts/aiAdapter');

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

const startConsultation = async (userId) => {
  const doctor = await Doctor.findOne({ userId });

  if (!doctor) {
    throw new AppError('No Doctor found!', 404);
  }

  const pipeline = [
    {
      $match: {
        doctorId: doctor._id,
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

  // const summary = await generateSummary(appointmentObj);

  (async () => {
    try {
      const summary = await generateSummary(appointmentObj);

      await Appointment.findByIdAndUpdate(appt._id, {
        aiSummary: summary,
        aisummaryUpdatedAt: new Date(),
      });

      console.log('AI summary saved');
    } catch (err) {
      console.log('AI summary failes', err);
    }
  })();

  delete appointment.patientDetails;

  return appointmentObj;
};

const getAiSummary = async (token) => {
  const summary = await Appointment.findOne({ token }).select(
    'aiSummary aisummaryUpdatedAt token',
  );

  if (!summary) {
    throw new AppError('Summary does not exist', 404);
  }

  return summary;
};

const endConsultation = async (token) => {
  const appointment = await Appointment.findOneAndUpdate(
    {
      token,
    },
    {
      status: 'completed',
      consulationEndsAt: new Date(),
    },
    {
      new: true,
    },
  );

  if (!appointment) {
    throw new AppError('appointment not found!', 404);
  }

  return appointment;
};

const getActiveConsultation = async (userId, date) => {
  const doctor = await Doctor.findOne({ userId });

  if (!doctor) {
    throw new AppError('no doctor found!', 404);
  }

  const pipeline = [
    {
      $match: {
        doctorId: doctor._id,
        status: { $in: ['called', 'in_consultation'] },
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

  const activeAppointment = await Appointment.aggregate(pipeline);

  if (!activeAppointment) {
    throw new AppError('no active appointment', 404);
  }

  return activeAppointment;
};

const treatedPatientsHistory = async (userId) => {
  const doctor = await Doctor.findOne({ userId });

  if (!doctor) {
    throw new AppError('No doctor found!', 404);
  }

  const appointments = await Appointment.aggregate([
    {
      $match: {
        doctorId: doctor._id,
        status: 'completed',
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
  ]);

  return appointments;
};

module.exports = {
  callPatient,
  startConsultation,
  getAiSummary,
  endConsultation,
  getActiveConsultation,
  treatedPatientsHistory,
};
