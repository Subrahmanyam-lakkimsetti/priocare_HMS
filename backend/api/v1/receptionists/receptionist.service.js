const Appointment = require('../../../models/appointment.model');
const Patient = require('../../../models/patient.model');
const User = require('../../../models/user.model');
const AppError = require('../../../utils/AppError.util');
const { getDayRange } = require('../../../utils/dayRange.util');
const sendEmail = require('../../../utils/email.util');
const {
  emitDoctorRefresh,
  emitReceptionistRefresh,
  emitPatientRefresh,
} = require('../../../utils/realtime.util');

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

  await appointment.save();

  emitDoctorRefresh({
    doctorId: appointment.doctorId?._id || appointment.doctorId,
    scheduledDate: appointment.scheduledDate,
  });
  emitReceptionistRefresh({ scheduledDate: appointment.scheduledDate });
  emitPatientRefresh({
    patientId: appointment.patientId?._id || appointment.patientId,
    token: appointment.token,
  });

  const patient = await Patient.findById(appointment.patientId);
  const user = await User.findById(patient.userId);

  await sendCheckInConfirmationEmail(appointment, patient, user);

  return appointment;
};

const sendCheckInConfirmationEmail = async (appointment, patient, user) => {
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

  const checkedInTime = new Date(appointment.checkedInAt).toLocaleTimeString(
    'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  );

  // Get doctor details from populated appointment
  const doctor = appointment.doctorId;
  const doctorName = `Dr. ${doctor.firstName} ${doctor.lastName}`;

  const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Check-In Confirmation - PrioCare</title>
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
    .checkin-card {
      background: #f0fdf4;
      border: 2px solid #10b981;
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 24px;
      text-align: center;
    }
    .checkin-icon {
      font-size: 48px;
      margin-bottom: 8px;
    }
    .checkin-title {
      font-size: 18px;
      font-weight: 700;
      color: #065f46;
      margin-bottom: 8px;
    }
    .checkin-time {
      font-size: 13px;
      color: #047857;
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
      padding: 10px 0;
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
    .queue-note {
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
      <div class="header-icon">✅🏥</div>
      <h1>Check-In Successful</h1>
      <p>You're now in the queue</p>
    </div>

    <div class="content">
      <div class="greeting">Dear ${patient.firstName || 'Patient'} ${patient.lastName || ''},</div>
      <div class="message">
        You have been successfully checked in at PrioCare. Please wait for your turn.
      </div>

      <!-- Check-in Success Card -->
      <div class="checkin-card">
        <div class="checkin-icon">✓</div>
        <div class="checkin-title">Checked In Successfully</div>
        <div class="checkin-time">at ${checkedInTime}</div>
      </div>

      <!-- Appointment Details Card -->
      <div class="appointment-card">
        <div class="section-title">📋 APPOINTMENT DETAILS</div>
        
        <div class="detail-row">
          <span class="detail-label">📅 Date</span>
          <span class="detail-value">${formattedDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">⏰ Scheduled Time</span>
          <span class="detail-value">${formattedTime}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">👨‍⚕️ Doctor</span>
          <span class="detail-value">${doctorName}</span>
        </div>
      </div>

      <!-- Token Box -->
      <div class="token-box">
        <div class="token-label">YOUR QUEUE TOKEN</div>
        <div class="token-value">${appointment.token}</div>
        <div class="token-note">Keep this token ready</div>
      </div>

      <!-- Queue Information -->
      <div class="queue-note">
        🚶 <strong>You are now in the queue.</strong><br>
        The doctor will call you shortly based on priority and token number.<br>
        Please wait in the waiting area.
      </div>

      <!-- Website Link -->
      <div class="website-link">
        <a href="https://priocare.live">🏥 Visit PrioCare Portal → priocare.live</a>
        <div class="note">Login to track your queue position</div>
      </div>
    </div>

    <div class="footer">
      © 2026 PrioCare · <a href="https://priocare.live">priocare.live</a><br>
      <span style="font-size: 10px;">For support: support@priocare.live</span>
    </div>
  </div>
</body>
</html>`;

  if (!user?.email) {
    throw new AppError('User email not found for check-in confirmation', 404);
  }

  await sendEmail(user.email, '✅ PrioCare · Check-In Confirmation', emailHtml);
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

        'triage.priorityScore': 1,
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
