import React from 'react';
import type { WasteAnalysisRecord } from '@/src/types/wasteAnalysis';

interface AnalysisHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: WasteAnalysisRecord[];
  activeAnalysisId: string | null;
  onSelectAnalysis: (record: WasteAnalysisRecord) => void;
}

export const AnalysisHistoryDrawer: React.FC<AnalysisHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  activeAnalysisId,
  onSelectAnalysis,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Analysis Run History</h2>
            <p className="text-xs text-slate-500">
              Audit log of previous AI model analyses and characterizations
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No historical analyses on record yet. Complete an analysis to start building audit trails.
            </div>
          ) : (
            history.map((item) => {
              const isSelected = item.id === activeAnalysisId;
              const formattedDate = new Date(item.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectAnalysis(item);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{item.waste_name}</span>
                      {item.is_current && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                          Current Active
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{formattedDate}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Material</span>
                      <span className="font-semibold text-slate-800 truncate block">
                        {item.result.material}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Confidence</span>
                      <span className="font-bold text-emerald-700 block">
                        {item.result.confidence}%
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Recyclability</span>
                      <span className="font-medium text-slate-700 truncate block">
                        {item.result.recyclability_tier}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Status</span>
                      <span className="font-medium text-slate-600 block">
                        {item.is_verified_by_user ? 'Verified' : 'AI Analyzed'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {history.length} {history.length === 1 ? 'analysis' : 'analyses'} recorded
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
          >
            Close History
          </button>
        </div>
      </div>
    </div>
  );
};
