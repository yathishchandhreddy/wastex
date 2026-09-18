import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 md:px-6 py-12 md:py-20 max-w-5xl mx-auto flex-1">
      {/* Problem statement / initiative badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-6">
        <span className="w-2 h-2 rounded-full bg-emerald-600" />
        <span>Sustainability SU-05 • Industrial Waste Valorization & Circular Exchange</span>
      </div>

      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-3xl leading-tight">
        Transform Industrial Byproducts into High-Value Circular Feedstock
      </h1>

      <p className="text-base sm:text-lg text-slate-600 max-w-2xl mt-5 mb-8 leading-relaxed">
        WasteX AI empowers manufacturing plants, recyclers, and procurement teams to analyze waste composition, discover optimal valorization pathways, and match with verified industrial buyers.
      </p>

      {/* Main Actions */}
      <div className="flex flex-col items-center gap-4 w-full max-w-xl">
        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          <Link
            to="/login"
            className="px-6 py-3 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow-xs hover:bg-emerald-700 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">lock_open</span>
            <span>Sign In to Platform</span>
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 rounded-lg bg-white border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-[20px]">domain_add</span>
            <span>Register Facility / Buyer Account</span>
          </Link>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="w-full p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-left flex flex-col gap-2.5 mt-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-700 text-[18px]">bolt</span>
              Fast Demo One-Click Login
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-white border border-emerald-300 px-2 py-0.5 rounded-full">
              Instant Sandbox
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Link
              to="/login"
              className="p-2.5 rounded-lg bg-white border border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center gap-2 text-left text-xs font-bold text-slate-900"
            >
              <span className="material-symbols-outlined text-emerald-700 text-[18px]">precision_manufacturing</span>
              <div>
                <div>Generator Demo</div>
                <div className="text-[10px] text-slate-500 font-normal">Waste Streams & TEA</div>
              </div>
            </Link>

            <Link
              to="/login"
              className="p-2.5 rounded-lg bg-white border border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center gap-2 text-left text-xs font-bold text-slate-900"
            >
              <span className="material-symbols-outlined text-emerald-700 text-[18px]">shopping_cart</span>
              <div>
                <div>Buyer Demo</div>
                <div className="text-[10px] text-slate-500 font-normal">Procurement & Offtake</div>
              </div>
            </Link>

            <Link
              to="/login"
              className="p-2.5 rounded-lg bg-white border border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center gap-2 text-left text-xs font-bold text-slate-900"
            >
              <span className="material-symbols-outlined text-emerald-700 text-[18px]">admin_panel_settings</span>
              <div>
                <div>Admin Demo</div>
                <div className="text-[10px] text-slate-500 font-normal">Audit Clearinghouse</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Key Enterprise Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-12 pt-8 border-t border-slate-200">
        <div className="flex flex-col p-4 bg-white rounded-xl border border-slate-200 shadow-xs text-left">
          <span className="text-2xl font-bold text-slate-900">94.2%</span>
          <span className="text-xs text-slate-500 mt-0.5">Classification Precision</span>
        </div>
        <div className="flex flex-col p-4 bg-white rounded-xl border border-slate-200 shadow-xs text-left">
          <span className="text-2xl font-bold text-emerald-700">₹14,500/MT</span>
          <span className="text-xs text-slate-500 mt-0.5">Avg Valorized Yield</span>
        </div>
        <div className="flex flex-col p-4 bg-white rounded-xl border border-slate-200 shadow-xs text-left">
          <span className="text-2xl font-bold text-slate-900">4,280 MT</span>
          <span className="text-xs text-slate-500 mt-0.5">Landfill Diversion Logged</span>
        </div>
        <div className="flex flex-col p-4 bg-white rounded-xl border border-slate-200 shadow-xs text-left">
          <span className="text-2xl font-bold text-slate-900">12,450 tCO₂e</span>
          <span className="text-xs text-slate-500 mt-0.5">Emissions Avoided</span>
        </div>
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-left w-full">
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs hover:border-emerald-300 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-4">
            <span className="material-symbols-outlined text-[22px]">document_scanner</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">1. AI Waste Characterization</h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Multi-spectral image capture and manifest ingestion analyze chemical composition, hazardous traits, and moisture content with confidence scoring.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs hover:border-emerald-300 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 mb-4">
            <span className="material-symbols-outlined text-[22px]">alt_route</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">2. Valorization Pathways</h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Techno-economic assessment (TEA) comparing direct reuse, mechanical recycling, chemical synthesis, and energy recovery ranked by ROI and ESG impact.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs hover:border-emerald-300 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-4">
            <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">3. Circular Buyer Matching</h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Live marketplace matching industrial generators directly with vetted cement kilns, smelters, recyclers, and chemical manufacturers.
          </p>
        </div>
      </div>
    </div>
  );
};
