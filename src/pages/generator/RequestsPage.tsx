import React from 'react';
import { PageHeader } from '@/src/components/layout/PageHeader';
import { DEMO_DATA_BADGE } from '@/src/data/demo';

export const RequestsPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full px-4 md:px-6 py-6 gap-6 max-w-5xl mx-auto">
      <PageHeader
        nodeTag="Commercial Contracts"
        statusTag="Bilateral Negotiation Active"
        title="Industrial Trade & Allocation Requests"
        description="Formal off-take inquiries, bilateral contracting terms, specimen validation, and logistics protocols."
        badge={DEMO_DATA_BADGE}
      />

      <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                REQUEST #TR-2026-084
              </span>
              <span className="text-xs text-slate-400">• Received 2 hours ago</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1.5">
              Apex Circular Synthetics Corp ↔ Pune Manufacturing Facility 04
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
            Pending Generator Review
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Requested Allocation</span>
            <div className="text-sm font-bold text-slate-900 mt-1">12.5 MT / Fortnight</div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Offered Benchmark Price</span>
            <div className="text-sm font-bold text-emerald-700 mt-1">$1,240 / MT</div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Fulfillment Incoterm</span>
            <div className="text-sm font-bold text-slate-900 mt-1">Ex-Works (Pune Facility)</div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Material Specimen</span>
            <div className="text-sm font-bold text-sky-700 mt-1">PET-POLY-0982-A (91.8%)</div>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <span className="font-bold text-slate-900">Procurement Note from Buyer:</span> &quot;We reviewed your spectral scan, TRL ranking, and ISO-1043 verification data. We wish to establish a recurring 12.5 MT bi-weekly feedstock allocation at $1,240/MT on Ex-Works terms.&quot;
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Estimated Gross Value: <strong className="text-slate-900">$15,500 / batch</strong>
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-all"
            >
              Counter-Offer
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Accept & Issue Dispatch Manifest</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
