import React, { useState } from 'react';

interface ScannerViewportProps {
  imageUrl?: string;
  matrixLabel?: string;
  sampleCode?: string;
  onCameraClick?: () => void;
  onBatchClick?: () => void;
}

export const ScannerViewport: React.FC<ScannerViewportProps> = ({
  imageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrFmoqQEVDCjB5IJ2zUfI4f36BKNIkkOcolW5WrRLd1eODPyxa_yRm4EclhD-UDWodsB83KRtUz8x_bf6HpGCy10bmgIyW9yitYvrpiDB2hN1QJ55dlp-3Tyc55rIniW2gRuURfN-oCcO6mrCaudqQjW31mySS4IVgx-_yLZq8YkrIBKkuN_eCOMh75L4BHFs-5VU8GhQbtTE3IEC_nLq9Y56t3frWlgqSMPWeXrVJbGQWm1JQ3vtqQw',
  matrixLabel = 'Matrix: Rigid Thermoplastic Flakes',
  sampleCode = 'SAMPLE-PET-0982',
  onCameraClick,
  onBatchClick,
}) => {
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSource, setActiveSource] = useState<'camera' | 'batch'>('camera');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="w-full rounded-xl bg-white p-4 border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span className="text-xs font-semibold text-slate-800">
            Material Sample Inspection Viewport
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] font-mono text-slate-500">
            {sampleCode}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium">
            {matrixLabel}
          </span>
        </div>
      </div>

      {/* Sample Image Preview Container */}
      <div className="relative w-full h-72 rounded-lg overflow-hidden bg-slate-900 border border-slate-200">
        <img
          id="analyzer-feed-img"
          alt="Clean industrial shredded PET polymer plastic flakes and compacted pellets inside an analytical laboratory tray"
          className={`w-full h-full object-cover transition-all duration-300 ${
            isRefreshing ? 'opacity-70 scale-[0.99]' : 'opacity-100'
          } ${isEnhanced ? 'contrast-125 saturate-150' : ''}`}
          src={imageUrl}
        />

        {/* Professional Inspection Badge Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5 shadow-sm border border-slate-700/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>AI Multi-Spectral Capture</span>
          </div>
          {isEnhanced && (
            <div className="px-2 py-1 rounded-md bg-emerald-700/90 text-white text-[11px] font-medium shadow-sm">
              Contrast Enhanced
            </div>
          )}
        </div>

        {/* Viewport Action Controls */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            id="btn-recalibrate"
            aria-label="Refresh sample analysis"
            type="button"
            onClick={handleRefresh}
            className="h-8 px-2.5 rounded-md bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-medium backdrop-blur-md transition-all flex items-center gap-1 shadow-sm border border-slate-700/60"
            title="Refresh sample analysis"
          >
            <span className={`material-symbols-outlined text-[16px] ${isRefreshing ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span className="hidden sm:inline text-[11px]">Re-scan</span>
          </button>
          <button
            id="btn-toggle-spectrum"
            aria-label="Toggle enhanced contrast"
            type="button"
            onClick={() => setIsEnhanced(!isEnhanced)}
            className={`h-8 px-2.5 rounded-md text-xs font-medium backdrop-blur-md transition-all flex items-center gap-1 shadow-sm border ${
              isEnhanced
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-900/80 text-white hover:bg-slate-900 border-slate-700/60'
            }`}
            title="Toggle contrast filter"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span className="hidden sm:inline text-[11px]">Filter</span>
          </button>
        </div>

        {/* Bottom Inspection Metadata Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-md bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-white text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
            <span className="font-medium text-slate-200">Spectrometric Validation Passed</span>
          </div>
          <span className="text-slate-400 text-[11px] font-mono">
            NIR 980nm - 1450nm Band
          </span>
        </div>
      </div>

      {/* Input Source Mode Switcher */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            setActiveSource('camera');
            onCameraClick?.();
          }}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all border ${
            activeSource === 'camera'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">photo_camera</span>
          <span>Optical Inspection Image</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveSource('batch');
            onBatchClick?.();
          }}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all border ${
            activeSource === 'batch'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">upload_file</span>
          <span>Laboratory Test Report / Certificate</span>
        </button>
      </div>
    </div>
  );
};
