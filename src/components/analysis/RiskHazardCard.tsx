import React from 'react';
import type { StructuredGeminiAnalysisResponse, FieldProvenance } from '@/src/types/wasteAnalysis';
import { ProvenanceTag } from './ProvenanceTag';

interface RiskHazardCardProps {
  data: StructuredGeminiAnalysisResponse;
  provenance: Record<string, FieldProvenance>;
  onVerifyField?: (fieldKey: string) => void;
}

export const RiskHazardCard: React.FC<RiskHazardCardProps> = ({
  data,
  provenance,
  onVerifyField,
}) => {
  const hasHazards = data.hazard_indicators && data.hazard_indicators.length > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
              hasHazards ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            !
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              RISK / HAZARD INDICATORS
            </h3>
            <p className="text-[11px] text-slate-500">
              Safety screening, handling precautions, and regulatory compliance flags
            </p>
          </div>
        </div>
        <ProvenanceTag
          type={provenance.hazard_indicators || 'AI Estimated'}
          onVerify={onVerifyField ? () => onVerifyField('hazard_indicators') : undefined}
        />
      </div>

      {/* Hazard Indicators */}
      {hasHazards ? (
        <div className="flex flex-col gap-2.5">
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-900 flex flex-col gap-2">
            <span className="font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              Potential Hazardous Properties Flagged:
            </span>
            <ul className="space-y-1 pl-3.5 list-disc text-rose-800">
              {data.hazard_indicators.map((hazard, i) => (
                <li key={i} className="font-medium">
                  {hazard}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            * Strict manifest protocols, SDS documentation, and specialized licensed transport required.
          </p>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 text-xs text-emerald-900 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
          <span>
            <strong>Non-Hazardous Baseline:</strong> No immediate toxic, corrosive, or flammable hazards detected in the declared waste manifest.
          </span>
        </div>
      )}
    </div>
  );
};
