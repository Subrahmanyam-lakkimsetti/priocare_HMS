import { useDispatch, useSelector } from 'react-redux';
import { setField } from '../patientSlice';

export default function DateStep() {
  const dispatch = useDispatch();
  const date = useSelector((s) => s.patient.intake.scheduledDate);

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const selected = new Date(e.target.value + 'T00:00:00');
    if (selected.getDay() === 0) return; // silently block Sundays
    dispatch(setField({ scheduledDate: e.target.value }));
  };

  const formatted = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="space-y-3">
      <input
        type="date"
        min={today}
        value={date}
        onChange={handleChange}
        className="border-2 border-gray-200 focus:border-blue-400 outline-none rounded-xl px-4 py-2.5 text-sm text-gray-800 transition-colors cursor-pointer"
      />

      <p className="text-xs text-gray-400 flex items-center gap-1.5">
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Sundays not available · Hospital closed
      </p>

      {formatted && (
        <p className="text-xs font-semibold text-blue-600 flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          {formatted}
        </p>
      )}
    </div>
  );
}
