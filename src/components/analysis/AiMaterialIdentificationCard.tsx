import React from 'react';
import type { StructuredGeminiAnalysisResponse, FieldProvenance } from '@/src/types/wasteAnalysis';
import { ProvenanceTag } from './ProvenanceTag';

interface AiMaterialIdentificationCardProps {
  data: StructuredGeminiAnalysisResponse;
  provenance: Record<string, FieldProvenance>;
  onVerifyField?: (fieldKey: string) => void;
}

export const AiMaterialIdentificationCard: React.FC<AiMaterialIdentificationCardProps> = ({
  data,
  provenance,
  onVerifyField,
}) => {
  const isLowConfidence = data.confidence < 70;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
            AI
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              AI MATERIAL IDENTIFICATION
            </h3>
            <p className="text-[11px] text-slate-500">
              Taxonomy classification and confidence metric derived by Gemini AI
            </p>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex flex-col items-end">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isLowConfidence
                ? 'bg-amber-50 text-amber-800 border border-amber-300'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLowConfidence ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
            <span>{data.confidence}% AI confidence</span>
          </div>
        </div>
      </div>

      {/* Low Confidence Warning Note if <70% */}
      {isLowConfidence && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg text-xs text-amber-900 flex items-start gap-2">
          <span className="font-bold">Notice:</span>
          <span>
            Low confidence — additional material testing recommended before downstream procurement or industrial recycling commitment.
          </span>
        </div>
      )}

      {/* Grid of Classification Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Identified Material */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Identified Material
            </span>
            <ProvenanceTag
              type={provenance.material || 'AI Estimated'}
              onVerify={onVerifyField ? () => onVerifyField('material') : undefined}
            />
          </div>
          <span className="text-sm font-bold text-slate-900">{data.material || 'Undetermined'}</span>
        </div>

        {/* 14-Category Taxonomy */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Taxonomy Category
            </span>
            <ProvenanceTag
              type={provenance.category || 'AI Estimated'}
              onVerify={onVerifyField ? () => onVerifyField('category') : undefined}
            />
          </div>
          <span className="text-sm font-bold text-slate-900">{data.category}</span>
        </div>

        {/* Subcategory / Subtype */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Industrial Subtype
            </span>
            <ProvenanceTag
              type={provenance.subcategory || 'AI Estimated'}
              onVerify={onVerifyField ? () => onVerifyField('subcategory') : undefined}
            />
          </div>
          <span className="text-sm font-bold text-slate-900">{data.subcategory || 'Standard fraction'}</span>
        </div>
      </div>

      {/* Required Explanatory Disclaimer */}
      <p className="text-[11px] text-slate-500 italic bg-slate-50/60 px-3 py-1.5 rounded border border-slate-200/60">
        * AI confidence reflects model confidence in the classification and does not represent laboratory verification.
      </p>
    </div>
  );
};
