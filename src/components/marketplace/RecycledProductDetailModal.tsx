import React from 'react';
import type { RecycledProduct } from '@/src/types/recycledMarketplace';

interface RecycledProductDetailModalProps {
  product: RecycledProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderNow: (product: RecycledProduct) => void;
}

export const RecycledProductDetailModal: React.FC<RecycledProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onOrderNow,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              <span>Verified Recycled Material</span>
            </span>
            <span className="text-xs text-slate-400">ID: {product.id}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex flex-col gap-6">
          {/* Main Hero Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-2xl overflow-hidden bg-slate-100 aspect-4/3 border border-slate-200">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  {product.category}
                </span>
                <h2 className="text-xl font-black text-slate-900 leading-snug mt-1">
                  {product.name}
                </h2>

                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
                  <span>{product.location}</span>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-900">${product.price}</span>
                    <span className="text-xs font-semibold text-slate-600"> / {product.unit}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-800">
                    Min. Order: {product.minimum_order_qty} {product.unit}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Stock Availability:</span>
                  <strong className="text-emerald-700 font-bold">{product.quantity_available} {product.unit} Available</strong>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Condition Grade:</span>
                  <strong className="text-slate-800 font-bold">{product.condition_grade}</strong>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Carbon Abatement:</span>
                  <strong className="text-emerald-700 font-bold">-{product.carbon_abatement_pct}% GHG vs Virgin</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Source Origin */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase text-slate-400">Product Description & Feedstock Origin</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {product.description}
            </p>
            <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600 flex items-center gap-1">
              <strong>Source Waste Material:</strong> {product.source_waste_material}
            </div>
          </div>

          {/* Technical Specifications Table */}
          {product.technical_specs && Object.keys(product.technical_specs).length > 0 && (
            <div>
              <h3 className="text-xs font-extrabold uppercase text-slate-500 mb-2">Technical Specifications & Laboratory Parameters</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(product.technical_specs).map(([key, val]) => (
                  <div key={key} className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">{key}:</span>
                    <span className="font-bold text-slate-900">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seller / Processor Info */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Certified Producer & Seller</div>
              <div className="font-bold text-slate-900 text-sm">{product.seller_organization}</div>
              <div className="text-xs text-slate-500">{product.recycling_company_name}</div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                100% ESG Verified
              </span>
            </div>
          </div>
        </div>

        {/* Modal Action Footer (Amazon / Flipkart Style) */}
        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOrderNow(product);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
            <span>Buy / Place Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
