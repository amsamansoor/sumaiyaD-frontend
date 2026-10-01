import React, { useRef } from 'react';

const defaultProducts = [
  {
    id: 'sample-1',
    name: '3 Piece Embroidered Velvet Suit',
    price: 40990,
    category: 'UNSTITCHED',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sample-2',
    name: '2 Piece Embroidered Dobby Linen Suit',
    price: 22990,
    category: 'READY TO WEAR',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sample-3',
    name: '3 Piece Embroidered Lawn Suit',
    price: 22990,
    category: 'UNSTITCHED',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80'
  }
];

export default function ProductGrid({
  products = [],
  categories = [],
  activeCategory,
  setActiveCategory,
  onQuickView,     // Eye Icon handler (Modal ke liye)
  onViewDetails    // View Details handler (Full Page ke liye)
}) {
  const scrollContainerRef = useRef(null);

  const displayProductsList = (products && products.length > 0) ? products : defaultProducts;

  const filteredProducts = displayProductsList.filter((product) => {
    if (!activeCategory || activeCategory.toUpperCase() === 'ALL' || activeCategory.toUpperCase() === 'NEW ARRIVALS') {
      return true;
    }
    const prodCategory = (product.category || '').toUpperCase();
    const selectedCategory = activeCategory.toUpperCase();
    return prodCategory.includes(selectedCategory) || selectedCategory.includes(prodCategory);
  });

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

  const defaultCategoryTabs = ['ALL', 'UNSTITCHED', 'READY TO WEAR', 'LUXURY FORMAL'];
  const rawTabs = categories && categories.length > 0 
    ? ['ALL', ...categories.map(c => (typeof c === 'string' ? c : c.name))]
    : defaultCategoryTabs;

  const categoryTabs = Array.from(new Set(rawTabs.map(t => t.toUpperCase())));

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white">
      {/* 1. Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-gray-900 tracking-tight uppercase">
          MOST TRENDING
        </h2>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setActiveCategory && setActiveCategory('ALL')} 
            className="text-xs sm:text-sm text-gray-600 hover:text-black underline underline-offset-4 tracking-wider uppercase font-medium"
          >
            VIEW ALL
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleScroll('left')}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200"
            >
              ‹
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* 2. Category Tabs */}
      <div className="flex space-x-6 sm:space-x-8 overflow-x-auto scrollbar-hide border-b border-gray-100 pb-3 mb-8">
        {categoryTabs.map((catName) => {
          const currentCategory = activeCategory || 'ALL';
          const isActive = currentCategory.toUpperCase() === catName.toUpperCase();
          
          return (
            <button
              key={catName}
              onClick={() => setActiveCategory && setActiveCategory(catName)}
              className={`text-xs sm:text-sm uppercase tracking-wider font-medium whitespace-nowrap transition-all duration-200 relative pb-2 ${
                isActive ? 'text-black font-semibold' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              {catName}
              {isActive && (
                <span className="absolute bottom-0 inset-x-0 h-[2px] bg-black rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Horizontal Slider */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-5 overflow-x-auto scrollbar-hide scroll-smooth py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filteredProducts.map((product) => {
          const priceNum = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
          const priceDisplay = priceNum > 0 ? `Rs.${priceNum.toLocaleString()}` : (product.price || 'Rs.0');

          return (
            <div
              key={product.id || product._id}
              className="flex-none w-[230px] sm:w-[260px] md:w-[280px] group flex flex-col cursor-pointer"
            >
              {/* Product Card Image Container */}
              <div 
                className="relative h-[340px] sm:h-[380px] md:h-[410px] w-full rounded-2xl overflow-hidden bg-gray-100 mb-3"
                onClick={() => onViewDetails && onViewDetails(product)}
              >
                <img
                  src={product.image || product.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'}
                  alt={product.title || product.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />

                {/* Floating Hover Bar */}
                <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10">
                  <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-xl px-3 py-2 flex items-center justify-between border border-gray-100">
                    
                    {/* 1. View Details Text + Arrow Button (Navigates to Full Page) */}
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onViewDetails) onViewDetails(product);
                      }}
                      className="flex items-center space-x-2 text-gray-900 hover:text-black transition-colors"
                    >
                      <span className="text-[11px] font-semibold leading-tight text-left">
                        View<br/>Details
                      </span>
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>

                    {/* Divider & Action Icons */}
                    <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
                      
                      {/* 2. Eye Icon (Triggers Quick View Modal) */}
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation(); // Event bubbling stop karni zaroori hai
                          if (onQuickView) onQuickView(product);
                        }}
                        className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        title="Quick View"
                      >
                        <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      {/* 3. Wishlist Heart Icon */}
                      <button 
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-gray-600 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Add to Wishlist"
                      >
                        <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>

                  </div>
                </div>

              </div>

              {/* Product Info */}
              <div 
                className="space-y-1 px-1 text-left"
                onClick={() => onViewDetails && onViewDetails(product)}
              >
                <h3 className="text-sm font-normal text-gray-800 line-clamp-1">
                  {product.title || product.name || 'Embroidered Suit'}
                </h3>
                <p className="text-sm font-bold text-gray-900">
                  {priceDisplay}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}