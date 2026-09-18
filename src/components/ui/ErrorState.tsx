import React from 'react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Operation Error',
  message = 'An unexpected failure interrupted this operation.',
  onRetry,
}) => {
  return (
    <div className="w-full rounded-xl bg-rose-50 border border-rose-200 p-6 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 mb-3">
        <span className="material-symbols-outlined text-[24px]">error</span>
      </div>
      <h3 className="text-base font-semibold text-rose-900">
        {title}
      </h3>
      <p className="text-xs text-rose-700 max-w-sm mt-1 mb-4 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-white border border-rose-300 text-rose-800 text-xs font-semibold hover:bg-rose-100/50 shadow-xs transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
};
