const { Server } = require('socket.io');
const Doctor = require('../models/doctor.model');
const Patient = require('../models/patient.model');
const { verifyToken } = require('./jwt.util');

let io;

const parseCookies = (cookieHeader = '') => {
  return cookieHeader.split(';').reduce((acc, part) => {
    const trimmed = part.trim();
    if (!trimmed) return acc;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) return acc;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (key) acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
};

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const cookies = parseCookies(socket.handshake.headers?.cookie || '');
      const token = cookies.accessToken;
      if (!token) return next(new Error('unauthorized'));

      const payload = verifyToken(token);
      socket.user = {
        id: payload.userId,
        role: String(payload.role || '')
          .trim()
          .toLowerCase(),
      };

      return next();
    } catch (err) {
      return next(new Error('unauthorized'));
    }
  });

  io.on('connection', async (socket) => {
    const { id, role } = socket.user || {};
    if (id) socket.join(`user:${id}`);
    if (role) socket.join(`role:${role}`);

    try {
      if (role === 'doctor' && id) {
        const doctor = await Doctor.findOne({ userId: id })
          .select('_id')
          .lean();
        if (doctor?._id) {
          socket.join(`doctor:${doctor._id.toString()}`);
        }
      }

      if (role === 'patient' && id) {
        const patient = await Patient.findOne({ userId: id })
          .select('_id')
          .lean();
        if (patient?._id) {
          socket.join(`patient:${patient._id.toString()}`);
        }
      }
    } catch (err) {
      console.log('Socket room join failed', err);
    }
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

const safeEmit = (room, event, payload) => {
  if (!io) return;
  io.to(room).emit(event, payload);
};

module.exports = {
  initSocket,
  getIO,
  safeEmit,
};
