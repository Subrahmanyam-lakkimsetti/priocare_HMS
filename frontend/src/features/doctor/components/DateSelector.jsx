import { useSelector } from 'react-redux';
import { useRef } from 'react';

/* ------------------ DATE UTILITIES ------------------ */

const toDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const todayStr = () => toDateString(new Date());

const shiftDate = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return toDateString(d);
};

const formatDisplay = (dateStr) => {
  const date = new Date(dateStr);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diff = Math.round((date - today) / 86400000);

  const label =
    diff === 0
      ? 'Today'
      : diff === -1
        ? 'Yesterday'
        : diff === 1
          ? 'Tomorrow'
          : null;

  const formatted = date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return { label, formatted };
};

/* ------------------ COMPONENT ------------------ */

export default function DateSelector({ selectedDate, onChange }) {
  const loading = useSelector((s) => s.doctor.loading);
  const queue = useSelector((s) => s.doctor.queue);

  const isToday = selectedDate === todayStr();
  const dateInputRef = useRef(null);

  const { label, formatted } = formatDisplay(selectedDate);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-sm">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              {label && (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isToday
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {label}
                </span>
              )}

              {loading && (
                <span className="flex items-center gap-1 text-xs text-blue-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping inline-block" />
                  Loading
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-gray-800 mt-0.5">
              {formatted}
            </p>
          </div>
        </div>

        <div className="w-px h-8 bg-gray-100" />

        {/* PATIENT COUNT */}

        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M16 3.13a4 4 0 010 7.75M12 12a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
          </div>

          <div>
            <p className="text-xs text-gray-400 leading-none">Waiting</p>
            <p className="text-sm font-bold text-gray-800 leading-tight">
              {queue.length} patient{queue.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE CONTROLS */}

      <div className="flex items-center gap-2">
        {/* DATE PICKER */}

        <input
          ref={dateInputRef}
          type="date"
          value={selectedDate}
          onChange={(e) => e.target.value && onChange(e.target.value)}
          className="sr-only"
        />

        <button
          type="button"
          onClick={() => dateInputRef.current?.showPicker?.()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Pick date
        </button>

        {/* PREVIOUS DAY */}

        <button
          type="button"
          onClick={() => onChange(shiftDate(selectedDate, -1))}
          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition"
          title="Previous day"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* NEXT DAY */}

        <button
          type="button"
          onClick={() => onChange(shiftDate(selectedDate, 1))}
          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition"
          title="Next day"
        >
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {!isToday && (
          <button
            type="button"
            onClick={() => onChange(todayStr())}
            className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Today
          </button>
        )}
      </div>
    </div>
  );
}
