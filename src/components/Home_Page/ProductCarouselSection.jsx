import React from 'react';

/**
 * Renders a titled strip of product cards, filtered by category.
 * Reuses the same card markup style as the rest of the storefront
 * (kept simple/self-contained rather than importing ProductGrid's internal
 * card, since that component's exact props weren't available).
 */
export default function ProductCarouselSection({ title, subtitle, products = [], categoryFilter, onViewDetails }) {
  const filtered =
    !categoryFilter || categoryFilter === 'All'
      ? products
      : products.filter((p) => (p.category || '').toLowerCase() === categoryFilter.toLowerCase());

  if (filtered.length === 0) return null;

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-4xl font-serif text-gray-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {filtered.slice(0, 8).map((product) => (
          <div
            key={product.id}
            onClick={() => onViewDetails && onViewDetails(product)}
            className="group cursor-pointer"
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-2">
              <img
                src={product.imageUrl || product.image || (product.images && product.images[0])}
                alt={product.title || product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-800 truncate">
              {product.title || product.name}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-gray-900">
              PKR {typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
