import React from 'react';
import type { B2BMaterialListing } from '@/src/types';

interface MaterialCardProps {
  listing: B2BMaterialListing;
  onViewDetails: (listing: B2BMaterialListing) => void;
  onRequestSample?: (listing: B2BMaterialListing) => void;
  matchScore?: number;
  isRecommended?: boolean;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  listing,
  onViewDetails,
  onRequestSample,
  matchScore,
  isRecommended,
}) => {
  // Compute approximate price in INR and USD for dual display
  const priceUsd = listing.expected_price;
  const priceInrPerKg = Math.round((priceUsd * 83) / 1000); // 1 USD ~ 83 INR, per kg
  const formattedInr = priceInrPerKg > 0 ? `₹${priceInrPerKg}/kg` : `₹${priceUsd}`;

  return (
    <div
      id={`material-card-${listing.id}`}
      className="group bg-white rounded-xl border border-slate-200 hover:border-emerald-500/50 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden text-left"
    >
      {/* Product Image Box */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={
            listing.image_url ||
            'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80'
          }
          alt={listing.material}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          loading="lazy"
        />

        {/* AI Analyzed / Verified Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-600 text-white shadow-xs">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            <span>AI Analyzed</span>
          </span>
          {isRecommended && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-slate-900 shadow-xs">
              ★ Recommended
            </span>
          )}
        </div>

        {/* Match Score Badge if applicable */}
        {matchScore && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-900/80 backdrop-blur-sm text-white border border-white/20">
            {matchScore}% Match
          </div>
        )}

        {/* Category Pill at bottom */}
        <div className="absolute bottom-2 left-2.5">
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-900/70 backdrop-blur-xs text-white">
            {listing.waste_category}
          </span>
        </div>
      </div>

      {/* Product Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-1">
            <span className="material-symbols-outlined text-[14px] text-emerald-600">location_on</span>
            <span className="truncate">{listing.location}</span>
          </div>

          {/* Material Name */}
          <h3
            className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors"
            title={listing.material}
          >
            {listing.material}
          </h3>

          {/* Available Quantity */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-xs font-semibold text-slate-700">Available:</span>
            <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
              {listing.quantity.toLocaleString()} {listing.unit}
            </span>
            <span className="text-[11px] text-slate-400">• {listing.availability}</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2.5 border-t border-slate-100 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-900">{formattedInr}</span>
              <span className="text-[11px] text-slate-400 font-medium">(${listing.expected_price}/MT)</span>
            </div>
            <span className="text-[10px] uppercase font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
              {listing.recovery_pathway}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              id={`btn-view-details-${listing.id}`}
              type="button"
              onClick={() => onViewDetails(listing)}
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
            >
              <span>View Details</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
            {onRequestSample && (
              <button
                id={`btn-request-sample-${listing.id}`}
                type="button"
                onClick={() => onRequestSample(listing)}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Sample</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
