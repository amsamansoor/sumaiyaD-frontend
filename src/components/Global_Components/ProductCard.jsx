import React from 'react';
import { ShoppingBag, Heart } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  // Safe Image, Title, and Price parsing for API compatibility
  const productImage = product?.image || product?.imageUrl || 'https://via.placeholder.com/400x500?text=Product';
  const productName = product?.name || product?.title || 'Product';
  const productCategory = product?.category || 'Collection';
  const productStock = typeof product?.stock === 'number' ? product.stock : 10;
  
  const originalPrice = typeof product?.price === 'number' ? product.price : parseFloat(product?.price) || 0;
  const discountPercentage = product?.discountPercentage || 0;
  const hasDiscount = discountPercentage > 0;
  
  const finalPrice = hasDiscount 
    ? Math.round(originalPrice - (originalPrice * (discountPercentage / 100))) 
    : originalPrice;

  return (
    <div className="group relative border border-gray-100 rounded-sm overflow-hidden bg-white hover:shadow-md transition-shadow">
      
      {/* Product Image & Badges */}
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        <img 
          src={productImage} 
          alt={productName} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Sale Badge */}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded-sm">
            {discountPercentage}% OFF
          </span>
        )}

        {/* Out of Stock Overlay */}
        {productStock <= 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-black text-xs font-bold uppercase px-3 py-1 tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3 text-center space-y-1">
        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
          {productCategory}
        </span>
        <h3 className="text-xs font-medium text-gray-800 truncate uppercase tracking-wide">
          {productName}
        </h3>

        {/* Pricing */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {hasDiscount ? (
            <>
              <span className="text-xs text-gray-400 line-through font-mono">
                PKR {originalPrice.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-red-600 font-mono">
                PKR {finalPrice.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-xs font-bold text-gray-900 font-mono">
              PKR {originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          disabled={productStock <= 0}
          onClick={() => onAddToCart && onAddToCart({ ...product, price: finalPrice })}
          className="w-full mt-2 bg-black text-white py-2 text-[11px] font-semibold uppercase tracking-wider hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
        >
          <ShoppingBag size={14} /> Add to Bag
        </button>
      </div>
    </div>
  );
}