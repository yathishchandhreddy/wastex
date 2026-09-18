import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/src/components/layout/PageHeader';
import { IndustrialLifecycleBar } from '@/src/components/lifecycle/IndustrialLifecycleBar';
import { SimpleValorizationCard } from '@/src/components/valorization/SimpleValorizationCard';
import { valorizationService } from '@/src/services/valorizationService';
import { wasteAnalysisService } from '@/src/services/wasteAnalysisService';
import { isSupabaseConfigured } from '@/src/lib/supabase';
import type {
  StructuredValorizationResult,
  ValorizationInput,
  ValorizationPathwayType,
  ValorizationRecord,
} from '@/src/types/valorization';

// 5 Mandatory Test Cases specified in Official Problem Statement Section 14
const TEST_CASES: Array<{
  id: string;
  name: string;
  categoryTag: string;
  input: ValorizationInput;
}> = [
  {
    id: 'tc-plastic',
    name: '1. Industrial Plastic Waste',
    categoryTag: 'Plastic & Polymers',
    input: {
      wasteName: 'Post-Industrial Clean rPET Flakes',
      category: 'Plastic & Polymers',
      subcategory: 'Rigid Thermoplastic Scrap',
      quantity: 24,
      unit: 'MT',
      generationFrequency: 'Bi-weekly recurring batch',
      qualityGrade: 'Grade A High Purity Clean Regrind',
      storageCondition: 'Dry indoor palletized gaylords',
      hazardousDeclaration: 'Non-Hazardous Industrial Byproduct',
      description: 'Clean preform trim and molding bottle regrind. Minimal thermal degradation, moisture <1.2%, free of PVC and paper adhesive.',
      location: 'Chakan Industrial Zone, Pune, MH',
      composition: [
        { component: 'Polyethylene Terephthalate', estimated_percentage: 92 },
        { component: 'HDPE Neck Rings', estimated_percentage: 7 },
        { component: 'Moisture', estimated_percentage: 1 },
      ],
      recyclability: 'Tier 1 - High Mechanical Recyclability',
      reusePotential: 85,
      recoveryPotential: 92,
      hazardIndicators: [],
    },
  },
  {
    id: 'tc-metal',
    name: '2. Metal Manufacturing Scrap',
    categoryTag: 'Metal & Alloys',
    input: {
      wasteName: 'CNC Aluminum & Brass Machining Swarf',
      category: 'Metal & Alloys',
      subcategory: 'Segregated Non-Ferrous Scrap',
      quantity: 8.5,
      unit: 'MT',
      generationFrequency: 'Weekly continuous production',
      qualityGrade: 'Alloy 6061-T6 Centrifuged Briquetted Turnings',
      storageCondition: 'Briquetted enclosed metal bins',
      hazardousDeclaration: 'Non-Hazardous Metal Scrap',
      description: 'Centrifuged CNC machine turnings from automotive machining line. Tramp cutting coolant <1.5%, segregated from ferrous metals.',
      location: 'Pithampur Industrial Corridor, MP',
      composition: [
        { component: 'Aluminum 6061 Alloy', estimated_percentage: 88 },
        { component: 'Copper/Brass Turnings', estimated_percentage: 10 },
        { component: 'Residual Coolant Film', estimated_percentage: 2 },
      ],
      recyclability: 'High - Direct Secondary Smelting & Ingot Casting',
      reusePotential: 40,
      recoveryPotential: 95,
      hazardIndicators: [],
    },
  },
  {
    id: 'tc-textile',
    name: '3. Textile Waste',
    categoryTag: 'Textile & Fibers',
    input: {
      wasteName: 'Cotton-Polyester Blend Cutting Clips',
      category: 'Textile & Fibers',
      subcategory: 'Post-Cutting Apparel Clippings',
      quantity: 15,
      unit: 'MT',
      generationFrequency: 'Bi-weekly recurring batch',
      qualityGrade: '65/35 Polycotton Unprinted Trimmings',
      storageCondition: 'Compacted hydraulic dry bales',
      hazardousDeclaration: 'Non-Hazardous Industrial Byproduct',
      description: 'Clean garment cut-waste clips from woven shirting production. Segregated by color family, free of zippers, buttons, or chemical sizing.',
      location: 'Tirupur Garment Export Zone, TN',
      composition: [
        { component: 'Virgin Cotton Fiber', estimated_percentage: 65 },
        { component: 'Polyester Filament', estimated_percentage: 34 },
        { component: 'Moisture', estimated_percentage: 1 },
      ],
      recyclability: 'Moderate - Mechanical Garnetting / Fiber Regeneration',
      reusePotential: 70,
      recoveryPotential: 80,
      hazardIndicators: [],
    },
  },
  {
    id: 'tc-wood',
    name: '4. Wood Residue',
    categoryTag: 'Wood & Timber Residue',
    input: {
      wasteName: 'Kiln-Dried Timber Offcuts & Sawdust',
      category: 'Wood & Timber Residue',
      subcategory: 'Untreated Solid Hardwood Scrap',
      quantity: 40,
      unit: 'MT',
      generationFrequency: 'Monthly recurring batch',
      qualityGrade: 'Untreated Kiln-Dried Pine & Teak Residue',
      storageCondition: 'Covered dry hopper silo storage',
      hazardousDeclaration: 'Non-Hazardous Biomass',
      description: 'Untreated solid lumber trimmer end-cuts, planer shavings, and fine sawdust from furniture plant. Moisture <9%, zero creosote or resin glue.',
      location: 'Yamunanagar Timber Cluster, Haryana',
      composition: [
        { component: 'Cellulose / Hardwood Fiber', estimated_percentage: 90 },
        { component: 'Natural Moisture', estimated_percentage: 9 },
        { component: 'Inorganic Ash', estimated_percentage: 1 },
      ],
      recyclability: 'High - Particleboard Feedstock or Biomass Briquette Pelletizing',
      reusePotential: 65,
      recoveryPotential: 88,
      hazardIndicators: [],
    },
  },
  {
    id: 'tc-insufficient',
    name: '5. Waste with Insufficient Info',
    categoryTag: 'Chemicals / Unidentified',
    input: {
      wasteName: 'Mixed Underground Tank Sludge Residue',
      category: 'Chemicals & Spent Solvents',
      subcategory: 'Unclassified Industrial Residue',
      quantity: 0, // Explicitly unknown quantity to test Section 1 & 14
      unit: 'MT',
      generationFrequency: '',
      qualityGrade: '',
      storageCondition: 'Corroded legacy pit containment',
      hazardousDeclaration: 'Unknown / Suspected Toxic Residual Sludge',
      description: 'Legacy sludge accumulated in unidentified sump pit. Variable viscosity, chemical aroma detected. Laboratory assay not yet conducted.',
      location: 'Industrial Area Zone 2',
      composition: null,
      recyclability: 'Unknown',
      reusePotential: 0,
      recoveryPotential: 0,
      hazardIndicators: ['Unverified Flammable Flashpoint', 'Unknown Heavy Metals', 'Corrosion Risk'],
    },
  },
];

