import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'generator' | 'buyer'>('generator');
  const [location, setLocation] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    if (password.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const createdProfile = await signUp({
        name: fullName.trim(),
        organization: organization.trim(),
        email: email.trim(),
        password,
        role,
        location: location.trim() || undefined,
      });

      if (createdProfile.role === 'buyer') {
        navigate('/buyer', { replace: true });
      } else {
        navigate('/app', { replace: true });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('unique constraint')) {
        setErrorMessage('This corporate email is already registered. Please sign in instead.');
      } else if (msg.toLowerCase().includes('confirm')) {
        setSuccessNotice('Account created! Please check your email to confirm your corporate registration before signing in.');
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 flex-1">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
        <div className="text-center">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3 border border-emerald-200">
            <span className="material-symbols-outlined text-[22px]">domain_add</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Register Industrial Facility</h2>
          <p className="text-xs text-slate-500 mt-1">
            Enroll an industrial byproduct generator or certified circular raw material buyer
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

        {successNotice && (
          <div
            role="status"
            className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5"
          >
            <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">
              check_circle
            </span>
            <div className="flex-1 font-medium">{successNotice}</div>
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          {/* Role Selection (Public only allows generator or buyer) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Facility / Entity Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('generator')}
                className={`py-2 px-3 text-xs rounded-lg border font-medium transition-all flex items-center justify-center gap-2 ${
                  role === 'generator'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-semibold shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">precision_manufacturing</span>
                <span>Waste Generator</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`py-2 px-3 text-xs rounded-lg border font-medium transition-all flex items-center justify-center gap-2 ${
                  role === 'buyer'
                    ? 'bg-sky-50 border-sky-600 text-sky-800 font-semibold shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">storefront</span>
                <span>Buyer / Recycler</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Dr. Rajesh Verma"
                className="bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Organization / Facility Name</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Gujarat Petrochem Node 4"
                className="bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Corporate Dispatch Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. operations@petrochem.in"
                className="bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                required
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Facility Location / Region</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Dahej PCPIR, Gujarat, India"
              className="bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
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
                <span>Registering Industrial Node...</span>
              </>
            ) : (
              <span>Create Facility Account</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-700 hover:underline font-semibold">
            Sign In to Existing Account
          </Link>
        </div>
      </div>
    </div>
  );
};
