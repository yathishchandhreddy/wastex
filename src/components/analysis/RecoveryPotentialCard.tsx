import React from 'react';
import type { StructuredGeminiAnalysisResponse, FieldProvenance } from '@/src/types/wasteAnalysis';
import { ProvenanceTag } from './ProvenanceTag';

interface RecoveryPotentialCardProps {
  data: StructuredGeminiAnalysisResponse;
  provenance: Record<string, FieldProvenance>;
  onVerifyField?: (fieldKey: string) => void;
}

export const RecoveryPotentialCard: React.FC<RecoveryPotentialCardProps> = ({
  data,
  provenance,
  onVerifyField,
}) => {
  const isNonRecyclable =
    data.recyclability_tier?.toLowerCase().includes('non') ||
    data.reuse_potential?.toLowerCase().includes('none') ||
    data.recovery_potential?.toLowerCase().includes('none') ||
    data.recommended_next_step?.toLowerCase().includes('disposal') ||
    data.recommended_next_step?.toLowerCase().includes('incinerat');

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            RECOVERY POTENTIAL
          </h3>
          <p className="text-[11px] text-slate-500">
            Circular valorization feasibility and technological readiness
          </p>
        </div>
        <ProvenanceTag
          type={provenance.recyclability_tier || 'AI Estimated'}
          onVerify={onVerifyField ? () => onVerifyField('recyclability_tier') : undefined}
        />
      </div>

      {/* Recyclability Tier Badge */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-slate-700">Recyclability Tier:</span>
        <div
          className={`px-3 py-2 rounded-lg border flex items-center justify-between text-xs font-bold ${
            isNonRecyclable
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isNonRecyclable ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
            />
            <span className="text-sm">{data.recyclability_tier}</span>
          </div>
          <span className="text-[11px] font-medium opacity-80">
            {isNonRecyclable ? 'Disposal Track' : 'Circular Valorization Ready'}
          </span>
        </div>
      </div>

      {/* Reuse and Recovery Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Reuse Potential */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Reuse Potential
            </span>
            <ProvenanceTag
              type={provenance.reuse_potential || 'AI Estimated'}
              onVerify={onVerifyField ? () => onVerifyField('reuse_potential') : undefined}
            />
          </div>
          <span className="text-base font-bold text-slate-900">{data.reuse_potential}</span>
          <p className="text-[11px] text-slate-500">
            Direct remanufacturing or closed-loop industrial reuse suitability
          </p>
        </div>

        {/* Recovery Potential */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Recovery Potential
            </span>
            <ProvenanceTag
              type={provenance.recovery_potential || 'AI Estimated'}
              onVerify={onVerifyField ? () => onVerifyField('recovery_potential') : undefined}
            />
          </div>
          <span className="text-base font-bold text-slate-900">{data.recovery_potential}</span>
          <p className="text-[11px] text-slate-500">
            Chemical, mechanical, or thermal secondary conversion potential
          </p>
        </div>
      </div>

      {/* Recommended Next Step Guidance */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-slate-700">Recommended Next Action:</span>
        <p className="text-xs text-slate-900 font-medium leading-relaxed">
          {data.recommended_next_step || 'Proceed to valorization pathway modeling.'}
        </p>
      </div>
    </div>
  );
};