export const ValorizePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const streamParam = searchParams.get('stream');

  // Active state
  const [currentInput, setCurrentInput] = useState<ValorizationInput>(TEST_CASES[0].input);
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(TEST_CASES[0].id);
  const [valorizationResult, setValorizationResult] = useState<StructuredValorizationResult | null>(null);
  const [selectedPathway, setSelectedPathway] = useState<ValorizationPathwayType | undefined>(undefined);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dbPersisted, setDbPersisted] = useState<boolean>(false);

  // Initialize from active analysis handoff or active valorization cache
  useEffect(() => {
    async function init() {
      // Check if there is an active valorization record saved
      const cached = valorizationService.getActiveValorization();
      if (cached && cached.result) {
        setValorizationResult(cached.result);
        setCurrentInput(cached.input);
        setSelectedPathway(cached.result.recommended_pathway);
        return;
      }

      // Check if there's a fresh analysis handoff from AnalyzePage
      const handoff = wasteAnalysisService.getActiveAnalysisForValorization();
      if (handoff) {
        const customInput: ValorizationInput = {
          wasteName: handoff.result.material || handoff.user_provided.wasteName,
          category: handoff.result.category || handoff.user_provided.category,
          subcategory: handoff.result.subcategory || handoff.user_provided.subcategory,
          quantity: handoff.user_provided.quantity,
          unit: handoff.user_provided.unit,
          generationFrequency: handoff.user_provided.generationFrequency,
          qualityGrade: handoff.user_provided.qualityGrade,
          storageCondition: handoff.user_provided.storageCondition,
          hazardousDeclaration: handoff.user_provided.hazardousDeclaration,
          description: handoff.user_provided.description,
          location: handoff.user_provided.location,
          composition: handoff.result.composition_estimate?.map((c) => ({
            component: c.component,
            estimated_percentage: c.estimated_percentage,
          })),
          recyclability: handoff.result.recyclability_tier,
          reusePotential: handoff.result.reuse_potential,
          recoveryPotential: handoff.result.recovery_potential,
          hazardIndicators: handoff.result.hazard_indicators,
        };
        setCurrentInput(customInput);
        executeEvaluation(customInput);
        return;
      }

      // Default: run with Test Case 1 (Plastic)
      executeEvaluation(TEST_CASES[0].input);
    }

    init();
  }, []);

  // Execute Gemini AI Valorization Decision Engine
  const executeEvaluation = async (inputToRun: ValorizationInput) => {
    setIsEvaluating(true);
    setErrorMessage(null);
    setDbPersisted(false);

    try {
      const record: ValorizationRecord = await valorizationService.evaluateAndSaveValorization(
        inputToRun
      );
      setValorizationResult(record.result);
      setSelectedPathway(record.result.recommended_pathway);
      setDbPersisted(isSupabaseConfigured);
    } catch (err: any) {
      console.error('Valorization Engine Failure:', err);
      setErrorMessage(
        err?.message || 'AI valorization decision could not be completed. Please try again.'
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSelectTestCase = (testCase: (typeof TEST_CASES)[0]) => {
    setSelectedTestCaseId(testCase.id);
    setCurrentInput(testCase.input);
    executeEvaluation(testCase.input);
  };

  const isRecoverable =
    (selectedPathway || valorizationResult?.recommended_pathway) !== 'alternative_disposal';

  return (
    <div className="flex flex-col w-full px-4 md:px-6 py-6 gap-6 max-w-5xl mx-auto">
      {/* 1. Lifecycle Bar directly connected to the Valorization Track (Section 9, 10, 12) */}
      <IndustrialLifecycleBar
        currentStep="Valorize"
        isRecoverable={isRecoverable}
        isAnalysisComplete={true}
      />

      {/* 2. Header Hub */}
      <PageHeader
        nodeTag="Plant: Pune Facility • Unit 04"
        statusTag="SU-05 AI Valorization Decision Engine"
        title="AI Waste Valorization & Circular Pathway Engine"
        description="Techno-economic circular evaluation determining the most appropriate pathway among Reuse, Recycling, Recovery, or Regulated Alternative Disposal."
        action={
          <button
            type="button"
            onClick={() => executeEvaluation(currentInput)}
            disabled={isEvaluating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                isEvaluating ? 'animate-spin' : ''
              }`}
            >
              {isEvaluating ? 'refresh' : 'psychology'}
            </span>
            <span>{isEvaluating ? 'Evaluating with Gemini...' : 'Re-evaluate with AI'}</span>
          </button>
        }
      />

      {/* 3. Test Cases Selector (Mandatory Section 14 Test Verification) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-[20px]">
              science
            </span>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Verify Official Test Cases (Section 14)
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Click any test scenario to run real multi-pathway AI analysis
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {TEST_CASES.map((tc) => {
            const isSelected = selectedTestCaseId === tc.id;
            return (
              <button
                key={tc.id}
                type="button"
                onClick={() => handleSelectTestCase(tc)}
                disabled={isEvaluating}
                className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-950 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/80 text-slate-700'
                }`}
              >
                <div className="text-xs font-bold leading-tight">{tc.name}</div>
                <span className="text-[10px] font-medium text-slate-500 block truncate">
                  {tc.categoryTag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Active Stream Intake Summary Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-slate-500 text-[20px]">
            category
          </span>
          <div>
            <span className="text-slate-500 font-medium">Evaluated Waste: </span>
            <strong className="text-slate-900 font-bold">{currentInput.wasteName}</strong>
            <span className="text-slate-500 ml-1.5">
              ({currentInput.quantity ? `${currentInput.quantity} ${currentInput.unit}` : 'Insufficient info'})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {dbPersisted && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
              <span className="material-symbols-outlined text-[13px]">database</span>
              <span>Persisted to Supabase (valorization_options)</span>
            </span>
          )}
          <Link
            to="/app/sell"
            className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 border border-slate-200 bg-white px-2.5 py-1 rounded-md"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
            <span>Intake New Stream</span>
          </Link>
        </div>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 5. Loading State */}
      {isEvaluating && (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          <h3 className="text-base font-bold text-slate-800">
            Gemini AI Evaluating Circular Pathways...
          </h3>
          <p className="text-xs text-slate-500 max-w-md">
            Assessing composition, quantity thresholds, contamination risks, and querying active
            marketplace buyer demand in Supabase.
          </p>
        </div>
      )}

      {/* 6. Simple Valorization Card (Amazon / Flipkart Simplicity - Section 6, 7, 8, 10) */}
      {!isEvaluating && valorizationResult && (
        <SimpleValorizationCard
          valorization={valorizationResult}
          input={currentInput}
          selectedPathway={selectedPathway}
          onSelectPathway={(pathway) => setSelectedPathway(pathway)}
        />
      )}
    </div>
  );
};
