import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type {
  StructuredValorizationResult,
  PathwayEvaluation,
  ValorizationPathwayType,
  ValorizationInput,
} from '@/src/types/valorization';

interface SimpleValorizationCardProps {
  valorization: StructuredValorizationResult;
  input: ValorizationInput;
  onSelectPathway?: (pathway: ValorizationPathwayType) => void;
  selectedPathway?: ValorizationPathwayType;
  onFindBuyers?: () => void;
  onViewDisposal?: () => void;
}

export const SimpleValorizationCard: React.FC<SimpleValorizationCardProps> = ({
  valorization,
  input,
  onSelectPathway,
  selectedPathway,
  onFindBuyers,
  onViewDisposal,
}) => {
  const [isWhyOpen, setIsWhyOpen] = useState(false);
  const [isTechnicalOpen, setIsTechnicalOpen] = useState(false);

  const activePathwayType = selectedPathway || valorization.recommended_pathway;
  const isDisposalTrack = activePathwayType === 'alternative_disposal';

  const getPathwayBadge = (pathway: ValorizationPathwayType) => {
    switch (pathway) {
      case 'reuse':
        return {
          label: 'REUSE',
          icon: 'cached',
          color: 'emerald',
          bgColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'recycling':
        return {
          label: 'RECYCLING',
          icon: 'recycling',
          color: 'blue',
          bgColor: 'bg-blue-50 text-blue-800 border-blue-200',
        };
      case 'recovery':
        return {
          label: 'ENERGY / RECOVERY',
          icon: 'bolt',
          color: 'amber',
          bgColor: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'alternative_disposal':
        return {
          label: 'ALTERNATIVE DISPOSAL',
          icon: 'shield',
          color: 'slate',
          bgColor: 'bg-slate-100 text-slate-800 border-slate-300',
        };
    }
  };

  const currentBadge = getPathwayBadge(valorization.recommended_pathway);

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability.toLowerCase()) {
      case 'high':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'low':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-rose-100 text-rose-800 border-rose-300';
    }
  };

  const otherPathways = valorization.pathways.filter(
    (p) => p.pathway !== valorization.recommended_pathway
  );

  return (
    <div id="simple-valorization-card" className="flex flex-col gap-5">
      {/* 1. Main Recommendation Banner (Amazon / Flipkart Simple Card) */}
      <div className="bg-white border-2 border-emerald-500 rounded-2xl p-5 md:p-7 shadow-sm relative overflow-hidden">
        {/* Subtle Top Accent Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />

        <div className="flex flex-col gap-4">
          {/* Header Title & Subtitle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                AI Valorization Recommendation
              </span>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-2">
                WHAT SHOULD YOU DO WITH THIS WASTE?
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">AI Confidence:</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                {valorization.confidence}%
              </span>
            </div>
          </div>

          {/* Primary Recommended Pathway Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[24px]">
                  {currentBadge.icon}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Recommended Pathway:</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg md:text-xl font-black text-slate-900">
                    {currentBadge.label}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-md border uppercase ${getSuitabilityColor(
                      valorization.suitability_level
                    )}`}
                  >
                    Suitability: {valorization.suitability_level}
                  </span>
                </div>
              </div>
            </div>

            {/* Why text */}
            <div className="text-sm text-slate-700 leading-relaxed font-medium bg-white p-3.5 rounded-lg border border-slate-200/80">
              <span className="font-bold text-slate-900 mr-1.5">Why?</span>
              &ldquo;{valorization.recommendation_reason}&rdquo;
            </div>

            {/* 3 Core Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* Metric 1: Suitability */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Suitability
                </span>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-base font-black text-slate-900">
                    {valorization.suitability_level}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({valorization.pathways.find((p) => p.pathway === valorization.recommended_pathway)?.score || 85}/100)
                  </span>
                </div>
              </div>

              {/* Metric 2: Potential Value */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Potential Value
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {valorization.potential_value_label}
                  </span>
                </div>
                <div className="mt-1">
                  <span className="text-base font-black text-slate-900">
                    {valorization.potential_value_display}
                  </span>
                </div>
              </div>

              {/* Metric 3: Market Demand */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Market Demand
                </span>
                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      valorization.market_demand_status === 'Available'
                        ? 'bg-emerald-500'
                        : valorization.market_demand_status === 'Limited'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span className="text-base font-bold text-slate-900">
                    {valorization.market_demand_status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Other Options Overview (Section 6) */}
          <div className="flex flex-col gap-2 pt-1">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Other Evaluated Options
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {otherPathways.map((opt) => {
                const badge = getPathwayBadge(opt.pathway);
                const isSelected = selectedPathway === opt.pathway;
                return (
                  <button
                    key={opt.pathway}
                    type="button"
                    onClick={() => onSelectPathway && onSelectPathway(opt.pathway)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-slate-500">
                        {badge.icon}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-800 capitalize block">
                          {opt.pathway.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] text-slate-500">Score: {opt.score}/100</span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSuitabilityColor(
                        opt.suitability
                      )}`}
                    >
                      {opt.suitability}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Action Button (Section 6) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            {!isDisposalTrack ? (
              <Link
                to="/app/buy"
                onClick={onFindBuyers}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">groups</span>
                <span>Find Buyers</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={onViewDisposal}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">policy</span>
                <span>View Disposal Guidance</span>
              </button>
            )}

            <span className="text-xs text-slate-500 text-center sm:text-left">
              {!isDisposalTrack
                ? 'Check real compatible buyer requirements or publish to the industrial exchange.'
                : 'Regulated waste pathway: access verified authorized TSDF & hazardous disposal protocols.'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Expandable Section 7: "Why did WasteX recommend this?" */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setIsWhyOpen(!isWhyOpen)}
          className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-emerald-600 text-[22px]">
              help_outline
            </span>
            <span className="text-sm font-bold text-slate-900">
              Why did WasteX recommend this?
            </span>
          </div>
          <span className="material-symbols-outlined text-slate-400 transition-transform">
            {isWhyOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {isWhyOpen && (
          <div className="p-5 border-t border-slate-100 flex flex-col gap-4 text-sm text-slate-700">
            <p className="leading-relaxed bg-emerald-50/60 p-3.5 rounded-lg border border-emerald-100 text-emerald-950 font-medium">
              WasteX evaluated the stream against 4 circular pathways considering its material
              purity, lot volume, contamination risks, and available industrial market demand.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Waste Characteristics */}
              <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  1. Waste Characteristics
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {valorization.why_recommendation.waste_characteristics ||
                    'Analyzed compositional purity and contamination indicators.'}
                </p>
              </div>

              {/* Quantity Assessment */}
              <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  2. Quantity & Logistics
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {valorization.why_recommendation.quantity ||
                    `${input.quantity || 'Declared'} ${input.unit || 'MT'} batch size evaluated for processing viability.`}
                </p>
              </div>

              {/* Generation Pattern */}
              <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  3. Generation Pattern
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {valorization.why_recommendation.generation_pattern ||
                    input.generationFrequency ||
                    'Recurring batch availability matches continuous processing demand.'}
                </p>
              </div>

              {/* Market Context */}
              <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  4. Market Demand Context
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {valorization.why_recommendation.market_context ||
                    valorization.market_demand_summary ||
                    'Evaluated against active buyer requirements in the platform database.'}
                </p>
              </div>

              {/* Economic Context */}
              <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  5. Economic Context
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {valorization.why_recommendation.economic_context ||
                    'Secondary raw material valuation estimated based on standard industrial benchmarks.'}
                </p>
              </div>

              {/* Environmental Context */}
              <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  6. Environmental Context
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {valorization.why_recommendation.environmental_context ||
                    'Circular diversion avoids landfill emissions and displaces virgin raw material extraction.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Expandable Section 8: "View Technical Analysis" */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setIsTechnicalOpen(!isTechnicalOpen)}
          className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-indigo-600 text-[22px]">
              analytics
            </span>
            <span className="text-sm font-bold text-slate-900">
              View Technical Analysis
            </span>
            <span className="text-[11px] text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
              Full TEA & Pathway Scores
            </span>
          </div>
          <span className="material-symbols-outlined text-slate-400 transition-transform">
            {isTechnicalOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {isTechnicalOpen && (
          <div className="p-5 border-t border-slate-100 flex flex-col gap-5">
            {/* Detailed Pathway Comparison Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Techno-Economic Assessment (TEA) Pathway Matrix
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="p-3">Pathway</th>
                      <th className="p-3">Overall Score</th>
                      <th className="p-3">Feasibility</th>
                      <th className="p-3">Economic Yield</th>
                      <th className="p-3">Environmental Benefit</th>
                      <th className="p-3">Market Demand</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {valorization.pathways.map((p) => {
                      const isRec = p.pathway === valorization.recommended_pathway;
                      return (
                        <tr key={p.pathway} className={isRec ? 'bg-emerald-50/50 font-medium' : 'bg-white'}>
                          <td className="p-3 flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 capitalize">
                              {p.pathway.replace('_', ' ')}
                            </span>
                            {isRec && (
                              <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">
                                Recommended
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-bold text-slate-900">{p.score}/100</td>
                          <td className="p-3 text-slate-700">{p.feasibility_score ?? 80}/100</td>
                          <td className="p-3 text-slate-700">{p.economic_score ?? 75}/100</td>
                          <td className="p-3 text-slate-700">{p.environmental_score ?? 85}/100</td>
                          <td className="p-3 text-slate-700">{p.market_demand_score ?? 60}/100</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Individual Pathway Technical Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {valorization.pathways.map((p) => (
                <div key={p.pathway} className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 uppercase">
                      {p.pathway.replace('_', ' ')} Technical Rationale
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getSuitabilityColor(p.suitability)}`}>
                      {p.suitability}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{p.reason}</p>
                  <div className="text-[11px] text-slate-600 flex flex-col gap-1 pt-1 border-t border-slate-200/60">
                    <div>
                      <strong className="text-slate-800">Feasibility:</strong> {p.practical_feasibility}
                    </div>
                    <div>
                      <strong className="text-slate-800">Economics:</strong> {p.economic_context}
                    </div>
                    <div>
                      <strong className="text-slate-800">Environment:</strong> {p.environmental_context}
                    </div>
                    <div>
                      <strong className="text-slate-800">Market:</strong> {p.market_context}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Composition & Hazard Indicators if present */}
            {Array.isArray(input.composition) && input.composition.length > 0 && (
              <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50">
                <span className="text-xs font-bold text-slate-900 uppercase block mb-2">
                  Feedstock Chemical Composition Considered in AI Evaluation
                </span>
                <div className="flex flex-wrap gap-2">
                  {input.composition.map((c, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-white border border-slate-200 text-xs text-slate-800"
                    >
                      <strong className="font-semibold">{c.component}</strong>:{' '}
                      {c.estimated_percentage !== undefined && c.estimated_percentage !== null
                        ? `${c.estimated_percentage}%`
                        : 'Identified'}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Disposal Guidance Track (Section 10) */}
      {(isDisposalTrack || valorization.disposal_guidance) && (
        <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-[22px]">
              warning
            </span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Regulated Handling & Disposal Guidance
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {valorization.disposal_guidance?.recommended_handling_pathway ||
              'Authorized treatment, storage, and disposal facility (TSDF) protocol required.'}
          </p>

          {valorization.disposal_guidance?.risk_handling_notes &&
            valorization.disposal_guidance.risk_handling_notes.length > 0 && (
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1.5">
                  Handling & Risk Mitigations
                </span>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {valorization.disposal_guidance.risk_handling_notes.map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex items-start gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-slate-400 shrink-0 mt-0.5">
              info
            </span>
            <span>
              {valorization.disposal_guidance?.compliance_notes ||
                'Subject to applicable Hazardous and Industrial Waste Management Rules. Note: WasteX provides operational decision support and does not certify statutory compliance.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
