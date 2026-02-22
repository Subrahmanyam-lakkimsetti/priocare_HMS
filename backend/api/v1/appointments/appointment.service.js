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

  if (appointment) generateToken();

  return token;
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

  console.log(triageData);

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
  console.log(userId);
  const patient = await Patient.findOne({ userId });

  console.log(patient);

  if (!patient) {
    throw new AppError('No patient found', 404);
  }

  console.log('patientId', patient._id);

  const appointment = await Appointment.findOne({
    patientId: patient._id,
    status: { $in: ['confirmed', 'checked_in', 'called', 'in_consultation'] },
  }).populate('doctorId', 'firstName lastName department experienceYears');

  console.log('activeappointment', appointment);

  const { patients: patientDetails } = await getDoctorQueue(
    appointment.doctorId,
    appointment.scheduledDate,
  );

  const patientWaitingDetails = patientDetails.filter((pat) =>
    pat.patientId.equals(patient._id),
  );

  return {
    ...appointment.toObject(),
    exceptedStartTime: patientWaitingDetails[0].exceptedStartTime,
    exceptedEndTime: patientWaitingDetails[0].exceptedEndTime,
    queuePosition: patientWaitingDetails[0].queuePosition,
  };
};

const getAppointmentByToken = async ({ token }, id) => {
  console.log('token', token);
  const appointment = await Appointment.findOne({ token }).populate(
    'doctorId',
    'firstName lastName department experienceYears',
  );

  if (!appointment) {
    throw new AppError('No appointment found!', 404);
  }

  console.log('appointment', appointment);

  const { exceptedStartTime, exceptedEndTime, queuePosition } =
    await getActiveAppointment(id);

  return {
    ...appointment.toObject(),
    exceptedStartTime,
    exceptedEndTime,
    queuePosition,
  };
};

module.exports = {
  createAppointment,
  getActiveAppointment,
  getAppointmentByToken,
};
