import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DEMO_RECYCLED_PRODUCTS } from '@/src/data/recycledData';
import { DEMO_B2B_EXCHANGE_LISTINGS } from '@/src/data/demo';
import type { RecycledProduct } from '@/src/types/recycledMarketplace';
import type { B2BMaterialListing } from '@/src/types';
import { RecycledProductCard } from '@/src/components/marketplace/RecycledProductCard';
import { RecycledProductDetailModal } from '@/src/components/marketplace/RecycledProductDetailModal';
import { PlaceOrderModal } from '@/src/components/marketplace/PlaceOrderModal';
import { MaterialCard } from '@/src/components/marketplace/MaterialCard';
import { MaterialDetailModal } from '@/src/components/marketplace/MaterialDetailModal';
import { BuyerRequirementModal } from '@/src/components/marketplace/BuyerRequirementModal';
import { EmptyState } from '@/src/components/ui/EmptyState';

export const BuyMaterialsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'recycled_products' | 'raw_feedstocks'>('recycled_products');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'qty_high'>('featured');

  // Recycled Product Modal & Order state
  const [activeRecycledProduct, setActiveRecycledProduct] = useState<RecycledProduct | null>(null);
  const [isRecycledDetailOpen, setIsRecycledDetailOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderProduct, setOrderProduct] = useState<RecycledProduct | null>(null);
  const [orderToast, setOrderToast] = useState<string | null>(null);

  // Raw B2B listing modal states
  const [activeB2BListing, setActiveB2BListing] = useState<B2BMaterialListing | null>(null);
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false);

  const recycledCategories = [
    'All',
    'Recycled Polymers',
    'Recovered Metals',
    'Reprocessed Fibers',
    'Circular Energy & Biomass',
    'Circular Construction',
  ];

  const rawCategories = [
    'All',
    'Plastic & Polymers',
    'Metal & Alloys',
    'Paper & Pulp',
    'Industrial By-products & Slags',
    'Agro-Industrial Biomass',
    'Rubber & Elastomers',
    'Textiles & Fiber',
  ];

  const locations = ['All', 'Tamil Nadu', 'Maharashtra', 'Gujarat', 'Karnataka', 'Jharkhand', 'Haryana', 'Madhya Pradesh'];

  // Filter Recycled Products
  const filteredRecycledProducts = useMemo(() => {
    return DEMO_RECYCLED_PRODUCTS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesLocation =
        selectedLocation === 'All' || item.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesPrice = item.price <= maxPrice;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source_waste_material.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesLocation && matchesPrice && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'qty_high') return b.quantity_available - a.quantity_available;
      return 0;
    });
  }, [selectedCategory, selectedLocation, maxPrice, searchQuery, sortBy]);

  // Filter Raw Feedstocks
  const filteredRawListings = useMemo(() => {
    return DEMO_B2B_EXCHANGE_LISTINGS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.waste_category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesLocation =
        selectedLocation === 'All' || item.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesPrice = item.expected_price <= maxPrice;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesLocation && matchesPrice && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.expected_price - b.expected_price;
      if (sortBy === 'price_high') return b.expected_price - a.expected_price;
      if (sortBy === 'qty_high') return b.quantity - a.quantity;
      return 0;
    });
  }, [selectedCategory, selectedLocation, maxPrice, searchQuery, sortBy]);

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
    setOrderToast(
      `Purchase order #${order.id} confirmed for ${order.order_quantity} ${order.unit} of ${order.product_name}!`
    );
    setTimeout(() => setOrderToast(null), 8000);
  };

  return (
    <div id="buy-materials-page" className="flex flex-col gap-6 pb-16">
      {/* Toast Alert */}
      {orderToast && (
        <div className="bg-emerald-700 text-white px-5 py-3.5 rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-fade-in border border-emerald-500">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="material-symbols-outlined text-[20px] text-emerald-200">check_circle</span>
            <span>{orderToast}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/app/orders')}
            className="px-3 py-1 bg-white text-emerald-900 rounded-lg text-xs font-black hover:bg-emerald-50 cursor-pointer shrink-0"
          >
            View in My Orders →
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900">People Marketplace</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Amazon/Flipkart-style catalog for certified recycled products and secondary raw materials
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/app/orders')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>My Orders</span>
          </button>

          <button
            id="btn-open-post-requirement"
            type="button"
            onClick={() => setIsRequirementModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Post Requirement</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs (People Marketplace vs Raw Feedstocks) */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => {
            setActiveTab('recycled_products');
            setSelectedCategory('All');
          }}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'recycled_products'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">storefront</span>
          <span>Recycled Products & Materials ({DEMO_RECYCLED_PRODUCTS.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('raw_feedstocks');
            setSelectedCategory('All');
          }}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'raw_feedstocks'
              ? 'bg-white text-blue-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">inventory_2</span>
          <span>Post-Industrial Scrap Streams ({DEMO_B2B_EXCHANGE_LISTINGS.length})</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            id="buy-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'recycled_products'
                ? 'Search recycled products (e.g. rPET pellets, Aluminum ingots, Yarn, Bio-pellets)...'
                : 'Search industrial scrap lots (e.g. Flakes, Swarf, Kraft offcuts)...'
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Category */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
            >
              {(activeTab === 'recycled_products' ? recycledCategories : rawCategories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location / Region */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Location / State:</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
            >
              <option value="featured">Featured / Best Match</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="qty_high">Quantity Available</option>
            </select>
          </div>

          {/* Max Price */}
          <div>
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>Max Price:</span>
              <span className="text-emerald-700">${maxPrice}/MT</span>
            </div>
            <input
              type="range"
              min="50"
              max="10000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Grid of Products */}
      {activeTab === 'recycled_products' ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Showing <strong>{filteredRecycledProducts.length}</strong> certified recycled products</span>
            <span className="text-emerald-700 font-bold">100% ESG & CPCB Verified</span>
          </div>

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
              title="No Certified Recycled Products Found"
              description="No recycled products match your current search and filter criteria. You can post a procurement requirement to alert qualified recyclers."
              icon="storefront"
              actionLabel="Post Requirement"
              onAction={() => setIsRequirementModalOpen(true)}
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Showing <strong>{filteredRawListings.length}</strong> raw industrial scrap streams</span>
            <span>Direct Generator Lots</span>
          </div>

          {filteredRawListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRawListings.map((listing) => (
                <MaterialCard
                  key={listing.id}
                  listing={listing}
                  onViewDetails={(item) => setActiveB2BListing(item)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Raw Industrial Streams Found"
              description="No raw waste streams match your selected filters. Post a buyer requirement so waste generators can contact you."
              icon="precision_manufacturing"
              actionLabel="Post Requirement"
              onAction={() => setIsRequirementModalOpen(true)}
            />
          )}
        </div>
      )}

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

      <BuyerRequirementModal
        isOpen={isRequirementModalOpen}
        onClose={() => setIsRequirementModalOpen(false)}
        onSubmit={(data) => {
          setIsRequirementModalOpen(false);
          setOrderToast(`Requirement for ${data.quantity} ${data.unit} of ${data.material} broadcasted to generators.`);
          setTimeout(() => setOrderToast(null), 6000);
        }}
      />
    </div>
  );
};
