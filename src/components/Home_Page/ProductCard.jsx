import React from 'react';

export default function ProductCard({ product, onAddToCart }) {
  // Backend Keys vs Frontend Keys Mappings & Fallbacks
  const image = product.imageUrl || product.image || 'https://via.placeholder.com/300';
  const name = product.title || product.name || 'Untitled Product';
  const category = product.category || 'General';
  const tag = product.tag || (product.inStock ? 'In Stock' : 'Out of Stock');
  const priceFormatted = typeof product.price === 'number' 
    ? `Rs. ${product.price.toLocaleString()}` 
    : product.price;

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-white/90 text-black text-[10px] uppercase font-bold tracking-widest px-2 py-1">
          {tag}
        </span>
        
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onAddToCart && onAddToCart(product)}
            className="w-full bg-black text-white text-xs uppercase tracking-widest py-3 font-semibold hover:bg-gray-800 transition-colors shadow-lg"
          >
            Quick Add to Cart
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center text-center">
        <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
          {category}
        </span>
        <h3 className="text-sm font-medium text-gray-900 tracking-wide mb-1">
          {name}
        </h3>
        <p className="text-sm font-semibold text-black tracking-wider">
          {priceFormatted}
        </p>
      </div>
    </div>
  );
}