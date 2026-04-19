const Appointment = require('../../../models/appointment.model');
const Doctor = require('../../../models/doctor.model');
const Patient = require('../../../models/patient.model');
const Prescription = require('../../../models/prescription.model');
const User = require('../../../models/user.model');
const AppError = require('../../../utils/AppError.util');
const sendEmail = require('../../../utils/email.util');
const { getDoctor } = require('../doctors/doctorAuth.service');
const assignDoctor = require('./doctorAssign.service');
const { getDoctorQueue } = require('./doctorQueue.service');
const evaluateTriage = require('./triage/aiAdapter.triage');

const sendAppointmentConfirmationEmail = async (
  appointment,
  patient,
  doctor,
) => {
  console.log(patient.email);
  const formattedDate = new Date(appointment.scheduledDate).toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  );

  const formattedTime = new Date(appointment.scheduledDate).toLocaleTimeString(
    'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  );

  const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmation - PrioCare</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      background-color: #eef2f8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Sora', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      padding: 24px 16px;
    }
    .email-container {
      max-width: 540px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 12px 28px -8px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #0b2b3f 0%, #0f4a5e 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .header-icon {
      font-size: 44px;
      margin-bottom: 10px;
    }
    .header h1 {
      font-size: 26px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
    }
    .header p {
      color: #a5f3fc;
      font-size: 14px;
      margin-top: 6px;
    }
    .content {
      padding: 32px 28px;
    }
    .greeting {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 12px;
    }
    .message {
      color: #475569;
      font-size: 14px;
      margin-bottom: 28px;
      line-height: 1.5;
    }
    .appointment-card {
      background: #f8fafc;
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 24px;
      border: 1px solid #e2e8f0;
    }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #0e7c8c;
      margin-bottom: 18px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-size: 13px;
      font-weight: 600;
      color: #334155;
    }
    .detail-value {
      font-size: 13px;
      color: #0f172a;
      font-weight: 500;
      text-align: right;
    }
    .token-box {
      background: linear-gradient(135deg, #f0f9ff 0%, #e6f7f9 100%);
      border: 2px solid #06b6d4;
      border-radius: 20px;
      padding: 20px;
      text-align: center;
      margin-bottom: 24px;
    }
    .token-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #0e7c8c;
    }
    .token-value {
      font-family: 'SF Mono', 'JetBrains Mono', monospace;
      font-size: 44px;
      font-weight: 800;
      letter-spacing: 6px;
      color: #0f172a;
      margin: 12px 0 6px;
    }
    .token-note {
      font-size: 11px;
      color: #0e7c8c;
    }
    .info-note {
      background: #fef9e3;
      padding: 14px 18px;
      border-radius: 14px;
      font-size: 12px;
      color: #92400e;
      text-align: center;
      margin-bottom: 24px;
    }
    .website-link {
      text-align: center;
      padding: 16px;
      background: #f1f5f9;
      border-radius: 14px;
    }
    .website-link a {
      color: #0f4a5e;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
    }
    .website-link .note {
      font-size: 11px;
      color: #64748b;
      margin-top: 8px;
    }
    .footer {
      background: #f9fbfd;
      padding: 18px 24px;
      text-align: center;
      border-top: 1px solid #e9edf2;
      font-size: 11px;
      color: #7c8ba0;
    }
    .footer a {
      color: #0f4a5e;
      text-decoration: none;
    }
    @media (max-width: 520px) {
      .content { padding: 24px 20px; }
      .token-value { font-size: 34px; letter-spacing: 4px; }
      .detail-row { flex-direction: column; align-items: flex-start; gap: 6px; }
      .detail-value { text-align: left; }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="header-icon">📅✅</div>
      <h1>Appointment Confirmed</h1>
      <p>Your consultation has been scheduled</p>
    </div>

    <div class="content">
      <div class="greeting">Dear ${patient.firstName || 'Patient'} ${patient.lastName || ''},</div>
      <div class="message">
        Your appointment has been successfully booked with PrioCare. Here are your appointment details:
      </div>

      <!-- Appointment Details Card -->
      <div class="appointment-card">
        <div class="section-title">📋 APPOINTMENT DETAILS</div>
        
        <div class="detail-row">
          <span class="detail-label">📅 Date</span>
          <span class="detail-value">${formattedDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">⏰ Time</span>
          <span class="detail-value">${formattedTime}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">👨‍⚕️ Doctor</span>
          <span class="detail-value">Dr. ${doctor.firstName} ${doctor.lastName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">🏥 Department</span>
          <span class="detail-value">${doctor.department || 'General Medicine'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">⭐ Experience</span>
          <span class="detail-value">${doctor.experienceYears || 'N/A'} years</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">💰 Consultation Fee</span>
          <span class="detail-value">₹${doctor.consultationFee || '500'}</span>
        </div>
      </div>

      <!-- Token Box -->
      <div class="token-box">
        <div class="token-label">YOUR QUEUE TOKEN</div>
        <div class="token-value">${appointment.token}</div>
        <div class="token-note">Show this token at the reception desk</div>
      </div>

      <!-- Instructions -->
      <div class="info-note">
        ⏰ <strong>Please arrive 15 minutes before</strong> your scheduled time.<br>
        Keep your token number <strong>${appointment.token}</strong> ready for check-in.
      </div>

      <!-- Website Link -->
      <div class="website-link">
        <a href="https://priocare.live">🏥 Visit PrioCare Portal → priocare.live</a>
        <div class="note">Login to your account to view all your appointments</div>
      </div>
    </div>

    <div class="footer">
      © 2026 PrioCare · <a href="https://priocare.live">priocare.live</a><br>
      <span style="font-size: 10px;">For support: support@priocare.live</span>
    </div>
  </div>
</body>
</html>`;

  await sendEmail(
    patient.email,
    '📅 PrioCare · Your Appointment Confirmation',
    emailHtml,
  );
};

const getDay = (date) => {
  return new Date(date).toLocaleDateString('us-en', { weekday: 'short' });
};

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
  })
    .populate('doctorId', 'firstName lastName department experienceYears')
    .sort({ scheduledDate: -1 });

  return appointments;
};

const createAppointment = async (userId, triageData) => {
  // check patient exists or not
  const isPatientExists = await Patient.findOne({ userId });

  if (!isPatientExists) {
    throw new AppError('Patient Not found!', 404);
  }

  // calculate triage
  let triage;
  try {
    triage = JSON.parse(await evaluateTriage(triageData));
  } catch (error) {
    throw new AppError('Failed to evaluate triage data', 400);
  }

  if (!triage) {
    throw new AppError('Triage evaluation failed', 400);
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

  const { email } = await User.findById(userId);

  // Send appointment confirmation email
  await sendAppointmentConfirmationEmail(
    {
      token: appointment.token,
      scheduledDate: appointment.scheduledDate,
    },
    {
      firstName: isPatientExists.firstName,
      lastName: isPatientExists.lastName,
      email,
    },
    doctor,
  );

  return appointment;
};

const getDoctorsAccordingToSpecilization = async (triageData) => {
  let triage;
  try {
    triage = JSON.parse(await evaluateTriage(triageData));
  } catch (error) {
    throw new AppError('Failed to evaluate triage data', 400);
  }

  // specilization, date, day
  const day = getDay(triageData.scheduledDate);
  console.log(day);
  const pipeline = [
    {
      $match: {
        isActive: true,
        availabilityStatus: 'available',
        specializations: { $in: [triage.recommendedSpecialization] },
        availableDays: { $in: [day] },
      },
    },
    {
      $lookup: {
        from: 'appointments',
        let: { doctorId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$doctorId', '$$doctorId'] },
                  { $eq: ['$scheduledDate', triage.scheduledDate] },
                ],
              },
            },
          },
          {
            $count: 'count',
          },
        ],
        as: 'appointmentStats',
      },
    },
    {
      $addFields: {
        totalAppointments: {
          $ifNull: [{ $arrayElemAt: ['$appointmentStats.count', 0] }, 0],
        },
      },
    },
    {
      $project: {
        appointmentStats: 0,
      },
    },
  ];

  const doctors = await Doctor.aggregate(pipeline);

  return { doctors, triage };
};

const createAppointmentManualAssign = async (
  { triageData, doctorId, scheduledDate },
  userId,
) => {
  const patient = await Patient.findOne({ userId });

  const appointment = await Appointment.create({
    patientId: patient._id,
    doctorId,
    token: await generateToken(),
    scheduledDate,
    triage: {
      ...triageData,
      source: 'Gemini AI',
    },
    createdBy: 'patient',
  });

  const doctor = await Doctor.findById(doctorId);

  const { email } = await User.findById(userId);

  // Send appointment confirmation email
  await sendAppointmentConfirmationEmail(
    {
      token: appointment.token,
      scheduledDate: appointment.scheduledDate,
    },
    {
      firstName: patient.firstName,
      lastName: patient.lastName,
      email,
    },
    doctor,
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

  const appointmentData = await getActiveAppointment(id);
  console.log(appointmentData);

  let exceptedStartTime = null;
  let exceptedEndTime = null;
  let queuePosition = null;

  if (appointmentData) {
    exceptedStartTime = appointmentData.exceptedStartTime;
    exceptedEndTime = appointmentData.exceptedEndTime;
    queuePosition = appointmentData.queuePosition;
  }

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

const getPrescriptionByToken = async ({ params: { token } }) => {
  const appt = await Appointment.findOne({ token });

  if (!appt) throw new AppError('appointment not found', 404);

  const prescription = await Prescription.findOne({
    appointmentId: appt._id,
  });

  if (!prescription) {
    throw new AppError('prescription not exists');
  }

  return prescription;
};

module.exports = {
  createAppointment,
  getDoctorsAccordingToSpecilization,
  createAppointmentManualAssign,
  getActiveAppointment,
  getAppointmentByToken,
  getAppointmentsForUser,
  cancelAppointment,
  getPrescriptionByToken,
};
