import React, { useState } from 'react';
import { PageHeader } from '@/src/components/layout/PageHeader';
import { DEMO_DATA_BADGE } from '@/src/data/demo';

export const PostRequirementPage: React.FC = () => {
  const [material, setMaterial] = useState('Industrial Polypropylene (PP) Scrap');
  const [wasteCategory, setWasteCategory] = useState('Plastics & Polymers');
  const [quantity, setQuantity] = useState('15');
  const [frequency, setFrequency] = useState('Monthly Batch');
  const [qualityRequirement, setQualityRequirement] = useState('Purity >85%, Contamination <2.0%, Dry Pellets or Flakes');
  const [preferredLocation, setPreferredLocation] = useState('Pune Industrial Zone (Max 150 km radius)');
  const [maxPrice, setMaxPrice] = useState('1200');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col w-full px-4 md:px-6 py-6 gap-6 max-w-3xl mx-auto">
      <PageHeader
        nodeTag="Procurement Intake Desk"
        statusTag="Active Offtaker Registration"
        title="Post Secondary Feedstock Requirement"
        description="Broadcast your industrial raw material specifications to certified generators in your regional circular network."
        badge={DEMO_DATA_BADGE}
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col gap-4"
      >
        {submitted ? (
          <div className="p-8 rounded-lg bg-emerald-50 border border-emerald-200 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">task_alt</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Procurement Requirement Broadcasted
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-lg leading-relaxed">
                Your requirement for <strong>{quantity} MT ({frequency})</strong> of <strong>{material}</strong> has been registered. The WasteX AI matching engine is scanning compatible generators within <strong>{preferredLocation}</strong> with indicative pricing under <strong>${maxPrice}/MT</strong>.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-2 px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs"
            >
              Post Another Requirement
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Industrial Offtaker Specification (Section 8)
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Real-Time Generator Broadcast
              </span>
            </div>

            {/* Field 1 & 2: Material needed & Accepted waste category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Material Needed
                </label>
                <input
                  type="text"
                  required
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="e.g. Polypropylene Scrap, PET Flakes, Aluminum Dross"
                  className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Accepted Waste Category
                </label>
                <select
                  value={wasteCategory}
                  onChange={(e) => setWasteCategory(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="Plastics & Polymers">Plastics & Polymers</option>
                  <option value="Metals & Foundry Byproducts">Metals & Foundry Byproducts</option>
                  <option value="Mineral & Combustion Byproducts">Mineral & Combustion Byproducts</option>
                  <option value="Chemical & Solvent Residuals">Chemical & Solvent Residuals</option>
                  <option value="Paper & Fiber Pulp">Paper & Fiber Pulp</option>
                </select>
              </div>
            </div>

            {/* Field 3 & 4: Quantity required & Frequency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Quantity Required (Metric Tons)
                </label>
                <input
                  type="number"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Procurement Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="One-time Spot Purchase">One-time Spot Purchase</option>
                  <option value="Weekly Batch">Weekly Batch</option>
                  <option value="Bi-weekly Cycle">Bi-weekly Cycle</option>
                  <option value="Monthly Batch">Monthly Batch</option>
                  <option value="Continuous Pipeline Supply">Continuous Pipeline Supply</option>
                </select>
              </div>
            </div>

            {/* Field 5: Quality / Purity requirement */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Quality / Purity Requirement
              </label>
              <textarea
                rows={2}
                required
                value={qualityRequirement}
                onChange={(e) => setQualityRequirement(e.target.value)}
                placeholder="Specify minimum polymer purity %, moisture thresholds, permitted ash or dust tolerances..."
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600 resize-none"
              />
            </div>

            {/* Field 6 & 7: Preferred location / distance & Maximum target price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Preferred Location / Maximum Distance
                </label>
                <input
                  type="text"
                  required
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  placeholder="e.g. Pune Region (Max 150 km radius)"
                  className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Maximum Target Price ($/MT)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 text-xs font-semibold">$</span>
                  <input
                    type="number"
                    required
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600 font-mono w-full"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-3 w-full py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">broadcast_on_personal</span>
              <span>Publish Offtaker Requirement to Matching Engine</span>
            </button>
          </>
        )}
      </form>
    </div>
  );
};
