export default function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon */}
      <div className="shrink-0">
        <svg
          width="44"
          height="44"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <rect width="52" height="52" rx="12" fill="url(#logoGrad)" />
          <rect
            width="52"
            height="26"
            rx="12"
            fill="white"
            fillOpacity="0.08"
          />
          {/* Cross */}
          <rect x="22" y="9" width="8" height="28" rx="2.5" fill="white" />
          <rect x="14" y="17" width="24" height="8" rx="2.5" fill="white" />
          {/* ECG pulse */}
          <polyline
            points="4,44 10,44 14,38 18,50 22,32 26,50 30,38 34,44 48,44"
            fill="none"
            stroke="white"
            strokeWidth="1.6"
            strokeOpacity="0.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-none gap-0.5">
        <div className="flex items-baseline">
          <span
            className="font-bold text-2xl tracking-tight"
            style={{ fontFamily: 'Georgia, serif', color: '#1e2d5a' }}
          >
            Prio
          </span>
          <span
            className="font-bold text-2xl tracking-tight"
            style={{ fontFamily: 'Georgia, serif', color: '#2563eb' }}
          >
            Care
          </span>
        </div>
        <span
          style={{
            color: '#93adc8',
            fontSize: '0.5rem',
            letterSpacing: '0.18em',
          }}
        >
          PRIORITY HEALTHCARE
        </span>
      </div>
    </div>
  );
}
