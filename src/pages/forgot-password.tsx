import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { Input } from '@/components/ui/input';
import Logo from '../../public/logo.png';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen bg-white dark:bg-gray-950 p-4 items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-2xl shadow-xl dark:border dark:border-gray-800">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <svg
                  className="w-14 h-14 text-green-500 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-4">Check your email</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-3">
              We've sent a password reset link to <span className="font-medium">{email}</span>. Click the link in the
              email to reset your password and regain access to your account.
            </p>
          </div>
          <Link
            to="/sign-in"
            className="block w-full py-3 font-medium text-center bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-colors text-white rounded-lg shadow-md hover:shadow-lg"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-950">
      {/* Left Panel - Reset Form */}
      <div className="flex flex-col w-full md:w-1/2 p-4 md:p-12 lg:p-16 justify-center">
        <div className="w-full sm:max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-3">
              Forgot your password?
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your email and we'll send you a link to reset your password and get back to validating your ideas.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-4 rounded-lg mb-6 flex items-center shadow-sm animate-shake">
              <svg
                className="w-5 h-5 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                ></path>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400 dark:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 py-6"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending reset link...
                </span>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-8 text-gray-600 dark:text-gray-400">
            Remember your password?{' '}
            <Link
              to="/sign-in"
              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
            >
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Features Showcase */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-900 to-indigo-800 dark:from-indigo-950 dark:to-gray-900 text-white p-12 lg:p-16 items-center justify-center relative overflow-hidden">
        <div className="absolute opacity-5 top-0 left-0 w-full h-full">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-md bg-indigo-950/40 dark:bg-black/40 p-8 rounded-xl backdrop-filter backdrop-blur-sm border border-indigo-600/20 dark:border-indigo-700/20">
          <div className="flex items-center mb-8">
            <img src={Logo} alt="Logo" className="w-10" />
            <span className="text-2xl font-bold ml-2">SegmentGenie</span>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-white">Account recovery made simple</h2>

          <div className="space-y-6">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600/40 mr-4">
                <svg className="h-5 w-5 text-indigo-200" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Secure Recovery</h3>
                <p className="text-indigo-200 mt-1">Securely reset your password via email verification</p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600/40 mr-4">
                <svg className="h-5 w-5 text-indigo-200" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-.257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Quick Access</h3>
                <p className="text-indigo-200 mt-1">Regain access to your account in minutes</p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600/40 mr-4">
                <svg className="h-5 w-5 text-indigo-200" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Email Delivery</h3>
                <p className="text-indigo-200 mt-1">Check your inbox for a password reset link</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-10 border-t border-indigo-500/20">
            <p className="font-semibold text-indigo-200">Your data and insights are waiting for you</p>
          </div>
        </div>
      </div>
    </div>
  );
}
