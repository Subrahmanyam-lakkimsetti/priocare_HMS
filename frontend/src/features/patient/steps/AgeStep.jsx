import { useDispatch, useSelector } from 'react-redux';
import { setField } from '../patientSlice';

const AGE_GROUPS = [
  { label: 'Child', range: '0–12', icon: '🧒', value: 8 },
  { label: 'Teen', range: '13–17', icon: '🧑', value: 15 },
  { label: 'Adult', range: '18–59', icon: '👨', value: 30 },
  { label: 'Senior', range: '60+', icon: '👴', value: 65 },
];

function getAgeGroup(age) {
  const n = parseInt(age);
  if (!n) return null;
  if (n <= 12) return 'Child';
  if (n <= 17) return 'Teen';
  if (n <= 59) return 'Adult';
  return 'Senior';
}

export default function AgeStep() {
  const dispatch = useDispatch();
  const age = useSelector((s) => s.patient.intake.age);
  const numAge = parseInt(age) || 0;
  const activeGroup = getAgeGroup(age);
  const isValid = numAge >= 1 && numAge <= 120;

  const handleChange = (val) => {
    if (val === '') {
      dispatch(setField({ age: '' }));
      return;
    }
    const n = parseInt(val);
    if (n >= 1 && n <= 120) dispatch(setField({ age: String(n) }));
  };

  return (
    <div className="space-y-4">
      {/* Quick select — icon left, text right */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {AGE_GROUPS.map((g) => {
          const isActive = activeGroup === g.label;
          return (
            <button
              key={g.label}
              onClick={() => dispatch(setField({ age: String(g.value) }))}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 border-blue-600 shadow-sm'
                  : 'bg-white border-gray-100 hover:border-blue-200'
              }`}
            >
              <span className="text-lg shrink-0">{g.icon}</span>
              <div className="text-left">
                <p
                  className={`text-xs font-bold leading-none ${isActive ? 'text-white' : 'text-gray-700'}`}
                >
                  {g.label}
                </p>
                <p
                  className={`text-xs mt-0.5 ${isActive ? 'text-white/60' : 'text-gray-400'}`}
                >
                  {g.range}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400 font-medium">
          or enter exact age
        </span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Stepper + input */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleChange(String(Math.max(1, numAge - 1)))}
          disabled={numAge <= 1}
          className="w-10 h-10 rounded-xl border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 transition-all active:scale-95"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </button>

        <div className="relative w-20">
          <input
            type="number"
            value={age}
            min={1}
            max={120}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="—"
            className={`w-full text-center text-2xl font-black py-2.5 border-2 rounded-xl outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
              isValid
                ? 'border-blue-300 text-blue-700 bg-blue-50'
                : 'border-gray-200 text-gray-300 bg-white focus:border-blue-300'
            }`}
          />
          {isValid && (
            <span className="absolute right-2.5 bottom-2.5 text-xs text-gray-400 font-semibold pointer-events-none">
              yrs
            </span>
          )}
        </div>

        <button
          onClick={() => handleChange(String(Math.min(120, numAge + 1)))}
          disabled={numAge >= 120}
          className="w-10 h-10 rounded-xl border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 transition-all active:scale-95"
        >
          <svg
            className="w-4 h-4"
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
        </button>
      </div>

      {/* Compact confirmation */}
      {isValid && (
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
          {age} years old · {activeGroup}
        </p>
      )}
    </div>
  );
}
