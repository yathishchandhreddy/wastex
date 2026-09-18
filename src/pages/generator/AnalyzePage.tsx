import React, { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/src/components/layout/PageHeader';
import { IndustrialLifecycleBar } from '@/src/components/lifecycle/IndustrialLifecycleBar';
import { INDUSTRIAL_MATERIAL_TAXONOMY, MaterialCategory } from '@/src/types';
import type {
  StructuredGeminiAnalysisResponse,
  WasteAnalysisInput,
  WasteAnalysisRecord,
  FieldProvenance,
} from '@/src/types/wasteAnalysis';
import { geminiService } from '@/src/services/geminiService';
import { wasteAnalysisService } from '@/src/services/wasteAnalysisService';
import { isSupabaseConfigured } from '@/src/lib/supabase';
import { AiMaterialIdentificationCard } from '@/src/components/analysis/AiMaterialIdentificationCard';
import { MaterialCharacterizationCard } from '@/src/components/analysis/MaterialCharacterizationCard';
import { RecoveryPotentialCard } from '@/src/components/analysis/RecoveryPotentialCard';
import { RiskHazardCard } from '@/src/components/analysis/RiskHazardCard';
import { AiSummaryCard } from '@/src/components/analysis/AiSummaryCard';
import { AnalysisHistoryDrawer } from '@/src/components/analysis/AnalysisHistoryDrawer';

export const AnalyzePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const requestedPreset = searchParams.get('stream');

  // Intake Form State
  const [wasteName, setWasteName] = useState('Industrial Post-Industrial Flakes');
  const [category, setCategory] = useState<MaterialCategory>('Plastic & Polymers');
  const [subcategory, setSubcategory] = useState('Rigid Thermoplastic Scrap');
  const [materialType, setMaterialType] = useState('Polyethylene Terephthalate (rPET)');
  const [quantity, setQuantity] = useState('24');
  const [unit, setUnit] = useState('MT');
  const [frequency, setFrequency] = useState('Bi-weekly continuous batch');
  const [storageCondition, setStorageCondition] = useState('Indoor dry palletized gaylords');
  const [hazardousDeclaration, setHazardousDeclaration] = useState('Non-Hazardous Industrial Byproduct');
  const [qualityGrade, setQualityGrade] = useState('Grade A Post-Industrial Clean Regrind');
  const [location, setLocation] = useState('Facility 04 - Chakan Industrial Area, Pune, MH');
  const [description, setDescription] = useState(
    'Homogeneous post-industrial bottle preform trim and mold purge. Minimal thermal degradation, clear transparent flake geometry.'
  );

  // Visual Image Input
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
  );
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [imageMimeType, setImageMimeType] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // AI Analysis Execution State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStepLabel, setAnalysisStepLabel] = useState('');
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Active Analysis Result & History
  const [activeAnalysis, setActiveAnalysis] = useState<WasteAnalysisRecord | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<WasteAnalysisRecord[]>([]);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  // Load existing analysis history on mount
  useEffect(() => {
    async function loadHistory() {
      const history = await wasteAnalysisService.getAnalysisHistory();
      setAnalysisHistory(history);
      if (history.length > 0) {
        setActiveAnalysis(history[0]);
      }
    }
    loadHistory();
  }, []);

  // Quick Preset Scenarios to help users test diverse industrial waste streams
  const handleApplyPreset = (type: 'pet_flakes' | 'spent_solvent' | 'copper_swarf') => {
    if (type === 'pet_flakes') {
      setWasteName('Clean Polyethylene Terephthalate Flakes');
      setCategory('Plastic & Polymers');
      setSubcategory('Post-industrial rigid regrind');
      setMaterialType('rPET Polymer Flakes');
      setQuantity('32');
      setUnit('MT');
      setFrequency('Bi-weekly continuous batch');
      setStorageCondition('Dry climate-controlled silo storage');
      setHazardousDeclaration('Non-Hazardous Industrial Byproduct');
      setQualityGrade('Grade A High Clarity Flakes');
      setLocation('Plant 04, Chakan Industrial Area, Pune');
      setDescription('Clean reground preforms from beverage manufacturing. <1.2% moisture, zero adhesive labels, high intrinsic viscosity.');
      setImageUrl('https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80');
      setImageBase64(undefined);
      setImageMimeType(undefined);
    } else if (type === 'spent_solvent') {
      setWasteName('Spent Organosolv Distillation Residue');
      setCategory('Chemicals & Spent Solvents');
      setSubcategory('Heavy Still Bottoms');
      setMaterialType('Aromatic Fraction & Distillation Slurry');
      setQuantity('12');
      setUnit('KL');
      setFrequency('Monthly batch purge');
      setStorageCondition('Explosion-proof sealed containment vessel');
      setHazardousDeclaration('Hazardous - Flammable & Toxic Residue');
      setQualityGrade('Unrefined Spent Solvent Residue');
      setLocation('Chemical Synthesis Plant 02, Dahej, Gujarat');
      setDescription('Dark brown viscous chemical residue from reactor cleaning and solvent recovery columns. Contains residual halogenated traces.');
      setImageUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
      setImageBase64(undefined);
      setImageMimeType(undefined);
    } else {
      setWasteName('High-Purity Copper Machining Swarf');
      setCategory('Metal & Alloys');
      setSubcategory('Turnings, filings, and chips');
      setMaterialType('Electrolytic Tough Pitch Copper (Cu-ETP)');
      setQuantity('8.5');
      setUnit('MT');
      setFrequency('Weekly machining cycle');
      setStorageCondition('Covered bunded oil-draining bins');
      setHazardousDeclaration('Non-Hazardous Metal Scrap');
      setQualityGrade('Industrial Grade 1 Scrap Copper');
      setLocation('Precision CNC Facility, Peenya, Bengaluru');
      setDescription('Unalloyed copper turning chips from electrical busbar milling. Minor soluble water-based coolant residue (~2%).');
      setImageUrl('https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80');
      setImageBase64(undefined);
      setImageMimeType(undefined);
    }
  };

  // Handle local file upload with Base64 conversion
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImageUrl(dataUrl);
      setImageBase64(dataUrl);
      setImageMimeType(file.type);
    };
    reader.readAsDataURL(file);
  };

  // Execute Gemini AI Analysis
  const handleRunAnalysis = async () => {
    if (!wasteName.trim()) {
      setAnalysisError('Please enter a waste stream name before starting analysis.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    const inputData: WasteAnalysisInput = {
      wasteName: wasteName.trim(),
      category,
      subcategory: subcategory.trim(),
      materialType: materialType.trim(),
      quantity: Number(quantity) || 0,
      unit,
      generationFrequency: frequency,
      storageCondition,
      hazardousDeclaration,
      qualityGrade,
      description: description.trim(),
      location: location.trim(),
      imageUrl: imageUrl || undefined,
      imageBase64,
      imageMimeType,
    };

    try {
      setAnalysisStepLabel('Preparing waste data manifest...');
      await new Promise((r) => setTimeout(r, 400));

      setAnalysisStepLabel('Analyzing material characteristics with Gemini AI...');
      const geminiResult = await geminiService.analyzeWaste(inputData);

      setAnalysisStepLabel('Classifying circular recovery potential & hazard flags...');
      await new Promise((r) => setTimeout(r, 300));

      setAnalysisStepLabel('Saving analysis record to database...');
      const savedRecord = await wasteAnalysisService.saveAnalysisRecord(inputData, geminiResult);

      setActiveAnalysis(savedRecord);
      const updatedHistory = await wasteAnalysisService.getAnalysisHistory();
      setAnalysisHistory(updatedHistory);
    } catch (err: any) {
      console.error('Analysis execution failed:', err);
      // Fulfill Section 12 requirement: "AI analysis could not be completed. Please try again."
      setAnalysisError(err?.message || 'AI analysis could not be completed. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStepLabel('');
    }
  };

  // Handle engineer field verification
  const handleVerifyField = (fieldKey: string) => {
    if (!activeAnalysis) return;
    wasteAnalysisService.markFieldVerified(activeAnalysis.id, fieldKey);
    setActiveAnalysis({
      ...activeAnalysis,
      provenance: {
        ...activeAnalysis.provenance,
        [fieldKey]: 'Verified',
      },
    });
  };

  const handleVerifyAll = () => {
    if (!activeAnalysis) return;
    const verifiedProv: Record<string, FieldProvenance> = {};
    Object.keys(activeAnalysis.provenance).forEach((k) => {
      verifiedProv[k] = 'Verified';
    });
    const updated: WasteAnalysisRecord = {
      ...activeAnalysis,
      provenance: verifiedProv,
      is_verified_by_user: true,
    };
    wasteAnalysisService.setActiveAnalysis(updated);
    setActiveAnalysis(updated);
  };

  const isAnalysisComplete = Boolean(activeAnalysis && activeAnalysis.result);
  const isRecoverable =
    !activeAnalysis?.result.recyclability_tier?.toLowerCase().includes('non') &&
    !activeAnalysis?.result.recommended_next_step?.toLowerCase().includes('disposal') &&
    !activeAnalysis?.result.recommended_next_step?.toLowerCase().includes('incinerat');

  return (
    <div className="flex flex-col w-full px-4 md:px-6 py-6 gap-6 max-w-6xl mx-auto">
      {/* Visual Industrial Lifecycle Bar with Phase Locks */}
      <IndustrialLifecycleBar
        currentStep="Analyze"
        isRecoverable={isRecoverable}
        isAnalysisComplete={isAnalysisComplete}
      />

      {/* Header Hub */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          nodeTag="Plant Node: Pune Manufacturing Site 04"
          statusTag="AI Waste Analysis Engine Active"
          title="Industrial Waste Intake & AI Characterization"
          description="Submit industrial byproduct parameters to execute real Gemini multi-modal waste characterization, compositional breakdown, and circular recovery valuation."
        />

        {/* History Audit Button */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setIsHistoryDrawerOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-600">history</span>
            <span>Analysis History ({analysisHistory.length})</span>
          </button>
        </div>
      </div>

      {/* Sample Industrial Stream Presets */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-slate-600">science</span>
          <span className="text-xs font-semibold text-slate-700">Quick Test Scenarios:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleApplyPreset('pet_flakes')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>PET Flakes (Plastic & Polymers)</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('copper_swarf')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Copper Swarf (Metal & Alloys)</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('spent_solvent')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Still Bottoms (Chemicals & Solvents)</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Section 1 - INTAKE MANIFEST FORM */}
        <div className="lg:col-span-5 flex flex-col gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                1. WASTE STREAM INTAKE MANIFEST
              </h2>
              <p className="text-[11px] text-slate-500">
                Provide manifest parameters for industrial characterization
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
              Input Mode
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunAnalysis();
            }}
            className="flex flex-col gap-3.5"
          >
            {/* Waste Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Waste Stream Identifier / Name *
              </label>
              <input
                type="text"
                required
                value={wasteName}
                onChange={(e) => setWasteName(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                placeholder="e.g. Post-Industrial PET Flakes"
              />
            </div>

            {/* 14-Category Industrial Taxonomy */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Industrial Category (14 Standard Categories) *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              >
                {INDUSTRIAL_MATERIAL_TAXONOMY.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory & Material Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Subcategory / Grade</label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  placeholder="e.g. Rigid regrind"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Declared Material</label>
                <input
                  type="text"
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  placeholder="e.g. Polyethylene Terephthalate"
                />
              </div>
            </div>

            {/* Quantity & Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Volume / Mass *</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Unit of Measure</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="MT">Metric Tons (MT)</option>
                  <option value="Tons">Tons</option>
                  <option value="KL">Kiloliters (KL)</option>
                  <option value="Liters">Liters (L)</option>
                  <option value="Bales">Bales</option>
                  <option value="Kg">Kilograms (Kg)</option>
                </select>
              </div>
            </div>

            {/* Generation Frequency & Storage Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Generation Frequency</label>
                <input
                  type="text"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  placeholder="e.g. Continuous daily"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Storage Condition</label>
                <input
                  type="text"
                  value={storageCondition}
                  onChange={(e) => setStorageCondition(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  placeholder="e.g. Indoor silo"
                />
              </div>
            </div>

            {/* Hazardous Declaration & Quality Grade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Hazardous Declaration</label>
                <select
                  value={hazardousDeclaration}
                  onChange={(e) => setHazardousDeclaration(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="Non-Hazardous Industrial Byproduct">Non-Hazardous Industrial Byproduct</option>
                  <option value="Hazardous - Flammable & Toxic Residue">Hazardous - Flammable & Toxic Residue</option>
                  <option value="Potentially Regulated - Pending Screening">Potentially Regulated - Pending Screening</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Quality / Physical Grade</label>
                <input
                  type="text"
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  placeholder="e.g. Grade A"
                />
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Facility Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                placeholder="e.g. Pune Manufacturing Facility 04"
              />
            </div>

            {/* Stream Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Process Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 resize-none leading-relaxed"
                placeholder="Describe source manufacturing process, visible impurities, and handling..."
              />
            </div>

            {/* Visual Sample Image Capture */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Visual Material Sample (Optional Multimodal Vision)
                </label>
                <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Gemini Vision Ready
                </span>
              </div>

              {imageUrl && (
                <div className="relative rounded-lg overflow-hidden h-36 bg-slate-900 border border-slate-200 group">
                  <img
                    src={imageUrl}
                    alt="Stream Sample"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-950/75 backdrop-blur-xs p-1.5 rounded text-[10px] text-slate-200">
                    Multimodal visual inspection enabled. Gemini evaluates physical morphology and visible anomalies.
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors shrink-0"
                >
                  Upload Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImageBase64(undefined);
                    setImageMimeType(undefined);
                  }}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-600 font-mono"
                  placeholder="or enter image URL..."
                />
              </div>
            </div>

            {/* Error Banner */}
            {analysisError && (
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg flex items-start gap-2 text-xs text-rose-800">
                <span className="font-bold">Error:</span>
                <span className="flex-1">{analysisError}</span>
                <button
                  type="button"
                  onClick={handleRunAnalysis}
                  className="underline font-semibold text-rose-900 hover:text-rose-950"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Action Button & Loading Progress */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                disabled={isAnalyzing}
                className={`w-full py-3 rounded-lg text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isAnalyzing
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{analysisStepLabel || 'Analyzing with Gemini AI...'}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">psychology</span>
                    <span>
                      {isAnalysisComplete ? 'Re-Analyze with Gemini AI' : 'Analyze Waste with Gemini AI'}
                    </span>
                  </>
                )}
              </button>

              {isAnalyzing && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between font-semibold">
                    <span>AI Reasoning Progress</span>
                    <span className="text-emerald-700 animate-pulse">{analysisStepLabel}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full animate-indeterminate" />
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Section 2 - AI WASTE ANALYSIS RESULTS */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {activeAnalysis ? (
            <>
              {/* Material Identification Card */}
              <AiMaterialIdentificationCard
                data={activeAnalysis.result}
                provenance={activeAnalysis.provenance}
                onVerifyField={handleVerifyField}
              />

              {/* Material Characterization Card */}
              <MaterialCharacterizationCard
                data={activeAnalysis.result}
                provenance={activeAnalysis.provenance}
                onVerifyField={handleVerifyField}
              />

              {/* Recovery Potential Card */}
              <RecoveryPotentialCard
                data={activeAnalysis.result}
                provenance={activeAnalysis.provenance}
                onVerifyField={handleVerifyField}
              />

              {/* Risk & Hazard Indicators Card */}
              <RiskHazardCard
                data={activeAnalysis.result}
                provenance={activeAnalysis.provenance}
                onVerifyField={handleVerifyField}
              />

              {/* AI Summary Card with Engineer Verification */}
              <AiSummaryCard
                data={activeAnalysis.result}
                provenance={activeAnalysis.provenance}
                isVerified={activeAnalysis.is_verified_by_user}
                onVerifyAll={handleVerifyAll}
              />

              {/* Proceed to Valorize Step Card */}
              <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      Analysis Complete & Saved
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Step 2 Verified
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">
                    Ready for Step 3: Valorization & Circular Pathways
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Handoff confirmed for {activeAnalysis.result.material} ({activeAnalysis.result.category})
                  </p>
                </div>

                <Link
                  to={`/app/valorize?stream=${isRecoverable ? 'recoverable' : 'non-recoverable'}`}
                  className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition-colors flex items-center justify-center gap-2 shrink-0"
                >
                  <span>
                    {isRecoverable
                      ? 'Proceed to Valorization Pathways (Step 3)'
                      : 'View Regulated Disposal Track (Step 3)'}
                  </span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </>
          ) : (
            /* Empty / Pending State before initial analysis */
            <div className="bg-white border border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">psychology</span>
              </div>
              <div className="max-w-md">
                <h3 className="text-base font-bold text-slate-800">
                  Ready to Characterize Industrial Waste
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Enter waste stream parameters on the left or select a quick test scenario, then click
                  <strong> "Analyze Waste with Gemini AI"</strong> to execute real multimodal characterization.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRunAnalysis}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                <span>Start Initial Analysis</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Analysis History Drawer */}
      <AnalysisHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        history={analysisHistory}
        activeAnalysisId={activeAnalysis?.id || null}
        onSelectAnalysis={(selected) => {
          wasteAnalysisService.setActiveAnalysis(selected);
          setActiveAnalysis(selected);
        }}
      />
    </div>
  );
};
