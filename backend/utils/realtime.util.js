const { safeEmit } = require('./socket');

const toDateKey = (date) => {
  if (!date) return null;
  const asDate = new Date(date);
  if (Number.isNaN(asDate.getTime())) return null;
  return asDate.toISOString().slice(0, 10);
};

const emitDoctorRefresh = ({ doctorId, scheduledDate }) => {
  if (!doctorId) return;
  const dateKey = toDateKey(scheduledDate);
  safeEmit(`doctor:${doctorId}`, 'doctor:refresh', { date: dateKey });
};

const emitReceptionistRefresh = ({ scheduledDate }) => {
  const dateKey = toDateKey(scheduledDate);
  safeEmit('role:receptionist', 'receptionist:refresh', { date: dateKey });
};

const emitPatientRefresh = ({ patientId, token }) => {
  if (!patientId) return;
  safeEmit(`patient:${patientId}`, 'patient:refresh', { token });
};

const emitDoctorAiSummary = ({
  doctorId,
  token,
  aiSummary,
  aisummaryUpdatedAt,
}) => {
  if (!doctorId || !token) return;
  safeEmit(`doctor:${doctorId}`, 'doctor:aiSummary', {
    token,
    aiSummary,
    aisummaryUpdatedAt,
  });
};

module.exports = {
  emitDoctorRefresh,
  emitReceptionistRefresh,
  emitPatientRefresh,
  emitDoctorAiSummary,
  toDateKey,
};
