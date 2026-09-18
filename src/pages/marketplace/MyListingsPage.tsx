import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { wasteService } from '@/src/services/wasteService';
import type { WasteListingRow } from '@/src/types/database';
import { EmptyState } from '@/src/components/ui/EmptyState';

export const MyListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [myListings, setMyListings] = useState<WasteListingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadListings() {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const data = await wasteService.getMyWasteListings(user.id);
        setMyListings(data);
      } catch (err) {
        console.error('Error fetching waste listings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadListings();
  }, [user?.id]);

  return (
    <div id="my-listings-page" className="flex flex-col gap-6 pb-16">
      {/* Top Header with [+ List New Waste Stream] */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Seller Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your industrial waste streams, track interested buyers, and complete transactions
          </p>
        </div>

        <button
          id="btn-list-new-waste-stream"
          type="button"
          onClick={() => navigate('/app/sell')}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>+ List New Waste Stream</span>
        </button>
      </div>

      {/* Real KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">My Listings</span>
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">inventory_2</span>
          </div>
          <span className="text-2xl font-black text-slate-900">{myListings.length}</span>
          <span className="text-[11px] text-emerald-700 font-semibold">{myListings.length} logged</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Requests</span>
            <span className="material-symbols-outlined text-blue-600 text-[20px]">swap_horiz</span>
          </div>
          <span className="text-2xl font-black text-slate-900">0</span>
          <span className="text-[11px] text-blue-700 font-semibold">0 pending requests</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Materials Sold</span>
            <span className="material-symbols-outlined text-amber-600 text-[20px]">verified</span>
          </div>
          <span className="text-2xl font-black text-slate-900">0 MT</span>
          <span className="text-[11px] text-slate-500 font-semibold">0 MT diverted</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Earnings</span>
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">payments</span>
          </div>
          <span className="text-2xl font-black text-emerald-800">₹0</span>
          <span className="text-[11px] text-slate-400 font-medium">₹0 total value</span>
        </div>
      </div>

      {/* My Waste List */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">My Waste Listings</h2>
          <span className="text-xs text-slate-400">Real-time buyer demand tracking</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading listings...</div>
        ) : myListings.length > 0 ? (
          <div className="flex flex-col gap-3">
            {myListings.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{item.material}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {item.status || 'Active'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">{item.quantity} {item.unit}</span>
                    <span className="text-slate-300">•</span>
                    <span>📍 {item.location}</span>
                    <span className="text-slate-300">•</span>
                    <span>{item.waste_type}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/app/sell')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Manage Listing
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Waste Listings Found"
            description="You have not published any waste stream listings yet. Upload a stream to start receiving buyer offers."
            icon="inventory_2"
            actionLabel="+ List New Waste Stream"
            onAction={() => navigate('/app/sell')}
          />
        )}
      </div>
    </div>
  );
};
