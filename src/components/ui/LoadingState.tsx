import React from 'react';

interface LoadingStateProps {
  label?: string;
  sublabel?: string;
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label,
  sublabel = 'Awaiting AI classification and market yield calculation',
  message,
}) => {
  const displayLabel = label || message || 'Processing Feedstock Analysis...';
  return (
    <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center">
      <div className="relative w-12 h-12 flex items-center justify-center mb-4">
        <div className="w-10 h-10 rounded-full border-3 border-slate-200 border-t-emerald-600 animate-spin" />
      </div>
      <p className="text-sm font-semibold text-slate-800">
        {displayLabel}
      </p>
      <p className="text-xs text-slate-500 mt-1">
        {sublabel}
      </p>
    </div>
  );
};
