import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleArrayValue } from '../patientSlice';

const SYMPTOMS = [
  { label: 'Fever', icon: '🌡️', desc: 'High body temperature' },
  { label: 'Cough', icon: '😮‍💨', desc: 'Dry or wet cough' },
  { label: 'Headache', icon: '🤕', desc: 'Head or migraine pain' },
  { label: 'Chest Pain', icon: '💔', desc: 'Tightness or pressure' },
  { label: 'Breathing Difficulty', icon: '🫁', desc: 'Shortness of breath' },
  { label: 'Vomiting', icon: '🤢', desc: 'Nausea or vomiting' },
  { label: 'Stomach Pain', icon: '🫃', desc: 'Abdominal discomfort' },
  { label: 'Fatigue', icon: '😴', desc: 'Weakness or tiredness' },
  { label: 'Dizziness', icon: '😵', desc: 'Lightheaded or faint' },
  { label: 'Sore Throat', icon: '🤒', desc: 'Pain when swallowing' },
  { label: 'Body Aches', icon: '🦴', desc: 'Muscle or joint pain' },
  { label: 'Rash', icon: '🔴', desc: 'Skin changes or itching' },
];

export default function SymptomsStep() {
  const dispatch = useDispatch();
  const selected = useSelector((s) => s.patient.intake.symptoms);
  const [custom, setCustom] = useState('');

  const toggle = (label) =>
    dispatch(toggleArrayValue({ key: 'symptoms', value: label }));

  const addCustom = () => {
    const trimmed = custom.trim();
    if (!trimmed || selected.includes(trimmed)) return;
    dispatch(toggleArrayValue({ key: 'symptoms', value: trimmed }));
    setCustom('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustom();
    }
  };

  // Preset labels for quick comparison
  const presetLabels = SYMPTOMS.map((s) => s.label);
  // Custom = selected items that aren't in the preset list
  const customSelected = selected.filter((s) => !presetLabels.includes(s));

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Select all that apply
        </p>
        {selected.length > 0 && (
          <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
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
            {selected.length} selected
          </span>
        )}
      </div>

      {/* Symptom grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {SYMPTOMS.map((s) => {
          const isSelected = selected.includes(s.label);
          return (
            <button
              key={s.label}
              onClick={() => toggle(s.label)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-100'
                  : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-sm'
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
              <span className="text-xl shrink-0">{s.icon}</span>
              <div className="min-w-0">
                <p
                  className={`text-xs font-bold leading-tight truncate ${isSelected ? 'text-white' : 'text-gray-800'}`}
                >
                  {s.label}
                </p>
                <p
                  className={`text-xs mt-0.5 truncate ${isSelected ? 'text-white/70' : 'text-gray-400'}`}
                >
                  {s.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Custom symptom input ── */}
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
          Don't see your symptom? Add it manually
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Eye redness, Jaw pain..."
            className="flex-1 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-blue-400 transition-colors"
          />
          <button
            onClick={addCustom}
            disabled={!custom.trim() || selected.includes(custom.trim())}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all active:scale-95"
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
                onClick={() => toggle(s)}
                className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors"
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

      {/* All selected — summary strip */}
      {selected.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Selected
          </p>
          <div className="flex flex-wrap gap-1.5">
            {selected.map((s) => {
              const isCustom = !presetLabels.includes(s);
              return (
                <span
                  key={s}
                  onClick={() => toggle(s)}
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                    isCustom
                      ? 'bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-red-50 hover:border-red-200 hover:text-red-500'
                      : 'bg-blue-50 border border-blue-200 text-blue-700 hover:bg-red-50 hover:border-red-200 hover:text-red-500'
                  }`}
                >
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
          Tap any symptom above or type a custom one below
        </p>
      )}
    </div>
  );
}
