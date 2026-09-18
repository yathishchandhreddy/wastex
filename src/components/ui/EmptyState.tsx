import React from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Records Found',
  description = 'No active data or listings match the current filter criteria.',
  icon = 'inbox',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="w-full rounded-xl bg-white border border-slate-200 shadow-xs p-8 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <h3 className="text-base font-semibold text-slate-800">
        {title}
      </h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs active:scale-95 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
