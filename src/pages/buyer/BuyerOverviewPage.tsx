import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/src/components/layout/PageHeader';
import { DEMO_DATA_BADGE, DEMO_CURRENT_LISTING } from '@/src/data/demo';

export const BuyerOverviewPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full px-4 md:px-6 py-6 gap-6 max-w-6xl mx-auto">
      <PageHeader
        nodeTag="Circular Procurement Portal"
        statusTag="Verified Industrial Offtaker"
        title="Industrial Offtaker & Buyer Procurement Hub"
        description="Source verified secondary raw materials, industrial scrap, and chemical feedstocks directly from certified generators with complete compositional provenance."
        badge={DEMO_DATA_BADGE}
        action={
          <Link
            to="/buyer/post-requirement"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold shadow-xs hover:bg-emerald-700 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">post_add</span>
            <span>Post Feedstock Need</span>
          </Link>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Streams</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">18 Listings</div>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">Within 150 km regional radius</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Cost Savings</span>
          <div className="text-2xl font-bold text-emerald-700 mt-2">32.4%</div>
          <span className="text-xs text-slate-500 mt-1 block">vs virgin polymer/metals</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scope 3 Abatement</span>
          <div className="text-2xl font-bold text-sky-700 mt-2">142 tCO₂e</div>
          <span className="text-xs text-slate-500 mt-1 block">Avoided carbon impact</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Supply Contracts</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">3 Contracts</div>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">All dispatching on schedule</span>
        </div>
      </div>

      {/* Featured Verified Streams */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Available Verified Industrial Feedstocks
            </h2>
            <p className="text-xs text-slate-500">
              Spectroscopically verified secondary raw materials ready for immediate dispatch
            </p>
          </div>
          <Link to="/buyer/find-waste" className="text-emerald-700 hover:text-emerald-800 text-xs font-semibold flex items-center gap-1">
            <span>Browse Full Catalog</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={DEMO_CURRENT_LISTING.image_url}
              alt="Listing"
              className="w-16 h-16 rounded-lg object-cover border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                  94.2% Spectroscopic Match
                </span>
                <span className="text-slate-500 text-xs font-medium">{DEMO_CURRENT_LISTING.location}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-1">
                {DEMO_CURRENT_LISTING.material} ({DEMO_CURRENT_LISTING.quantity} {DEMO_CURRENT_LISTING.unit})
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Purity: 91.8% • Moisture: &lt;1.2% • Cadence: {DEMO_CURRENT_LISTING.generation_frequency}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/buyer/matches"
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs"
            >
              Examine Match Rationale
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
