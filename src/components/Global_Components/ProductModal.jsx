import React, { useState } from 'react';

export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState('XS');
  const [quantity, setQuantity] = useState(1);
  
  // Dynamic images fallback support (API array or fallback Unsplash array)
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [
        product.image || product.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80'
      ];

  const [activeImg, setActiveImg] = useState(productImages[0]);

  // Price calculations with discount support if available
  const originalPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
  const discountPercentage = product.discountPercentage || 0;
  const hasDiscount = discountPercentage > 0;
  const finalPrice = hasDiscount 
    ? Math.round(originalPrice - (originalPrice * (discountPercentage / 100))) 
    : originalPrice;

  const priceDisplay = `PKR ${finalPrice.toLocaleString()}`;
  const productStock = typeof product.stock === 'number' ? product.stock : 10;
  const isOutOfStock = productStock <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Left: Product Images Gallery */}
        <div className="w-full md:w-1/2 p-6 flex gap-4 bg-gray-50">
          <div className="main-image flex-1 rounded-2xl overflow-hidden h-[380px] sm:h-[450px]">
            <img src={activeImg} alt={product.title || product.name} className="w-full h-full object-cover object-top" />
          </div>
          <div className="flex flex-col gap-2">
            {productImages.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImg(img)}
                className={`w-12 h-16 rounded-lg overflow-hidden border-2 ${activeImg === img ? 'border-black' : 'border-transparent'}`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Options */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 uppercase tracking-wide">
                {product.title || product.name || 'Product Title'}
              </h2>
              <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${isOutOfStock ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                {isOutOfStock ? 'Out of Stock' : 'In Stock'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-6 uppercase tracking-wider">{product.sku || product.category || 'Collection'}</p>

            <div className="flex justify-between items-baseline border-b border-gray-100 pb-4 mb-6">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Price</span>
              <div className="text-right">
                {hasDiscount && (
                  <span className="text-xs text-gray-400 line-through font-mono block">
                    PKR {originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-2xl font-bold text-gray-900 font-mono">{priceDisplay}</span>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Shipping Time</span>
              <p className="text-xs font-medium text-gray-800">3-5 BUSINESS DAYS</p>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">Size</span>
              <div className="flex gap-2 flex-wrap">
                {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-10 rounded-xl font-medium text-xs tracking-wider transition-all ${
                      selectedSize === size ? 'bg-black text-white shadow-md' : 'border border-gray-200 text-gray-700 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">Quantity</span>
              <div className="flex items-center space-x-3 bg-gray-100 w-fit rounded-lg p-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-700 font-bold hover:bg-gray-200"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-black text-white shadow-sm font-bold hover:bg-gray-800"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            disabled={isOutOfStock}
            onClick={() => {
              onAddToCart({ 
                ...product, 
                price: finalPrice, // pass the discounted final price
                selectedSize, 
                quantity,
                cartItemId: `${product._id || product.id || 'prod'}-${selectedSize}` // unique identifier for cart variations
              });
              onClose();
            }}
            className="w-full bg-black text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg flex items-center justify-center space-x-2"
          >
            <span>{isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}