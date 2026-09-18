import React from 'react';

interface InferenceBannerProps {
  statusText?: string;
  confidenceScore?: number;
  materialName?: string;
  description?: string;
}

export const InferenceBanner: React.FC<InferenceBannerProps> = ({
  statusText = 'AI Material Classification Complete',
  confidenceScore = 94.2,
  materialName = 'PET Polymer Industrial Scrap Bale',
  description = 'Spectroscopy match: Resinate ISO-1043 Polyethylene Terephthalate with 98.2% spectral resonance alignment.',
}) => {
  return (
    <div className="w-full rounded-xl bg-emerald-50/80 p-4 shadow-xs flex flex-col gap-2 border border-emerald-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-emerald-700">verified</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            {statusText}
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs">
          {confidenceScore}% AI Confidence
        </span>
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-900">
          {materialName}
        </h4>
        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
      {/* AI Confidence Bar */}
      <div className="w-full bg-emerald-200/70 rounded-full h-1.5 mt-1 overflow-hidden">
        <div
          className="bg-emerald-600 h-1.5 rounded-full transition-all duration-700"
          style={{ width: `${confidenceScore}%` }}
        />
      </div>
    </div>
  );
};
