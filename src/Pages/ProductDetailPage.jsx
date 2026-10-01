import React, { useState, useEffect } from 'react';

// Global Layout Components
import TopBanner from '../components/Home_Page/TopBanner.jsx';
import Navbar from '../components/Global_Components/Navbar.jsx';
import Footer from '../components/Home_Page/Footer.jsx';
import CartDrawer from '../components/Global_Components/CartDrawer.jsx';
import CheckoutModal from '../components/Global_Components/CheckoutModal.jsx';
import SearchModal from '../components/Global_Components/SearchModal.jsx';

// --- Local Helper Sub-Components ---
function CustomersAlsoBoughtSection({ products = [], fallbackImg, onViewDetails }) {
  const displayItems = products.slice(0, 5);
  if (displayItems.length === 0) return null;

  return (
    <section className="my-16">
      <h2 className="text-2xl font-serif text-gray-900 mb-6 uppercase tracking-tight">
        Customers Also Bought
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {displayItems.map((item, i) => (
          <div
            key={item.id || i}
            onClick={() => onViewDetails && onViewDetails(item)}
            className="group cursor-pointer"
          >
            <div className="h-64 rounded-2xl overflow-hidden bg-gray-100 mb-2">
              <img
                src={item.image || item.imageUrl || fallbackImg}
                alt={item.title || item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="text-xs font-medium text-gray-800 truncate">{item.title || item.name}</h3>
            <p className="text-xs font-bold text-gray-900">
              PKR {typeof item.price === 'number' ? item.price.toLocaleString() : item.price}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SimilarProductsSection({ products = [], fallbackImg, onViewDetails }) {
  const displayItems = products.slice(0, 5);
  if (displayItems.length === 0) return null;

  return (
    <section className="my-16">
      <h2 className="text-2xl font-serif text-gray-900 mb-6 uppercase tracking-tight">
        Similar Products
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {displayItems.map((item, i) => (
          <div
            key={item.id || i}
            onClick={() => onViewDetails && onViewDetails(item)}
            className="group cursor-pointer"
          >
            <div className="h-72 rounded-2xl overflow-hidden bg-gray-100 mb-2">
              <img
                src={item.image || item.imageUrl || fallbackImg}
                alt={item.title || item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="text-xs font-medium text-gray-800 truncate">{item.title || item.name}</h3>
            <p className="text-xs font-bold text-gray-900">
              PKR {typeof item.price === 'number' ? item.price.toLocaleString() : item.price}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecentlyViewedSection({ product, fallbackImg, onViewDetails }) {
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

// --- Main Page Component ---
export default function ProductDetailPage({
  product,
  products = [],
  categories = [],
  activeCategory,
  setActiveCategory,
  onAddToCart,
  onBackToHome,
  onViewDetails,
  onNavigateToAdmin,
  currentView,
  setCurrentView,
  currentUser,
  onOpenAuthModal,
  onLogout,
  cart = [],
  setCart
}) {
  const [selectedSize, setSelectedSize] = useState('XS'); // kept for backward compatibility, unused for variable products
  const [selectedOptions, setSelectedOptions] = useState({}); // e.g. { Color: 'Black', Size: 'S' }
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic Image Handling
  const primaryProductImage = product?.image || product?.imageUrl || (product?.images && product?.images[0]) || 'https://via.placeholder.com/600x800?text=No+Image';

  // Dynamic Gallery
  const galleryImages = (product?.images && product.images.length > 0)
    ? product.images
    : [primaryProductImage];

  const [activeImg, setActiveImg] = useState(primaryProductImage);

  useEffect(() => {
    setActiveImg(primaryProductImage);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Default-select the first value of each attribute group for variable products
    if (product?.productType === 'variable' && product?.attributeGroups?.length > 0) {
      const defaults = {};
      product.attributeGroups.forEach(g => {
        if (g.values && g.values.length > 0) defaults[g.name] = g.values[0];
      });
      setSelectedOptions(defaults);
    } else {
      setSelectedOptions({});
    }
  }, [product]);

  const isVariable = product?.productType === 'variable';
  const priceNum = typeof product?.price === 'number' ? product.price : parseFloat(product?.price) || 0;

  // Find the variant matching every currently-selected option
  const matchedVariant = isVariable
    ? (product?.variants || []).find(v =>
        Object.keys(v.combination || {}).every(key => v.combination[key] === selectedOptions[key])
      )
    : null;

  const displayPrice = matchedVariant ? matchedVariant.price : priceNum;
  const displayOriginalPrice = matchedVariant ? matchedVariant.originalPrice : product?.originalPrice;
  const isInStock = isVariable ? Boolean(matchedVariant && matchedVariant.stock > 0) : (product?.inStock !== false);
  const stockLeft = matchedVariant?.stock;

  const totalCartCount = (cart || []).reduce((acc, item) => acc + (item.quantity || 1), 0);

  // Search — same filter logic as HomePage.jsx
  const searchResults = (products || []).filter(p => {
    const titleMatch = (p.title || p.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || categoryMatch;
  });

  // Dynamic list filtering
  const similarProductsList = products.filter(p => p.id !== product?.id && p.category === product?.category);
  const fallbackList = products.filter(p => p.id !== product?.id);
  const displayRelatedList = similarProductsList.length > 0 ? similarProductsList : fallbackList;

  // Cart handlers — moved here from the wrong sub-component, and now use the
  // setCart prop passed down from App.js (same pattern as HomePage.jsx)
  const handleUpdateQuantity = (id, newQty) => {
    if (typeof setCart !== 'function') return;
    setCart(prev => {
      if (newQty <= 0) return prev.filter(item => item.id !== id);
      return prev.map(item => item.id === id ? { ...item, quantity: newQty } : item);
    });
  };

  const handleRemoveFromCart = (id) => {
    if (typeof setCart !== 'function') return;
    setCart(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">

      {/* 1. TOP BANNER & NAVBAR */}
      <TopBanner />
      <Navbar
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigateToAdmin={onNavigateToAdmin}
        currentUser={currentUser}
        onOpenAuthModal={onOpenAuthModal || (() => typeof setCurrentView === 'function' && setCurrentView('login'))}
        onLogout={onLogout}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* 2. MAIN PAGE CONTENT */}
      <main className="flex-grow max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-6">
          <nav className="text-xs text-gray-400 flex items-center space-x-2">
            <span className="cursor-pointer hover:text-black" onClick={onBackToHome}>Home</span> <span>›</span>
            <span>{product?.category || 'Luxury Formals'}</span> <span>›</span>
            <span className="text-gray-800 font-medium">{product?.title || product?.name || 'Product Detail'}</span>
          </nav>

          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="text-xs font-semibold uppercase tracking-wider text-gray-600 hover:text-black border border-gray-200 px-3 py-1.5 rounded-lg hover:border-black transition-all"
            >
              ← Back to Store
            </button>
          )}
        </div>

        {/* Main PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

          {/* Left: Dynamic Gallery */}
          <div className="space-y-4">
            <div className="h-[550px] sm:h-[650px] w-full rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
              <img src={activeImg} alt={product?.title || "Product Image"} className="w-full h-full object-cover object-top" />
            </div>
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(img)}
                    className={`w-20 h-24 rounded-xl overflow-hidden flex-none border-2 transition-all ${activeImg === img ? 'border-black scale-95' : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {product?.title || product?.name || 'Product Title'}
              </h1>
              <span className={`text-xs px-3 py-1 rounded-md font-medium ${isInStock ? 'bg-gray-100 text-gray-700' : 'bg-red-50 text-red-600'}`}>
                {isInStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <p className="text-xs text-gray-400 uppercase tracking-widest">{product?.code || 'SKU-SELECTED-ITEM'}</p>

            <div className="flex justify-between items-baseline border-b pb-4">
              <span className="text-sm font-medium text-gray-500 uppercase">Price</span>
              <span className="flex items-baseline gap-2">
                {displayOriginalPrice > displayPrice && (
                  <span className="text-sm text-gray-400 line-through">Rs.{displayOriginalPrice.toLocaleString()}</span>
                )}
                <span className="text-2xl font-bold text-gray-900">
                  {displayPrice > 0 ? `Rs.${displayPrice.toLocaleString()}` : 'Rs.0'}
                </span>
              </span>
            </div>

            {/* Short description — shown right under price if set */}
            {product?.shortDescription && (
              <p className="text-sm text-gray-600 -mt-2">{product.shortDescription}</p>
            )}

            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Shipping Time</span>
              <p className="text-xs font-medium text-gray-800">3-5 BUSINESS DAYS</p>
            </div>

            {/* Options — dynamic per product (Color, Size, or any custom attribute set in admin) */}
            {isVariable && (product?.attributeGroups || []).map((group) => (
              <div key={group.name}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase">{group.name}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.values.map((value) => {
                    const isSelected = selectedOptions[group.name] === value;
                    // Would this value, combined with the rest of the current
                    // selection, resolve to a variant that's out of stock?
                    const hypothetical = { ...selectedOptions, [group.name]: value };
                    const hypotheticalVariant = (product?.variants || []).find(v =>
                      Object.keys(v.combination || {}).every(k => v.combination[k] === hypothetical[k])
                    );
                    const disabled = hypotheticalVariant ? hypotheticalVariant.stock <= 0 : false;

                    return (
                      <button
                        key={value}
                        disabled={disabled}
                        onClick={() => setSelectedOptions(prev => ({ ...prev, [group.name]: value }))}
                        className={`px-5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                          disabled
                            ? 'border border-gray-100 text-gray-300 line-through cursor-not-allowed'
                            : isSelected
                              ? 'bg-black text-white shadow-md'
                              : 'border border-gray-200 text-gray-700 hover:border-black'
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {isVariable && matchedVariant && stockLeft > 0 && stockLeft <= 5 && (
              <p className="text-xs text-amber-600 font-medium">Only {stockLeft} left in this option</p>
            )}

            {/* Quantity */}
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase block mb-3">Quantity</span>
              <div className="flex items-center space-x-3 bg-gray-100 w-fit rounded-lg p-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-md bg-white font-bold">-</button>
                <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-md bg-black text-white font-bold">+</button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-4">
              <button className="flex-1 border border-black py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                Add to Wishlist
              </button>
              <button
                disabled={!isInStock}
                onClick={() => onAddToCart && onAddToCart({
                  ...product,
                  selectedOptions: isVariable ? selectedOptions : undefined,
                  selectedSize: selectedOptions?.Size, // kept for any code still reading selectedSize
                  price: displayPrice,
                  originalPrice: displayOriginalPrice,
                  sku: matchedVariant?.sku,
                  quantity
                })}
                className="flex-1 bg-black text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isInStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {/* Accordions — Short Description already shown above; these three are optional and only appear if the admin set them */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              {[
                { key: 'Description', content: product?.description },
                { key: 'Product Care', content: product?.productCare },
              ].filter(section => section.content).map(({ key, content }) => (
                <div key={key} className="border-b border-gray-100 pb-3">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === key ? null : key)}
                    className="w-full flex justify-between items-center text-sm font-medium text-gray-800"
                  >
                    <span>{key}</span>
                    <span>{openAccordion === key ? '−' : '+'}</span>
                  </button>
                  {openAccordion === key && (
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed whitespace-pre-line">
                      {content}
                    </p>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* 3. SUB-SECTIONS RENDERED */}
        <CustomersAlsoBoughtSection
          products={displayRelatedList}
          fallbackImg={primaryProductImage}
          onViewDetails={onViewDetails}
        />

        <SimilarProductsSection
          products={displayRelatedList}
          fallbackImg={primaryProductImage}
          onViewDetails={onViewDetails}
        />

        <RecentlyViewedSection
          product={product}
          fallbackImg={primaryProductImage}
          onViewDetails={onViewDetails}
        />

      </main>

      {/* Search — same pattern as HomePage.jsx */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        results={searchResults}
        onSelectProduct={(prod) => {
          setIsSearchOpen(false);
          if (onViewDetails) onViewDetails(prod);
        }}
      />

      {/* Cart Drawer — now correctly scoped inside the main component */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
        currentUser={currentUser}
        onLoginClick={() => {
          setIsCartOpen(false);
          if (typeof setCurrentView === 'function') setCurrentView('login');
        }}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {isCheckoutOpen && (
        <CheckoutModal
          cartItems={cart}
          currentUser={currentUser}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={() => {
            if (typeof setCart === 'function') setCart([]);
            setIsCheckoutOpen(false);
          }}
        />
      )}

      {/* 4. FOOTER */}
      <Footer />

    </div>
  );
}
