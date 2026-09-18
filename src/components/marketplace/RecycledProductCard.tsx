import React from 'react';
import type { RecycledProduct } from '@/src/types/recycledMarketplace';

interface RecycledProductCardProps {
  product: RecycledProduct;
  onViewDetail: (product: RecycledProduct) => void;
  onBuyNow: (product: RecycledProduct) => void;
}

export const RecycledProductCard: React.FC<RecycledProductCardProps> = ({
  product,
  onViewDetail,
  onBuyNow,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Product Image + Badges */}
        <div className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onViewDetail(product)}>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">eco</span>
              <span>100% Circular Recycled</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-900/80 text-slate-100 backdrop-blur-xs">
              {product.category}
            </span>
          </div>

          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-white/95 text-emerald-800 shadow-xs border border-emerald-200">
            -{product.carbon_abatement_pct}% CO₂
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2.5">
          {/* Title */}
          <div>
            <h3
              onClick={() => onViewDetail(product)}
              className="font-bold text-sm text-slate-900 line-clamp-2 hover:text-emerald-700 cursor-pointer leading-snug"
            >
              {product.name}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-slate-400">factory</span>
              <span className="truncate">{product.recycling_company_name}</span>
            </p>
          </div>

          {/* Condition / Grade Chip */}
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px] text-slate-700 font-medium line-clamp-1">
            <strong className="text-slate-900">Grade:</strong> {product.condition_grade}
          </div>

          {/* Source Origin Info */}
          <div className="text-[10px] text-slate-500">
            <span className="font-semibold text-slate-700">Source:</span> {product.source_waste_material}
          </div>

          {/* Price & Quantity Available */}
          <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
            <div>
              <span className="text-lg font-black text-slate-950">${product.price}</span>
              <span className="text-xs text-slate-500 font-medium"> / {product.unit}</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {product.quantity_available} {product.unit} in stock
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer (Amazon / Flipkart Style) */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onViewDetail(product)}
          className="w-full py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
        >
          View Details
        </button>
        <button
          type="button"
          onClick={() => onBuyNow(product)}
          className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px]">shopping_bag</span>
          <span>Buy / Order</span>
        </button>
      </div>
    </div>
  );
};
