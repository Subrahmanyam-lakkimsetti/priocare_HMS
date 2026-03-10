// hooks/useIntakeDispatch.js
import { useDispatch, useSelector } from 'react-redux';
import { setField, setVitals, toggleArrayValue } from '../patient/patientSlice';
import { saveIntake } from '../utils/patientStorage';

export default function useIntakeDispatch() {
  const dispatch = useDispatch();
  const userId = useSelector((s) => s.auth.user?._id);
  const intake = useSelector((s) => s.patient.intake);

  return {
    updateField: (payload) => {
      const next = { ...intake, ...payload };
      dispatch(setField(payload));
      saveIntake(userId, next);
    },
    updateVitals: (payload) => {
      const next = { ...intake, vitals: { ...intake.vitals, ...payload } };
      dispatch(setVitals(payload));
      saveIntake(userId, next);
    },
    toggle: (key, value) => {
      const arr = intake[key];
      const next = {
        ...intake,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
      dispatch(toggleArrayValue({ key, value }));
      saveIntake(userId, next);
    },
  };
}