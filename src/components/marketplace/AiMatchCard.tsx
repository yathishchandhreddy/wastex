import React, { useState } from 'react';
import type { WasteMatch } from '@/src/types';

interface AiMatchCardProps {
  match: WasteMatch;
  onViewMaterial: (match: WasteMatch) => void;
  onContact?: (match: WasteMatch) => void;
}

export const AiMatchCard: React.FC<AiMatchCardProps> = ({
  match,
  onViewMaterial,
  onContact,
}) => {
  const [showScoreDetails, setShowScoreDetails] = useState(false);

  const roundedScore = Math.round(match.match_score);
  const req = match.requirement;

  return (
    <div
      id={`ai-match-card-${match.id}`}
      className="bg-white rounded-xl border border-slate-200 hover:border-emerald-500/50 p-5 shadow-xs flex flex-col justify-between gap-4 transition-all"
    >
      <div>
        {/* Top Header: AI Match Badge + Percentage */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            </span>
            <div>
              <span className="text-xs font-extrabold text-slate-900 block leading-tight">
                AI Match
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {req?.buyer_company || match.buyer_type || 'Industrial Offtaker'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
            <span className="text-sm font-black text-emerald-800">{roundedScore}%</span>
            <span className="text-[11px] font-bold text-emerald-700">Match</span>
          </div>
        </div>

        {/* Material & Target Specs */}
        <div className="mt-3">
          <h4 className="text-sm font-bold text-slate-900">
            {req?.material || 'Secondary Polymer Regrind Feedstock'}
          </h4>
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-slate-400">inventory_2</span>
              <span>
                Need: {req?.min_quantity || 10} - {req?.max_quantity || 50} {req?.unit || 'MT'}
              </span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-slate-400">location_on</span>
              <span>{req?.location || 'Regional Cluster'}</span>
            </span>
          </div>
        </div>

        {/* Why section (Section 8 Requirement) */}
        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
            Why?
          </span>
          <ul className="space-y-1 text-xs text-slate-700 font-semibold">
            <li className="flex items-center gap-1.5 text-emerald-800">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
              <span>Material matches requirements</span>
            </li>
            <li className="flex items-center gap-1.5 text-emerald-800">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
              <span>Quantity matches available volume</span>
            </li>
            <li className="flex items-center gap-1.5 text-emerald-800">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
              <span>Location is within nearby logistics radius</span>
            </li>
            <li className="flex items-center gap-1.5 text-emerald-800">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
              <span>Price is within target benchmark</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Action CTA & Detailed Scores Toggle */}
      <div className="pt-2 flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onViewMaterial(match)}
            className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
          >
            <span>View Material</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
          {onContact && (
            <button
              type="button"
              onClick={() => onContact(match)}
              className="py-2 px-3 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">chat</span>
              <span>Connect</span>
            </button>
          )}
        </div>

        {/* Detailed Scores Expandable (Section 8 Requirement) */}
        <div>
          <button
            type="button"
            onClick={() => setShowScoreDetails(!showScoreDetails)}
            className="w-full text-center text-[11px] font-semibold text-slate-400 hover:text-slate-700 py-1 flex items-center justify-center gap-1 transition-colors"
          >
            <span>{showScoreDetails ? 'Hide match breakdown' : 'See Match Details'}</span>
            <span className="material-symbols-outlined text-[14px]">
              {showScoreDetails ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {showScoreDetails && (
            <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs grid grid-cols-3 gap-2 animate-in fade-in">
              <div>
                <span className="text-slate-400 text-[10px] block">Material:</span>
                <span className="font-bold text-slate-800">{match.material_score}%</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Quantity:</span>
                <span className="font-bold text-slate-800">{match.quantity_score}%</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Quality:</span>
                <span className="font-bold text-slate-800">{match.quality_score}%</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Location:</span>
                <span className="font-bold text-slate-800">{match.location_score}%</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Price:</span>
                <span className="font-bold text-slate-800">{match.price_score}%</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Frequency:</span>
                <span className="font-bold text-slate-800">{match.frequency_score}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
