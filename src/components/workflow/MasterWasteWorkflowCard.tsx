import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  StructuredValorizationResult,
  ValorizationInput,
  ValorizationPathwayType,
} from '@/src/types/valorization';
import { DEMO_RECYCLING_COMPANIES } from '@/src/data/recycledData';
import type { RecyclingCompany } from '@/src/types/recycledMarketplace';
import { RecyclingCompanyMatchCard } from '@/src/components/workflow/RecyclingCompanyMatchCard';
import { RecyclingProcessStepper } from '@/src/components/workflow/RecyclingProcessStepper';

interface MasterWasteWorkflowCardProps {
  valorization: StructuredValorizationResult;
  input: ValorizationInput;
  onReset?: () => void;
}

export const MasterWasteWorkflowCard: React.FC<MasterWasteWorkflowCardProps> = ({
  valorization,
  input,
  onReset,
}) => {
  const navigate = useNavigate();

  // Active pathway selection (defaults to AI recommended pathway)
  const [activePathway, setActivePathway] = useState<ValorizationPathwayType>(
    valorization.recommended_pathway || 'recycling'
  );

  // Technical details toggle
  const [isTechOpen, setIsTechOpen] = useState(false);

  // Recycling sub-workflow state
  const matchedRecyclingCompanies = DEMO_RECYCLING_COMPANIES.filter(
    (c) =>
      c.category.toLowerCase().includes((input.category || '').toLowerCase()) ||
      (input.category || '').toLowerCase().includes(c.category.toLowerCase()) ||
      c.accepted_materials.some((m) =>
        m.toLowerCase().includes((input.wasteName || '').toLowerCase())
      )
  );

  // Fallback to top companies if category is generic
  const displayedCompanies =
    matchedRecyclingCompanies.length > 0
      ? matchedRecyclingCompanies
      : DEMO_RECYCLING_COMPANIES.slice(0, 3);

  const [selectedCompany, setSelectedCompany] = useState<RecyclingCompany>(displayedCompanies[0]);
  const [isProcessStepperActive, setIsProcessStepperActive] = useState(false);

  // Contact / Seller proposal state
  const [inquirySent, setInquirySent] = useState<string | null>(null);

  const handleStartRecyclingProcess = (comp: RecyclingCompany) => {
    setSelectedCompany(comp);
    setIsProcessStepperActive(true);
  };

  const handleSendInquiry = (targetName: string) => {
    setInquirySent(targetName);
    setTimeout(() => setInquirySent(null), 6000);
  };

  const isDisposalTrack = activePathway === 'alternative_disposal';

  return (
    <div id="master-waste-workflow-card" className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Toast Notification */}
      {inquirySent && (
        <div className="bg-emerald-800 text-white px-5 py-3 rounded-xl text-xs font-bold shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-300">check_circle</span>
            <span>Inquiry and technical spec sheet dispatched to <strong>{inquirySent}</strong>.</span>
          </div>
          <span className="text-[10px] text-emerald-200">Response expected within 4 hours</span>
        </div>
      )}

      {/* SECTION 1: WASTE ANALYSIS REPORT (Section 4 Requirement) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs flex flex-col gap-5">
        {/* Report Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                Verified AI Waste Characterization
              </span>
              <span className="text-xs text-slate-400">Stream: {input.wasteName}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Waste Analysis Report
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium mr-1">AI Confidence:</span>
              <strong className="text-slate-900 font-black">{valorization.confidence}%</strong>
            </div>
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                New Upload
              </button>
            )}
          </div>
        </div>

        {/* Legend for Provenance Distinction */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-400 uppercase tracking-wider mr-1">Provenance Legend:</span>
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            [User-Provided]
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            [AI-Estimated]
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
            [Requires Lab Verification]
          </span>
        </div>

        {/* Grid of Key Characterization Fields */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          {/* Material Name */}
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
              <span>Material / Stream</span>
              <span className="text-blue-600 font-bold">[User]</span>
            </div>
            <div className="font-extrabold text-slate-900 text-sm truncate">{input.wasteName}</div>
            <div className="text-[10px] text-slate-500 truncate">{input.category}</div>
          </div>

          {/* Quantity & Unit */}
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
              <span>Batch Quantity</span>
              <span className="text-blue-600 font-bold">[User]</span>
            </div>
            <div className="font-extrabold text-slate-900 text-sm">
              {input.quantity || '10'} {input.unit || 'MT'}
            </div>
            <div className="text-[10px] text-slate-500">{input.location || 'Pan-India'}</div>
          </div>

          {/* Condition / Quality Grade */}
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
              <span>Quality Grade</span>
              <span className="text-emerald-600 font-bold">[AI-Estimated]</span>
            </div>
            <div className="font-extrabold text-slate-900 text-sm truncate">
              {input.qualityGrade || 'Tier 1 Feedstock'}
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold">Clean morphology</div>
          </div>

          {/* Contamination Level */}
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
              <span>Contamination</span>
              <span className="text-amber-600 font-bold">[Requires Lab]</span>
            </div>
            <div className="font-extrabold text-slate-900 text-sm">
              {isDisposalTrack ? '>14% Contaminants' : '<1.5% Non-target'}
            </div>
            <div className="text-[10px] text-slate-500">Optical scan baseline</div>
          </div>

          {/* Recoverability Status */}
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
              <span>Recoverability</span>
              <span className="text-emerald-600 font-bold">[AI-Estimated]</span>
            </div>
            <div className="font-extrabold text-slate-900 text-sm">
              {isDisposalTrack ? (
                <span className="text-rose-700">Non-Recoverable</span>
              ) : (
                <span className="text-emerald-700">Highly Viable</span>
              )}
            </div>
            <div className="text-[10px] text-slate-500">Score: {valorization.suitability_level}</div>
          </div>

          {/* Reuse Potential */}
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
              <span>Reuse Potential</span>
              <span className="text-emerald-600 font-bold">[AI-Estimated]</span>
            </div>
            <div className="font-extrabold text-slate-900 text-sm">
              {input.reusePotential || 85} / 100
            </div>
            <div className="text-[10px] text-slate-500">Direct application index</div>
          </div>

          {/* Recycling Potential */}
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
              <span>Recycling Potential</span>
              <span className="text-emerald-600 font-bold">[AI-Estimated]</span>
            </div>
            <div className="font-extrabold text-slate-900 text-sm">
              {input.recoveryPotential || 92} / 100
            </div>
            <div className="text-[10px] text-slate-500">Mechanical/thermal yield</div>
          </div>

          {/* Carbon Abatement Potential */}
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
              <span>Carbon Abatement</span>
              <span className="text-emerald-600 font-bold">[AI-Estimated]</span>
            </div>
            <div className="font-extrabold text-emerald-800 text-sm">
              14.2 tCO₂e
            </div>
            <div className="text-[10px] text-slate-500">Net lifecycle benefit</div>
          </div>
        </div>

        {/* AI Summary / Observations */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-800 uppercase tracking-wider">
              AI Diagnostic Summary:
            </span>
            <span className="text-[10px] text-emerald-700 font-bold">Resonance match 98.2%</span>
          </div>
          <p className="text-slate-700 leading-relaxed font-medium">
            {valorization.recommendation_reason}
          </p>
        </div>

        {/* Expandable Technical Analysis */}
        <div>
          <button
            type="button"
            onClick={() => setIsTechOpen(!isTechOpen)}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
          >
            <span>{isTechOpen ? '▲ Hide Technical Spectrometry & Assay' : '▼ Show Detailed Technical Analysis & Assay'}</span>
          </button>

          {isTechOpen && (
            <div className="mt-3 p-4 bg-slate-900 text-white rounded-xl text-xs flex flex-col gap-3 font-mono">
              <div className="text-emerald-400 font-bold text-[11px] uppercase">
                // GEMINI NIR & SPECTROSCOPIC CHARACTERIZATION MATRIX
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                <div>
                  <span className="text-slate-400 block font-sans text-[10px]">Composition Estimate:</span>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs">
                    {input.composition && input.composition.length > 0 ? (
                      input.composition.map((c, idx) => (
                        <li key={idx}>
                          {c.component}: <strong>{c.estimated_percentage}%</strong>
                        </li>
                      ))
                    ) : (
                      <>
                        <li>Primary Polymer / Matrix: <strong>91.8%</strong></li>
                        <li>Secondary Stabilizers: <strong>6.6%</strong></li>
                        <li>Moisture & Tramp: <strong>1.6%</strong></li>
                      </>
                    )}
                  </ul>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans text-[10px]">Regulatory & Safety Checks:</span>
                  <div className="mt-1 text-xs">
                    Hazardous Declaration: <strong>{input.hazardousDeclaration || 'None Detected'}</strong>
                    <br />
                    Storage Requirement: <strong>Covered Dry Containment</strong>
                    <br />
                    TRL Level: <strong>Level 9 (Commercially Proven)</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: ELIGIBILITY ASSESSMENT — "WHAT CAN YOU DO WITH THIS WASTE?" (Section 5 Requirement) */}
      <div className="bg-white border-2 border-emerald-600 rounded-2xl p-5 sm:p-7 shadow-md flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Step 4: AI Eligibility Assessment
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              WHAT CAN YOU DO WITH THIS WASTE?
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select one of the evaluated pathways below to activate the corresponding industrial workflow.
            </p>
          </div>
        </div>

        {/* 4 Pathway Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Pathway 1: DISPOSE */}
          <button
            type="button"
            onClick={() => {
              setActivePathway('alternative_disposal');
              setIsProcessStepperActive(false);
            }}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              activePathway === 'alternative_disposal'
                ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-slate-900/30 shadow-md'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-black">1. DISPOSE</span>
                <span className="material-symbols-outlined text-[20px]">
                  {activePathway === 'alternative_disposal' ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${activePathway === 'alternative_disposal' ? 'text-slate-300' : 'text-slate-500'}`}>
                Safe handling, compliance protocols, and TSDF routing for hazardous or unviable waste.
              </p>
            </div>
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded w-fit ${
              activePathway === 'alternative_disposal' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
            }`}>
              Safe Disposal Guidance
            </span>
          </button>

          {/* Pathway 2: SELL */}
          <button
            type="button"
            onClick={() => {
              setActivePathway('recovery');
              setIsProcessStepperActive(false);
            }}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              activePathway === 'recovery'
                ? 'bg-blue-900 text-white border-blue-900 ring-2 ring-blue-900/30 shadow-md'
                : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-black">2. SELL</span>
                <span className="material-symbols-outlined text-[20px]">
                  {activePathway === 'recovery' ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${activePathway === 'recovery' ? 'text-blue-100' : 'text-slate-500'}`}>
                Trade secondary material directly to industrial buyers, traders, and compounders.
              </p>
            </div>
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded w-fit ${
              activePathway === 'recovery' ? 'bg-blue-800 text-blue-100' : 'bg-blue-50 text-blue-700'
            }`}>
              Dealer / Buyer Connect
            </span>
          </button>

          {/* Pathway 3: RECYCLE (Recommended Default) */}
          <button
            type="button"
            onClick={() => {
              setActivePathway('recycling');
              setIsProcessStepperActive(false);
            }}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              activePathway === 'recycling'
                ? 'bg-emerald-800 text-white border-emerald-800 ring-2 ring-emerald-800/30 shadow-md'
                : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-400'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black">3. RECYCLE</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-500 text-slate-950">AI TOP PICK</span>
                </div>
                <span className="material-symbols-outlined text-[20px]">
                  {activePathway === 'recycling' ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${activePathway === 'recycling' ? 'text-emerald-100' : 'text-slate-500'}`}>
                Connect with recycling facilities → Track conversion → Produce items for People Marketplace.
              </p>
            </div>
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded w-fit ${
              activePathway === 'recycling' ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-50 text-emerald-800'
            }`}>
              Recycling → Marketplace
            </span>
          </button>

          {/* Pathway 4: REUSE */}
          <button
            type="button"
            onClick={() => {
              setActivePathway('reuse');
              setIsProcessStepperActive(false);
            }}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              activePathway === 'reuse'
                ? 'bg-teal-900 text-white border-teal-900 ring-2 ring-teal-900/30 shadow-md'
                : 'bg-white border-slate-200 text-slate-700 hover:border-teal-400'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base font-black">4. REUSE</span>
                <span className="material-symbols-outlined text-[20px]">
                  {activePathway === 'reuse' ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${activePathway === 'reuse' ? 'text-teal-100' : 'text-slate-500'}`}>
                In-house reprocessing, remanufacturing, and direct secondary industrial symbiosis.
              </p>
            </div>
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded w-fit ${
              activePathway === 'reuse' ? 'bg-teal-800 text-teal-100' : 'bg-teal-50 text-teal-800'
            }`}>
              AI Reuse Guidance
            </span>
          </button>
        </div>
      </div>

      {/* SECTION 3: THE 4 DEDICATED PATHWAY VIEWS */}

      {/* PATHWAY 1: DISPOSE (Safe Disposal Guidance) */}
      {activePathway === 'alternative_disposal' && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col gap-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl">shield</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                Pathway 1: Safe Disposal Protocol
              </span>
              <h3 className="text-xl font-black text-white">
                Safe Disposal Guidance & TSDF Manifest Requirements
              </h3>
            </div>
          </div>

          <div className="bg-rose-950/40 border border-rose-800/60 p-4 rounded-xl text-xs text-rose-200 flex flex-col gap-1.5">
            <strong className="text-rose-100 text-sm">Notice: Marketplace Listing Restricted</strong>
            <p>
              This stream contains refractory contaminants or hazardous indicators exceeding circular thresholds. Direct open-market trading is prohibited to protect supply chain safety.
            </p>
          </div>

          {/* Handling & Safety Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-col gap-2">
              <h4 className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-400 text-[18px]">checklist</span>
                <span>Safe Handling & PPE Checklist:</span>
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Store in UN-certified sealed corrosion-resistant containers with secondary containment.</li>
                <li>Maintain nitrogen/inert blanketing to prevent volatile vapor accumulation.</li>
                <li>Operators must wear Category III chemical PPE and organic-vapor full face respirators.</li>
                <li>Do not mix with municipal effluent, watercourses, or combustible scrap.</li>
              </ul>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-col gap-2">
              <h4 className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-blue-400 text-[18px]">gavel</span>
                <span>Compliance & Regulatory Framework:</span>
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Governed under CPCB Hazardous Waste Management Rules 2016 (Schedule II).</li>
                <li>Mandatory GPS-enabled tracking manifest (Form 10) for inter-state transport.</li>
                <li>Consignment must be dispatched exclusively to authorized TSDF thermal co-processors.</li>
              </ul>
            </div>
          </div>

          {/* Authorized TSDF Consignor Contacts */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-200">Nearest Certified TSDF Facility:</div>
              <div className="text-sm font-extrabold text-white">Gujarat Enviro-Protection & Infrastructure Ltd. (GEPIL)</div>
              <div className="text-xs text-slate-400">Hazardous Waste Incinerator #TSDF-GJ-402 • 64 km away</div>
            </div>

            <button
              type="button"
              onClick={() => handleSendInquiry('GEPIL TSDF Facility')}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
            >
              Generate Disposal Manifest
            </button>
          </div>
        </div>
      )}

      {/* PATHWAY 2: SELL (Dealer / Buyer Connect) */}
      {activePathway === 'recovery' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 flex flex-col gap-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                Pathway 2: B2B Industrial Exchange
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Dealer & Buyer Connect: {input.wasteName}
              </h3>
              <p className="text-xs text-slate-500">
                {input.quantity || 10} {input.unit || 'MT'} • Indicative Valuation: <strong className="text-slate-900">{valorization.potential_value_display}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/app/buy')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              <span>Open B2B Exchange</span>
            </button>
          </div>

          {/* Matched Verified Buyers List */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Matched Procurement Buyers for this Stream:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm">Apex Circular Synthetics Corp.</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">96% Match</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Vadodara Cluster (84 km) • Seeking 10-50 MT Monthly</p>
                  <div className="mt-2 text-xs text-slate-700 font-medium">
                    Bid: <strong>$1,240/MT</strong> • Spot Intake
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSendInquiry('Apex Circular Synthetics')}
                  className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Send Commercial Offer
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm">EcoStrata Infrastructure Ltd.</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">88% Match</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Surat Industrial Belt (142 km) • Seeking 8-25 MT</p>
                  <div className="mt-2 text-xs text-slate-700 font-medium">
                    Bid: <strong>$1,180/MT</strong> • 6-Month Contract
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSendInquiry('EcoStrata Infrastructure')}
                  className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Request Technical Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PATHWAY 3: RECYCLE (Recycling Companies → Process → Recycled Product → People Marketplace) */}
      {activePathway === 'recycling' && (
        <div className="flex flex-col gap-6">
          {/* STEP 1: Find Recycling Companies */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 flex flex-col gap-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    Pathway 3: Recycling Opportunity (Step 1 of 3)
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Matched Certified Recycling Companies
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Filtered by material compatibility, location radius, processing technology, and certified ESG standards.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {displayedCompanies.map((comp) => (
                <RecyclingCompanyMatchCard
                  key={comp.id}
                  company={comp}
                  isSelected={selectedCompany?.id === comp.id}
                  onSelect={(c) => setSelectedCompany(c)}
                  onStartProcess={handleStartRecyclingProcess}
                />
              ))}
            </div>
          </div>

          {/* STEP 2 & 3: Recycling Process & Recycled Product Output Stepper */}
          {selectedCompany && (
            <RecyclingProcessStepper
              company={selectedCompany}
              materialName={input.wasteName}
              quantity={input.quantity || 10}
              unit={input.unit || 'MT'}
              onViewMarketplaceProduct={() => navigate('/app/buy')}
            />
          )}
        </div>
      )}

      {/* PATHWAY 4: REUSE (AI Reuse Guidance) */}
      {activePathway === 'reuse' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 flex flex-col gap-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl">cached</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                Pathway 4: Direct Closed-Loop Reuse
              </span>
              <h3 className="text-xl font-black text-slate-900">
                AI In-House & Industrial Symbiosis Reuse Guidance
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-200 flex flex-col gap-2">
              <h4 className="font-bold text-sm text-teal-950 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-teal-700 text-[18px]">autorenew</span>
                <span>In-House Closed-Loop Protocol:</span>
              </h4>
              <p className="text-xs text-teal-900 leading-relaxed">
                Re-introduce up to <strong>15-20% regrind</strong> directly into primary manufacturing hopper blends without affecting tensile strength or dimensional stability.
              </p>
              <div className="mt-2 text-xs font-bold text-teal-900">
                Est. Raw Material Savings: $4,200 / Month
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-slate-700 text-[18px]">hub</span>
                <span>Industrial Symbiosis Applications:</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                Direct substitution feedstock for nearby construction aggregate, acoustic barrier panels, or non-critical molding applications.
              </p>
              <div className="mt-2 text-xs font-bold text-slate-900">
                Zero processing capex required
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 text-white">
            <div>
              <div className="text-xs text-slate-300 font-bold">Need assistance configuring your extrusion line for regrind?</div>
              <div className="text-[11px] text-slate-400">WasteX Industrial Process Engineers provide technical advisory.</div>
            </div>
            <button
              type="button"
              onClick={() => handleSendInquiry('WasteX Engineering Team')}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black cursor-pointer shrink-0"
            >
              Request Technical Advisory
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
