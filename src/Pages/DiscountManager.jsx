import React, { useState } from 'react';
import { Tag, Percent, Plus, Trash2, Calendar, CheckCircle2 } from 'lucide-react';

export default function DiscountManager({ coupons = [], onAddCoupon, onDeleteCoupon, categories = [] }) {
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage', // 'percentage' or 'fixed'
    discountValue: '',
    minOrderValue: '',
    expiryDate: ''
  });

  const [categoryDiscount, setCategoryDiscount] = useState({
    category: 'Pret',
    percentage: ''
  });

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.discountValue) return;

    const newCoupon = {
      ...couponForm,
      id: Date.now(),
      code: couponForm.code.toUpperCase().trim(),
      discountValue: Number(couponForm.discountValue),
      minOrderValue: Number(couponForm.minOrderValue || 0)
    };

    if (typeof onAddCoupon === 'function') {
      onAddCoupon(newCoupon);
    }

    setCouponForm({ code: '', discountType: 'percentage', discountValue: '', minOrderValue: '', expiryDate: '' });
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-8">
      
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
          <Tag size={20} />
          Sales & Campaign Management
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Create promotional promo codes and set collection-wide percentage discounts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Section 1: Create Promo Code */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5 border-b pb-2">
            <Plus size={16} /> Create Promo Code / Coupon
          </h3>

          <form onSubmit={handleCouponSubmit} className="space-y-4 bg-gray-50 p-4 rounded border border-gray-200">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Coupon Code</label>
              <input 
                type="text" 
                required
                value={couponForm.code} 
                onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm uppercase font-mono font-bold tracking-wider focus:outline-none focus:border-black"
                placeholder="e.g. AZADI20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Discount Type</label>
                <select 
                  value={couponForm.discountType}
                  onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
                >
                  <option value="percentage">Percentage (% OFF)</option>
                  <option value="fixed">Fixed Amount (PKR OFF)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  Value ({couponForm.discountType === 'percentage' ? '%' : 'PKR'})
                </label>
                <input 
                  type="number" 
                  required
                  value={couponForm.discountValue} 
                  onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
                  placeholder={couponForm.discountType === 'percentage' ? '20' : '1500'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Min Order Value (PKR)</label>
                <input 
                  type="number" 
                  value={couponForm.minOrderValue} 
                  onChange={(e) => setCouponForm({ ...couponForm, minOrderValue: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
                  placeholder="e.g. 5000"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Expiry Date</label>
                <input 
                  type="date" 
                  value={couponForm.expiryDate} 
                  onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black text-gray-600"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-black text-white py-2 text-xs font-semibold uppercase tracking-wider rounded hover:bg-gray-800 transition-colors"
            >
              Generate Coupon Code
            </button>
          </form>
        </div>

        {/* Section 2: Active Coupons List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5 border-b pb-2">
            <CheckCircle2 size={16} /> Active Coupon Codes ({coupons.length})
          </h3>

          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {coupons.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8 bg-gray-50 rounded border border-dashed">
                No active promo codes created yet.
              </p>
            ) : (
              coupons.map((coupon) => (
                <div 
                  key={coupon.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded hover:border-black transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm bg-black text-white px-2 py-0.5 rounded uppercase">
                        {coupon.code}
                      </span>
                      <span className="text-xs font-semibold text-gray-900">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `PKR ${coupon.discountValue} OFF`}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-3">
                      {coupon.minOrderValue > 0 && <span>Min Order: PKR {coupon.minOrderValue}</span>}
                      {coupon.expiryDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> Exp: {coupon.expiryDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => onDeleteCoupon && onDeleteCoupon(coupon.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete Coupon"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}