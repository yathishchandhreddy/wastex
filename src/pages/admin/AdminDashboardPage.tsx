import React from 'react';
import { PageHeader } from '@/src/components/layout/PageHeader';

interface AdminSubPageProps {
  title?: string;
  description?: string;
  category?: string;
}

export const AdminDashboardPage: React.FC<AdminSubPageProps> = ({
  title = 'Grid Infrastructure & Network Operations',
  description = 'Platform-wide circular economy operations, verified industrial facilities, and regional material transaction volume.',
  category = 'Network Operations',
}) => {
  return (
    <div className="flex flex-col w-full px-4 md:px-6 py-6 gap-6 max-w-6xl mx-auto">
      <PageHeader
        nodeTag="Central Network Controller"
        statusTag="All Systems Operational"
        title={title}
        description={description}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Generator Facilities</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">142</div>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">99.8% verification telemetry uptime</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Circular Buyers</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">89</div>
          <span className="text-xs text-sky-700 font-medium mt-1 block">Certified industrial offtakers</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Feedstock Diverted</span>
          <div className="text-2xl font-bold text-emerald-700 mt-2">4,820 MT</div>
          <span className="text-xs text-slate-500 mt-1 block">Landfill diversion rate: 92.4%</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scope 3 Abatement</span>
          <div className="text-2xl font-bold text-sky-700 mt-2">7,140 tCO₂e</div>
          <span className="text-xs text-slate-500 mt-1 block">Verified ESG carbon offsets</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {category} • Real-time Facility Stream Activity
            </h2>
            <p className="text-xs text-slate-500">Live feedstocks verified across regional manufacturing clusters</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            Telemetry Live
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="py-2.5 px-3">Facility Node</th>
                <th className="py-2.5 px-3">Material Stream</th>
                <th className="py-2.5 px-3">Quantity</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">AI Confidence</th>
                <th className="py-2.5 px-3 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-3 font-semibold text-slate-900">NODE-IN-GJ-04 (Pune Alpha)</td>
                <td className="py-3 px-3">PET Polymer Scrap Flakes</td>
                <td className="py-3 px-3 font-bold text-slate-900">12.5 MT</td>
                <td className="py-3 px-3"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold text-[11px] border border-emerald-200">● Matched</span></td>
                <td className="py-3 px-3 font-semibold text-emerald-700">94.2%</td>
                <td className="py-3 px-3 text-right"><button type="button" className="text-emerald-700 hover:text-emerald-800 font-semibold">Inspect</button></td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-3 font-semibold text-slate-900">NODE-IN-MH-12 (Jamshedpur)</td>
                <td className="py-3 px-3">Blast Furnace GGBS Slag</td>
                <td className="py-3 px-3 font-bold text-slate-900">120.0 MT</td>
                <td className="py-3 px-3"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold text-[11px] border border-amber-200">● In Review</span></td>
                <td className="py-3 px-3 font-semibold text-emerald-700">96.1%</td>
                <td className="py-3 px-3 text-right"><button type="button" className="text-emerald-700 hover:text-emerald-800 font-semibold">Inspect</button></td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-3 font-semibold text-slate-900">NODE-IN-KA-09 (Bengaluru)</td>
                <td className="py-3 px-3">Spent Battery Black Mass</td>
                <td className="py-3 px-3 font-bold text-slate-900">4.2 MT</td>
                <td className="py-3 px-3"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 text-sky-800 font-semibold text-[11px] border border-sky-200">● Negotiating</span></td>
                <td className="py-3 px-3 font-semibold text-emerald-700">91.8%</td>
                <td className="py-3 px-3 text-right"><button type="button" className="text-emerald-700 hover:text-emerald-800 font-semibold">Inspect</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
