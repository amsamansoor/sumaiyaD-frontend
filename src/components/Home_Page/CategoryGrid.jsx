import React, { useRef } from 'react';

// Default categories agar parent component/admin se data na mile
const defaultCategories = [
  { id: 1, title: 'Kids', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80' },
  { id: 2, title: 'Unstitched', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80' },
  { id: 3, title: 'Luxury Formals', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80' },
  { id: 4, title: 'Luxury Pret', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80' },
  { id: 5, title: 'Stitched', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80' },
  { id: 6, title: 'Jewelry', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80' }
];

export default function CategoryGrid({ categories = defaultCategories, onSelectCategory }) {
  const scrollContainerRef = useRef(null);

  // Left & Right Manual Scroll Handler
  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75; 
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 relative group">
      {/* Section Header with Left/Right Navigation Controls */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-4xl font-serif text-gray-900 tracking-tight">
            New Arrivals
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Shop the latest arrivals before they sell out
          </p>
        </div>

        {/* Action Arrows for Scroll */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleScroll('left')}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-200"
            aria-label="Scroll Left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-200"
            aria-label="Scroll Right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Moveable Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-4 sm:space-x-5 overflow-x-auto scrollbar-hide scroll-smooth py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat, index) => (
          <div
            key={cat.id || index}
            onClick={() => onSelectCategory && onSelectCategory(cat.title)}
            className="flex-none w-[220px] sm:w-[260px] md:w-[280px] group/card relative h-[360px] sm:h-[400px] rounded-2xl overflow-hidden cursor-pointer bg-gray-100 shadow-sm transition-all duration-300 hover:shadow-md"
          >
            {/* Background Image (Admin set ya default) */}
            <img
              src={cat.image || cat.imageUrl}
              alt={cat.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/card:scale-105"
            />

            {/* Dark Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-80 group-hover/card:opacity-90 transition-opacity" />

            {/* Title & Arrow */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex items-end justify-between text-white z-10">
              <span className="text-base sm:text-lg font-medium tracking-wide">
                {cat.title}
              </span>

              <div className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm group-hover/card:bg-white group-hover/card:text-black transition-all duration-300">
                <svg
                  className="w-4 h-4 transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}