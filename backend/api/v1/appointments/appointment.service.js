const Appointment = require('../../../models/appointment.model');
const Patient = require('../../../models/patient.model');
const AppError = require('../../../utils/AppError.util');
const { getDoctor } = require('../doctors/doctorAuth.service');
const assignDoctor = require('./doctorAssign.service');
const { getDoctorQueue } = require('./doctorQueue.service');
const evaluateTriage = require('./triage/aiAdapter.triage');

const generateToken = async () => {
  const chars = 'ABCDEFGHJKLMNPQRSTVVWXYZ23456789';

  let token = '';

  for (let i = 0; i < 4; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }

  const appointment = await Appointment.findOne({ token });

  if (appointment) return generateToken();

  return token;
};

const getAppointmentsForUser = async (userId) => {
  const patient = await Patient.findOne({ userId });

  if (!patient) {
    throw new AppError('No patient found!', 404);
  }

  const appointments = await Appointment.find({
    patientId: patient._id,
  }).populate('doctorId', 'firstName lastName department experienceYears');

  return appointments;
};

const createAppointment = async (userId, triageData) => {
  // ckeck patient exists or not
  const isPatientExists = await Patient.findOne({ userId });

  if (!isPatientExists) {
    throw new AppError('Patient Not found!', 404);
  }

  // calculate triage
  const triage = JSON.parse(await evaluateTriage(triageData));

  if (!triage) {
    throw new AppError('failed', 401);
  }

  // const triage = {};

  //  assign Doctor
  const doctor = await assignDoctor({
    specilization: triage?.recommendedSpecialization || 'General Medicine',
    scheduledDate: triageData.scheduledDate,
  });

  triageData.triage.priorityScore = triage.priorityScore || 25;
  triageData.triage.severityLevel = triage.severityLevel || 'low';
  triageData.triage.source = 'Gemini AI';

  const appointmentdoc = await Appointment.create({
    patientId: isPatientExists?._id,
    doctorId: doctor._id,
    token: await generateToken(),
    scheduledDate: triageData.scheduledDate,
    triage: {
      ...triageData.triage,
    },
    createdBy: 'patient',
  });

  const appointment = await Appointment.findById(appointmentdoc._id).populate(
    'doctorId',
    'firstName lastName department experienceYears consultationFee',
  );

  return appointment;
};

const getActiveAppointment = async (userId) => {
  const patient = await Patient.findOne({ userId });

  if (!patient) {
    throw new AppError('No patient found', 404);
  }

  const appointment = await Appointment.findOne({
    patientId: patient._id,
    status: { $in: ['confirmed', 'checked_in', 'called', 'in_consultation'] },
  }).populate('doctorId', 'firstName lastName department experienceYears');

  if (!appointment) {
    return null;
  }

  const { patients: patientDetails } = await getDoctorQueue(
    appointment.doctorId._id,
    appointment.scheduledDate,
  );

  let exceptedStartTime = null;
  let exceptedEndTime = null;
  let queuePosition = null;

  if (patientDetails?.length > 0) {
    const details = patientDetails.filter((pat) =>
      pat.patientId.equals(patient._id),
    );

    exceptedStartTime = details[0].exceptedStartTime;
    exceptedEndTime = details[0].exceptedEndTime;
    queuePosition = details[0].queuePosition;
  }

  return {
    ...appointment.toObject(),
    exceptedStartTime,
    exceptedEndTime,
    queuePosition,
  };
};

const getAppointmentByToken = async ({ token }, id) => {
  const appointment = await Appointment.findOne({ token }).populate(
    'doctorId',
    'firstName lastName department experienceYears',
  );

  if (!appointment) {
    throw new AppError('No appointment found!', 404);
  }

  const { exceptedStartTime, exceptedEndTime, queuePosition } =
    await getActiveAppointment(id);

  return {
    ...appointment.toObject(),
    exceptedStartTime,
    exceptedEndTime,
    queuePosition,
  };
};

const cancelAppointment = async ({ token }) => {
  const appointment = await Appointment.findOneAndUpdate(
    {
      token,
    },
    {
      status: 'cancelled',
    },
    {
      new: true,
    },
  ).populate('doctorId', 'firstName lastName department experienceYears');

  if (!appointment) {
    throw new AppError('Appointment not found!', 404);
  }

  return appointment;
};

module.exports = {
  createAppointment,
  getActiveAppointment,
  getAppointmentByToken,
  getAppointmentsForUser,
  cancelAppointment,
};
