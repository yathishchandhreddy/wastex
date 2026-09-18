import React from 'react';
import { PageHeader } from '@/src/components/layout/PageHeader';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const CHART_DATA = [
  { month: 'Apr', volumeMT: 22, carbonAvoided: 32 },
  { month: 'May', volumeMT: 28, carbonAvoided: 41 },
  { month: 'Jun', volumeMT: 35, carbonAvoided: 52 },
  { month: 'Jul', volumeMT: 31, carbonAvoided: 46 },
  { month: 'Aug', volumeMT: 44, carbonAvoided: 65 },
  { month: 'Sep', volumeMT: 52, carbonAvoided: 76 },
];

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full px-margin pb-space-xl gap-space-lg select-none max-w-4xl mx-auto">
      <PageHeader
        nodeTag="Circularity Telemetry"
        statusTag="Audited Data Stream"
        title="Industrial Yield Analytics"
        description="Historic byproduct diversion, GHG emission avoidance credits, and economic recovery yields."
      />

      <div className="bg-[#0D131A] border border-[#1D2836] p-space-lg rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-headline-md text-base text-[#F4F7FA] font-bold">
              Carbon Avoidance & Throughput (tCO2e)
            </h3>
            <p className="font-body-sm text-xs text-[#6F8299]">
              Certified Scope 3 circularity credit projections
            </p>
          </div>
          <span className="px-2 py-1 rounded bg-[#00E599]/10 text-[#00E599] font-label-sm text-xs font-bold">
            +38.5% YoY
          </span>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E599" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00E599" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#6F8299" fontSize={11} />
              <YAxis stroke="#6F8299" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0D131A', borderColor: '#1D2836', color: '#F4F7FA', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="carbonAvoided" stroke="#00E599" strokeWidth={2} fillOpacity={1} fill="url(#colorCarbon)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
