const cron = require('node-cron');
const Prescription = require('../models/prescription.model');
const Patient = require('../models/patient.model');
const User = require('../models/user.model');
const sendEmail = require('../utils/email.util');

const times = {
  morning: { cron: '0 9 * * *', keyword: 'morning' },
  afternoon: { cron: '0 14 * * *', keyword: 'afternoon' },
  evening: { cron: '0 20 * * *', keyword: 'evening' },
};

const sendReminder = async (timeKeyword) => {
  try {
    // Find prescriptions where medications have frequency containing the keyword
    const prescriptions = await Prescription.find({
      'medications.frequency': { $regex: timeKeyword, $options: 'i' },
      $or: [{ followUpDate: { $gt: new Date() } }, { followUpDate: null }],
    }).populate('patientId');

    for (const prescription of prescriptions) {
      const patient = prescription.patientId;
      if (!patient) continue;

      const user = await User.findById(patient.userId);
      if (!user || !user.email) continue;

      // Filter medications for this time
      const relevantMeds = prescription.medications.filter((med) =>
        med.frequency.toLowerCase().includes(timeKeyword),
      );

      if (relevantMeds.length === 0) continue;

      // Compose email
      const subject = `Medicine Reminder - ${timeKeyword.charAt(0).toUpperCase() + timeKeyword.slice(1)}`;
      const html = `
        <h2>Medicine Reminder</h2>
        <p>Dear ${patient.firstName} ${patient.lastName},</p>
        <p>It's time to take your medicines for ${timeKeyword}:</p>
        <ul>
          ${relevantMeds
            .map(
              (med) => `
            <li><strong>${med.name}</strong> - Dosage: ${med.dosage}, Instructions: ${med.instructions || 'N/A'}</li>
          `,
            )
            .join('')}
        </ul>
        <p>Please follow the instructions carefully. Stay healthy!</p>
        <p>Regards,<br>Priocare Team</p>
      `;

      await sendEmail(user.email, subject, html);
      console.log(`Reminder sent to ${user.email} for ${timeKeyword}`);
    }
  } catch (error) {
    console.error('Error sending reminders:', error);
  }
};

// Schedule the jobs
const scheduleReminders = () => {
  Object.values(times).forEach(({ cron: cronTime, keyword }) => {
    cron.schedule(
      cronTime,
      () => {
        sendReminder(keyword);
      },
      {
        timezone: 'Asia/Kolkata', // Adjust timezone as needed
      },
    );
  });
  console.log('Medicine reminder jobs scheduled');
};

module.exports = { scheduleReminders };
