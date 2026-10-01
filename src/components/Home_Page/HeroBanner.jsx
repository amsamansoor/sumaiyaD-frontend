import React, { useState, useEffect } from 'react';

export default function HeroBanner({ heroConfig }) {
  // console.log("HeroBanner ko kya mila:", heroConfig);
  // Database/API se aane wale data ko slides array mein convert karna (Static fallback bilkul khatam)
 const slides = Array.isArray(heroConfig) 
  ? heroConfig.map((item, index) => ({
      id: item.id || index + 1,
      image: item.imageUrl || item.imageUrl || item.image || item.image,
      titleUrdu: item.title || item.title || '',
      subtitle: item.subtitle || item.subtitle || item.linkUrl || item.linkUrl || ''
    }))
  : heroConfig && (heroConfig.imageUrl || heroConfig.imageUrl || heroConfig.image)
    ? [{
        id: heroConfig.id || 1,
        image: heroConfig.imageUrl || heroConfig.imageUrl || heroConfig.image,
        titleUrdu: heroConfig.title || heroConfig.title || '',
        subtitle: heroConfig.subtitle || heroConfig.subtitle || heroConfig.linkUrl || heroConfig.linkUrl || ''
      }]
    : [];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0 || !slides[0].image) {
    return (
      <section className="relative w-full h-[60vh] bg-black flex items-center justify-center text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Loading Banner...</p>
      </section>
    );
  }

  const activeSlide = slides[currentSlide] || slides[0];

  return (
    <section className="relative w-full h-[75vh] md:h-[85vh] bg-black overflow-hidden flex flex-col justify-end">
      {/* 1. Background Slider Images (from Database) */}
      {slides.map((slide, index) => (
        <div
          key={slide.id || index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.subtitle || 'Store Banner'}
            className="w-full h-full object-cover object-top"
          />
          {/* Bottom Dark Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>
      ))}

      {/* 2. Content & Indicators Wrapper Container */}
      <div className="relative z-20 w-full pb-8 md:pb-12 px-6 flex items-end justify-between">
        
        {/* Empty left side to balance space */}
        <div className="hidden md:block w-32"></div>

        {/* Center Title & Subtitle */}
        <div className="text-center text-white mx-auto flex flex-col items-center">
          {activeSlide.titleUrdu ? (
            <h1 
              dir="rtl" 
              className="text-4xl md:text-6xl font-bold tracking-wider mb-2 drop-shadow-md leading-normal"
              style={{ fontFamily: '"Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", serif' }}
            >
              {activeSlide.titleUrdu}
            </h1>
          ) : null}
          
          {activeSlide.subtitle && (
            <p className="text-[10px] sm:text-xs tracking-[0.25em] font-light uppercase border-t border-white/60 pt-2 px-6 drop-shadow">
              {activeSlide.subtitle}
            </p>
          )}
        </div>

        {/* Right Side Carousel Indicators (Dashes) */}
        <div className="flex items-center space-x-2 pb-2">
          {slides.length > 1 && slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-[3px] transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? 'w-10 bg-white'
                  : 'w-5 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}