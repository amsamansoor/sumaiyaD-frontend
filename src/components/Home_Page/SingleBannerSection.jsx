import React from 'react';

export default function SingleBannerSection({ item, onSelectCategory }) {
  if (!item || !item.imageUrl) return null;

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div
        onClick={() => item.linkCategory && onSelectCategory && onSelectCategory(item.linkCategory)}
        className={`group relative h-[320px] sm:h-[400px] md:h-[460px] rounded-2xl overflow-hidden ${item.linkCategory ? 'cursor-pointer' : ''} bg-gray-100 shadow-sm`}
      >
        <img
          src={item.imageUrl}
          alt={item.label}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
        {item.label && (
          <div className="absolute bottom-8 inset-x-0 text-center z-10 px-4">
            <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-light tracking-[0.2em] uppercase font-sans drop-shadow-md">
              {item.label}
            </h3>
          </div>
        )}
      </div>
    </section>
  );
}
