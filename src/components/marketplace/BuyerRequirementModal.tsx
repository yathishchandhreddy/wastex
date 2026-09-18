import React, { useState } from 'react';

interface BuyerRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    material: string;
    quantity: string;
    unit: string;
    location: string;
    targetPrice?: string;
    frequency?: string;
    purityMin?: string;
  }) => void;
}

export const BuyerRequirementModal: React.FC<BuyerRequirementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [material, setMaterial] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('MT');
  const [location, setLocation] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [frequency, setFrequency] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [purityMin, setPurityMin] = useState('90');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!material.trim() || !quantity.trim()) return;
    onSubmit({
      material,
      quantity,
      unit,
      location,
      targetPrice: targetPrice || undefined,
      frequency: frequency || undefined,
      purityMin: showAdvanced ? purityMin : undefined,
    });
    onClose();
  };

  return (
    <div
      id="buyer-requirement-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="buyer-requirement-modal-content"
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">Post What You Need</h3>
            <p className="text-xs text-slate-500">AI will automatically find matching generators and notify you</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 text-xs">
          {/* Question 1: What material are you looking for? */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              What material are you looking for? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Plastic Scrap, Aluminum chips, Paper trimmings..."
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Question 2: How much do you need? */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              How much do you need? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                required
                min="1"
                placeholder="Quantity, e.g. 10"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-28 px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:border-emerald-600"
              >
                <option value="MT">MT (Metric Tons)</option>
                <option value="kg">kg (Kilograms)</option>
                <option value="Litres">Litres</option>
                <option value="Drums">Drums</option>
              </select>
            </div>
          </div>

          {/* Question 3: Where should it be located? */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              Where should it be located? (Location / Radius)
            </label>
            <input
              type="text"
              placeholder="e.g. Coimbatore, Tamil Nadu (within 150 km)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Question 4: Your target price? (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                Your target price? <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. ₹35 / kg or $1,200 / MT"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            {/* Question 5: How often do you need it? (Optional) */}
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                How often do you need it? <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:border-emerald-600"
              >
                <option value="">One-time purchase</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
                <option value="Monthly">Monthly contract</option>
                <option value="Continuous">Continuous supply</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters Expandable (Section 7 Requirement) */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Advanced Filters</span>
              <span className="material-symbols-outlined text-[16px]">
                {showAdvanced ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {showAdvanced && (
              <div className="mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2.5 animate-in fade-in">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Minimum Purity / Assay Requirement (%):
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={purityMin}
                    onChange={(e) => setPurityMin(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  AI will prioritize lots verified by VIS-NIR optical spectroscopy meeting or exceeding this threshold.
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              id="btn-find-materials-submit"
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">search</span>
              <span>Find Materials</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
