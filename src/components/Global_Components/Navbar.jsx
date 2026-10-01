import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Heart, User, ShieldCheck } from 'lucide-react';
import logoImage from "../../assets/logo.png";

export default function Navbar({
  categories = [],
  activeCategory,
  setActiveCategory,
  cartCount = 0,
  wishlistCount = 0,
  mobileMenuOpen: externalMobileMenuOpen,
  setMobileMenuOpen: externalSetMobileMenuOpen,
  onOpenCart,
  onOpenSearch,
  onOpenWishlist,
  onNavigateToAdmin,
  currentView = 'store',
  setCurrentView,
  // User Authentication Props
  currentUser,
  onOpenAuthModal,
  onLogout
}) {
  // Local state as fallback agar parent se props na milein
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);

  const isMenuOpen = externalMobileMenuOpen !== undefined ? externalMobileMenuOpen : internalMobileMenuOpen;

  const toggleMenu = () => {
    if (typeof externalSetMobileMenuOpen === 'function') {
      externalSetMobileMenuOpen(!externalMobileMenuOpen);
    } else {
      setInternalMobileMenuOpen(!internalMobileMenuOpen);
    }
  };

  const closeMenu = () => {
    if (typeof externalSetMobileMenuOpen === 'function') {
      externalSetMobileMenuOpen(false);
    } else {
      setInternalMobileMenuOpen(false);
    }
  };

  // Admin view navigation handler
  const handleAdminClick = () => {
    if (typeof onNavigateToAdmin === 'function') {
      onNavigateToAdmin();
    } else if (typeof setCurrentView === 'function') {
      setCurrentView('admin');
    }
    closeMenu();
  };

  // Home view navigation handler
  const handleHomeClick = () => {
    if (typeof setCurrentView === 'function') {
      setCurrentView('store');
    }
    closeMenu();
  };

  // Handle User Icon Click (Maria B. Pattern)
  const handleUserIconClick = () => {
    if (typeof setCurrentView === 'function') {
      if (currentUser) {
        setCurrentView('account'); // Logged in user goes to Account Dashboard
      } else {
        setCurrentView('login');   // Logged out user goes to Login Page
      }
    } else if (typeof onOpenAuthModal === 'function') {
      onOpenAuthModal();
    }
    closeMenu();
  };

  // Check if current user is admin (trim and lowercase safe check)
  const isAdmin = currentUser && currentUser.role && currentUser.role.trim().toLowerCase() === 'admin';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-700 hover:text-black focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo (Clicking logo returns to home page) */}
          <div className="flex-1 md:flex-initial text-center md:text-left flex items-center">
            <button
              onClick={handleHomeClick}
              className="inline-block py-1 focus:outline-none"
            >
              <img
                src={logoImage}
                alt="Sumayya.D Clothing Logo"
                className="h-28 w-auto max-w-none object-contain transform scale-125 origin-left transition-transform duration-300"
              />
            </button>
          </div>

          {/* Main Navigation Links */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium tracking-wider uppercase">
            {(categories || []).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  if (setActiveCategory) setActiveCategory(cat);
                  handleHomeClick();
                }}
                className={`transition-colors py-2 border-b-2 ${currentView === 'store' && activeCategory === cat
                    ? 'border-black text-black font-semibold'
                    : 'border-transparent text-gray-600 hover:text-black'
                  }`}
              >
                {cat === 'All' ? 'All Collections' : cat}
              </button>
            ))}

            {/* 🌟 Admin Link inside Navbar (Only visible if user is Admin) */}
            {isAdmin && (
              <button
                onClick={handleAdminClick}
                className={`transition-colors py-2 border-b-2 flex items-center gap-1 ${currentView === 'admin'
                    ? 'border-black text-black font-semibold'
                    : 'border-transparent text-gray-500 hover:text-black'
                  }`}
              >
                <ShieldCheck size={16} /> Admin
              </button>
            )}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button
              onClick={onOpenSearch}
              className="text-gray-700 hover:text-black transition-colors"
              aria-label="Search"
            >
              <Search size={22} />
            </button>

            {/* User Icon (Direct Route to Login/Account Page) */}
            <button
              onClick={handleUserIconClick}
              className={`transition-colors p-1 ${
                currentView === 'login' || currentView === 'account' 
                  ? 'text-black font-bold' 
                  : 'text-gray-700 hover:text-black'
              }`}
              aria-label="Account"
              title={currentUser ? "Account Details" : "Log in / Register"}
            >
              <User size={22} />
            </button>

            <button
              onClick={onOpenWishlist}
              className="hidden sm:block text-gray-700 hover:text-black transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenCart}
              className="text-gray-700 hover:text-black transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-4 space-y-2">
          {(categories || []).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                if (setActiveCategory) setActiveCategory(cat);
                handleHomeClick();
              }}
              className="block w-full text-left py-2 text-sm uppercase tracking-wider font-medium text-gray-800 hover:text-black"
            >
              {cat === 'All' ? 'All Collections' : cat}
            </button>
          ))}

          {/* Mobile Wishlist Link */}
          <button
            onClick={() => {
              if (onOpenWishlist) onOpenWishlist();
              closeMenu();
            }}
            className="block w-full text-left py-2 text-sm uppercase tracking-wider font-medium text-gray-800 hover:text-black"
          >
            Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ''}
          </button>

          {/* Mobile User Account Link */}
          <button
            onClick={handleUserIconClick}
            className="block w-full text-left py-2 text-sm uppercase tracking-wider font-semibold text-black"
          >
            {currentUser ? `Account (${currentUser.firstName || currentUser.name || 'User'})` : 'Log in / Register'}
          </button>

          {/* 🌟 Mobile Admin Portal Link (Only visible if user is Admin) */}
          {isAdmin && (
            <button
              onClick={handleAdminClick}
              className="block w-full text-left py-2 text-sm uppercase tracking-wider font-semibold text-gray-500 hover:text-black flex items-center gap-1"
            >
              <ShieldCheck size={16} /> Admin Portal
            </button>
          )}
        </div>
      )}
    </header>
  );
}
