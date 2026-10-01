import React, { useState } from 'react';

// Imports with explicit file extensions to resolve Vite HMR casing/resolution issues
import TopBanner from '../components/Home_Page/TopBanner.jsx';
import HeroBanner from '../components/Home_Page/HeroBanner.jsx';
import CategoryGrid from '../components/Home_Page/CategoryGrid.jsx';
import FeaturePromoBanners from '../components/Home_Page/FeaturePromoBanners.jsx';
import ProductCarouselSection from '../components/Home_Page/ProductCarouselSection.jsx';
import SingleBannerSection from '../components/Home_Page/SingleBannerSection.jsx';
import ProductGrid from '../components/Home_Page/ProductGrid.jsx';
import Footer from '../components/Home_Page/Footer.jsx';

import Navbar from '../components/Global_Components/Navbar.jsx';
import ProductModal from '../components/Global_Components/ProductModal.jsx';
import SearchModal from '../components/Global_Components/SearchModal.jsx';
import CartDrawer from '../components/Global_Components/CartDrawer.jsx';
import CheckoutModal from '../components/Global_Components/CheckoutModal.jsx';
import AuthModal from '../components/AuthModel/AuthModal.jsx';
import WishlistDrawer from '../components/Global_Components/WishlistDrawer.jsx';


// Default Category Images Mapping for Home Page
const defaultCategoryImages = {
  'Kids': 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80',
  'Unstitched': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
  'Luxury Formals': 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
  'Luxury Pret': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
  'Stitched': 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
  'Jewelry': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
  'Ready to Wear': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
  'Accessories': 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
  'Perfumes': 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80'
};

