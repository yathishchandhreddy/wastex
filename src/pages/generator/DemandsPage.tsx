import React from 'react';
import { PageHeader } from '@/src/components/layout/PageHeader';
import { DEMO_DEMAND_INSIGHTS, DEMO_DATA_BADGE } from '@/src/data/demo';

export const DemandsPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full px-4 md:px-6 py-6 gap-6 max-w-5xl mx-auto">
      <PageHeader
        nodeTag="Market Intelligence"
        statusTag="Regional Indices Synced"
        title="Industrial Circular Demand & Benchmark Pricing"
        description="Aggregated secondary commodity benchmark pricing, volume demand trajectories, and commercial offtaker applications."
        badge={DEMO_DATA_BADGE}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {DEMO_DEMAND_INSIGHTS.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                  {item.category}
                </span>
                <span className="flex items-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  +{item.growth_rate_pct}% YoY
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-3">
                {item.material}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Market Corridor: {item.region}
              </p>

              <div className="my-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Secondary Benchmark Spot
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl font-bold text-slate-900">
                    ${item.average_price_per_unit}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {item.currency} / {item.unit}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Target Industrial Sectors
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {item.top_applications.map((app) => (
                    <span
                      key={app}
                      className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-medium">
              <span>Index Confidence: {item.confidence_score}%</span>
              <span>Updated: {item.last_updated}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
