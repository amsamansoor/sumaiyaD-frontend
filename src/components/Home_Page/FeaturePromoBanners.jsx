import React from 'react';

// Original static banners — used only as a fallback until the admin creates
// a real "Promo Banner Grid" section from the Homepage Sections tab.
const fallbackLarge = [
  { label: 'READY TO WEAR', imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80', linkCategory: 'Ready To Wear' },
  { label: 'UNSTITCHED', imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80', linkCategory: 'Unstitched' },
];
const fallbackSmall = [
  { label: 'COUTURE', imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80', linkCategory: 'Luxury Formal' },
  { label: 'JEWELRY', imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', linkCategory: 'Accessories' },
  { label: 'ACCESSORIES', imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', linkCategory: 'Accessories' },
];

export default function FeaturePromoBanners({ items, onSelectCategory }) {
  const hasItems = Array.isArray(items) && items.length > 0;
  const large = hasItems ? items.filter((i) => (i.size || 'large') === 'large') : fallbackLarge;
  const small = hasItems ? items.filter((i) => i.size === 'small') : fallbackSmall;

  if (large.length === 0 && small.length === 0) return null;

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 md:space-y-8">

      {large.length > 0 && (
        <div className={`grid grid-cols-1 ${large.length > 1 ? 'md:grid-cols-2' : ''} gap-5 md:gap-6`}>
          {large.map((banner, i) => (
            <Banner key={i} banner={banner} onSelectCategory={onSelectCategory} tall />
          ))}
        </div>
      )}

      {small.length > 0 && (
        <div className={`grid grid-cols-1 ${smallGridCols(small.length)} gap-5 md:gap-6`}>
          {small.map((banner, i) => (
            <Banner key={i} banner={banner} onSelectCategory={onSelectCategory} />
          ))}
        </div>
      )}

    </section>
  );
}

// Tailwind's compiler needs literal class names, not a string built at
// runtime — so map the count to one of these fixed classes instead of
// interpolating `sm:grid-cols-${n}` directly.
function smallGridCols(count) {
  if (count >= 3) return 'sm:grid-cols-3';
  if (count === 2) return 'sm:grid-cols-2';
  return 'sm:grid-cols-1';
}

function Banner({ banner, onSelectCategory, tall }) {
  return (
    <div
      onClick={() => banner.linkCategory && onSelectCategory && onSelectCategory(banner.linkCategory)}
      className={`group relative ${tall ? 'h-[420px] sm:h-[500px] md:h-[580px]' : 'h-[380px] sm:h-[420px] md:h-[480px]'} rounded-2xl overflow-hidden ${banner.linkCategory ? 'cursor-pointer' : ''} bg-gray-100 shadow-sm transition-all duration-500`}
    >
      <img
        src={banner.imageUrl || banner.image}
        alt={banner.label || banner.title}
        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
      <div className="absolute bottom-8 inset-x-0 text-center z-10 px-4">
        <h3 className={`text-white ${tall ? 'text-xl sm:text-2xl md:text-3xl' : 'text-lg sm:text-xl md:text-2xl'} font-light tracking-[0.2em] uppercase font-sans drop-shadow-md`}>
          {banner.label || banner.title}
        </h3>
      </div>
    </div>
  );
}
