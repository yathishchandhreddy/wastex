import React from 'react';
import type { StructuredGeminiAnalysisResponse, FieldProvenance } from '@/src/types/wasteAnalysis';
import { ProvenanceTag } from './ProvenanceTag';

interface MaterialCharacterizationCardProps {
  data: StructuredGeminiAnalysisResponse;
  provenance: Record<string, FieldProvenance>;
  onVerifyField?: (fieldKey: string) => void;
}

export const MaterialCharacterizationCard: React.FC<MaterialCharacterizationCardProps> = ({
  data,
  provenance,
  onVerifyField,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            MATERIAL CHARACTERIZATION
          </h3>
          <p className="text-[11px] text-slate-500">
            Compositional estimate, moisture assessment, and physical attributes
          </p>
        </div>
        <ProvenanceTag
          type={provenance.composition_estimate || 'AI Estimated'}
          onVerify={onVerifyField ? () => onVerifyField('composition_estimate') : undefined}
        />
      </div>

      {/* Composition Breakdown */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-semibold text-slate-700">Composition Estimate Breakdown:</span>
        {data.composition_estimate && data.composition_estimate.length > 0 ? (
          <div className="space-y-2">
            {data.composition_estimate.map((comp, idx) => {
              const pct = typeof comp.estimated_percentage === 'number' ? comp.estimated_percentage : null;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{comp.component}</span>
                    <div className="flex items-center gap-3">
                      {comp.confidence ? (
                        <span className="text-[11px] text-slate-500 font-medium">
                          {comp.confidence}% confidence
                        </span>
                      ) : null}
                      <span className="font-bold text-slate-900 font-mono">
                        {pct !== null ? `${pct}%` : 'Estimate Pending'}
                      </span>
                    </div>
                  </div>
                  {pct !== null && (
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            No specific compositional breakdown available from available sensory data.
          </p>
        )}
      </div>

      {/* Physical Characteristics & Moisture Assessment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
        {/* Physical Characteristics */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-700">Physical Characteristics:</span>
          {data.physical_characteristics && data.physical_characteristics.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {data.physical_characteristics.map((char, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {char}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-slate-500 italic">Standard bulk industrial format</span>
          )}
        </div>

        {/* Moisture Assessment */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-700">Moisture Assessment:</span>
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-800">
              {data.moisture_assessment || 'Ambient moisture baseline'}
            </span>
            <ProvenanceTag
              type={provenance.moisture_assessment || 'AI Estimated'}
              onVerify={onVerifyField ? () => onVerifyField('moisture_assessment') : undefined}
            />
          </div>
        </div>
      </div>

      {/* Contaminant Indicators */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
        <span className="text-xs font-semibold text-slate-700">Contaminant Indicators:</span>
        {data.contaminants && data.contaminants.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.contaminants.map((contam, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {contam}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200 inline-block w-fit">
            ✓ No major physical or chemical contaminants flagged by AI inspection.
          </span>
        )}
      </div>
    </div>
  );
};
