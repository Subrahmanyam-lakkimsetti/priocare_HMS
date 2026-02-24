import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── tiny icon wrappers ───────────────────────────────── */
const Icon = ({ d, size = 20, stroke = 2 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

/* ─── Nav ───────────────────────────────────────────────── */
function Nav({ onBook }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M12 4v16M4 12h16" />
            </svg>
          </div>
          <span className="text-blue-900 text-xl font-bold tracking-tight">
            Prio<span className="text-cyan-600">Care</span>
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          {[
            ['#why', 'Why PrioCare'],
            ['#how', 'How It Works'],
            ['#emergency', 'Emergency'],
            ['#trust', 'Trust & Safety'],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="hover:text-blue-700 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        <button
          onClick={onBook}
          className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-sm"
        >
          Book Visit
        </button>
      </div>
    </nav>
  );
}

/* ─── Hero ──────────────────────────────────────────────── */
function Hero({ onBook }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-cyan-50/60">
      {/* Decorative circles — CSS only, no JS */}
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-cyan-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/30 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #1e40af 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-blue-700 text-xs font-bold uppercase tracking-widest">
                AI-Powered Triage System
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-5">
              Healthcare that{' '}
              <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                fits your life
              </span>
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
              Get the care you need, exactly when you need it. Our AI analyzes
              your symptoms, assigns your priority, and connects you with the
              right doctor — without the confusion or long waits.
            </p>

            {/* Feature checks */}
            <div className="grid grid-cols-2 gap-2.5 mb-8">
              {[
                'Quick access to care',
                'AI priority matching',
                'Always-on support',
                'Clear, simple guidance',
              ].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{f}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={onBook}
                className="flex items-center gap-2 px-7 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-200"
              >
                Book a Visit
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </button>
              <a
                href="#how"
                className="flex items-center gap-2 px-5 py-3.5 border-2 border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-700 font-semibold rounded-xl transition-all text-sm"
              >
                See How It Works
              </a>
            </div>
          </div>

          {/* Right — stat card cluster */}
          <div className="relative hidden lg:block">
            {/* Main card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                    Live System
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    AI Triage Active
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span className="text-green-700 text-xs font-bold">
                    Online
                  </span>
                </div>
              </div>

              {/* Journey steps */}
              <div className="space-y-3">
                {[
                  {
                    step: '01',
                    label: 'Fill intake form',
                    time: '~2 min',
                    done: true,
                  },
                  {
                    step: '02',
                    label: 'AI analyzes symptoms',
                    time: 'Instant',
                    done: true,
                  },
                  {
                    step: '03',
                    label: 'Doctor auto-assigned',
                    time: '~30 sec',
                    active: true,
                  },
                  {
                    step: '04',
                    label: 'Appointment confirmed',
                    time: 'Done',
                    done: false,
                  },
                ].map((s) => (
                  <div
                    key={s.step}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${s.active ? 'bg-blue-50 border border-blue-100' : s.done ? 'bg-gray-50' : 'bg-gray-50/50'}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black ${s.done ? 'bg-blue-600 text-white' : s.active ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-400'}`}
                    >
                      {s.done ? '✓' : s.step}
                    </div>
                    <span
                      className={`text-sm font-semibold flex-1 ${s.active ? 'text-blue-800' : s.done ? 'text-gray-600' : 'text-gray-400'}`}
                    >
                      {s.label}
                    </span>
                    <span
                      className={`text-xs font-medium ${s.active ? 'text-blue-500' : 'text-gray-300'}`}
                    >
                      {s.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating stat cards */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-3">
              <p className="text-2xl font-black text-blue-700">{'<'}2 min</p>
              <p className="text-xs text-gray-400 font-medium">
                Avg. analysis time
              </p>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-3">
              <p className="text-2xl font-black text-cyan-600">24/7</p>
              <p className="text-xs text-gray-400 font-medium">
                Always available
              </p>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {[
            { value: '24/7', label: 'Care access' },
            { value: '<2 min', label: 'AI analysis' },
            { value: '99%', label: 'Positive feedback' },
            { value: 'HIPAA', label: 'Compliant & secure' },
          ].map((s) => (
            <div
              key={s.value}
              className="bg-white/80 border border-gray-100 rounded-2xl px-5 py-4 text-center shadow-sm"
            >
              <p className="text-xl font-black text-blue-700">{s.value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-gray-400 to-transparent" />
      </div>
    </section>
  );
}

/* ─── Why PrioCare ──────────────────────────────────────── */
function WhySection() {
  const items = [
    {
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Less Waiting',
      desc: 'Priority-based scheduling means you get care when you need it most.',
      color: 'blue',
    },
    {
      icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
      title: 'Clear Guidance',
      desc: 'Every step explained in simple terms — no medical jargon, no confusion.',
      color: 'cyan',
    },
    {
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      title: 'Priority Care',
      desc: 'Urgent needs get immediate attention. Our AI never misses critical symptoms.',
      color: 'blue',
    },
    {
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      title: 'One Secure Place',
      desc: 'Everything you need — booking, records, queue status — in one HIPAA-compliant platform.',
      color: 'cyan',
    },
  ];

  return (
    <section id="why" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-4">
            <span className="text-blue-700 text-xs font-bold uppercase tracking-widest">
              Why PrioCare
            </span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-3">
            Healthcare that{' '}
            <span className="text-blue-700">actually works</span> for you
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            We've redesigned the hospital experience around what truly matters
            to patients.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <div
              key={item.title}
              className="group bg-gray-50 hover:bg-white border-2 border-gray-100 hover:border-blue-200 rounded-2xl p-6 transition-all duration-200 hover:shadow-md"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${item.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-cyan-100 text-cyan-600'}`}
              >
                <Icon d={item.icon} size={20} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ──────────────────────────────────────── */
function HowSection() {
  const steps = [
    {
      n: '01',
      title: 'Fill the Intake Form',
      desc: 'Describe your symptoms, add your age, any pre-existing conditions, and pick a date. Takes about 2 minutes.',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    },
    {
      n: '02',
      title: 'AI Analyzes Your Case',
      desc: 'Our AI cross-references your symptoms with clinical models, calculates a severity level and assigns a priority score to your case.',
      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    },
    {
      n: '03',
      title: 'Doctor is Auto-Assigned',
      desc: 'The most suitable and available doctor — matched to your department and case — is automatically assigned without any manual steps.',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    },
    {
      n: '04',
      title: 'Track Your Queue Live',
      desc: 'See your token number, queue position, and expected wait time in real time. Stay available — your doctor will call when ready.',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2m-6 9l2 2 4-4',
    },
  ];

  return (
    <section
      id="how"
      className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-4">
            <span className="text-blue-700 text-xs font-bold uppercase tracking-widest">
              How It Works
            </span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-3">
            A clear path to better health
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Each step naturally leads to the next, creating a seamless
            experience from booking to consultation.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-10 left-[calc(12.5%+12px)] right-[calc(12.5%+12px)] h-0.5 bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.n} className="relative flex flex-col">
                {/* Step number + icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-11 h-11 bg-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-200 z-10">
                    <Icon d={step.icon} size={18} stroke={1.8} />
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="absolute"
                    >
                      <path d={step.icon} />
                    </svg>
                  </div>
                  <span className="text-3xl font-black text-gray-100">
                    {step.n}
                  </span>
                </div>

                <div className="flex-1 bg-white border-2 border-gray-100 hover:border-blue-200 rounded-2xl p-5 transition-all hover:shadow-md">
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Arrow for mobile */}
                {i < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-4 mb-2 text-blue-300">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Pre & Post Care ───────────────────────────────────── */
function CareSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-4">
            <span className="text-blue-700 text-xs font-bold uppercase tracking-widest">
              Care Journey
            </span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-3">
            Care that{' '}
            <span className="text-blue-700">continues beyond the visit</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            We support you before your visit and keep you on track long after
            it.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Before */}
          <div className="bg-gradient-to-br from-blue-700 to-cyan-600 rounded-2xl p-8 text-white">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3 py-1 mb-5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13 12H3" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-wider">
                Before Your Visit
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-3">
              Preparing you for better care
            </h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              Everything you need to feel prepared, informed, and confident
              before stepping into the hospital.
            </p>
            <div className="space-y-3">
              {[
                {
                  icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2',
                  label: 'Clear step-by-step instructions',
                },
                {
                  icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
                  label: 'Home preparation tips for recovery',
                },
                {
                  icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
                  label: 'Know exactly what will happen',
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon d={item.icon} size={14} stroke={2} />
                  </div>
                  <span className="text-sm font-medium text-white/90">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* After */}
          <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-8">
            <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 rounded-full px-3 py-1 mb-5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0891b2"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
                After Your Visit
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Ongoing support & monitoring
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Regular follow-ups, progress tracking, and 24/7 support to make
              sure your recovery stays on track.
            </p>
            <div className="space-y-3">
              {[
                {
                  icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
                  label: 'Follow-up check-in calls & messages',
                  color: 'blue',
                },
                {
                  icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
                  label: '24/7 support for any questions',
                  color: 'cyan',
                },
                {
                  icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
                  label: 'Visual recovery milestone tracking',
                  color: 'blue',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3"
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-cyan-100 text-cyan-600'}`}
                  >
                    <Icon d={item.icon} size={14} stroke={2} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Who It's For ──────────────────────────────────────── */
function ForSection() {
  const roles = [
    {
      title: 'Patients',
      desc: 'Get care that adapts to your urgency and schedule. See your queue, track your case, and know exactly what happens next.',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      features: [
        'Priority scheduling',
        'Real-time queue tracking',
        'Clear instructions',
      ],
      accent: 'blue',
    },
    {
      title: 'Families',
      desc: "Stay informed and connected with your loved one's care journey. No more waiting in the dark.",
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      features: ['Shared status updates', 'Care coordination', 'Peace of mind'],
      accent: 'cyan',
    },
    {
      title: 'Care Teams',
      desc: 'Deliver better care with streamlined coordination, AI-assisted triage, and efficient patient workflows.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      features: [
        'Patient insights',
        'Team coordination',
        'Efficient workflows',
      ],
      accent: 'blue',
    },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-4">
            <span className="text-blue-700 text-xs font-bold uppercase tracking-widest">
              Designed For You
            </span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-3">
            For everyone who{' '}
            <span className="text-blue-700">cares about health</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Whether you're managing a chronic condition or seeking care once,
            PrioCare works for you.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {roles.map((role, i) => (
            <div
              key={role.title}
              className="bg-white border-2 border-gray-100 hover:border-blue-200 rounded-2xl p-7 transition-all hover:shadow-md group"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${role.accent === 'blue' ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 'bg-cyan-100 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white'} transition-all`}
              >
                <Icon d={role.icon} size={22} />
              </div>
              <div
                className={`text-xs font-black uppercase tracking-widest mb-2 ${role.accent === 'blue' ? 'text-blue-600' : 'text-cyan-600'}`}
              >
                0{i + 1}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {role.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                {role.desc}
              </p>
              <div className="space-y-2">
                {role.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-gray-500">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Emergency ─────────────────────────────────────────── */
function EmergencySection() {
  return (
    <section id="emergency" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border-2 border-red-100 rounded-2xl px-8 py-10 flex flex-col lg:flex-row items-center gap-8">
          {/* Icon */}
          <div className="w-20 h-20 bg-red-100 border-2 border-red-200 rounded-2xl flex items-center justify-center flex-shrink-0">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc2626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              Experiencing a medical emergency?
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-xl">
              Do <strong>not</strong> use this system for emergencies. PrioCare
              is for scheduled and non-emergency consultations only. If you are
              in immediate danger or experiencing a life-threatening condition,
              please act immediately.
            </p>
          </div>

          <div className="flex flex-col gap-3 flex-shrink-0">
            <div className="flex items-center gap-3 bg-white border-2 border-red-200 rounded-xl px-5 py-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <p className="text-xs text-gray-400 font-medium">
                  Call immediately
                </p>
                <p className="text-lg font-black text-red-600">911</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center font-medium">
              Or visit the emergency desk
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Trust ─────────────────────────────────────────────── */
function TrustSection() {
  const items = [
    {
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      stat: '256-bit',
      title: 'Encryption',
      desc: 'Your health data is encrypted end-to-end and never sold or shared without consent.',
    },
    {
      icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
      stat: 'Real-time',
      title: 'Updates',
      desc: 'No surprises. Always know what to expect, when to expect it, and who your doctor is.',
    },
    {
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      stat: 'HIPAA',
      title: 'Compliant',
      desc: 'Built on healthcare compliance standards. Regularly audited for data security and privacy.',
    },
    {
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      stat: '99.9%',
      title: 'Uptime',
      desc: '24/7 system availability with 99.9% uptime. Care whenever you need it, without interruption.',
    },
  ];

  return (
    <section id="trust" className="py-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-4">
            <span className="text-blue-700 text-xs font-bold uppercase tracking-widest">
              Trust & Security
            </span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-3">
            Built on <span className="text-blue-700">trust & security</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Your privacy and security are not features — they are the
            foundation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-white border-2 border-gray-100 hover:border-blue-200 rounded-2xl p-6 transition-all hover:shadow-md text-center"
            >
              <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Icon d={item.icon} size={20} />
              </div>
              <p className="text-2xl font-black text-blue-700 mb-0.5">
                {item.stat}
              </p>
              <p className="text-sm font-bold text-gray-800 mb-2">
                {item.title}
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ───────────────────────────────────────────────── */
function CTASection({ onBook }) {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-cyan-700 rounded-3xl px-8 py-14 text-center relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-xs font-bold uppercase tracking-widest">
                Doctors Available Now
              </span>
            </div>
            <h2 className="text-4xl font-black text-white mb-4">
              Ready for healthcare that puts you first?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of patients who experience healthcare differently —
              faster, clearer, and built around you.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={onBook}
                className="flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-black rounded-2xl hover:bg-blue-50 transition-all active:scale-95 shadow-lg"
              >
                Book Your First Visit
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </button>
              <a
                href="#how"
                className="px-6 py-4 border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all text-sm"
              >
                See How It Works
              </a>
            </div>
            <p className="text-white/40 text-xs mt-5">
              No commitment required · HIPAA compliant · Free to use
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M12 4v16M4 12h16" />
                </svg>
              </div>
              <span className="text-blue-900 text-xl font-bold">
                Prio<span className="text-cyan-600">Care</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Healthcare that understands what comes first in your life.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">
              Quick Links
            </p>
            <div className="space-y-2.5">
              {[
                'Book Visit',
                'How It Works',
                'Pre & Post Care',
                'Emergency',
                'Support',
              ].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="block text-sm text-gray-400 hover:text-blue-700 transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">
              Contact
            </p>
            <div className="space-y-2.5 text-sm text-gray-400">
              <p>24/7 Support Available</p>
              <p>help@priocare.com</p>
              <p>1-800-PRIO-CARE</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">
              Stay Updated
            </p>
            <p className="text-sm text-gray-400 mb-3">
              Get healthcare tips and updates.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 text-sm border-2 border-gray-200 focus:border-blue-400 rounded-xl outline-none transition-colors bg-white"
              />
              <button className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-all">
                Go
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 text-center space-y-1">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} PrioCare. All rights reserved.
          </p>
          <p className="text-xs text-gray-300">
            PrioCare does not provide emergency services. In case of emergency,
            call 911 immediately.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Root ──────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const onBook = () => navigate('/login ');

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Nav onBook={onBook} />
      <Hero onBook={onBook} />
      <WhySection />
      <HowSection />
      <CareSection />
      <ForSection />
      <EmergencySection />
      <TrustSection />
      <CTASection onBook={onBook} />
      <Footer />
    </div>
  );
}
