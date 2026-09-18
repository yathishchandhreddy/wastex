import React from 'react';
import { PageHeader } from '@/src/components/layout/PageHeader';
import { DEMO_DATA_BADGE } from '@/src/data/demo';

export const BuyerRequestsPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full px-4 md:px-6 py-6 gap-6 max-w-5xl mx-auto">
      <PageHeader
        nodeTag="Procurement Fulfillment Desk"
        statusTag="Bilateral Exchange Channel"
        title="Procurement Orders & Specimen Inquiries"
        description="Monitor status of your industrial purchase orders, sample testing dispatches, and material certificates."
        badge={DEMO_DATA_BADGE}
      />

      <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-xs flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-slate-100 gap-2">
          <div>
            <span className="text-xs font-semibold text-slate-500">ORDER #BUY-2026-091</span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              12.5 MT PET Scrap Flakes from Pune Manufacturing Facility 04
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            Awaiting Logistics Dispatch
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Logistics carrier assigned. Certified chain-of-custody documentation attached. Expected arrival at Vadodara processing facility on Tuesday, 09:00 IST.
        </p>
      </div>
    </div>
  );
};
