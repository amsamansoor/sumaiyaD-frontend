import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cart = [], 
  cartItems, // Prop name compatibility
  updateQuantity, 
  onUpdateQuantity, 
  removeItem, 
  onRemove,
  onCheckout,
  onLoginClick, // Callback for auth modal
  currentUser // Current user state check
}) {
  if (!isOpen) return null;

  // Prop aliases check
  const items = cartItems || cart || [];
  const handleUpdate = onUpdateQuantity || updateQuantity;
  const handleRemove = onRemove || removeItem;

  // Safe Total Calculation
  const total = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0);
  const totalCount = items.reduce((a, b) => a + (b.quantity || 1), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col h-full">
          
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
            <h2 className="text-lg font-semibold uppercase tracking-wider text-gray-900 flex items-center gap-2">
              <ShoppingBag size={20} /> Shopping Cart ({totalCount})
            </h2>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Content Container */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              /* Empty Cart View (Maria B Style) */
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <h3 className="text-xl font-normal text-gray-900 mb-6 tracking-wide">
                  Your cart is empty
                </h3>
                
                {/* Continue Shopping Button */}
                <button
                  onClick={onClose}
                  className="w-full max-w-xs border border-black text-black py-3 px-6 uppercase tracking-widest text-xs font-semibold hover:bg-black hover:text-white transition-all duration-200 mb-8"
                >
                  Continue Shopping
                </button>

                {/* Show Login Prompt ONLY if user is NOT logged in */}
                {!currentUser && (
                  <div className="space-y-1">
                    <p className="text-base font-medium text-gray-900">
                      Have an account?
                    </p>
                    <p className="text-sm text-gray-600">
                      <button 
                        onClick={() => {
                          onClose();
                          if (onLoginClick) onLoginClick();
                        }} 
                        className="underline hover:text-black font-semibold text-gray-900 cursor-pointer"
                      >
                        Log in
                      </button>{' '}
                      to check out faster.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Cart Items List */
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
                    <img 
                      src={item.image || item.imageUrl} 
                      alt={item.title || item.name} 
                      className="w-20 h-24 object-cover rounded bg-gray-50"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.title || item.name}</h3>
                          <button 
                            onClick={() => handleRemove && handleRemove(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Category: {item.category}</p>
                        <p className="text-sm font-semibold text-black mt-1">
                          PKR {Number(item.price).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gray-200 rounded">
                          <button 
                            onClick={() => handleUpdate && handleUpdate(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-xs font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdate && handleUpdate(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Subtotal & Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4 flex-shrink-0">
              <div className="flex justify-between text-base font-semibold text-gray-900">
                <span>Subtotal</span>
                <span>PKR {total.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500">Shipping & taxes calculated at checkout.</p>
              <button 
                onClick={onCheckout}
                className="w-full bg-black text-white py-3 uppercase tracking-widest text-xs font-semibold hover:bg-gray-800 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}