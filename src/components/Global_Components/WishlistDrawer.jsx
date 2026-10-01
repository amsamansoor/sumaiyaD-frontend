import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';

/**
 * WishlistDrawer
 * -------------------------------------------------------------------------
 * Same slide-in-from-right pattern as CartDrawer. Props:
 * - isOpen, onClose
 * - wishlistItems: array of product objects
 * - onRemove(id): remove one item from the wishlist
 * - onMoveToCart(item): add the item to the cart (and typically remove it
 *   from the wishlist too — handled by the parent)
 * - currentUser, onLoginClick: same pattern as CartDrawer, in case the
 *   wishlist should prompt guests to log in
 * -------------------------------------------------------------------------
 */
export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems = [],
  onRemove,
  onMoveToCart,
  currentUser,
  onLoginClick,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      {/* Drawer panel */}
      <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="flex items-center gap-2 text-lg font-bold uppercase tracking-wide">
            <Heart size={18} /> Wishlist ({wishlistItems.length})
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black" aria-label="Close wishlist">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!currentUser && (
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-4 text-sm text-gray-600">
              <button onClick={onLoginClick} className="underline text-black font-medium">
                Log in
              </button>{' '}
              to save your wishlist across devices.
            </div>
          )}

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">Your wishlist is empty.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {wishlistItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 bg-gray-100 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                      src={item.image || item.imageUrl || (item.images && item.images[0])}
                      alt={item.title || item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.title || item.name}
                    </p>
                    <p className="text-sm font-bold text-gray-900 mt-1">
                      PKR {typeof item.price === 'number' ? item.price.toLocaleString() : item.price}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <button
                        onClick={() => onMoveToCart && onMoveToCart(item)}
                        className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide bg-black text-white px-3 py-2 rounded hover:bg-gray-800"
                      >
                        <ShoppingBag size={14} /> Add to Cart
                      </button>
                      <button
                        onClick={() => onRemove && onRemove(item.id)}
                        className="text-gray-400 hover:text-red-600"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
