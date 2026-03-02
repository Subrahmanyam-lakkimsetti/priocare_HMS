import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from './authThunks';
import { clearError } from './authSlice';
import { useNavigate, Link } from 'react-router-dom';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: 'At least 6 characters', pass: password.length >= 6 }, // Changed from 8 to 6
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
    { label: 'Special character', pass: /[^A-Za-z0-9]/.test(password) },
  ];

  const strength = checks.filter((c) => c.pass).length;
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = [
    '',
    'bg-red-500',
    'bg-orange-400',
    'bg-yellow-400',
    'bg-emerald-500',
  ][strength];
  const strengthTextColor = [
    '',
    'text-red-500',
    'text-orange-400',
    'text-yellow-500',
    'text-emerald-500',
  ][strength];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : 'bg-gray-200'}`}
          />
        ))}
        <span className={`text-xs font-medium ml-1 ${strengthTextColor}`}>
          {strengthLabel}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {checks.map((c) => (
          <div key={c.label} className="flex items-center gap-1.5">
            <div
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-200 ${c.pass ? 'bg-emerald-500' : 'bg-gray-200'}`}
            >
              {c.pass && (
                <svg
                  className="w-2 h-2 text-white"
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
              )}
            </div>
            <span
              className={`text-xs transition-colors ${c.pass ? 'text-emerald-600' : 'text-gray-400'}`}
            >
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const EyeIcon = ({ open }) =>
  open ? (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  ) : (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, error, loading } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    navigate('/patient');
  }, [isAuthenticated, user, navigate]);

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6)
      // Changed from 8 to 6 to match backend
      errs.password = 'At least 6 characters required';
    if (!form.confirmPassword)
      errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(
      registerUser({
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      }),
    );
  };

  const inputBase =
    'w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all';
  const inputClass = (field) =>
    `${inputBase} ${
      fieldErrors[field]
        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400 bg-red-50/30'
        : 'border-gray-200 focus:ring-blue-500/30 focus:border-blue-500'
    }`;

  return (
    <div className="min-h-screen flex font-sans">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-900 via-blue-800 to-cyan-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-15 -right-15 w-72 h-72 bg-cyan-400/10 rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-blue-400/10 rounded-full" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <svg
              className="w-6 h-6 text-blue-700"
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
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">
            Prio<span className="text-cyan-300">Care</span>
          </span>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-cyan-200 text-sm font-medium">
              Join 10,000+ Patients
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight">
            Your Health Journey
            <br />
            <span className="text-cyan-300">Starts Here</span>
          </h1>
          <p className="text-blue-200 text-base leading-relaxed max-w-sm">
            Create your PrioCare account and get access to AI-powered symptom
            analysis, priority queueing, and seamless doctor communication.
          </p>

          <div className="space-y-3 pt-2">
            {[
              {
                icon: '🤖',
                title: 'AI Symptom Analysis',
                desc: 'Get triaged in under 2 minutes',
              },
              {
                icon: '⚡',
                title: 'Priority Queueing',
                desc: 'Seen based on urgency, not wait time',
              },
              {
                icon: '🔒',
                title: 'Secure & Private',
                desc: 'HIPAA compliant data handling',
              },
            ].map((b) => (
              <div
                key={b.title}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10"
              >
                <span className="text-xl">{b.icon}</span>
                <div>
                  <div className="text-white text-sm font-semibold">
                    {b.title}
                  </div>
                  <div className="text-blue-300 text-xs">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-cyan-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-blue-300 text-xs">
            HIPAA Compliant &amp; Secure
          </span>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 justify-center mb-8">
            <div className="w-9 h-9 bg-blue-700 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
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
            </div>
            <span className="text-blue-900 text-2xl font-bold tracking-tight">
              Prio<span className="text-cyan-600">Care</span>
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-gray-900">
                Create account
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Register as a patient to get started
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    autoFocus
                    className={inputClass('email')}
                    value={form.email}
                    onChange={set('email')}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    className={inputClass('password')}
                    value={form.password}
                    onChange={set('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {fieldErrors.password}
                  </p>
                )}
                <PasswordStrength password={form.password} />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    className={inputClass('confirmPassword')}
                    value={form.confirmPassword}
                    onChange={set('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {fieldErrors.confirmPassword}
                  </p>
                )}
                {/* Passwords match indicator */}
                {form.confirmPassword &&
                  form.password === form.confirmPassword && (
                    <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Passwords match
                    </p>
                  )}
              </div>

              {/* API Error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                  <svg
                    className="w-4 h-4 text-red-500 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 mt-1"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mt-5">
            <svg
              className="w-3.5 h-3.5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs text-gray-400">
              256-bit encrypted &amp; HIPAA compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
