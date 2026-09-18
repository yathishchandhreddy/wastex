import React from 'react';
import { Link } from 'react-router-dom';

interface NotFoundStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const NotFoundState: React.FC<NotFoundStateProps> = ({
  title = 'Page Not Found',
  description = 'The requested industrial resource or page does not exist on this platform.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-12">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-4">
        <span className="material-symbols-outlined text-[24px]">search_off</span>
      </div>
      <div className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-2">
        Error 404
      </div>
      <h1 className="text-2xl font-bold text-slate-900">
        {title}
      </h1>
      <p className="text-sm text-slate-600 max-w-md mt-2 mb-6">
        {description}
      </p>
      <div className="flex gap-3">
        {onAction && actionLabel ? (
          <button
            type="button"
            onClick={onAction}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs transition-all"
          >
            {actionLabel}
          </button>
        ) : (
          <Link
            to="/app/analyze"
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs transition-all"
          >
            Go to Waste Analyzer
          </Link>
        )}
        <Link
          to="/app"
          className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-all"
        >
          Dashboard Overview
        </Link>
      </div>
    </div>
  );
};
