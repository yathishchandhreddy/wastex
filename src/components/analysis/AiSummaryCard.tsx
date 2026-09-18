import React from 'react';
import type { StructuredGeminiAnalysisResponse, FieldProvenance } from '@/src/types/wasteAnalysis';
import { ProvenanceTag } from './ProvenanceTag';

interface AiSummaryCardProps {
  data: StructuredGeminiAnalysisResponse;
  provenance: Record<string, FieldProvenance>;
  isVerified?: boolean;
  onVerifyAll?: () => void;
}

export const AiSummaryCard: React.FC<AiSummaryCardProps> = ({
  data,
  provenance,
  isVerified,
  onVerifyAll,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            AI ANALYSIS SUMMARY
          </h3>
          <p className="text-[11px] text-slate-500">
            Technical synthesis for industrial waste classification and recycling viability
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProvenanceTag type={provenance.analysis_summary || 'AI Estimated'} />
          {isVerified ? (
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              ✓ Engineer Certified
            </span>
          ) : (
            onVerifyAll && (
              <button
                type="button"
                onClick={onVerifyAll}
                className="px-2.5 py-1 rounded text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
              >
                Verify Entire Analysis
              </button>
            )
          )}
        </div>
      </div>

      {/* Summary Content */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4 text-xs text-slate-800 leading-relaxed font-normal">
        <p className="whitespace-pre-line">{data.analysis_summary}</p>
      </div>
    </div>
  );
};
