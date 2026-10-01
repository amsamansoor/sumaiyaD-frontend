import React, { useState, useEffect } from 'react';
import HomePage from './Pages/HomePage';
import AdminPage from './Pages/AdminPage';
import ProductDetailPage from './Pages/ProductDetailPage';
import ProductModal from "./components/Global_Components/ProductModal";
import AuthView from './components/AuthModel/AuthModal';
import OrderHistory from './components/Global_Components/OrderHistory';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  fetchCategoryImages,
  fetchHomeSections,
  deleteProductFromDB,
  fetchUserCart,
  saveUserCart,
  fetchUserWishlist,
  saveUserWishlist,
  saveSiteConfig,
  fetchHeroContent,      // <-- Backend API for Hero GET
  createHeroContent,     // <-- Backend API for Hero POST/Create
  deleteHeroContent      // <-- Backend API for Hero DELETE
} from './Service/api';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'admin', 'product-detail', 'account', 'login'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All', 'Unstitched', 'Ready To Wear', 'Luxury Formal']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [categoryImages, setCategoryImages] = useState([]);
  const [homeSections, setHomeSections] = useState([]); // <-- NEW: admin-managed homepage sections

  // Dynamic Storefront Configurations (Connected to Database API)
  const [heroConfig, setHeroConfig] = useState([
    {
      id: 1,
      title: 'Luxury Collection 2026',
      subtitle: 'Discover timeless Pakistani couture crafted with precision and elegance.',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600',
      linkUrl: '#catalog',
      isActive: true
    }
  ]);

  const [announcementConfig, setAnnouncementConfig] = useState({
    text: 'Complimentary Worldwide Shipping on Orders Above PKR 15,000',
    isActive: true
  });

  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState(null);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState(null);

  // Current Active User State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('currentUser');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // User-Specific Cart State
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Sales & Discounts Management State
  const [coupons, setCoupons] = useState([
    { id: 1, code: 'AZADI2026', discountType: 'percentage', discountValue: 20, minOrderValue: 5000, expiryDate: '2026-08-31' }
  ]);

  // 1. Initial Load: Fetch Products, Hero Content & User Data from Database
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Fetch Products
        const productData = await fetchProducts();
        if (productData && productData.length > 0) {
          setProducts(productData);
        }

        // Fetch Hero Content from Backend API
        try {
          const heroData = await fetchHeroContent();
          if (heroData) {
            setHeroConfig(heroData);
          }
        } catch (heroErr) {
          console.error("Failed to load hero content from API:", heroErr);
        }

        if (currentUser) {
          const dbCart = await fetchUserCart(currentUser.id || currentUser.email, currentUser.token);
          if (dbCart) setCart(dbCart);

          const dbWishlist = await fetchUserWishlist(currentUser.id || currentUser.email, currentUser.token);
          if (dbWishlist) setWishlist(dbWishlist);
        } else {
          const guestCart = localStorage.getItem('guest_cart');
          if (guestCart) setCart(JSON.parse(guestCart));
        }
      } catch (error) {
        console.error("Failed to load initial data from backend:", error);
      }
    };
    loadInitialData();
  }, [currentUser]);

  // 2. Database Sync: Cart Changes
  useEffect(() => {
    if (currentUser) {
      saveUserCart(currentUser.id || currentUser.email, cart, currentUser.token).catch(err =>
        console.error("Cart database sync failed:", err)
      );
    } else {
      localStorage.setItem('guest_cart', JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  // 3. Database Sync: Wishlist Changes
  useEffect(() => {
    if (currentUser) {
      saveUserWishlist(currentUser.id || currentUser.email, wishlist, currentUser.token).catch(err =>
        console.error("Wishlist database sync failed:", err)
      );
    }
  }, [wishlist, currentUser]);

  // 4. Category images + Homepage sections — refreshed whenever the person is on the storefront
  //    (so edits made in the admin panel show up without a full page reload)
  useEffect(() => {
    if (currentView === 'home' || currentView === 'store') {
      fetchCategoryImages()
        .then(setCategoryImages)
        .catch((err) => console.error('Failed to load category images:', err));

      fetchHomeSections()
        .then(setHomeSections)
        .catch((err) => console.error('Failed to load home sections:', err));
    }
  }, [currentView]);

  const handleAuthSuccess = async (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));

    try {
      const dbCart = await fetchUserCart(user.id || user.email, user.token);
      setCart(dbCart || []);

      const dbWishlist = await fetchUserWishlist(user.id || user.email, user.token);
      setWishlist(dbWishlist || []);
    } catch (e) {
      console.error("Error loading user session data:", e);
    }

    if (user.role && user.role.trim().toLowerCase() === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('account');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setCart([]);
    setWishlist([]);
    setCurrentView('home');
  };

  const handleNavigateToAdmin = () => {
    if (currentUser && currentUser.role && currentUser.role.trim().toLowerCase() === 'admin') {
      setCurrentView('admin');
    } else {
      alert('Access Denied: Only administrators can access the admin panel.');
      setCurrentView('home');
    }
  };

  const handleAddToCart = (productToAdd) => {
    setCart(prevCart => {
      const sameOptions = (a, b) => JSON.stringify(a || {}) === JSON.stringify(b || {});
      const isSame = (item) =>
        item.id === productToAdd.id &&
        item.selectedSize === productToAdd.selectedSize &&
        sameOptions(item.selectedOptions, productToAdd.selectedOptions);

      const existing = prevCart.find(isSame);
      if (existing) {
        return prevCart.map(item =>
          isSame(item)
            ? { ...item, quantity: item.quantity + (productToAdd.quantity || 1) }
            : item
        );
      }
      return [...prevCart, { ...productToAdd, quantity: productToAdd.quantity || 1 }];
    });
  };

  // --- DATABASE CONNECTED ADMIN CRUD HANDLERS ---
  const handleAddProduct = (newProductData) => {
    setProducts(prev => [newProductData, ...prev]); // AdminPanel already saved this to the DB
  };

  const handleUpdateProduct = (updatedProductData) => {
    setProducts(prev => prev.map(p => p.id === updatedProductData.id ? updatedProductData : p)); // AdminPanel already saved this to the DB
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = currentUser?.token;
      await deleteProductFromDB(productId, token);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error("Error deleting product from database:", error);
    }
  };

  const handleAddCoupon = (newCoupon) => setCoupons(prev => [newCoupon, ...prev]);
  const handleDeleteCoupon = (couponId) => setCoupons(prev => prev.filter(c => c.id !== couponId));

  const handleUpdateHero = async (updatedHero) => {
    try {
      const token = currentUser?.token;

      const heroData = Array.isArray(updatedHero) ? updatedHero[updatedHero.length - 1] || updatedHero[0] : (updatedHero || {});

      const heroPayload = {
        id: Number(heroData.id || heroData.Id || 0),
        title: heroData.title || heroData.Title || heroData.heading || "",
        subtitle: heroData.subtitle || heroData.Subtitle || heroData.description || "",
        imageUrl: heroData.imageUrl || heroData.ImageUrl || heroData.image || "",
        linkUrl: heroData.linkUrl || heroData.LinkUrl || heroData.buttonLink || "#catalog",
        isActive: true
      };

      await createHeroContent(heroPayload, token);

      const refreshedHero = await fetchHeroContent();
      if (refreshedHero) {
        setHeroConfig(refreshedHero);
      }

      alert("Hero Banner successfully updated!");
    } catch (error) {
      console.error("Error updating hero content in database:", error);
      alert("Failed to save hero banner to database.");
    }
  };

  // --- DATABASE CONNECTED HERO DELETE API ---
  const handleDeleteHero = async (heroId) => {
    try {
      const token = currentUser?.token;

      await deleteHeroContent(heroId, token);

      setHeroConfig(prev => prev.filter(hero => hero.id !== heroId));

      alert("Hero Banner successfully deleted from database!");
    } catch (error) {
      console.error("Error deleting hero content:", error);
      alert("Failed to delete hero banner from database.");
    }
  };

  const handleUpdateAnnouncement = async (updatedAnnouncement) => {
    setAnnouncementConfig(updatedAnnouncement);
    try {
      await saveSiteConfig({ announcement: updatedAnnouncement }, currentUser?.token);
    } catch (e) {
      console.error("Announcement sync failed:", e);
    }
  };

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  const handleViewDetails = (product) => {
    setSelectedDetailProduct(product);
    setCurrentView('product-detail');
  };

  const handleQuickView = (product) => {
    setSelectedQuickViewProduct(product);
  };

  return (
    <>
      {currentView === 'admin' ? (
        currentUser && currentUser.role && currentUser.role.trim().toLowerCase() === 'admin' ? (
          <AdminPage
            products={products}
            coupons={coupons}
            categories={categories}
            heroConfig={heroConfig}
            announcementConfig={announcementConfig}
            currentUser={currentUser}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddCoupon={handleAddCoupon}
            onDeleteCoupon={handleDeleteCoupon}
            onUpdateHero={handleUpdateHero}
            onDeleteHero={handleDeleteHero}
            onUpdateAnnouncement={handleUpdateAnnouncement}
            onBackToHome={() => setCurrentView('home')}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-screen text-center px-4 bg-gray-50">
            <h2 className="text-3xl font-bold text-red-600 mb-2">403 - Unauthorized Access</h2>
            <p className="text-gray-600 mb-6">You Don't have any Access to this page.</p>
            <button
              onClick={() => setCurrentView('home')}
              className="bg-black text-white px-6 py-3 rounded text-sm uppercase font-semibold tracking-wider hover:bg-gray-800 transition-colors"
            >
              Back to Home
            </button>
          </div>
        )
      ) : currentView === 'product-detail' ? (
        <ProductDetailPage
          product={selectedDetailProduct}
          products={products}
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          cart={cart}
          setCart={setCart}
          onAddToCart={handleAddToCart}
          onViewDetails={handleViewDetails}
          onNavigateToAdmin={handleNavigateToAdmin}
          currentUser={currentUser}
          onOpenAuthModal={() => setCurrentView('login')}
          onLogout={handleLogout}
          currentView={currentView}
          setCurrentView={setCurrentView}
          onBackToHome={() => setCurrentView('home')}
        />
      ) : currentView === 'account' && currentUser ? (
        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-light tracking-wide">Account</h1>
              <button
                onClick={() => setCurrentView('home')}
                className="text-xs uppercase tracking-wider underline text-gray-600 hover:text-black"
              >
                Back to Store
              </button>
            </div>

            <div className="mb-12">
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-black underline flex items-center gap-1.5 transition-colors focus:outline-none"
              >
                Log out
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-gray-100 pt-8">
              <div className="md:col-span-2">
                <OrderHistory currentUser={currentUser} />
              </div>

              <div className="bg-gray-50 p-6 rounded-md border border-gray-100">
                <h2 className="text-xl font-light mb-4">Account details</h2>
                <div className="text-sm text-gray-700 space-y-1.5">
                  <p className="font-medium text-black text-base">{currentUser.name || currentUser.firstName || 'Valued Customer'}</p>
                  <p className="text-gray-500">{currentUser.email}</p>
                  <p className="text-gray-500">Role: <span className="uppercase font-semibold text-black">{currentUser.role || 'User'}</span></p>
                  <p className="text-gray-500">Pakistan</p>

                  <div className="pt-2">
                    <button className="text-xs text-gray-600 hover:text-black underline focus:outline-none">
                      View addresses (0)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : currentView === 'login' && !currentUser ? (
        <div className="min-h-screen bg-white flex flex-col">
          <div className="max-w-7xl w-full mx-auto px-4 py-6 flex justify-between items-center border-b border-gray-100">
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs uppercase tracking-wider underline text-gray-600 hover:text-black"
            >
              &larr; Back to Store
            </button>
          </div>
          <AuthView
            onAuthSuccess={handleAuthSuccess}
            setCurrentView={setCurrentView}
          />
        </div>
      ) : (
        <HomePage
          products={filteredProducts}
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          coupons={coupons}
          cart={cart}
          setCart={setCart}
          wishlist={wishlist}
          setWishlist={setWishlist}
          heroConfig={heroConfig}
          announcementConfig={announcementConfig}
          currentUser={currentUser}
          onAuthSuccess={handleAuthSuccess}
          onOpenAuthModal={() => setCurrentView('login')}
          onLogout={handleLogout}
          onNavigateToAdmin={handleNavigateToAdmin}
          currentView={currentView}
          setCurrentView={setCurrentView}
          onQuickView={handleQuickView}
          onViewDetails={handleViewDetails}
          categoryImages={categoryImages}
          homeSections={homeSections}
        />
      )}

      {selectedQuickViewProduct && (
        <ProductModal
          product={selectedQuickViewProduct}
          onClose={() => setSelectedQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
}