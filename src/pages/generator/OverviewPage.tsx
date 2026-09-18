import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/src/components/layout/PageHeader';
import { IndustrialLifecycleBar } from '@/src/components/lifecycle/IndustrialLifecycleBar';
import { useAuth } from '@/src/context/AuthContext';
import { wasteService } from '@/src/services/wasteService';
import type { WasteListingRow } from '@/src/types/database';
import { EmptyState } from '@/src/components/ui/EmptyState';

export const OverviewPage: React.FC = () => {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState<WasteListingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const data = await wasteService.getMyWasteListings(user.id);
        setMyListings(data);
      } catch (err) {
        console.error('Error loading generator waste listings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.id]);

  return (
    <div className="flex flex-col w-full px-4 md:px-6 py-6 gap-6 max-w-6xl mx-auto">
      {/* Industrial Lifecycle Visual Bar */}
      <IndustrialLifecycleBar currentStep="Identify" isRecoverable={myListings.length > 0} />

      <PageHeader
        nodeTag={`Facility: ${user?.user_metadata?.organization_name || user?.email || 'My Industrial Facility'}`}
        statusTag="Telemetry Online"
        title="Industrial Generator Operations Hub"
        description="Continuous byproduct characterization, multi-pathway techno-economic valorization, and circular buyer exchange."
        action={
          <Link
            to="/app/analyze"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold shadow-xs hover:bg-emerald-700 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">document_scanner</span>
            <span>Analyze Waste Stream</span>
          </Link>
        }
      />

      {/* Grid KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Active waste streams */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Active Waste Streams
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">inventory_2</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-2xl font-extrabold text-slate-900">{myListings.length}</span>
            <span className="text-xs font-medium text-slate-500">Streams</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1">Logged in plant registry</span>
        </div>

        {/* KPI 2: Recoverable materials */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Recoverable Materials
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">recycling</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-2xl font-extrabold text-emerald-700">{myListings.length}</span>
            <span className="text-xs font-medium text-emerald-800">/ {myListings.length}</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1">Active valorizable lots</span>
        </div>

        {/* KPI 3: Materials sent to recovery */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Sent to Recovery
            </span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-2xl font-extrabold text-slate-900">0.0</span>
            <span className="text-xs font-semibold text-sky-700">MT</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1">Delivered to circular offtakers</span>
        </div>

        {/* KPI 4: Potential economic value */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Potential Value
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">payments</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-2xl font-extrabold text-slate-900">₹0</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1">₹0 realization</span>
        </div>

        {/* KPI 5: CO2 emissions saved */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              CO₂ Saved
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">eco</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-2xl font-extrabold text-slate-900">0.0</span>
            <span className="text-xs font-semibold text-emerald-700">tCO₂e</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1">Virgin material abatement</span>
        </div>
      </div>

      {/* Industrial Waste Lifecycle Workflow Navigator */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              WasteX AI Industrial Lifecycle Pipeline
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identify Byproduct → AI Analysis → Recovery Decision → Valuation & Demand → Bilateral Matching → Exchange
            </p>
          </div>
          <Link
            to="/app/analyze"
            className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
          >
            <span>Start Stream Flow</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <Link
            to="/app/analyze"
            className="p-3.5 rounded-lg bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] flex items-center justify-center font-bold">1</span>
              <span className="material-symbols-outlined text-slate-600 text-[18px]">inventory_2</span>
            </div>
            <span className="text-xs font-bold text-slate-900 mt-1">1. Identify</span>
            <span className="text-[11px] text-slate-500 leading-tight">Input waste manifest</span>
          </Link>

          <Link
            to="/app/analyze"
            className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-300 transition-all flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center font-bold">2</span>
              <span className="material-symbols-outlined text-emerald-700 text-[18px]">psychology</span>
            </div>
            <span className="text-xs font-bold text-slate-900 mt-1">2. Analyze</span>
            <span className="text-[11px] text-emerald-800 leading-tight">AI characterization</span>
          </Link>

          <Link
            to="/app/valorize"
            className="p-3.5 rounded-lg bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] flex items-center justify-center font-bold">3</span>
              <span className="material-symbols-outlined text-slate-600 text-[18px]">alt_route</span>
            </div>
            <span className="text-xs font-bold text-slate-900 mt-1">3. Valorize</span>
            <span className="text-[11px] text-slate-500 leading-tight">Ranked reuse pathways</span>
          </Link>

          <Link
            to="/app/demands"
            className="p-3.5 rounded-lg bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] flex items-center justify-center font-bold">4</span>
              <span className="material-symbols-outlined text-slate-600 text-[18px]">trending_up</span>
            </div>
            <span className="text-xs font-bold text-slate-900 mt-1">4. Demand</span>
            <span className="text-[11px] text-slate-500 leading-tight">Market valuation range</span>
          </Link>

          <Link
            to="/app/exchange"
            className="p-3.5 rounded-lg bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] flex items-center justify-center font-bold">5</span>
              <span className="material-symbols-outlined text-slate-600 text-[18px]">hub</span>
            </div>
            <span className="text-xs font-bold text-slate-900 mt-1">5. Match</span>
            <span className="text-[11px] text-slate-500 leading-tight">AI buyer matching</span>
          </Link>

          <Link
            to="/app/exchange"
            className="p-3.5 rounded-lg bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] flex items-center justify-center font-bold">6</span>
              <span className="material-symbols-outlined text-slate-600 text-[18px]">handshake</span>
            </div>
            <span className="text-xs font-bold text-slate-900 mt-1">6. Exchange</span>
            <span className="text-[11px] text-slate-500 leading-tight">B2B circular transaction</span>
          </Link>
        </div>
      </div>

      {/* Active Material Streams Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700 text-[20px]">format_list_bulleted</span>
            <h2 className="text-sm font-bold text-slate-900">
              Facility Waste Streams Under Assessment
            </h2>
          </div>
          <span className="text-xs text-slate-500">Facility Registry</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading facility waste streams...</div>
        ) : myListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myListings.map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {item.status || 'Active'}
                  </span>
                  <span className="text-xs text-slate-500">{item.waste_type}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{item.material}</h3>
                <p className="text-xs text-slate-600">
                  Quantity: <strong>{item.quantity} {item.unit}</strong> • Location: {item.location}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Waste Streams Registered"
            description="There are currently no active waste streams logged for this facility. Click 'Analyze Waste Stream' to run an AI assessment."
            icon="document_scanner"
            actionLabel="Analyze Waste Stream"
            onAction={() => window.location.href = '/app/analyze'}
          />
        )}
      </div>
    </div>
  );
};
