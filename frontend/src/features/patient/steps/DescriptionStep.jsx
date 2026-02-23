import { useDispatch, useSelector } from 'react-redux';
import { setField } from '../patientSlice';

const PROMPTS = [
  'Fever since yesterday',
  'Headache and dizziness',
  'Stomach pain after eating',
  'Cough for 3 days',
  'Chest tightness while walking',
  'Sore throat and fatigue',
];

export default function DescriptionStep() {
  const dispatch = useDispatch();
  const value = useSelector((s) => s.patient.intake.description);

  const charCount = value?.length || 0;
  const isValid = charCount > 10;
  const maxChars = 500;

  return (
    <div className="space-y-4">
      {/* Quick suggestion chips */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Quick suggestions
        </p>
        <div className="flex flex-wrap gap-2">
          {PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => dispatch(setField({ description: p }))}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                value === p
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) =>
            dispatch(
              setField({ description: e.target.value.slice(0, maxChars) }),
            )
          }
          placeholder="e.g. I have had a sore throat and mild fever since yesterday evening, and it hurts to swallow..."
          rows={5}
          className={`w-full px-4 py-4 text-sm text-gray-800 placeholder-gray-300 bg-white border-2 rounded-xl resize-none outline-none transition-all duration-200 leading-relaxed ${
            isValid
              ? 'border-blue-300 focus:border-blue-500'
              : 'border-gray-200 focus:border-blue-400'
          }`}
        />
        {/* Char counter */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span
            className={`text-xs font-medium tabular-nums ${charCount > maxChars * 0.9 ? 'text-orange-400' : 'text-gray-300'}`}
          >
            {charCount}/{maxChars}
          </span>
        </div>
      </div>

      {/* Live preview — only when valid */}
      {isValid && (
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-blue-700 mb-0.5">
              Your doctor will see
            </p>
            <p className="text-sm text-blue-800 leading-relaxed">{value}</p>
          </div>
        </div>
      )}

      {/* Helper hint */}
      {!isValid && (
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
          Write at least a few words describing your main concern
        </p>
      )}
    </div>
  );
}
