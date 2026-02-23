import { useSelector } from 'react-redux';

export default function useIntakeStage() {
  const i = useSelector((s) => s.patient.intake);

  if (i.description.length <= 10) return 1;
  if (i.symptoms.length === 0) return 2;
  if (!i.age) return 3;
  if (!i.scheduledDate) return 4;
  return 5;
}
