import React from 'react';

interface SpectralCompositionCardProps {
  resonanceLabel?: string;
  resonanceProfile?: string;
  primaryMaterial?: string;
  purityPct?: number;
  moistureRatio?: string;
  contaminantsPct?: string;
  contaminantsDesc?: string;
  recyclabilityTier?: string;
  carbonAvoidance?: number;
}

export const SpectralCompositionCard: React.FC<SpectralCompositionCardProps> = ({
  resonanceLabel = 'NIR 1450nm Spectral Range',
  resonanceProfile = 'λ 1660 cm⁻¹ (C=O Carbonyl Stretch)',
  primaryMaterial = 'Polyethylene Terephthalate (PET)',
  purityPct = 91.8,
  moistureRatio = '< 1.2%',
  contaminantsPct = '0.4%',
  contaminantsDesc = 'Trace non-hazardous organic fraction',
  recyclabilityTier = 'Grade A (Primary)',
  carbonAvoidance = 18.4,
}) => {
  return (
    <div className="w-full rounded-xl bg-white p-5 flex flex-col gap-4 shadow-xs border border-slate-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">
              analytics
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Spectrometric Composition Analysis
            </h3>
            <p className="text-xs text-slate-500">
              Lab-verified characterization of molecular matrix
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline-block">
          {resonanceLabel}
        </span>
      </div>

      {/* SVG Waveform Absorbance Profile */}
      <div className="w-full bg-slate-50 rounded-lg p-3 flex flex-col gap-1.5 border border-slate-200">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-700">Resonance Absorbance Curve</span>
          <span className="text-emerald-700 font-mono text-[11px] font-medium">
            {resonanceProfile}
          </span>
        </div>
        <div className="w-full h-16 overflow-hidden flex items-end">
          <svg className="w-full h-full text-emerald-600" preserveAspectRatio="none" viewBox="0 0 320 60">
            <defs>
              <linearGradient id="specGlowB2B" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M0,45 Q20,44 40,43 T80,41 T110,25 T130,5 T150,38 T190,40 T220,18 T240,35 T280,42 L320,44 L320,60 L0,60 Z"
              fill="url(#specGlowB2B)"
            />
            <path
              d="M0,45 Q20,44 40,43 T80,41 T110,25 T130,5 T150,38 T190,40 T220,18 T240,35 T280,42 L320,44"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Parameter Breakdown Matrix */}
      <div className="flex flex-col gap-3">
        {/* Item 1: Material Purity */}
        <div className="flex flex-col gap-1.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-semibold text-slate-800">
                {primaryMaterial}
              </span>
              <p className="text-[11px] text-slate-500">Polymer purity threshold</p>
            </div>
            <span className="text-sm font-bold text-emerald-700">
              {purityPct}% Purity
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full"
              style={{ width: `${purityPct}%` }}
            />
          </div>
        </div>

        {/* Dual Metric Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3.5 rounded-lg flex flex-col justify-between gap-1 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Moisture Content
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-lg font-bold text-slate-900">
                {moistureRatio}
              </span>
              <span className="material-symbols-outlined text-[16px] text-emerald-600">
                check_circle
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Within extrusion limits
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg flex flex-col justify-between gap-1 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Contaminants
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-bold text-amber-700">
                {contaminantsPct}
              </span>
              <span className="text-[11px] text-slate-500">by weight</span>
            </div>
            <span className="text-[11px] text-slate-500 truncate">
              {contaminantsDesc}
            </span>
          </div>
        </div>

        {/* Circularity & Impact Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3.5 rounded-lg flex flex-col gap-1 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Valorization Grade
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-base font-bold text-emerald-700">
                {recyclabilityTier}
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Direct bottle-to-bottle pelletizing
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg flex flex-col gap-1 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Abatement Factor
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-bold text-sky-700">
                {carbonAvoidance}
              </span>
              <span className="text-xs font-semibold text-slate-700">
                tCO₂e
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Avoidance vs virgin PET polymer
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
