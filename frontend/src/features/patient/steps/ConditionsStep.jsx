import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleArrayValue } from '../patientSlice';

const CONDITIONS = [
  { label: 'Diabetes', icon: '🩸', desc: 'Type 1 or Type 2' },
  { label: 'Blood Pressure', icon: '💊', desc: 'High or low BP' },
  { label: 'Asthma', icon: '🫁', desc: 'Respiratory condition' },
  { label: 'Heart Disease', icon: '❤️', desc: 'Cardiac conditions' },
  { label: 'Thyroid', icon: '🦋', desc: 'Hypo or hyperthyroid' },
  { label: 'Kidney Disease', icon: '🫘', desc: 'Chronic kidney issues' },
  { label: 'Arthritis', icon: '🦴', desc: 'Joint inflammation' },
  { label: 'Epilepsy', icon: '⚡', desc: 'Seizure disorder' },
  { label: 'None', icon: '✅', desc: 'No known conditions' },
];

const PRESET_LABELS = CONDITIONS.map((c) => c.label);

export default function ConditionsStep() {
  const dispatch = useDispatch();
  const selected = useSelector((s) => s.patient.intake.comorbidities);
  const [custom, setCustom] = useState('');

  const toggle = (label) => {
    // If selecting "None", clear everything else first
    if (label === 'None') {
      selected
        .filter((s) => s !== 'None')
        .forEach((s) =>
          dispatch(toggleArrayValue({ key: 'comorbidities', value: s })),
        );
    } else if (selected.includes('None')) {
      // If "None" was selected, deselect it when picking a real condition
      dispatch(toggleArrayValue({ key: 'comorbidities', value: 'None' }));
    }
    dispatch(toggleArrayValue({ key: 'comorbidities', value: label }));
  };

  const addCustom = () => {
    const trimmed = custom.trim();
    if (!trimmed || selected.includes(trimmed)) return;
    if (selected.includes('None')) {
      dispatch(toggleArrayValue({ key: 'comorbidities', value: 'None' }));
    }
    dispatch(toggleArrayValue({ key: 'comorbidities', value: trimmed }));
    setCustom('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustom();
    }
  };

  const customSelected = selected.filter((s) => !PRESET_LABELS.includes(s));

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Select all that apply
        </p>
        {selected.length > 0 && (
          <span className="inline-flex items-center gap-1.5 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            <svg
              className="w-3 h-3"
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
            {selected.includes('None')
              ? 'None reported'
              : `${selected.length} selected`}
          </span>
        )}
      </div>

      {/* Conditions grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {CONDITIONS.map((c) => {
          const isSelected = selected.includes(c.label);
          const isNone = c.label === 'None';
          return (
            <button
              key={c.label}
              onClick={() => toggle(c.label)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 ${
                isSelected
                  ? isNone
                    ? 'bg-green-600 border-green-600 shadow-md shadow-green-100'
                    : 'bg-orange-500 border-orange-500 shadow-md shadow-orange-100'
                  : 'bg-white border-gray-100 hover:border-orange-200 hover:shadow-sm'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-white/25 rounded-full flex items-center justify-center">
                  <svg
                    className="w-2.5 h-2.5 text-white"
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
                </div>
              )}
              <span className="text-xl shrink-0">{c.icon}</span>
              <div className="min-w-0">
                <p
                  className={`text-xs font-bold leading-tight truncate ${isSelected ? 'text-white' : 'text-gray-800'}`}
                >
                  {c.label}
                </p>
                <p
                  className={`text-xs mt-0.5 truncate ${isSelected ? 'text-white/70' : 'text-gray-400'}`}
                >
                  {c.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom condition input — hidden if "None" selected */}
      {!selected.includes('None') && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 mb-2.5 flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Don't see your condition? Add it manually
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Lupus, Celiac disease..."
              className="flex-1 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-orange-400 transition-colors"
            />
            <button
              onClick={addCustom}
              disabled={!custom.trim() || selected.includes(custom.trim())}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all active:scale-95"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add
            </button>
          </div>

          {/* Custom added tags */}
          {customSelected.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {customSelected.map((s) => (
                <span
                  key={s}
                  onClick={() =>
                    dispatch(
                      toggleArrayValue({ key: 'comorbidities', value: s }),
                    )
                  }
                  className="inline-flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors"
                >
                  ✏️ {s}
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected summary */}
      {selected.length > 0 && !selected.includes('None') && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Selected
          </p>
          <div className="flex flex-wrap gap-1.5">
            {selected.map((s) => {
              const isCustom = !PRESET_LABELS.includes(s);
              return (
                <span
                  key={s}
                  onClick={() =>
                    dispatch(
                      toggleArrayValue({ key: 'comorbidities', value: s }),
                    )
                  }
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                    isCustom
                      ? 'bg-orange-50 border border-orange-200 text-orange-700 hover:bg-red-50 hover:border-red-200 hover:text-red-500'
                      : 'bg-orange-50 border border-orange-200 text-orange-700 hover:bg-red-50 hover:border-red-200 hover:text-red-500'
                  }`}
                >
                  {isCustom && '✏️ '}
                  {s}
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* None selected state */}
      {selected.includes('None') && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-green-800">
              No pre-existing conditions
            </p>
            <p className="text-xs text-green-600 mt-0.5">
              Your doctor will be informed accordingly
            </p>
          </div>
        </div>
      )}

      {/* Empty hint */}
      {selected.length === 0 && (
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
          Select your conditions or tap "None" if you have no known conditions
        </p>
      )}
    </div>
  );
}
