import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEMO_RECYCLED_PRODUCTS } from '@/src/data/recycledData';
import { DEMO_B2B_EXCHANGE_LISTINGS } from '@/src/data/demo';
import type { RecycledProduct } from '@/src/types/recycledMarketplace';
import type { B2BMaterialListing } from '@/src/types';
import { RecycledProductCard } from '@/src/components/marketplace/RecycledProductCard';
import { RecycledProductDetailModal } from '@/src/components/marketplace/RecycledProductDetailModal';
import { PlaceOrderModal } from '@/src/components/marketplace/PlaceOrderModal';
import { MaterialCard } from '@/src/components/marketplace/MaterialCard';
import { MaterialDetailModal } from '@/src/components/marketplace/MaterialDetailModal';
import { EmptyState } from '@/src/components/ui/EmptyState';

export const MarketplaceHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal states for Recycled Products (People Marketplace)
  const [activeRecycledProduct, setActiveRecycledProduct] = useState<RecycledProduct | null>(null);
  const [isRecycledDetailOpen, setIsRecycledDetailOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderProduct, setOrderProduct] = useState<RecycledProduct | null>(null);
  const [orderSuccessBanner, setOrderSuccessBanner] = useState<string | null>(null);

  // Modal states for raw B2B waste listings
  const [activeB2BListing, setActiveB2BListing] = useState<B2BMaterialListing | null>(null);

  const categories = [
    'All',
    'Recycled Polymers',
    'Recovered Metals',
    'Reprocessed Fibers',
    'Circular Energy & Biomass',
    'Circular Construction',
    'Industrial By-products',
  ];

  // Filter Recycled Products
  const filteredRecycledProducts = DEMO_RECYCLED_PRODUCTS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source_waste_material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recycling_company_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenRecycledDetail = (product: RecycledProduct) => {
    setActiveRecycledProduct(product);
    setIsRecycledDetailOpen(true);
  };

  const handleOpenOrder = (product: RecycledProduct) => {
    setOrderProduct(product);
    setIsOrderModalOpen(true);
  };

  const handleOrderSuccess = (order: any) => {
    setIsOrderModalOpen(false);
    setOrderSuccessBanner(
      `Order #${order.id} for ${order.order_quantity} ${order.unit} of ${order.product_name} successfully placed! View in "My Orders".`
    );
    setTimeout(() => setOrderSuccessBanner(null), 8000);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/app/buy?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div id="marketplace-home-page" className="flex flex-col gap-8 pb-16">
      {/* Toast Banner for Orders */}
      {orderSuccessBanner && (
        <div className="bg-emerald-700 text-white px-5 py-3.5 rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-fade-in border border-emerald-500">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="material-symbols-outlined text-[20px] text-emerald-200">check_circle</span>
            <span>{orderSuccessBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/app/orders')}
            className="px-3 py-1 bg-white text-emerald-900 rounded-lg text-xs font-black hover:bg-emerald-50 cursor-pointer shrink-0"
          >
            Track Order →
          </button>
        </div>
      )}

      {/* 1. Master Brand Hero Banner (Amazon/Flipkart Industrial Elegance) */}
      <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-10 md:p-12 overflow-hidden shadow-xl border border-slate-700/60">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="relative z-10 max-w-3xl flex flex-col gap-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold w-fit">
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            <span>WasteX AI Industrial Decision Engine & People Marketplace</span>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Upload your waste.
              <br />
              <span className="text-emerald-400">AI understands it.</span>
              <br />
              AI tells you what to do with it.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed mt-2">
              Every industrial waste stream has a purpose. We evaluate purity and compliance to route your material to the optimal pathway: <strong>Dispose Safely</strong>, <strong>Sell to Buyers</strong>, <strong>Recycle into Products</strong>, or <strong>Reuse In-House</strong>.
            </p>
          </div>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-2 flex flex-col sm:flex-row gap-2.5 max-w-2xl">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                search
              </span>
              <input
                id="home-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recycled materials (e.g. rPET pellets, Aluminum ingots, Yarn)..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-md"
              />
            </div>
            <button
              id="home-search-btn"
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Search Marketplace</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="btn-home-upload-waste"
              type="button"
              onClick={() => navigate('/app/sell')}
              className="flex-1 sm:flex-initial px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">document_scanner</span>
              <span>Upload Waste for AI Assessment</span>
            </button>
            <button
              id="btn-home-browse-marketplace"
              type="button"
              onClick={() => navigate('/app/buy')}
              className="flex-1 sm:flex-initial px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm transition-all backdrop-blur-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">storefront</span>
              <span>People Marketplace (Recycled Products)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. The 4 Master Pathways Overview Cards */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Four AI Decision Pathways</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              WasteX AI analyzes your waste characterization to route into one of four distinct outcomes:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Pathway 1: DISPOSE */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-3 hover:border-slate-300 transition-all">
            <div className="flex flex-col gap-2">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[22px]">delete_forever</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">1. DISPOSE</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Safe handling protocols, compliance standards, and certified TSDF partner routing for hazardous or unviable waste.
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
              Safe Disposal Guidance
            </span>
          </div>

          {/* Pathway 2: SELL */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-3 hover:border-emerald-300 transition-all">
            <div className="flex flex-col gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[22px]">handshake</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">2. SELL</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Direct connection with verified industrial secondary material dealers and procurement buyers.
              </p>
            </div>
            <span className="text-[11px] font-bold text-blue-800 bg-blue-50 p-2 rounded-lg border border-blue-100">
              Dealer / Buyer Connect
            </span>
          </div>

          {/* Pathway 3: RECYCLE */}
          <div className="bg-white p-4 rounded-2xl border-2 border-emerald-500 shadow-xs flex flex-col justify-between gap-3">
            <div className="flex flex-col gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[22px]">recycling</span>
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-slate-900">3. RECYCLE</h3>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-600 text-white">CORE</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Find recycling partners → Track conversion process → Transformed into recycled products for the People Marketplace.
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
              Recycling → People Marketplace
            </span>
          </div>

          {/* Pathway 4: REUSE */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-3 hover:border-teal-300 transition-all">
            <div className="flex flex-col gap-2">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[22px]">cached</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">4. REUSE</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                In-house re-processing, direct secondary manufacturing applications, and industrial symbiosis instructions.
              </p>
            </div>
            <span className="text-[11px] font-bold text-teal-800 bg-teal-50 p-2 rounded-lg border border-teal-100">
              AI Reuse Guidance
            </span>
          </div>
        </div>
      </section>

      {/* 3. Category Filter Navigation Bar */}
      <section className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* 4. People Marketplace for Recycled Products & Materials (Amazon/Flipkart Style) */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                People Marketplace — Recycled Products & Materials
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Certified secondary products manufactured by verified circular recycling facilities. Ready to browse, order, and buy.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/app/buy')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Recycled Inventory</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Product Cards Grid */}
        {filteredRecycledProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRecycledProducts.map((prod) => (
              <RecycledProductCard
                key={prod.id}
                product={prod}
                onViewDetail={handleOpenRecycledDetail}
                onBuyNow={handleOpenOrder}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Recycled Products Available"
            description="There are currently no certified recycled products listed in the marketplace. Recyclers can process waste streams to publish products."
            icon="storefront"
          />
        )}
      </section>

      {/* 5. Raw B2B Secondary Feedstocks Stream */}
      <section className="flex flex-col gap-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Direct Post-Industrial Waste Streams (For Recyclers & Converters)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Raw industrial scrap lots looking for qualified recyclers and buyers
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/app/sell')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Upload Your Stream</span>
          </button>
        </div>

        {DEMO_B2B_EXCHANGE_LISTINGS.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEMO_B2B_EXCHANGE_LISTINGS.slice(0, 4).map((listing) => (
              <MaterialCard
                key={listing.id}
                listing={listing}
                onViewDetails={(item) => setActiveB2BListing(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Direct Waste Streams Listed"
            description="No post-industrial waste streams are currently available on the exchange. Generators can upload waste lots to receive buyer offers."
            icon="precision_manufacturing"
            actionLabel="List a Waste Stream"
            onAction={() => navigate('/app/sell')}
          />
        )}
      </section>

      {/* Modals */}
      <RecycledProductDetailModal
        product={activeRecycledProduct}
        isOpen={isRecycledDetailOpen}
        onClose={() => setIsRecycledDetailOpen(false)}
        onOrderNow={handleOpenOrder}
      />

      <PlaceOrderModal
        product={orderProduct}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <MaterialDetailModal
        listing={activeB2BListing}
        isOpen={Boolean(activeB2BListing)}
        onClose={() => setActiveB2BListing(null)}
      />
    </div>
  );
};
