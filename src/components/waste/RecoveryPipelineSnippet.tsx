import React from 'react';
import { Link } from 'react-router-dom';

interface RecoveryPipelineSnippetProps {
  pipelineTitle?: string;
  pathwayUrl?: string;
}

export const RecoveryPipelineSnippet: React.FC<RecoveryPipelineSnippetProps> = ({
  pipelineTitle = 'Mechanical De-polymerization → Resin Flake',
  pathwayUrl = '/app/valorize',
}) => {
  return (
    <Link
      to={pathwayUrl}
      className="w-full rounded-xl bg-white p-4 flex items-center justify-between shadow-xs border border-slate-200 hover:border-emerald-400 hover:shadow-sm transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
          <span className="material-symbols-outlined text-[20px]">alt_route</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Recommended Valorization Pathway
          </span>
          <span className="text-xs font-bold text-slate-900">
            {pipelineTitle}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
        <span>Evaluate Techno-Economics</span>
        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
      </div>
    </Link>
  );
};
