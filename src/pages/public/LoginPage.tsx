import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { DEMO_ACCOUNTS } from '@/src/services/authService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isAuthenticated, profile, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already logged in, redirect to respective portal
  useEffect(() => {
    if (isAuthenticated && profile && !authLoading) {
      const target =
        profile.role === 'buyer' ? '/buyer' : profile.role === 'admin' ? '/admin' : '/app';
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, profile, authLoading, navigate]);

  const executeSignIn = async (loginEmail: string, loginPass: string) => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const userProfile = await signIn(loginEmail, loginPass);
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
      if (from && from !== '/login') {
        navigate(from, { replace: true });
      } else if (userProfile.role === 'buyer') {
        navigate('/buyer', { replace: true });
      } else if (userProfile.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/app', { replace: true });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Please verify your credentials.';
      if (msg.includes('Invalid login credentials')) {
        setErrorMessage('Invalid email or password. Please verify your credentials or use the demo accounts below.');
      } else if (msg.includes('Email not confirmed')) {
        setErrorMessage('Email address has not been confirmed yet. Please check your inbox.');
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeSignIn(email, password);
  };

  const handleQuickDemo = async (role: keyof typeof DEMO_ACCOUNTS) => {
    const demo = DEMO_ACCOUNTS[role];
    setEmail(demo.email);
    setPassword(demo.password);
    await executeSignIn(demo.email, demo.password);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 flex-1">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
        <div className="text-center">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3 border border-emerald-200">
            <span className="material-symbols-outlined text-[22px]">lock</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Sign in to WasteX AI</h2>
          <p className="text-xs text-slate-500 mt-1">
            Industrial Waste Valorization & Circular Secondary Feedstock Exchange
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

        {/* Fast Demo Login Section */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-700 text-[18px]">bolt</span>
              Fast Demo One-Click Login
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-white border border-emerald-300 px-2 py-0.5 rounded-full">
              No Password Needed
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              id="btn-demo-generator"
              type="button"
              disabled={isSubmitting}
              onClick={() => handleQuickDemo('generator')}
              className="px-3.5 py-2.5 rounded-lg bg-white border border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 text-slate-800 text-xs font-bold transition-all text-left flex items-center justify-between shadow-xs cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-emerald-700 text-[20px]">precision_manufacturing</span>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-emerald-900">Waste Generator Demo</div>
                  <div className="text-[11px] text-slate-500 font-normal">Gujarat AgroChem • Generator Operations Hub</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-emerald-700 text-[18px]">arrow_forward</span>
            </button>

            <button
              id="btn-demo-buyer"
              type="button"
              disabled={isSubmitting}
              onClick={() => handleQuickDemo('buyer')}
              className="px-3.5 py-2.5 rounded-lg bg-white border border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 text-slate-800 text-xs font-bold transition-all text-left flex items-center justify-between shadow-xs cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-emerald-700 text-[20px]">shopping_cart</span>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-emerald-900">Buyer / Recycler Demo</div>
                  <div className="text-[11px] text-slate-500 font-normal">EcoBind Materials • Procurement Marketplace</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-emerald-700 text-[18px]">arrow_forward</span>
            </button>

            <button
              id="btn-demo-admin"
              type="button"
              disabled={isSubmitting}
              onClick={() => handleQuickDemo('admin')}
              className="px-3.5 py-2.5 rounded-lg bg-white border border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 text-slate-800 text-xs font-bold transition-all text-left flex items-center justify-between shadow-xs cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-emerald-700 text-[20px]">admin_panel_settings</span>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-emerald-900">Platform Admin Demo</div>
                  <div className="text-[11px] text-slate-500 font-normal">WasteX Clearinghouse • Audit & Operations</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-emerald-700 text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center my-1">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] text-slate-400 font-semibold uppercase absolute">Or Sign In with Email</span>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Corporate Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. operations@gujaratchem.in"
              className="bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              required
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-emerald-700 hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-xs mt-2 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Platform</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don&apos;t have an enterprise account?{' '}
          <Link to="/signup" className="text-emerald-700 hover:underline font-semibold">
            Register Industrial Facility / Buyer Account
          </Link>
        </div>
      </div>
    </div>
  );
};