export default function HomePage({
  products = [],
  categories = [],
  activeCategory,
  setActiveCategory,
  onNavigateToAdmin,
  currentView = 'store',
  setCurrentView,
  onQuickView,
  onViewDetails,
  cart = [],
  setCart,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onAuthSuccess,
  heroConfig,
  categoryImages = [],
  homeSections = []   // <-- NEW: [{ id, title, subtitle, type, isActive, items, productCategoryFilter }]
}) {
  // Local UI States for Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  // Safe search check for API fields
  const searchResults = (products || []).filter(p => {
    const titleMatch = (p.title || p.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || categoryMatch;
  });

  // Global Sync Cart Handlers
  const handleAddToCart = (productWithDetails) => {
    setCart(prevItems => {
      const sameOptions = (a, b) => JSON.stringify(a || {}) === JSON.stringify(b || {});
      const isSame = (item) =>
        item.id === productWithDetails.id &&
        item.selectedSize === productWithDetails.selectedSize &&
        sameOptions(item.selectedOptions, productWithDetails.selectedOptions);

      const existingIndex = prevItems.findIndex(isSame);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prevItems, { ...productWithDetails, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, newQty) => {
    setCart(prev => {
      if (newQty <= 0) {
        return prev.filter(item => item.id !== id);
      }
      return prev.map(item => item.id === id ? { ...item, quantity: newQty } : item);
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };
  const handleRemoveFromWishlist = (id) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  const handleMoveToCart = (item) => {
    handleAddToCart(item);
    setWishlist(prev => prev.filter(i => i.id !== item.id));
  };

  const totalCartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  // Formatted categories list with mapped images for CategoryGrid
  const imageByCategory = new Map(
    (categoryImages || []).map(c => [(c.categoryName || '').trim().toLowerCase(), c.imageUrl])
  );

  const formattedCategories = (categories.length > 0 ? categories : Object.keys(defaultCategoryImages)).map((catName, index) => {
    const title = typeof catName === 'string' ? catName : catName.title;
    return {
      id: index + 1,
      title,
      image:
        imageByCategory.get(title.trim().toLowerCase()) ||
        defaultCategoryImages[title] ||
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80'
    };
  });

  const handleSelectCategory = (catName) => {
    if (setActiveCategory) setActiveCategory(catName);
    window.scrollTo({ top: 650, behavior: 'smooth' });
  };

  // Only sections marked active, in the order the admin arranged them
  const visibleSections = (homeSections || [])
    .filter(s => s.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Header Section */}
      <TopBanner />
      <Navbar
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigateToAdmin={onNavigateToAdmin}
        // User Auth Props for Navbar
        currentUser={currentUser}
        onOpenAuthModal={onOpenAuthModal || (() => typeof setCurrentView === 'function' && setCurrentView('login'))}
        onLogout={onLogout}
        currentView={currentView}
        setCurrentView={setCurrentView}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        categoryImages={categoryImages}
      />

      {/* Main Content View Switcher */}
      <main className="flex-grow">
        {currentView === 'login' ? (
          /* Maria B. Full-Page Auth View Inside Main Layout */
          <AuthModal
            onAuthSuccess={(user) => {
              if (onAuthSuccess) onAuthSuccess(user);
              if (setCurrentView) setCurrentView('store');
            }}
            setCurrentView={setCurrentView}
          />
        ) : (
          /* Standard Store View */
          <>
            <HeroBanner heroConfig={heroConfig} />

            {/* Fixed: category strip — managed via the "Category Images" admin tab */}
            <CategoryGrid
              categories={formattedCategories}
              onSelectCategory={handleSelectCategory}
            />

            {/* Dynamic: everything below is managed via the "Homepage Sections" admin tab.
                If no sections exist yet, fall back to the original static promo banners +
                product grid so the page never looks broken/empty. */}
            {visibleSections.length > 0 ? (
              visibleSections.map((section) => {
                switch (section.type) {
                  case 'promo-banner-grid':
                    return (
                      <FeaturePromoBanners
                        key={section.id}
                        items={section.items}
                        onSelectCategory={handleSelectCategory}
                      />
                    );
                  case 'single-banner':
                    return (
                      <SingleBannerSection
                        key={section.id}
                        item={section.items?.[0]}
                        onSelectCategory={handleSelectCategory}
                      />
                    );
                  case 'product-carousel':
                    return (
                      <ProductCarouselSection
                        key={section.id}
                        title={section.title}
                        subtitle={section.subtitle}
                        products={products}
                        categoryFilter={section.productCategoryFilter}
                        onViewDetails={onViewDetails}
                      />
                    );
                  case 'category-strip':
                    return (
                      <CategoryGrid
                        key={section.id}
                        categories={(section.items || []).map((it, i) => ({
                          id: i,
                          title: it.label,
                          image: it.imageUrl,
                        }))}
                        onSelectCategory={handleSelectCategory}
                      />
                    );
                  default:
                    return null;
                }
              })
            ) : (
              <FeaturePromoBanners onSelectCategory={handleSelectCategory} />
            )}

            <ProductGrid
              products={products}
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onAddToCart={(product) => setSelectedProduct(product)}
              onQuickView={onQuickView}
              onViewDetails={onViewDetails}
            />
          </>
        )}
      </main>

      {/* Footer Section */}
      <Footer />

      {/* Modals & Overlays */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          allProducts={products}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        results={searchResults}
        onSelectProduct={(prod) => {
          setSelectedProduct(prod);
          setIsSearchOpen(false);
        }}
      />

      {/* Integrated Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
        currentUser={currentUser}
        onLoginClick={() => {
          setIsCartOpen(false);
          if (typeof setCurrentView === 'function') {
            setCurrentView('login');
          } else if (onOpenAuthModal) {
            onOpenAuthModal();
          }
        }}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlist}
        onRemove={handleRemoveFromWishlist}
        onMoveToCart={handleMoveToCart}
        currentUser={currentUser}
        onLoginClick={() => {
          setIsWishlistOpen(false);
          if (typeof setCurrentView === 'function') setCurrentView('login');
        }}
      />

      {isCheckoutOpen && (
        <CheckoutModal
          cartItems={cart}
          currentUser={currentUser}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={() => {
            setCart([]);
            setIsCheckoutOpen(false);
          }}
        />
      )}
    </div>
  );
}
