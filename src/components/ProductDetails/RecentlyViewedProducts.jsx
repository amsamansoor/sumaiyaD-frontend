import React from 'react';

export default function RecentlyViewedProducts({ product, fallbackImg, onViewDetails }) {
  if (!product) return null;

  const priceNum = typeof product?.price === 'number' ? product.price : parseFloat(product?.price) || 0;

  return (
    <section className="my-16">
      <h2 className="text-2xl font-serif text-gray-900 mb-6 uppercase tracking-tight">
        Recently Viewed Products
      </h2>
      <div 
        onClick={() => onViewDetails && onViewDetails(product)} 
        className="w-56 group cursor-pointer"
      >
        <div className="h-72 rounded-2xl overflow-hidden bg-gray-100 mb-2">
          <img 
            src={product.image || product.imageUrl || fallbackImg} 
            alt={product.title || product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        </div>
        <h3 className="text-xs font-medium text-gray-800 truncate">
          {product.title || product.name || 'Selected Suit'}
        </h3>
        <p className="text-xs font-bold text-gray-900">
          PKR {priceNum > 0 ? priceNum.toLocaleString() : (product.price || '0')}
        </p>
      </div>
    </section>
  );
}