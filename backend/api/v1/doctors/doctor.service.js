const Appointment = require('../../../models/appointment.model');
const Doctor = require('../../../models/doctor.model');
const User = require('../../../models/user.model');
const AppError = require('../../../utils/AppError.util');
const { getDoctorQueue } = require('../appointments/doctorQueue.service');
const { generateSummary } = require('./prompts/aiAdapter');
const sendEmail = require('../../../utils/email.util');

const formatDate = (date) => {
  if (!date) return 'N/A';

  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = (date) => {
  if (!date) return 'N/A';

  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const sendPatientCalledEmail = async ({
  appointment,
  patient,
  doctor,
  email,
}) => {
  if (!email) return;

  const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Doctor Called You - PrioCare</title>
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
      background: linear-gradient(135deg, #14532d 0%, #15803d 100%);
      padding: 32px 24px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .header p {
      color: #dcfce7;
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
      margin-bottom: 24px;
    }
    .appointment-card {
      background: #f8fafc;
      border-radius: 20px;
      padding: 24px;
      border: 1px solid #e2e8f0;
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #166534;
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
    .notice {
      background: #fef9e3;
      padding: 14px 18px;
      border-radius: 14px;
      font-size: 12px;
      color: #92400e;
      text-align: center;
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
      color: #166534;
      text-decoration: none;
    }
    @media (max-width: 520px) {
      .content { padding: 24px 20px; }
      .detail-row { flex-direction: column; align-items: flex-start; gap: 6px; }
      .detail-value { text-align: left; }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Your Doctor Has Called You</h1>
      <p>Please proceed to consultation room</p>
    </div>

    <div class="content">
      <div class="greeting">Dear ${patient.firstName || 'Patient'} ${patient.lastName || ''},</div>
      <div class="message">
        Your queue token has been called. Please proceed for your consultation at PrioCare.
      </div>

      <div class="appointment-card">
        <div class="section-title">Consultation Call Details</div>

        <div class="detail-row">
          <span class="detail-label">Token</span>
          <span class="detail-value">${appointment.token || 'N/A'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Doctor</span>
          <span class="detail-value">Dr. ${doctor.firstName || ''} ${doctor.lastName || ''}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Department</span>
          <span class="detail-value">${doctor.department || 'General Medicine'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Appointment Date</span>
          <span class="detail-value">${formatDate(appointment.scheduledDate)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Called At</span>
          <span class="detail-value">${formatTime(appointment.calledAt)}</span>
        </div>
      </div>

      <div class="notice">
        Please keep your token ready and report to the doctor immediately.
      </div>
    </div>

    <div class="footer">
      PrioCare Hospital Management System<br>
      <a href="https://priocare.live">priocare.live</a>
    </div>
  </div>
</body>
</html>`;

  await sendEmail(email, 'PrioCare · Your Doctor Called You', emailHtml);
};

const sendConsultationCompletedEmail = async ({
  appointment,
  patient,
  doctor,
  email,
}) => {
  if (!email) return;

  const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consultation Completed - PrioCare</title>
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
      color: #ffffff;
    }
    .header h1 {
      font-size: 26px;
      font-weight: 800;
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
      margin-bottom: 24px;
    }
    .appointment-card {
      background: #f8fafc;
      border-radius: 20px;
      padding: 24px;
      border: 1px solid #e2e8f0;
      margin-bottom: 24px;
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
    .notice {
      background: #f1f5f9;
      padding: 14px 18px;
      border-radius: 14px;
      font-size: 12px;
      color: #334155;
      text-align: center;
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
      .detail-row { flex-direction: column; align-items: flex-start; gap: 6px; }
      .detail-value { text-align: left; }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Consultation Completed</h1>
      <p>Thank you for visiting PrioCare</p>
    </div>

    <div class="content">
      <div class="greeting">Dear ${patient.firstName || 'Patient'} ${patient.lastName || ''},</div>
      <div class="message">
        Your consultation has been marked as completed. Please review your prescription and follow-up instructions.
      </div>

      <div class="appointment-card">
        <div class="section-title">Consultation Summary</div>

        <div class="detail-row">
          <span class="detail-label">Token</span>
          <span class="detail-value">${appointment.token || 'N/A'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Doctor</span>
          <span class="detail-value">Dr. ${doctor.firstName || ''} ${doctor.lastName || ''}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Department</span>
          <span class="detail-value">${doctor.department || 'General Medicine'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date</span>
          <span class="detail-value">${formatDate(appointment.scheduledDate)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Completed At</span>
          <span class="detail-value">${formatTime(appointment.consulationEndsAt)}</span>
        </div>
      </div>

      <div class="notice">
        You can log in to your PrioCare account to access appointment history and prescriptions.
      </div>
    </div>

    <div class="footer">
      PrioCare Hospital Management System<br>
      <a href="https://priocare.live">priocare.live</a>
    </div>
  </div>
</body>
</html>`;

  await sendEmail(email, 'PrioCare · Consultation Completed', emailHtml);
};

const callPatient = async (userId, date) => {
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
  ).populate('patientId', 'firstName lastName userId');

  if (!calledPatient) {
    throw new AppError('Patient already called by another request', 409);
  }

  (async () => {
    try {
      const patient = calledPatient.patientId;
      const user = await User.findById(patient.userId).select('email');

      await sendPatientCalledEmail({
        appointment: calledPatient,
        patient,
        doctor,
        email: user?.email,
      });
    } catch (err) {
      console.log('Patient called email failed', err);
    }
  })();

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
  )
    .populate('patientId', 'firstName lastName userId')
    .populate('doctorId', 'firstName lastName department');

  if (!appointment) {
    throw new AppError('appointment not found!', 404);
  }

  (async () => {
    try {
      const patient = appointment.patientId;
      const doctor = appointment.doctorId;
      const user = await User.findById(patient.userId).select('email');

      await sendConsultationCompletedEmail({
        appointment,
        patient,
        doctor,
        email: user?.email,
      });
    } catch (err) {
      console.log('Consultation completed email failed', err);
    }
  })();

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
