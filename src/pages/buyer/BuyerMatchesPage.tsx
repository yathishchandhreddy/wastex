import React from 'react';
import { PageHeader } from '@/src/components/layout/PageHeader';
import { DEMO_MATCHES, DEMO_DATA_BADGE } from '@/src/data/demo';

export const BuyerMatchesPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full px-4 md:px-6 py-6 gap-6 max-w-5xl mx-auto">
      <PageHeader
        nodeTag="Procurement Matching Desk"
        statusTag="High-Compatibility Algorithms"
        title="Feedstock Synergy & Compatibility Matches"
        description="Ranked generator byproducts matching your active procurement requirements based on composition, distance, and volumes."
        badge={DEMO_DATA_BADGE}
      />

      <div className="flex flex-col gap-4">
        {DEMO_MATCHES.map((m) => (
          <div key={m.id} className="rounded-xl bg-white border border-slate-200 p-5 shadow-xs flex flex-col gap-3">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  {m.match_score}% Compatibility Index
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  Pune Manufacturing Facility 04 • Industrial PET Scrap Flakes
                </h3>
                <span className="text-xs text-slate-500">12.5 MT batch • Recurring bi-weekly</span>
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Submit Supply Bid</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{m.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
