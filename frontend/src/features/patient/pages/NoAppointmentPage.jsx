const NoAppointmentPage = ({ firstName, onStartConsultation }) => {
  const timeOfDay = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Greeting row */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {timeOfDay()}, {firstName} 👋
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {today} · No active consultation
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-green-700 text-xs font-semibold">
            Doctors Available
          </span>
        </div>
      </div>

      {/* Main CTA card */}
      <div className="bg-linear-to-br from-blue-700 via-blue-600 to-cyan-600 rounded-2xl overflow-hidden shadow-lg">
        {/* Top section */}
        <div className="p-7">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3 py-1 mb-4">
                <svg
                  className="w-3.5 h-3.5 text-cyan-200"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs font-semibold text-cyan-100 tracking-wide">
                  AI-Powered Priority System
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                How can we help
                <br />
                you today?
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6 max-w-xs">
                Describe your symptoms. Our AI will assess your condition and
                connect you with the right doctor — fast.
              </p>

              <button
                onClick={onStartConsultation}
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 active:scale-95 transition-all shadow-md text-sm"
              >
                Start Consultation
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>

            {/* Illustration block */}
            <div className="hidden sm:flex flex-col items-center justify-center w-36 h-36 bg-white/10 rounded-2xl border border-white/20 shrink-0">
              <svg
                className="w-16 h-16 text-white/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              <p className="text-white/60 text-xs mt-2 font-medium">
                Intake Form
              </p>
            </div>
          </div>
        </div>

        {/* Bottom strip — how it works */}
        <div className="bg-black/20 border-t border-white/10 px-7 py-4">
          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">
            How it works
          </p>
          <div className="flex items-center gap-0">
            {[
              { step: '1', label: 'Fill intake form' },
              { step: '2', label: 'AI analyzes symptoms' },
              { step: '3', label: 'Doctor auto-assigned' },
              { step: '4', label: 'Appointment confirmed' },
            ].map((item, i, arr) => (
              <div key={item.step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-7 h-7 bg-white/20 border border-white/30 rounded-full flex items-center justify-center text-white text-xs font-bold mb-1">
                    {item.step}
                  </div>
                  <p className="text-white/70 text-xs text-center leading-tight">
                    {item.label}
                  </p>
                </div>
                {i < arr.length - 1 && (
                  <div className="w-full h-px bg-white/20 flex-1 -mt-4 mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 feature cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            icon: (
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            ),
            bg: 'bg-blue-50',
            title: 'Under 2 Minutes',
            desc: 'AI analyzes and assigns your priority score instantly',
          },
          {
            icon: (
              <svg
                className="w-6 h-6 text-cyan-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            ),
            bg: 'bg-cyan-50',
            title: 'Best Doctor Match',
            desc: 'Most suitable and available doctor is auto-assigned',
          },
          {
            icon: (
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            ),
            bg: 'bg-indigo-50',
            title: 'Private & Secure',
            desc: 'Your medical data is encrypted and HIPAA compliant',
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center mb-3`}
            >
              {f.icon}
            </div>
            <p className="text-sm font-bold text-gray-800 mb-1">{f.title}</p>
            <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Important notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
        <svg
          className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <p className="text-sm font-bold text-amber-800">
            Experiencing a medical emergency?
          </p>
          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
            Do not use this system. Please visit the emergency desk immediately
            or call emergency services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoAppointmentPage;
