const resend = require('../config/email.config');

const sendEmail = async (to, subject, html) => {
  try {
    const response = await resend.emails.send({
      from: 'Priocare <noreply@priocare.live>',
      to: to,
      subject: subject,
      html: html,
    });

    return response;
  } catch (error) {
    console.error(error);
    throw new Error('Email not sent');
  }
};

module.exports = sendEmail;
