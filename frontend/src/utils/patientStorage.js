const KEY = 'patient_intake_v1';

export const loadIntake = () => {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : undefined;
  } catch {
    return undefined;
  }
};

export const saveIntake = (intake) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(intake));
  } catch {}
};

export const clearIntake = () => {
  localStorage.removeItem(KEY);
};
