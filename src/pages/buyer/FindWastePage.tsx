import React, { useState } from 'react';
import { PageHeader } from '@/src/components/layout/PageHeader';
import { DEMO_B2B_EXCHANGE_LISTINGS, DEMO_DATA_BADGE } from '@/src/data/demo';
import { B2BExchangeListing } from '@/src/types';

export const FindWastePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedListingForDetails, setSelectedListingForDetails] = useState<B2BExchangeListing | null>(null);
  const [selectedListingForSample, setSelectedListingForSample] = useState<B2BExchangeListing | null>(null);
  const [sampleVolume, setSampleVolume] = useState('25');
  const [sampleUnit, setSampleUnit] = useState('kg (Assay Sample)');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredListings = DEMO_B2B_EXCHANGE_LISTINGS.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.waste_category === selectedCategory;
    const matchesSearch =
      search === '' ||
      item.material.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      item.seller_organization.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleRequestSample = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedListingForSample) {
      showToast(
        `Technical assay sample of ${sampleVolume} ${sampleUnit} for ${selectedListingForSample.material} requested from ${selectedListingForSample.seller_organization}.`
      );
      setSelectedListingForSample(null);
    }
  };

  return (
    <div className="flex flex-col w-full px-4 md:px-6 py-6 gap-6 max-w-5xl mx-auto">
      <PageHeader
        nodeTag="Feedstock Discovery Registry"
        statusTag="Live Industrial Directory"
        title="Discover Industrial Byproducts & Secondary Feedstocks"
        description="Search certified post-industrial scrap, mineral slag, and polymer byproducts verified by spectroscopic characterization."
        badge={DEMO_DATA_BADGE}
      />

      {/* Toast Notice */}
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

      {/* Search & Filter Input Bar */}
      <div className="bg-white border border-slate-200 p-3 rounded-xl flex flex-col md:flex-row items-center gap-3 shadow-xs">
        <div className="flex-1 w-full flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus-within:border-emerald-600 focus-within:bg-white transition-all">
          <span className="material-symbols-outlined text-slate-400 text-[18px]">search</span>
          <input
            type="text"
            placeholder="Search by polymer grade, metal alloy, mineral composition, or dispatch plant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-slate-900 text-xs font-medium w-full focus:outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
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

      {/* Material Feed (Section 7 Display Requirements) */}
      <div className="grid grid-cols-1 gap-4">
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 shadow-xs hover:border-slate-300 transition-all"
          >
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-start gap-4">
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

              {/* Price Tag */}
              <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Indicative Valuation
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

            {/* Specifications Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Batch Quantity
                </span>
                <strong className="text-slate-900">
                  {listing.quantity} {listing.unit}
                </strong>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Generation Frequency
                </span>
                <strong className="text-slate-900">{listing.generation_frequency}</strong>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Grade / Purity
                </span>
                <strong className="text-slate-900">{listing.quality}</strong>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Dispatch Location
                </span>
                <strong className="text-slate-900">{listing.location}</strong>
              </div>
            </div>

            {/* Actions: View Details, Request Material, Contact */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-emerald-600">verified</span>
                <span>Verified Clean Stream Certificate</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedListingForDetails(listing)}
                  className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>View Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedListingForSample(listing)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">science</span>
                  <span>Request Material Sample</span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast(`Inquiry sent to ${listing.seller_organization}.`)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  <span>Contact</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILS MODAL */}
      {selectedListingForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl flex flex-col gap-4 border border-slate-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  Material Assay & Recovery Profile
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedListingForDetails.material}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedListingForDetails(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex gap-4 items-center">
              <img
                src={selectedListingForDetails.image_url || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80'}
                alt="Feedstock"
                className="w-20 h-20 rounded-lg object-cover border border-slate-200"
              />
              <div className="text-xs text-slate-600 space-y-1">
                <p>
                  <strong>Seller:</strong> {selectedListingForDetails.seller_organization}
                </p>
                <p>
                  <strong>Waste Category:</strong> {selectedListingForDetails.waste_category}
                </p>
                <p>
                  <strong>Pathway:</strong> {selectedListingForDetails.recovery_pathway}
                </p>
                <p>
                  <strong>Location:</strong> {selectedListingForDetails.location}
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
              <p>
                <strong>Specification / Grade:</strong> {selectedListingForDetails.quality}
              </p>
              <p>
                <strong>Generation Frequency:</strong> {selectedListingForDetails.generation_frequency} ({selectedListingForDetails.quantity} {selectedListingForDetails.unit}/cycle)
              </p>
              <p>
                <strong>Price Terms:</strong> ${selectedListingForDetails.expected_price} {selectedListingForDetails.currency}/{selectedListingForDetails.unit} ({selectedListingForDetails.price_type})
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedListingForDetails(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedListingForSample(selectedListingForDetails);
                  setSelectedListingForDetails(null);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
              >
                Request Material Sample
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAMPLE REQUEST MODAL */}
      {selectedListingForSample && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleRequestSample}
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl flex flex-col gap-4 border border-slate-200"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  Technical Sample Requisition
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  Request {selectedListingForSample.material} Sample
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedListingForSample(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Request an inspection batch from <strong>{selectedListingForSample.seller_organization}</strong> ({selectedListingForSample.location}) for laboratory testing before full contract execution.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Sample Quantity</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={sampleVolume}
                  onChange={(e) => setSampleVolume(e.target.value)}
                  className="w-24 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                />
                <select
                  value={sampleUnit}
                  onChange={(e) => setSampleUnit(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="kg (Assay Sample)">kg (Assay Sample)</option>
                  <option value="Tons (Trial Batch)">Tons (Trial Batch)</option>
                  <option value="Liters (Liquid Assay)">Liters (Liquid Assay)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedListingForSample(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Send Sample Request</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
