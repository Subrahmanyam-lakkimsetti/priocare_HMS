import { useDispatch, useSelector } from 'react-redux';
import { setVitals } from '../patientSlice';

const VITALS = [
  {
    key: 'heartRate',
    label: 'Heart Rate',
    placeholder: '72',
    unit: 'bpm',
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
  },
  {
    key: 'bloodPressure',
    label: 'Blood Pressure',
    placeholder: '120/80',
    unit: 'mmHg',
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    key: 'temperature',
    label: 'Temperature',
    placeholder: '98.6',
    unit: '°F',
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
        />
      </svg>
    ),
  },
];

export default function VitalsStep() {
  const dispatch = useDispatch();
  const vitals = useSelector((s) => s.patient.intake.vitals) || {};

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {VITALS.map(({ key, label, placeholder, unit, icon }) => (
          <div key={key}>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5">
              <span className="text-gray-400">{icon}</span>
              {label}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={placeholder}
                value={vitals[key] || ''}
                onChange={(e) => dispatch(setVitals({ [key]: e.target.value }))}
                className="w-full border-2 border-gray-200 focus:border-blue-400 outline-none rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 pr-12 transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-300 pointer-events-none">
                {unit}
              </span>
            </div>
          </div>
        ))}
      </div>

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
        Skip if you don't have recent readings — this is optional
      </p>
    </div>
  );
}
