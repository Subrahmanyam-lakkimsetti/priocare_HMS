const getKey = (userId) => `patient_intake_v1_${userId}`;

export const loadIntake = (userId) => {
  if (!userId) return undefined;
  try {
    const data = localStorage.getItem(getKey(userId));
    return data ? JSON.parse(data) : undefined;
  } catch {
    return undefined;
  }
};

export const saveIntake = (userId, intake) => {
  if (!userId) return;
  try {
    localStorage.setItem(getKey(userId), JSON.stringify(intake));
  } catch {}
};

export const clearIntake = (userId) => {
  if (!userId) return;
  localStorage.removeItem(getKey(userId));
};