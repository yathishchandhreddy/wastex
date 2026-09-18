import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AnalyzeActionButtonsProps {
  onOverrideClick?: () => void;
}

export const AnalyzeActionButtons: React.FC<AnalyzeActionButtonsProps> = ({
  onOverrideClick,
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/app/valorize');
      }, 600);
    }, 800);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-1">
      {/* Primary Valorization Trigger Button */}
      <button
        id="btn-confirm-analysis"
        type="button"
        disabled={isSubmitting}
        onClick={handleConfirm}
        className={`flex-1 py-3 px-5 rounded-lg text-xs font-semibold shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2 ${
          success
            ? 'bg-emerald-700 text-white'
            : isSubmitting
            ? 'bg-emerald-600/80 text-white cursor-wait'
            : 'bg-emerald-600 text-white hover:bg-emerald-700'
        }`}
      >
        {isSubmitting ? (
          <>
            <span className="material-symbols-outlined animate-spin text-[18px]">
              progress_activity
            </span>
            <span>Synthesizing TEA Valorization Pathways...</span>
          </>
        ) : success ? (
          <>
            <span className="material-symbols-outlined text-[18px]">task_alt</span>
            <span>Valorization Pathways Generated</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">
              science
            </span>
            <span>Confirm Stream & Run Valorization Engine</span>
          </>
        )}
      </button>

      {/* Secondary Calibration / Retake Trigger */}
      <button
        id="btn-override-scan"
        type="button"
        onClick={onOverrideClick}
        className="py-3 px-4 rounded-lg bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 active:scale-[0.99] transition-all flex items-center justify-center gap-2 border border-slate-300 shadow-xs"
      >
        <span className="material-symbols-outlined text-[18px] text-slate-500">edit_note</span>
        <span>Edit Parameters</span>
      </button>
    </div>
  );
};
