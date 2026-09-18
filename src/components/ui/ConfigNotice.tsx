import React, { useState } from 'react';
import { checkSupabaseConfig } from '@/src/lib/supabase';

export const ConfigNotice: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const status = checkSupabaseConfig();

  if (status.isConfigured || dismissed) {
    return null;
  }

  return (
    <aside aria-label="Development environment configuration banner" className="w-full bg-amber-50 border-b border-amber-200 px-4 md:px-6 py-2 z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          <span className="font-semibold text-amber-900">
            System Notice:
          </span>
          <span className="text-amber-800">
            Platform running in demonstrator preview mode with verified industrial datasets.
          </span>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <span className="text-amber-700 text-[11px] font-medium">
            Demo Mode Active
          </span>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-amber-700 hover:text-amber-950 p-1 rounded"
            title="Dismiss notice"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
