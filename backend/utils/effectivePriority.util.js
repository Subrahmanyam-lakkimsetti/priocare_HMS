const SEVERITY_WEIGHT = {
  emergency: 400,
  high: 300,
  medium: 200,
  low: 100,
};

const AIGING_FACTOR = 0.2;

const calculateEffectivePriority = (appointment, clinicStartTime) => {
  // priorityScore + severityLevel + (waitingTime * AIGING_FACTOR)

  const waitingTime = Math.max(0, (Date.now() - clinicStartTime) / 60000);

  const score =
    appointment.triage.priorityScore +
    SEVERITY_WEIGHT[appointment.triage.severityLevel] +
    waitingTime * AIGING_FACTOR;

  return score.toFixed(2);
};

module.exports = {
  calculateEffectivePriority,
};
