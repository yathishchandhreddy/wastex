import React, { useState } from 'react';
import type { RecycledProduct, RecycledProductOrder } from '@/src/types/recycledMarketplace';
import { orderService } from '@/src/services/orderService';

interface PlaceOrderModalProps {
  product: RecycledProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: RecycledProductOrder) => void;
}

export const PlaceOrderModal: React.FC<PlaceOrderModalProps> = ({
  product,
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  if (!isOpen || !product) return null;

  const [quantity, setQuantity] = useState<number>(product.minimum_order_qty || 2);
  const [buyerName, setBuyerName] = useState('Rahul Sharma');
  const [buyerEmail, setBuyerEmail] = useState('rahul.sharma@industriallogistics.in');
  const [buyerPhone, setBuyerPhone] = useState('+91 98200 45678');
  const [shippingAddress, setShippingAddress] = useState('Plot 88, Sector 12, Pimpri Industrial Belt, Pune, MH - 411018');
  const [paymentMethod, setPaymentMethod] = useState('Industrial PO / 30-Day Credit');
  const [notes, setNotes] = useState('Please attach laboratory certificate of analysis (COA) with shipment.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = product.price * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = orderService.placeOrder({
        product,
        quantity,
        buyerName,
        buyerEmail,
        buyerPhone,
        shippingAddress,
        paymentMethod,
        notes,
      });

      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-700 text-white">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">
              Direct Circular Order
            </span>
            <h2 className="text-lg font-black">Confirm Purchase Requisition</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex flex-col gap-4">
          {/* Product Summary Mini Card */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">{product.name}</h4>
              <p className="text-[11px] text-slate-500 truncate">{product.seller_organization}</p>
              <div className="text-xs font-extrabold text-emerald-700 mt-0.5">
                ${product.price} / {product.unit}
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="text-xs font-bold text-slate-800 block">Order Quantity ({product.unit}):</label>
              <span className="text-[10px] text-slate-500">Min. order: {product.minimum_order_qty} {product.unit}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={product.minimum_order_qty}
                max={product.quantity_available}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(product.minimum_order_qty, Number(e.target.value)))}
                className="w-24 p-2 rounded-lg border border-slate-300 bg-white font-black text-slate-900 text-center text-sm focus:outline-none focus:border-emerald-600"
                required
              />
              <span className="text-xs font-bold text-slate-700">{product.unit}</span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Buyer / Authorized Representative:</label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:border-emerald-600"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone / Mobile:</label>
              <input
                type="tel"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:border-emerald-600"
                required
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="font-bold text-slate-700 block mb-1">Official Work Email:</label>
            <input
              type="email"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:border-emerald-600"
              required
            />
          </div>

          {/* Delivery Address */}
          <div className="text-xs">
            <label className="font-bold text-slate-700 block mb-1">Plant / Delivery Address:</label>
            <textarea
              rows={2}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:border-emerald-600 resize-none"
              required
            />
          </div>

          {/* Payment Terms */}
          <div className="text-xs">
            <label className="font-bold text-slate-700 block mb-1">Payment Method & Terms:</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-xs font-medium focus:outline-none focus:border-emerald-600"
            >
              <option value="Industrial PO / 30-Day Credit">Industrial PO / 30-Day Credit Terms</option>
              <option value="B2B Bank Wire / Letter of Credit (LC)">B2B Bank Wire / Letter of Credit (LC)</option>
              <option value="Escrow Milestone Release">Escrow Milestone Release (10% Advance, 90% at Gate)</option>
              <option value="Online Direct B2B UPI / Corporate Card">Online Direct B2B UPI / Corporate Card</option>
            </select>
          </div>

          {/* Order Total Calculation */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Total Purchase Value</span>
              <div className="text-xs text-slate-300">
                {quantity} {product.unit} × ${product.price}
              </div>
            </div>
            <div className="text-xl font-black text-emerald-400">
              ${totalPrice.toLocaleString()} {product.currency}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Generating Order...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Confirm Order</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
