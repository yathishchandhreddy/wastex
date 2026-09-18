import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await resetPassword(email.trim());
      setIsSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send password recovery instructions.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 flex-1">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
        <div className="text-center">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3 border border-emerald-200">
            <span className="material-symbols-outlined text-[22px]">lock_reset</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Reset Account Password</h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter your corporate email address to receive an official recovery link.
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5"
          >
            <span className="material-symbols-outlined text-rose-600 text-[18px] shrink-0 mt-0.5">
              error
            </span>
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {isSuccess ? (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <span className="material-symbols-outlined text-emerald-600 text-[20px] shrink-0 mt-0.5">
                mark_email_read
              </span>
              <div>
                <p className="font-semibold text-emerald-900">Recovery Instructions Dispatched</p>
                <p className="mt-1 text-emerald-700 leading-relaxed">
                  If an account exists for <span className="font-mono font-medium">{email}</span>, a secure password reset link has been dispatched to your corporate inbox.
                </p>
              </div>
            </div>

            <Link
              to="/login"
              className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold text-center transition-colors block"
            >
              Return to Platform Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Corporate Dispatch Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operations@facility.com"
                className="bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                required
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-xs mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending Recovery Email...</span>
                </>
              ) : (
                <span>Dispatch Recovery Link</span>
              )}
            </button>
          </form>
        )}

        <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
          Remember your credentials?{' '}
          <Link to="/login" className="text-emerald-700 hover:underline font-semibold">
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
