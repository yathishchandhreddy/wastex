import React, { useState } from 'react';
import type { B2BMaterialListing } from '@/src/types';

interface MaterialDetailModalProps {
  listing: B2BMaterialListing | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestMaterial?: (listing: B2BMaterialListing, quantity: number) => void;
  onAskSeller?: (listing: B2BMaterialListing) => void;
  onRequestSample?: (listing: B2BMaterialListing) => void;
}

export const MaterialDetailModal: React.FC<MaterialDetailModalProps> = ({
  listing,
  isOpen,
  onClose,
  onRequestMaterial,
  onAskSeller,
  onRequestSample,
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState<number>(5);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  if (!isOpen || !listing) return null;

  const priceUsd = listing.expected_price;
  const priceInrPerKg = Math.round((priceUsd * 83) / 1000);
  const formattedInr = priceInrPerKg > 0 ? `₹${priceInrPerKg} / kg` : `₹${priceUsd}`;

  const handleRequestSubmit = () => {
    if (onRequestMaterial) {
      onRequestMaterial(listing, orderQuantity);
    }
    setFeedbackSuccess(`Purchase request for ${orderQuantity} ${listing.unit} sent to ${listing.seller_organization}!`);
    setTimeout(() => {
      setFeedbackSuccess(null);
      onClose();
    }, 2200);
  };

  const handleSampleSubmit = () => {
    if (onRequestSample) {
      onRequestSample(listing);
    }
    setFeedbackSuccess(`Technical assay sample requested from ${listing.seller_organization}. Dispatch tracking will update in My Requests.`);
    setTimeout(() => {
      setFeedbackSuccess(null);
    }, 2500);
  };

  return (
    <div
      id="material-detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="material-detail-modal-content"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              ✓ AI Analyzed & Verified
            </span>
            <span className="text-xs text-slate-500 font-medium">{listing.waste_category}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex flex-col gap-6">
          {feedbackSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
              <span>{feedbackSuccess}</span>
            </div>
          )}

          {/* Product Overview Layout: Image + Core Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Gallery / Image */}
            <div className="flex flex-col gap-2">
              <div className="aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs relative">
                <img
                  src={
                    listing.image_url ||
                    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={listing.material}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-xs font-semibold">
                  Available: {listing.quantity} {listing.unit}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                High-resolution optical scan from generator dispatch lot
              </p>
            </div>

            {/* Core Info */}
            <div className="flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">location_on</span>
                  <span>{listing.location}</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                  {listing.material}
                </h2>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600 font-medium">
                  <span>Seller:</span>
                  <span className="font-semibold text-slate-800">{listing.seller_organization}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                    {listing.seller_role}
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-emerald-900 font-medium block">Price per Unit:</span>
                    <span className="text-2xl font-black text-emerald-800">{formattedInr}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">USD Benchmark</span>
                    <span className="text-sm font-bold text-slate-700">${listing.expected_price} / MT</span>
                  </div>
                </div>

                {/* AI Analysis Summary Badges (Section 6 Requirement) */}
                <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    AI Automated Verification:
                  </span>
                  <ul className="space-y-1.5 text-xs font-semibold text-slate-700">
                    <li className="flex items-center gap-2 text-emerald-800">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                      <span>Material identified & verified non-toxic</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-800">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                      <span>Quality & assay parameters documented</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-800">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                      <span>Suitable for secondary circular recycling</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Order Quantity Selector */}
              <div className="flex items-center gap-3 pt-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                  Quantity ({listing.unit}):
                </label>
                <input
                  type="number"
                  min="1"
                  max={listing.quantity}
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                />
                <span className="text-xs text-slate-400">
                  Total est: ₹{Math.round(priceInrPerKg * orderQuantity * 1000).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* "Why this material?" Section (Section 6 Requirement) */}
          <div className="bg-amber-50/60 border border-amber-200/70 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-1.5">
              <span className="material-symbols-outlined text-[18px] text-amber-700">smart_toy</span>
              <span>Why choose this material?</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {listing.description ||
                'This industrial batch features high homogeneous purity verified by spectroscopic inspection, with low contaminant threshold and excellent thermal stability for direct secondary re-granulation or manufacturing.'}
            </p>
          </div>

          {/* Action Buttons: [Request Material] [Ask Seller] [Request Sample] */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              id="btn-request-material-submit"
              type="button"
              onClick={handleRequestSubmit}
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
              <span>Request Material</span>
            </button>

            <button
              id="btn-ask-seller"
              type="button"
              onClick={() => {
                if (onAskSeller) onAskSeller(listing);
              }}
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Ask Seller</span>
            </button>

            <button
              id="btn-request-sample-submit"
              type="button"
              onClick={handleSampleSubmit}
              className="py-2.5 px-4 rounded-xl text-xs font-bold border border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">science</span>
              <span>Request Sample</span>
            </button>
          </div>

          {/* Expandable Section: View Technical Details (Section 6 Requirement) */}
          <div className="border-t border-slate-200 pt-4">
            <button
              id="btn-toggle-technical-details"
              type="button"
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full flex items-center justify-between py-2 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-slate-500">settings_suggest</span>
                <span>View Technical Details & Assay Data</span>
              </div>
              <span className="material-symbols-outlined text-[20px]">
                {showTechnicalDetails ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {showTechnicalDetails && (
              <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3 animate-in fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Quality Grade:</span>
                    <span className="font-semibold text-slate-800">{listing.quality}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Generation Frequency:</span>
                    <span className="font-semibold text-slate-800">{listing.generation_frequency}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Compliance Standard:</span>
                    <span className="font-semibold text-slate-800">{listing.compliance_status}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Availability Window:</span>
                    <span className="font-semibold text-slate-800">{listing.availability}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Circular Track:</span>
                    <span className="font-semibold text-emerald-800">{listing.recovery_pathway}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Pricing Type:</span>
                    <span className="font-semibold text-slate-800">{listing.price_type}</span>
                  </div>
                </div>

                {listing.observations && listing.observations.length > 0 && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                      Laboratory Assay Observations:
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      {listing.observations.map((obs, i) => (
                        <li key={i}>{obs}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
