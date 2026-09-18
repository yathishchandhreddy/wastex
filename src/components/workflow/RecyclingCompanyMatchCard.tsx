import React from 'react';
import type { RecyclingCompany } from '@/src/types/recycledMarketplace';

interface RecyclingCompanyMatchCardProps {
  company: RecyclingCompany;
  isSelected?: boolean;
  onSelect: (company: RecyclingCompany) => void;
  onStartProcess: (company: RecyclingCompany) => void;
}

export const RecyclingCompanyMatchCard: React.FC<RecyclingCompanyMatchCardProps> = ({
  company,
  isSelected,
  onSelect,
  onStartProcess,
}) => {
  return (
    <div
      className={`rounded-2xl border transition-all p-5 flex flex-col justify-between gap-4 ${
        isSelected
          ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
          : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'
      }`}
    >
      <div className="flex flex-col gap-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              {company.category}
            </span>
            {company.is_verified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>Verified Recycler</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
            <span>★</span>
            <span>{company.rating}</span>
            <span className="text-[10px] text-slate-400 font-normal">({company.reviews_count})</span>
          </div>
        </div>

        {/* Company Name & Location */}
        <div>
          <h4 className="text-base font-extrabold text-slate-900 leading-snug">
            {company.name}
          </h4>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-slate-400">location_on</span>
            <span>{company.location} ({company.distance_km} km away)</span>
          </p>
        </div>

        {/* Processing Technology */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
          <div className="text-[10px] font-bold uppercase text-slate-400">Technology & Output</div>
          <div className="font-bold text-slate-800 mt-0.5">{company.processing_type}</div>
          <div className="text-emerald-700 font-semibold text-[11px] mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">autorenew</span>
            <span>Output: {company.resulting_product_name}</span>
          </div>
        </div>

        {/* Specialization Tags */}
        <div className="flex flex-wrap gap-1.5">
          {company.specialization.map((spec, i) => (
            <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
              {spec}
            </span>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Intake Capacity</span>
            <span className="font-bold text-slate-800">{company.min_intake} - {company.max_intake} {company.unit}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Turnaround Time</span>
            <span className="font-bold text-slate-800">~{company.estimated_processing_days} Days</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onSelect(company)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isSelected
              ? 'bg-slate-200 text-slate-800'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          {isSelected ? 'Selected' : 'View Profile'}
        </button>

        <button
          type="button"
          onClick={() => onStartProcess(company)}
          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">play_arrow</span>
          <span>Start Recycling</span>
        </button>
      </div>
    </div>
  );
};
