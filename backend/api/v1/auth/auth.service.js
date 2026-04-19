const Otp = require('../../../models/otp.model');
const User = require('../../../models/user.model');
const AppError = require('../../../utils/AppError.util');
const sendEmail = require('../../../utils/email.util');
const { generateToken } = require('../../../utils/jwt.util');
const { customAlphabet } = require('nanoid');
const crypto = require('crypto');

const nanoId = customAlphabet('1234567890', 6);

const sendOTP = async (otp, email) => {
  console.log(email);

  await sendEmail(
    email,
    'PrioCare · Verification Code',
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PrioCare OTP</title>
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
      padding: 20px 0;
    }
    .email-container {
      max-width: 520px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 12px 28px -8px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }
    /* Banner */
    .banner {
      background: linear-gradient(135deg, #0b2b3f 0%, #0f4a5e 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .logo {
      font-size: 28px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .logo span {
      background: rgba(255,255,255,0.15);
      padding: 4px 12px;
      border-radius: 40px;
      font-size: 13px;
      font-weight: 500;
    }
    .tagline {
      font-size: 13px;
      color: #a5f3fc;
      margin-top: 12px;
      opacity: 0.9;
    }
    /* Content */
    .content {
      padding: 36px 28px 32px 28px;
      text-align: center;
    }
    .greeting {
      font-size: 20px;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 12px;
    }
    .message {
      color: #475569;
      font-size: 14px;
      margin-bottom: 32px;
    }
    /* OTP Highlight Box */
    .otp-card {
      background: #f8fafc;
      border: 2px solid #06b6d4;
      border-radius: 20px;
      padding: 28px 20px;
      margin-bottom: 24px;
      box-shadow: 0 4px 12px rgba(6,182,212,0.1);
    }
    .otp-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #0e7c8c;
      margin-bottom: 16px;
    }
    .otp-code {
      font-family: 'SF Mono', 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 52px;
      font-weight: 800;
      letter-spacing: 10px;
      color: #0f172a;
      background: #ffffff;
      display: inline-block;
      padding: 12px 28px;
      border-radius: 20px;
      border: 1px solid #cbd5e1;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .expiry {
      font-size: 12px;
      color: #64748b;
      margin-top: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .expiry-badge {
      background: #fef3c7;
      padding: 3px 10px;
      border-radius: 30px;
      font-weight: 600;
      color: #b45309;
      font-size: 11px;
    }
    .note {
      font-size: 12px;
      color: #64748b;
      background: #f1f5f9;
      padding: 14px 16px;
      border-radius: 16px;
      margin-top: 20px;
    }
    .footer {
      background: #f9fbfd;
      padding: 18px 24px;
      text-align: center;
      border-top: 1px solid #e9edf2;
      font-size: 11px;
      color: #94a3b8;
    }
    .footer a {
      color: #0f4a5e;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Simple Banner -->
    <div class="banner">
      <div class="logo">
        ⚕️ PrioCare <span>HMS</span>
      </div>
      <div class="tagline">secure · instant · reliable</div>
    </div>

    <!-- Main Content -->
    <div class="content">
      <div class="greeting">Verification Code</div>
      <div class="message">
        Use the code below to complete your verification.
      </div>

      <!-- OTP Highlight Section -->
      <div class="otp-card">
        <div class="otp-label">Your One-Time Password</div>
        <div class="otp-code">${otp}</div>
        <div class="expiry">
          ⏱️ Expires in <span class="expiry-badge">10 minutes</span>
        </div>
      </div>

      <div class="note">
        🔐 This code is for verification only. Never share it with anyone.
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      © 2026 PrioCare · <a href="https://priocare.live">priocare.live</a>
    </div>
  </div>
</body>
</html>`,
  );
};

const sendOtpToUser = async ({ email }) => {
  // send otp

  const isAlreadySent = await Otp.findOne({ email }).lean();

  if (isAlreadySent) {
    throw new AppError('Email already sent');
  }

  const otp = nanoId();

  await sendOTP(otp, email);

  await Otp.create({
    email,
    otp,
  });
};

const resendOtpToUser = async ({ email }) => {
  const otpDetails = await Otp.findOne({ email });

  const otp = nanoId();

  if (otpDetails) otpDetails.otp = otp;

  await sendOTP(email, otp);

  otpDetails.save();

  if (!otpDetails) {
    await Otp.create({
      email,
      otp,
    });
  }
};

const registerUser = async ({ email, password, otp }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error('User already exists with the given email');
  }

  const userOtpDetails = await Otp.findOne({ email });

  if (!userOtpDetails && !userOtpDetails.verifyOtp(otp)) {
    throw new AppError('otp is not Valid, incorrect or expired');
  }

  const newUser = await User.create({
    email,
    password,
    role: 'patient',
    isActive: true,
  });

  const token = generateToken({
    userId: newUser.id,
    role: newUser.role,
    isActive: newUser.isActive,
  });

  await sendEmail(
    email,
    '🎉 Welcome to PrioCare – Your Health Journey Starts Here',
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to PrioCare</title>
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
    .email-box {
      max-width: 560px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.12);
      border: 1px solid #e2e8f0;
    }
    /* Hero Header */
    .hero {
      background: linear-gradient(135deg, #0b2b3f 0%, #0f4a5e 100%);
      padding: 40px 28px 36px;
      text-align: center;
    }
    .hero-icon {
      font-size: 52px;
      margin-bottom: 12px;
    }
    .hero h1 {
      font-size: 32px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.8px;
      margin-bottom: 10px;
    }
    .hero p {
      color: #b9e6f0;
      font-size: 15px;
    }
    /* Content */
    .content {
      padding: 36px 32px 32px;
    }
    .greeting {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 16px;
    }
    .intro {
      color: #334155;
      font-size: 15px;
      margin-bottom: 28px;
      line-height: 1.6;
    }
    /* Feature Cards - Simple Visual */
    .features {
      margin-bottom: 32px;
    }
    .feature-item {
      display: flex;
      align-items: center;
      gap: 14px;
      background: #f8fafc;
      padding: 14px 18px;
      border-radius: 18px;
      margin-bottom: 12px;
      border: 1px solid #e9edf2;
    }
    .feature-icon {
      font-size: 28px;
      min-width: 44px;
      text-align: center;
    }
    .feature-text {
      flex: 1;
    }
    .feature-title {
      font-weight: 700;
      color: #0f172a;
      font-size: 15px;
      margin-bottom: 4px;
    }
    .feature-desc {
      font-size: 13px;
      color: #5b6e8c;
    }
    /* CTA Button */
    .cta-button {
      background: linear-gradient(95deg, #0f4a5e 0%, #06b6d4 100%);
      border-radius: 50px;
      padding: 14px 24px;
      text-align: center;
      margin: 28px 0 24px;
    }
    .cta-button a {
      color: white;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      letter-spacing: 0.3px;
      display: block;
    }
    .simple-note {
      background: #fef9e3;
      padding: 14px 18px;
      border-radius: 16px;
      font-size: 12px;
      color: #92400e;
      text-align: center;
      margin-top: 20px;
    }
    .footer {
      background: #f9fbfd;
      padding: 20px 32px;
      text-align: center;
      border-top: 1px solid #e9edf2;
      font-size: 11px;
      color: #7c8ba0;
    }
    .footer a {
      color: #0f4a5e;
      text-decoration: none;
    }
    hr {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 20px 0;
    }
    @media (max-width: 520px) {
      .content { padding: 28px 20px; }
      .hero h1 { font-size: 26px; }
    }
  </style>
</head>
<body>
  <div class="email-box">
    <!-- Hero Banner -->
    <div class="hero">
      <div class="hero-icon">🏥⚕️</div>
      <h1>Welcome to PrioCare</h1>
      <p>Your Smart Hospital Management System</p>
    </div>

    <!-- Main Content -->
    <div class="content">
      <div class="greeting">Hello ${email.split('@')[0]}! 👋</div>
      <div class="intro">
        We're excited to have you on board. <strong>PrioCare</strong> makes managing your healthcare simple — 
        from booking appointments to tracking queue positions in real time.
      </div>

      <!-- Simple Feature Highlights -->
      <div class="features">
        <div class="feature-item">
          <div class="feature-icon">🤖</div>
          <div class="feature-text">
            <div class="feature-title">AI-Powered Triage</div>
            <div class="feature-desc">Our smart system analyzes symptoms and assigns the right doctor.</div>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">⚡</div>
          <div class="feature-text">
            <div class="feature-title">Priority Queue</div>
            <div class="feature-desc">No more long waits — dynamic queue based on urgency and time.</div>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🔐</div>
          <div class="feature-text">
            <div class="feature-title">Secure Dashboard</div>
            <div class="feature-desc">View appointments, medical history, and consultation notes anytime.</div>
          </div>
        </div>
      </div>

      <!-- Simple CTA -->
      <div class="cta-button">
        <a href="https://priocare.live">🎯 Go to Your Dashboard</a>
      </div>

      <!-- Friendly Reminder -->
      <div class="simple-note">
        💡 <strong>Quick tip:</strong> Complete your health profile to get better AI recommendations.
      </div>

      <hr />

      <div style="font-size: 12px; color: #475569; text-align: center; margin-top: 8px;">
        Need help? Reach us at <strong>support@priocare.live</strong>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      © 2026 PrioCare HMS · <a href="https://priocare.live">priocare.live</a> · Secure Healthcare Platform
    </div>
  </div>
</body>
</html>`,
  );

  return {
    newUser,
    token,
  };
};

const loginUser = async ({ email, password }) => {
  // check email and password valid or not
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePasswords(password))) {
    throw new AppError('email or password is Invalid', 404);
  }

  // check isActive
  if (!user.isActive) {
    throw new AppError('Account is inActive, please contact support.', 403);
  }

  // generate and send token
  const token = generateToken({
    userId: user.id,
    role: user.role,
    isActive: user.isActive,
  });

  return { user, token };
};

const getUser = async ({ id }) => {
  const user = await User.findById(id).select('email role isActive');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

const updatePassword = async ({ currentPassword, newPassword }, { id }) => {
  const currentUser = await User.findById(id);

  if (!currentUser) {
    throw new AppError('user not found', 404);
  }

  if (!(await currentUser.comparePasswords(currentPassword))) {
    throw new AppError('current password is invalid', 401);
  }

  currentUser.password = newPassword;

  currentUser.save();
};

const forgetPassword = async (req) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError('user not found!', 404);
  }

  const token = await user.generateResetPasswordToken();
  user.save();

  const backendResetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/resetToken/${token}`;

  return backendResetUrl;
};

const resetPassword = async (resetToken, newPassword) => {
  const token = crypto.createHash('sha256').update(resetToken).digest('hex');

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpireTime: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('reset token is expired or not found', 404);
  }

  user.password = newPassword;

  user.passwordResetToken = undefined;
  user.passwordResetTokenExpireTime = undefined;

  user.save();
};

module.exports = {
  sendOtpToUser,
  resendOtpToUser,
  registerUser,
  loginUser,
  getUser,
  updatePassword,
  forgetPassword,
  resetPassword,
};
