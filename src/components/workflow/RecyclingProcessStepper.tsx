import React, { useState } from 'react';
import type { RecyclingCompany, RecyclingProcessStep } from '@/src/types/recycledMarketplace';

interface RecyclingProcessStepperProps {
  company: RecyclingCompany;
  materialName: string;
  quantity: string | number;
  unit: string;
  onViewMarketplaceProduct?: () => void;
}

export const RecyclingProcessStepper: React.FC<RecyclingProcessStepperProps> = ({
  company,
  materialName,
  quantity,
  unit,
  onViewMarketplaceProduct,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(2); // In progress by default for interactive realism

  const defaultSteps: RecyclingProcessStep[] = [
    {
      step_number: 1,
      step_name: 'Waste Received',
      status: currentStepIndex >= 0 ? (currentStepIndex > 0 ? 'completed' : 'in_progress') : 'pending',
      title: 'Consignment Gate Intake & Gross Weighment',
      description: `${quantity || 'Declared'} ${unit || 'MT'} of ${materialName || 'feedstock'} arrived at ${company.name} gate. Visual lot inspection and radioactivity check completed.`,
      technical_note: 'Gross tare weighment verified within ±0.2% tolerance.',
      updated_at: '2 hours ago',
    },
    {
      step_number: 2,
      step_name: 'Sorting',
      status: currentStepIndex >= 1 ? (currentStepIndex > 1 ? 'completed' : 'in_progress') : 'pending',
      title: 'Automated NIR Optical Sorting & Decontamination',
      description: 'Stream conveyed through near-infrared sensor arrays and air-eject nozzles to isolate pure target fraction and purge tramp contaminants.',
      technical_note: 'Target purity upgraded to >99.4% through dual-pass optical separation.',
      updated_at: '1 hour ago',
    },
    {
      step_number: 3,
      step_name: 'Processing',
      status: currentStepIndex >= 2 ? (currentStepIndex > 2 ? 'completed' : 'in_progress') : 'pending',
      title: company.processing_type,
      description: `Primary thermal/mechanical regeneration actively executing. Material converted into high-density secondary intermediate.`,
      technical_note: `Processing operating at continuous nominal parameter tolerances.`,
      updated_at: 'In Progress',
    },
    {
      step_number: 4,
      step_name: 'Quality Check',
      status: currentStepIndex >= 3 ? (currentStepIndex > 3 ? 'completed' : 'in_progress') : 'pending',
      title: 'Laboratory Assay & Grade Certification',
      description: 'Samples extracted for spectrometry, tensile strength, and impurity screening against national/international recycled standards.',
      technical_note: `Certified compliance: ${company.compliance_cert}`,
      updated_at: 'Scheduled',
    },
    {
      step_number: 5,
      step_name: 'Recycled Material/Product',
      status: currentStepIndex >= 4 ? 'completed' : 'pending',
      title: `Final Output: ${company.resulting_product_name}`,
      description: `Certified secondary raw material ready for distribution in the People Marketplace. Packaging in bulk industrial bags.`,
      technical_note: '100% circular traceability badge issued.',
      updated_at: 'Pending batch release',
    },
  ];

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 md:p-7 border border-slate-800 flex flex-col gap-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live Digital Twin
            </span>
            <span className="text-xs text-slate-400">Step 2: Circular Recycling Workflow</span>
          </div>
          <h3 className="text-lg md:text-xl font-black text-white mt-1">
            Recycling Process: {materialName} → {company.resulting_product_name}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Partner: <strong className="text-slate-200">{company.name}</strong> • {company.location} ({company.distance_km} km)
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">verified</span>
          <span className="text-xs font-bold text-slate-200">{company.compliance_cert.split('&')[0]}</span>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        {defaultSteps.map((step, idx) => {
          const isDone = currentStepIndex > idx;
          const isCurrent = currentStepIndex === idx;

          return (
            <button
              key={step.step_number}
              type="button"
              onClick={() => setCurrentStepIndex(idx)}
              className={`p-2 sm:p-3 rounded-xl flex flex-col items-center sm:items-start text-left transition-all cursor-pointer border ${
                isCurrent
                  ? 'bg-emerald-950/80 border-emerald-500 text-white ring-1 ring-emerald-500/40'
                  : isDone
                  ? 'bg-slate-800/60 border-slate-700 text-slate-300'
                  : 'bg-slate-800/20 border-slate-800 text-slate-500 hover:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1.5 w-full">
                <span
                  className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${
                    isDone
                      ? 'bg-emerald-500 text-slate-950'
                      : isCurrent
                      ? 'bg-emerald-400 text-slate-950 animate-pulse'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {isDone ? '✓' : step.step_number}
                </span>
                <span className="hidden sm:inline text-[11px] font-extrabold truncate">
                  {step.step_name}
                </span>
              </div>
              <span className="text-[9px] text-slate-400 mt-1 hidden md:block">
                {isDone ? 'Completed' : isCurrent ? 'Active Process' : 'Upcoming'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Step Details Panel */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 md:p-5 flex flex-col gap-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">
                {currentStepIndex === 0
                  ? 'inventory_2'
                  : currentStepIndex === 1
                  ? 'filter_alt'
                  : currentStepIndex === 2
                  ? 'precision_manufacturing'
                  : currentStepIndex === 3
                  ? 'fact_check'
                  : 'check_circle'}
              </span>
            </span>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                Step {defaultSteps[currentStepIndex].step_number} of 5: {defaultSteps[currentStepIndex].step_name}
              </span>
              <h4 className="text-sm md:text-base font-extrabold text-white">
                {defaultSteps[currentStepIndex].title}
              </h4>
            </div>
          </div>

          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-medium">
            {defaultSteps[currentStepIndex].updated_at}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {defaultSteps[currentStepIndex].description}
        </p>

        {defaultSteps[currentStepIndex].technical_note && (
          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-700/70 text-xs text-slate-300 flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-[18px] shrink-0">info</span>
            <span><strong>Industrial Log:</strong> {defaultSteps[currentStepIndex].technical_note}</span>
          </div>
        )}

        {/* Step Navigation Simulator */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
          <button
            type="button"
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            ← Previous Stage
          </button>

          <div className="text-[11px] text-slate-400">
            Simulated industrial process verification
          </div>

          <button
            type="button"
            disabled={currentStepIndex === defaultSteps.length - 1}
            onClick={() => setCurrentStepIndex((prev) => Math.min(defaultSteps.length - 1, prev + 1))}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Advance Stage →
          </button>
        </div>
      </div>

      {/* Step 3 — Resulting Recycled Product Showcase Banner */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950/90 border-2 border-emerald-500/60 rounded-xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={company.resulting_product_image}
            alt={company.resulting_product_name}
            className="w-16 h-16 rounded-xl object-cover border border-emerald-500/40 shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/40">
                Transformed Recycled Product
              </span>
              <span className="text-[10px] text-slate-300">Ready for Consumer & People Marketplace</span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-white mt-1">
              {company.resulting_product_name}
            </h4>
            <p className="text-xs text-slate-400">
              Est. Batch Yield: <strong className="text-emerald-300">{Number(quantity || 10) * 0.92} {unit || 'MT'}</strong> • Value: <strong className="text-white">${company.offered_intake_price}/MT</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewMarketplaceProduct}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
          <span>View in People Marketplace</span>
        </button>
      </div>
    </div>
  );
};
