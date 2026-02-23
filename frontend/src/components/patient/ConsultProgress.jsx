import useIntakeStage from '../../features/patient/useIntakeStage';

export default function ConsultProgress() {
  const stage = useIntakeStage();
  const percent = ((stage - 1) / 4) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-gray-500">
        <span>Consultation progress</span>
        <span>{Math.round(percent)}%</span>
      </div>

      <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
