import React from 'react';
import type { FieldProvenance } from '@/src/types/wasteAnalysis';

interface ProvenanceTagProps {
  type: FieldProvenance;
  className?: string;
  onVerify?: () => void;
}

export const ProvenanceTag: React.FC<ProvenanceTagProps> = ({ type, className = '', onVerify }) => {
  if (type === 'Verified') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
        title="Confirmed by plant engineer or laboratory certification"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Verified
      </span>
    );
  }

  if (type === 'User Provided') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 ${className}`}
        title="Information directly declared by the industrial generator"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        User Provided
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 ${className}`}
      title="Inferred by Gemini multimodal AI model"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
      AI Estimated
      {onVerify && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onVerify();
          }}
          className="ml-1 text-[10px] text-emerald-700 underline hover:text-emerald-800 font-semibold cursor-pointer"
        >
          Verify
        </button>
      )}
    </span>
  );
};
