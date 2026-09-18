import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEMO_B2B_EXCHANGE_LISTINGS } from '@/src/data/demo';
import { MaterialCard } from '@/src/components/marketplace/MaterialCard';
import { MaterialDetailModal } from '@/src/components/marketplace/MaterialDetailModal';
import { BuyerRequirementModal } from '@/src/components/marketplace/BuyerRequirementModal';
import { EmptyState } from '@/src/components/ui/EmptyState';
import type { B2BMaterialListing } from '@/src/types';

export const MyRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false);
  const [activeModalListing, setActiveModalListing] = useState<B2BMaterialListing | null>(null);

  // Active requests tracked by the buyer
  const [requests, setRequests] = useState<any[]>([]);

  const recommendedMaterials = DEMO_B2B_EXCHANGE_LISTINGS.slice(0, 4);

  const handleAddRequirement = (data: {
    material: string;
    quantity: string;
    unit: string;
    location: string;
    targetPrice?: string;
    frequency?: string;
  }) => {
    const newReq = {
      id: `req-${Date.now()}`,
      material: data.material,
      quantity: `${data.quantity} ${data.unit}`,
      frequency: data.frequency || 'One-time',
      location: data.location || 'Pan-India',
      targetPrice: data.targetPrice || 'Market benchmark',
      status: 'Matching',
      offersCount: 0,
      date: 'Just now',
    };
    setRequests([newReq, ...requests]);
  };

  return (
    <div id="my-requests-page" className="flex flex-col gap-6 pb-16">
      {/* Top Header with [+ Post What You Need] */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Buyer Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track material purchase requests, assay sample dispatches, and incoming generator bids
          </p>
        </div>

        <button
          id="btn-post-what-you-need"
          type="button"
          onClick={() => setIsRequirementModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>+ Post What You Need</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">My Requests</span>
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">assignment</span>
          </div>
          <span className="text-2xl font-black text-slate-900">{requests.length}</span>
          <span className="text-[11px] text-emerald-700 font-semibold">Active requisitions</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Saved Materials</span>
            <span className="material-symbols-outlined text-amber-500 text-[20px]">favorite</span>
          </div>
          <span className="text-2xl font-black text-slate-900">0</span>
          <span className="text-[11px] text-slate-500 font-semibold">0 bookmarked</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Samples Requested</span>
            <span className="material-symbols-outlined text-blue-600 text-[20px]">science</span>
          </div>
          <span className="text-2xl font-black text-slate-900">0</span>
          <span className="text-[11px] text-blue-700 font-semibold">0 pending samples</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Purchases</span>
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">shopping_cart_checkout</span>
          </div>
          <span className="text-2xl font-black text-emerald-800">0 MT</span>
          <span className="text-[11px] text-slate-400 font-medium">0 MT procured</span>
        </div>
      </div>

      {/* My Active Requests */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">My Active Requisitions</h2>
          <span className="text-xs text-slate-400">Live generator matching</span>
        </div>

        {requests.length > 0 ? (
          <div className="flex flex-col gap-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900">{req.material}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {req.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Needed: {req.quantity}</span>
                    <span className="text-slate-300">•</span>
                    <span>Target: {req.targetPrice}</span>
                    <span className="text-slate-300">•</span>
                    <span>{req.frequency}</span>
                    <span className="text-slate-300">•</span>
                    <span>📍 {req.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => navigate(`/app/buy?q=${encodeURIComponent(req.material)}`)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                  >
                    View Matches
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Active Material Requisitions"
            description="You have not posted any material purchase requirements yet. Click below to announce what secondary feedstocks you need."
            icon="assignment"
            actionLabel="+ Post What You Need"
            onAction={() => setIsRequirementModalOpen(true)}
          />
        )}
      </div>

      {/* Recommended for You Section (Section 10 Requirement) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">smart_toy</span>
              <span>Recommended for You</span>
            </h2>
            <p className="text-xs text-slate-500">Materials matching your purchase history and target specs</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/app/buy')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            Explore marketplace →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedMaterials.map((item) => (
            <MaterialCard
              key={item.id}
              listing={item}
              onViewDetails={(l) => setActiveModalListing(l)}
              onRequestSample={(l) => setActiveModalListing(l)}
              isRecommended={true}
            />
          ))}
        </div>
      </div>

      {/* Requirement Modal */}
      <BuyerRequirementModal
        isOpen={isRequirementModalOpen}
        onClose={() => setIsRequirementModalOpen(false)}
        onSubmit={handleAddRequirement}
      />

      {/* Detail Modal */}
      <MaterialDetailModal
        listing={activeModalListing}
        isOpen={!!activeModalListing}
        onClose={() => setActiveModalListing(null)}
        onRequestMaterial={(listing, qty) => {
          console.log('Order sent:', listing.material, qty);
        }}
        onAskSeller={(listing) => {
          setActiveModalListing(null);
          navigate(`/app/messages?seller=${encodeURIComponent(listing.seller_organization)}`);
        }}
      />
    </div>
  );
};
