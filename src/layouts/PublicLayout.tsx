import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ConfigNotice } from '@/src/components/ui/ConfigNotice';

export const PublicLayout: React.FC = () => {
  return (
    <div className="bg-[#F8FAF9] text-slate-900 min-h-screen flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      <header className="fixed top-0 w-full z-50 pt-safe bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="h-16 px-4 md:px-6 flex items-center justify-between max-w-7xl mx-auto w-full">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-xs">
              <span className="material-symbols-outlined text-[20px]">recycling</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 text-base tracking-tight">
                  WasteX AI
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Industrial B2B
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-normal">
                Industrial Waste Valorization & Circular Exchange
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-lg text-slate-700 hover:text-emerald-700 text-xs font-semibold transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Create Account</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-16 flex-1 flex flex-col">
        <ConfigNotice />
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
