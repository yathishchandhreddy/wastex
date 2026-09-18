import React from 'react';

interface PageHeaderProps {
  nodeTag?: string;
  statusTag?: string;
  title: string;
  description?: string;
  badge?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  nodeTag = 'Facility: Pune Plant 04',
  statusTag = 'Operational',
  title,
  description,
  badge,
  action,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span className="font-medium text-slate-700">
            {nodeTag}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-medium">
            {statusTag}
          </span>
          {badge && (
            <span className="ml-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {badge}
            </span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="self-start sm:self-center shrink-0">{action}</div>}
    </div>
  );
};
