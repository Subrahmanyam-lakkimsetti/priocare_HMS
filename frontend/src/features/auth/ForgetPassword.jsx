import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { forgetPassword } from './authThunks';

export default function ForgetPassword() {
  const dispatch = useDispatch();
  const { forgetPasswordLoading, forgetPasswordError, forgetPasswordSuccess } =
    useSelector((state) => state.auth);

  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      dispatch(forgetPassword({ email: email.trim() }));
    }
  };

  if (forgetPasswordSuccess) {
    return (
      <div className="min-h-screen flex font-sans">
        {/* Left Panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-900 via-blue-800 to-cyan-700 flex-col justify-between p-12 relative overflow-hidden">
          {/* Background decorative circles */}
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
                  d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-2 9h-4v4h-2v-4H7v-2h4V6h2v4h4v2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Priocare</h1>
              <p className="text-blue-200 text-sm">
                Hospital Management System
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Password Reset Email Sent
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              We've sent a password reset link to your email address. Please
              check your inbox and follow the instructions to reset your
              password.
            </p>
          </div>

          {/* Footer */}
          <div className="relative z-10 text-blue-200 text-sm">
            <p>© 2024 Priocare. All rights reserved.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Check Your Email
              </h2>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>

              <div className="space-y-3">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200"
                >
                  Back to Login
                </Link>

                <button
                  onClick={() => {
                    setEmail('');
                    window.location.reload();
                  }}
                  className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-xl transition-all duration-200"
                >
                  Try Different Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-900 via-blue-800 to-cyan-700 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decorative circles */}
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
                d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-2 9h-4v4h-2v-4H7v-2h4V6h2v4h4v2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Priocare</h1>
            <p className="text-blue-200 text-sm">Hospital Management System</p>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Forgot Your Password?
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            No worries! Enter your email address and we'll send you a link to
            reset your password.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-blue-200 text-sm">
          <p>© 2024 Priocare. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-gray-900">
                Reset Password
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Enter your email to receive reset instructions
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
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Error Message */}
              {forgetPasswordError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-red-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-red-700 text-sm">
                      {forgetPasswordError}
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={forgetPasswordLoading || !email.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm"
              >
                {forgetPasswordLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Reset Link...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
