import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/src/components/layout/PageHeader';
import { IndustrialLifecycleBar } from '@/src/components/lifecycle/IndustrialLifecycleBar';
import { MasterWasteWorkflowCard } from '@/src/components/workflow/MasterWasteWorkflowCard';
import { geminiService } from '@/src/services/geminiService';
import { valorizationService } from '@/src/services/valorizationService';
import { wasteAnalysisService } from '@/src/services/wasteAnalysisService';
import type {
  StructuredValorizationResult,
  ValorizationInput,
  ValorizationPathwayType,
  ValorizationRecord,
} from '@/src/types/valorization';

export const SellWastePage: React.FC = () => {
  const navigate = useNavigate();

  // Form inputs
  const [material, setMaterial] = useState('');
  const [category, setCategory] = useState('Industrial Scrap & Byproducts');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('MT');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [imageMimeType, setImageMimeType] = useState<string | undefined>(undefined);

  // Execution states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Valorization result
  const [valorizationResult, setValorizationResult] = useState<StructuredValorizationResult | null>(null);
  const [selectedPathway, setSelectedPathway] = useState<ValorizationPathwayType | undefined>(undefined);
  const [activeInput, setActiveInput] = useState<ValorizationInput | null>(null);

  // 5 Official Test Presets (Section 14)
  const samplePresets = [
    {
      name: '1. Industrial Plastic Waste',
      categoryTag: 'Plastic & Polymers',
      img: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
      material: 'Post-Industrial Clean rPET Flakes',
      category: 'Plastic & Polymers',
      qty: '24',
      unit: 'MT',
      loc: 'Chakan Industrial Zone, Pune, MH',
      desc: 'Clean bottle preform regrind. Minimal thermal degradation, moisture <1.2%, free of adhesive and PVC.',
    },
    {
      name: '2. Metal Manufacturing Scrap',
      categoryTag: 'Metal & Alloys',
      img: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      material: 'CNC Aluminum & Brass Machining Swarf',
      category: 'Metal & Alloys',
      qty: '8.5',
      unit: 'MT',
      loc: 'Pithampur Industrial Corridor, MP',
      desc: 'Centrifuged CNC machine turnings from automotive machining line. Tramp cutting coolant <1.5%, segregated from ferrous scrap.',
    },
    {
      name: '3. Textile Waste',
      categoryTag: 'Textile & Fibers',
      img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
      material: 'Cotton-Polyester Blend Cutting Clips',
      category: 'Textile & Fibers',
      qty: '15',
      unit: 'MT',
      loc: 'Tirupur Garment Export Zone, TN',
      desc: 'Clean garment cut-waste clips from woven shirting line. 65/35 polycotton, unprinted, free of metal accessories.',
    },
    {
      name: '4. Wood Residue',
      categoryTag: 'Wood & Timber Residue',
      img: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=80',
      material: 'Kiln-Dried Timber Offcuts & Sawdust',
      category: 'Wood & Timber Residue',
      qty: '40',
      unit: 'MT',
      loc: 'Yamunanagar Timber Cluster, Haryana',
      desc: 'Untreated solid lumber trimmer end-cuts and fine sawdust from furniture manufacturing. Moisture <9%, zero creosote.',
    },
    {
      name: '5. Waste with Insufficient Info',
      categoryTag: 'Chemicals / Unidentified',
      img: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
      material: 'Mixed Underground Tank Sludge Residue',
      category: 'Chemicals & Spent Solvents',
      qty: '0', // Explicit zero / insufficient info
      unit: 'MT',
      loc: 'Unknown Industrial Pit Area',
      desc: 'Legacy sludge accumulated in unidentified sump pit. Unknown composition, chemical odor detected. Lab assay not conducted.',
    },
  ];

  const handleApplyPreset = (p: (typeof samplePresets)[0]) => {
    setMaterial(p.material);
    setCategory(p.category);
    setQuantity(p.qty);
    setUnit(p.unit);
    setLocation(p.loc);
    setDescription(p.desc);
    setPhotoUrl(p.img);
    setImageBase64(undefined);
    setImageMimeType(undefined);
    setValorizationResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImageBase64(base64String);
        setImageMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI Analysis & Valorization Flow
  const handleAnalyzeAndValorize = async () => {
    if (!material.trim()) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    setValorizationResult(null);

    try {
      setAnalysisStep('1/2: Characterizing chemical & physical composition with Gemini AI...');

      // 1. Initial Waste Characterization via Gemini
      const analysisOutput = await geminiService.analyzeWaste({
        wasteName: material,
        category: category || 'Industrial Scrap & Byproducts',
        quantity: quantity,
        unit: unit,
        location: location,
        description: description || 'Industrial byproduct batch intake',
        imageBase64: imageBase64,
        imageMimeType: imageMimeType,
      });

      // Save analysis record in service
      await wasteAnalysisService.saveAnalysisRecord(
        {
          wasteName: material,
          category: category || 'Industrial Scrap & Byproducts',
          quantity: quantity,
          unit: unit,
          location: location,
          description: description,
          imageBase64: imageBase64,
          imageMimeType: imageMimeType,
        },
        analysisOutput
      );

      setAnalysisStep('2/2: Running AI Valorization Decision Engine (TEA & Market Context)...');

      // 2. Build input for Valorization Decision Engine
      const valInput: ValorizationInput = {
        wasteName: analysisOutput.material || material,
        category: analysisOutput.category || category,
        subcategory: analysisOutput.subcategory,
        quantity: quantity,
        unit: unit,
        generationFrequency: 'Standard production recurring batch',
        qualityGrade: analysisOutput.recyclability_tier,
        storageCondition: 'Standard facility containment',
        hazardousDeclaration:
          analysisOutput.hazard_indicators && analysisOutput.hazard_indicators.length > 0
            ? `Hazardous: ${analysisOutput.hazard_indicators.join(', ')}`
            : 'Non-Hazardous Industrial Byproduct',
        description: description || analysisOutput.analysis_summary,
        location: location,
        composition: analysisOutput.composition_estimate?.map((c) => ({
          component: c.component,
          estimated_percentage: c.estimated_percentage,
        })),
        recyclability: analysisOutput.recyclability_tier,
        reusePotential: analysisOutput.reuse_potential,
        recoveryPotential: analysisOutput.recovery_potential,
        hazardIndicators: analysisOutput.hazard_indicators,
      };

      setActiveInput(valInput);

      // 3. Evaluate Valorization & Persist to Supabase
      const valRecord: ValorizationRecord = await valorizationService.evaluateAndSaveValorization(
        valInput
      );

      setValorizationResult(valRecord.result);
      setSelectedPathway(valRecord.result.recommended_pathway);
    } catch (err: any) {
      console.error('Sell Waste Analysis Error:', err);
      setErrorMessage(
        err?.message || 'AI valorization decision could not be completed. Please try again.'
      );
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const isRecoverable =
    (selectedPathway || valorizationResult?.recommended_pathway) !== 'alternative_disposal';

  return (
    <div className="flex flex-col w-full px-4 md:px-6 py-6 gap-6 max-w-4xl mx-auto">
      {/* 1. Simple Lifecycle Bar (Identify active) */}
      <IndustrialLifecycleBar
        currentStep={valorizationResult ? 'Valorize' : 'Identify'}
        isRecoverable={isRecoverable}
        isAnalysisComplete={Boolean(valorizationResult)}
      />

      {/* 2. Amazon/Flipkart Simple Header */}
      <PageHeader
        nodeTag="Marketplace Generator Flow"
        statusTag="Simple Waste Intake"
        title="Sell Industrial Waste & Byproducts"
        description="List your industrial waste stream in simple steps. WasteX Gemini AI analyzes purity, determines the best pathway, and checks real buyer demand."
      />

      {/* 3. Preset Scenarios (Section 14 Official Test Cases) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">bolt</span>
            Quick Test Cases (Section 14):
          </span>
          <span className="text-[11px] text-slate-500">Click to autofill manifest</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {samplePresets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="text-xs font-semibold p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-800 transition-all text-left shadow-2xs cursor-pointer truncate"
              title={p.name}
            >
              <div className="font-bold truncate">{p.name}</div>
              <span className="text-[10px] text-slate-400 font-normal">{p.categoryTag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Simple Seller Intake Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        {/* Step 1: Upload a photo (Optional) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <span>Upload a photo of your waste <span className="text-slate-400 font-normal text-xs">(Optional)</span></span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 relative flex items-center justify-center group">
              {photoUrl ? (
                <img src={photoUrl} alt="Waste preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <span className="material-symbols-outlined text-3xl text-slate-400">add_a_photo</span>
                  <p className="text-xs text-slate-500 mt-1">Photo Preview</p>
                </div>
              )}
            </div>

            <div className="sm:col-span-2 flex flex-col gap-2.5">
              <label
                htmlFor="waste-photo-input"
                className="w-fit px-4 py-2.5 rounded-xl border border-slate-300 hover:border-emerald-600 bg-white hover:bg-emerald-50 text-slate-800 text-xs font-bold cursor-pointer transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-600">upload_file</span>
                <span>Choose Photo or Take Picture</span>
              </label>
              <input
                id="waste-photo-input"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <p className="text-xs text-slate-500 leading-relaxed">
                Optical characterization verifies flake morphology, contamination, and grade specifications automatically.
              </p>
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Step 2: What material is this? */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <span>What material is this?</span>
          </label>
          <input
            id="input-material-name"
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder="Material name (e.g. Post-Industrial Plastic Flakes, Aluminum Turnings, Sawdust)"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <hr className="border-slate-100" />

        {/* Step 3: How much do you have? */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <span>How much do you have?</span>
          </label>
          <div className="flex gap-3">
            <input
              id="input-quantity"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity (e.g. 24)"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
            <select
              id="select-unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-36 px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 bg-white focus:outline-none focus:border-emerald-600"
            >
              <option value="MT">MT (Tons)</option>
              <option value="kg">kg (Kilograms)</option>
              <option value="Litres">Litres</option>
              <option value="Drums">Drums</option>
            </select>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Step 4: Where is it located? */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
              4
            </span>
            <span>Where is it located?</span>
          </label>
          <input
            id="input-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Facility city, industrial cluster, or region (e.g. Chakan, Pune, MH)"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <hr className="border-slate-100" />

        {/* Optional: Tell us anything else */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-700">
            Tell us anything else <span className="text-slate-400 font-normal">(Optional description)</span>
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Storage condition, purity, generation cycle, packaging..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        {/* Action Button: [Analyze & Find Best Pathway] */}
        <button
          id="btn-analyze-and-find-buyers"
          type="button"
          disabled={isAnalyzing || !material.trim()}
          onClick={handleAnalyzeAndValorize}
          className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-extrabold text-base shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[22px]">progress_activity</span>
              <span>{analysisStep || 'Analyzing with Gemini AI...'}</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[22px]">smart_toy</span>
              <span>Analyze & Determine Best Pathway with AI</span>
            </>
          )}
        </button>
      </div>

      {/* Error message if any */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 5. MASTER WASTEX AI WORKFLOW OUTCOME (AI Analysis Report + Eligibility Assessment + 4 Pathways) */}
      {valorizationResult && activeInput && (
        <div className="animate-in fade-in flex flex-col gap-4">
          <MasterWasteWorkflowCard
            valorization={valorizationResult}
            input={activeInput}
            onReset={() => {
              setValorizationResult(null);
              setActiveInput(null);
              setMaterial('');
              setQuantity('');
              setDescription('');
              setPhotoUrl('');
            }}
          />
        </div>
      )}
    </div>
  );
};
