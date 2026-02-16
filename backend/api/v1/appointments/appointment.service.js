const Appointment = require('../../../models/appointment.model');
const Patient = require('../../../models/patient.model');
const AppError = require('../../../utils/AppError.util');
const assignDoctor = require('./doctorAssign.service');
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
  // const triage = JSON.parse(await evaluateTriage(triageData));

  console.log('triage', triage);
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

  await Appointment.create({
    patientId: isPatientExists?._id,
    doctorId: doctor._id,
    token: generateToken(),
    scheduledDate: triageData.scheduledDate,
    triage: {
      ...triageData.triage,
    },
    createdBy: 'patient',
  });

  return 'success';
};

module.exports = {
  createAppointment,
};
