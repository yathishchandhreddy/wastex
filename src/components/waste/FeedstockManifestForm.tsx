import React from 'react';

interface FeedstockManifestFormProps {
  quantity: string;
  onQuantityChange: (val: string) => void;
  grade: string;
  onGradeChange: (val: string) => void;
  frequency: string;
  onFrequencyChange: (val: string) => void;
  originNode: string;
  onOriginNodeChange: (val: string) => void;
  quantityInputRef?: React.RefObject<HTMLInputElement | null>;
}

export const FeedstockManifestForm: React.FC<FeedstockManifestFormProps> = ({
  quantity,
  onQuantityChange,
  grade,
  onGradeChange,
  frequency,
  onFrequencyChange,
  originNode,
  onOriginNodeChange,
  quantityInputRef,
}) => {
  return (
    <div className="w-full rounded-xl bg-white p-5 flex flex-col gap-4 shadow-xs border border-slate-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">
              assignment
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Feedstock Manifest & Production Parameters
            </h3>
            <p className="text-xs text-slate-500">
              Verify batch volumes, quality grades, and dispatch logistics
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
          Editable by Generator
        </span>
      </div>

      {/* Field Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quantity Metric Input Block */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label
            className="text-xs font-semibold text-slate-700"
            htmlFor="quantity-input"
          >
            Batch Quantity & Measurement Unit
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600 transition-all">
              <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">
                scale
              </span>
              <input
                ref={quantityInputRef}
                className="bg-transparent text-slate-900 font-bold text-base w-full focus:outline-none"
                id="quantity-input"
                type="text"
                value={quantity}
                onChange={(e) => onQuantityChange(e.target.value)}
              />
            </div>
            <div className="w-40 flex items-center justify-center bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700">
              Metric Tons (MT)
            </div>
          </div>
        </div>

        {/* Grade / Purity Spec */}
        <div className="flex flex-col gap-1.5">
          <label
            className="text-xs font-semibold text-slate-700"
            htmlFor="grade-input"
          >
            Physical State & Purity Grade
          </label>
          <div className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600 transition-all">
            <span className="material-symbols-outlined text-emerald-600 text-[18px] mr-2">
              verified
            </span>
            <input
              className="bg-transparent text-slate-900 text-xs font-medium w-full focus:outline-none"
              id="grade-input"
              type="text"
              value={grade}
              onChange={(e) => onGradeChange(e.target.value)}
            />
          </div>
        </div>

        {/* Generation Cadence */}
        <div className="flex flex-col gap-1.5">
          <label
            className="text-xs font-semibold text-slate-700"
            htmlFor="freq-input"
          >
            Generation Cadence
          </label>
          <div className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600 transition-all">
            <span className="material-symbols-outlined text-sky-600 text-[18px] mr-2">
              schedule
            </span>
            <input
              className="bg-transparent text-slate-900 text-xs font-medium w-full focus:outline-none"
              id="freq-input"
              type="text"
              value={frequency}
              onChange={(e) => onFrequencyChange(e.target.value)}
            />
          </div>
        </div>

        {/* Facility Origin Location Node */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label
            className="text-xs font-semibold text-slate-700"
            htmlFor="origin-input"
          >
            Facility Dispatch Location
          </label>
          <div className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600 transition-all">
            <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">
              factory
            </span>
            <input
              className="bg-transparent text-slate-900 text-xs font-medium w-full focus:outline-none"
              id="origin-input"
              type="text"
              value={originNode}
              onChange={(e) => onOriginNodeChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
