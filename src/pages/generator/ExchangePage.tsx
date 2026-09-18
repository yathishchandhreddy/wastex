import React, { useState } from 'react';
import { PageHeader } from '@/src/components/layout/PageHeader';
import { IndustrialLifecycleBar } from '@/src/components/lifecycle/IndustrialLifecycleBar';
import {
  DEMO_MATCHES,
  DEMO_B2B_EXCHANGE_LISTINGS,
  DEMO_DATA_BADGE,
  DEMO_CURRENT_LISTING,
} from '@/src/data/demo';
import { B2BExchangeListing } from '@/src/types';

export const ExchangePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'matches'>('marketplace');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals / Interaction State
  const [detailModalListing, setDetailModalListing] = useState<B2BExchangeListing | null>(null);
  const [requestModalListing, setRequestModalListing] = useState<B2BExchangeListing | null>(null);
  const [requestedVolume, setRequestedVolume] = useState('10');
  const [requestNotes, setRequestNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredListings = DEMO_B2B_EXCHANGE_LISTINGS.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.waste_category === selectedCategory;
    const matchesSearch =
      searchTerm === '' ||
      item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.seller_organization.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSendMaterialRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestModalListing) {
      showToast(
        `Material procurement request for ${requestedVolume} ${requestModalListing.unit} of ${requestModalListing.material} dispatched to ${requestModalListing.seller_organization}.`
      );
      setRequestModalListing(null);
      setRequestNotes('');
    }
  };

  return (
    <div className="flex flex-col w-full px-4 md:px-6 py-6 gap-6 max-w-5xl mx-auto">
      {/* Industrial Lifecycle Bar */}
      <IndustrialLifecycleBar currentStep="Exchange" isRecoverable={true} />

      {/* Header Hub */}
      <PageHeader
        nodeTag="Platform: B2B Industrial Exchange Network"
        statusTag="Bilateral Liquidity Desk Active"
        title="Industrial Material Exchange & Smart Matching"
        description="Connect recoverable secondary feedstocks directly with vetted industrial offtakers, recycling processors, and manufacturers."
        badge={DEMO_DATA_BADGE}
      />

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-700 text-white text-xs font-semibold flex items-center justify-between shadow-md transition-all">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* View Switcher Tabs (Section 7 B2B Platform vs Section 8-9 Smart Matching) */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('marketplace')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'marketplace'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span>B2B Material Exchange ({DEMO_B2B_EXCHANGE_LISTINGS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'matches'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span>Smart Offtaker Matches ({DEMO_MATCHES.length})</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 hidden sm:flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active Feedstock: <strong>{DEMO_CURRENT_LISTING.material}</strong></span>
        </div>
      </div>

      {/* TAB 1: B2B MATERIAL EXCHANGE (SECTION 7) */}
      {activeTab === 'marketplace' && (
        <div className="flex flex-col gap-5">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 w-full flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus-within:border-emerald-600 focus-within:bg-white">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">search</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search secondary materials, cities, sellers, or specifications..."
                className="bg-transparent text-xs text-slate-900 w-full focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {['All', 'Plastics', 'Metals', 'Byproducts', 'Paper'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Listings Feed */}
          <div className="grid grid-cols-1 gap-4">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4 hover:border-slate-300 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={listing.image_url || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80'}
                      alt={listing.material}
                      className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                          {listing.waste_category}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 text-[10px] font-bold border border-sky-200">
                          {listing.recovery_pathway}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            listing.availability === 'Immediate' || listing.availability === 'Continuous Contract'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {listing.availability}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {listing.material}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="material-symbols-outlined text-[14px]">apartment</span>
                        <span className="font-semibold text-slate-700">{listing.seller_organization}</span>
                        <span>•</span>
                        <span>{listing.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Expected Price
                    </span>
                    <div className="text-base font-bold text-slate-900 mt-0.5">
                      ${listing.expected_price}{' '}
                      <span className="text-xs font-normal text-slate-500">
                        {listing.currency}/{listing.unit}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 mt-0.5">
                      {listing.price_type}
                    </span>
                  </div>
                </div>

                {/* Details Meta Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Volume per Batch
                    </span>
                    <strong className="text-slate-900">
                      {listing.quantity} {listing.unit}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Generation Cadence
                    </span>
                    <strong className="text-slate-900">{listing.generation_frequency}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Quality / Grade
                    </span>
                    <strong className="text-slate-900">{listing.quality}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Dispatch Origin
                    </span>
                    <strong className="text-slate-900">{listing.location}</strong>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-emerald-600">verified</span>
                    <span>Verified Laboratory Assay Attached</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDetailModalListing(listing)}
                      className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>View Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRequestModalListing(listing);
                        setRequestedVolume(String(listing.quantity));
                      }}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                      <span>Request Material</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        showToast(`Inquiry channel initiated with ${listing.seller_organization} logistics coordinator.`);
                      }}
                      className="px-3.5 py-2 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">mail</span>
                      <span>Contact Seller</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SMART BUYER MATCHING (SECTION 8 & 9) */}
      {activeTab === 'matches' && (
        <div className="flex flex-col gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Multi-Factor Algorithmic Matching
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluates chemical grade compatibility, volume requirements, transit distance, and price tolerances.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {DEMO_MATCHES.length} Active Buyers Found
            </span>
          </div>

          {DEMO_MATCHES.map((match) => (
            <div
              key={match.id}
              className="rounded-xl bg-white border border-slate-200 p-5 shadow-xs flex flex-col gap-4 hover:border-slate-300 transition-all"
            >
              {/* Top Row: Buyer Name, Buyer Type, & Compatibility Score */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                    <span className="material-symbols-outlined text-[20px]">corporate_fare</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        {match.requirement?.buyer_company}
                      </h3>
                      {/* Buyer Type Tag mandated by Section 9 */}
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 text-[10px] font-bold border border-sky-200">
                        {match.buyer_type || 'Recycling Company'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{match.requirement?.location}</span>
                      <span>•</span>
                      <span>{match.requirement?.frequency} procurement cycle</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    {match.match_score}% Compatibility Index
                  </span>
                </div>
              </div>

              {/* Section 9: Plain Text "Why this is a match" Explanation Box */}
              <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 flex flex-col gap-1">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-700">psychology</span>
                  Why this is a match:
                </span>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  &ldquo;{match.reason}&rdquo;
                </p>
              </div>

              {/* Score Factors Breakdown */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex flex-col items-center text-center">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Material</span>
                  <span className="text-xs font-bold text-emerald-700 mt-0.5">{match.material_score}%</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Volume</span>
                  <span className="text-xs font-bold text-emerald-700 mt-0.5">{match.quantity_score}%</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Purity</span>
                  <span className="text-xs font-bold text-emerald-700 mt-0.5">{match.quality_score}%</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Transit</span>
                  <span className="text-xs font-bold text-sky-700 mt-0.5">{match.location_score}%</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Price</span>
                  <span className="text-xs font-bold text-amber-700 mt-0.5">{match.price_score}%</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Cadence</span>
                  <span className="text-xs font-bold text-emerald-700 mt-0.5">{match.frequency_score}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
                <div className="text-xs text-slate-600">
                  Buyer Indicative Bid:{' '}
                  <span className="text-slate-900 font-bold">
                    ${match.requirement?.max_price} {match.requirement?.currency}/MT
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      `Supply proposal sent to ${match.requirement?.buyer_company} for 12.5 MT at $${match.requirement?.max_price}/MT.`
                    )
                  }
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Initiate Supply Request</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {detailModalListing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl flex flex-col gap-4 border border-slate-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  Secondary Material Specification
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  {detailModalListing.material}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalListing(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex gap-4 items-center">
              <img
                src={detailModalListing.image_url || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80'}
                alt="Feedstock"
                className="w-24 h-24 rounded-lg object-cover border border-slate-200"
              />
              <div className="text-xs text-slate-600 space-y-1">
                <p>
                  <strong>Seller:</strong> {detailModalListing.seller_organization}
                </p>
                <p>
                  <strong>Category:</strong> {detailModalListing.waste_category}
                </p>
                <p>
                  <strong>Recommended Pathway:</strong> {detailModalListing.recovery_pathway}
                </p>
                <p>
                  <strong>Location:</strong> {detailModalListing.location}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Available Batch</span>
                <span className="font-bold text-slate-900">
                  {detailModalListing.quantity} {detailModalListing.unit} ({detailModalListing.generation_frequency})
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Expected Valuation</span>
                <span className="font-bold text-emerald-700">
                  ${detailModalListing.expected_price} {detailModalListing.currency}/{detailModalListing.unit}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900">Assay & Quality Note: </strong>
              {detailModalListing.quality}. Certified under ASTM standardized post-industrial feedstock protocols. NIR optical sorting confirms low contaminant threshold.
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDetailModalListing(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setRequestModalListing(detailModalListing);
                  setRequestedVolume(String(detailModalListing.quantity));
                  setDetailModalListing(null);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
              >
                Proceed to Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST MATERIAL MODAL */}
      {requestModalListing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSendMaterialRequest}
            className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl flex flex-col gap-4 border border-slate-200"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  Material Procurement Request
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  Request {requestModalListing.material}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setRequestModalListing(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="text-xs text-slate-600">
              Transmitting formal secondary feedstock inquiry to <strong>{requestModalListing.seller_organization}</strong> for dispatch from <strong>{requestModalListing.location}</strong>.
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Requested Volume ({requestModalListing.unit})
              </label>
              <input
                type="number"
                value={requestedVolume}
                onChange={(e) => setRequestedVolume(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Procurement Notes & Delivery Terms
              </label>
              <textarea
                rows={3}
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
                placeholder="Specify target intake date, packaging requirements (e.g. supersacks), or sample testing requests..."
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRequestModalListing(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Send Procurement Request</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
