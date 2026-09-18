import React from 'react';
import { PageHeader } from '@/src/components/layout/PageHeader';
import { checkSupabaseConfig } from '@/src/lib/supabase';

export const SettingsPage: React.FC = () => {
  const supabaseStatus = checkSupabaseConfig();

  return (
    <div className="flex flex-col w-full px-margin pb-space-xl gap-space-lg select-none max-w-3xl mx-auto">
      <PageHeader
        nodeTag="System & Hardware Config"
        statusTag="Firmware v2.4.1"
        title="Node Configuration"
        description="Spectroscopic hardware calibration, AI inference parameters, and cloud runtime credentials."
      />

      <div className="bg-[#0D131A] border border-[#1D2836] p-space-lg rounded-xl shadow-xl flex flex-col gap-4">
        <div>
          <h3 className="font-headline-md text-base text-[#F4F7FA] font-bold">
            Database & Cloud Persistence (Supabase)
          </h3>
          <p className="font-body-sm text-xs text-[#6F8299] mt-1">
            Status of client connection to Supabase database.
          </p>
        </div>

        <div className="bg-[#101418] p-3 rounded-lg border border-[#1D2836] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                supabaseStatus.isConfigured ? 'bg-[#00E599]' : 'bg-[#E1C068]'
              }`}
            />
            <span className="font-label-md text-xs text-[#F4F7FA]">
              {supabaseStatus.isConfigured
                ? 'Supabase Configured & Active'
                : 'Development Mode (Unconfigured)'}
            </span>
          </div>
          <span className="font-label-sm text-[10px] text-[#6F8299] uppercase">
            Step 1 Preview
          </span>
        </div>

        <div className="pt-2 border-t border-[#1D2836]">
          <h4 className="font-label-md text-xs text-[#F4F7FA] font-semibold mb-2">
            Multimodal AI Architecture (Gemini)
          </h4>
          <p className="text-xs text-[#6F8299]">
            In compliance with security standards, AI reasoning runs strictly server-side. The client will connect via authenticated `/api/ai/*` routes in Step 2.
          </p>
        </div>
      </div>
    </div>
  );
};
