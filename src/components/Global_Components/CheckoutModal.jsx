import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { placeOrderAPI } from '../../Service/api'; // add this export to api.js — see note below

export default function CheckoutModal({ cartItems = [], onClose, onSuccess, currentUser }) {
  const [step, setStep] = useState('form'); // 'form' or 'success'
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || currentUser?.firstName || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'COD'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    try {
      setIsSubmitting(true);

      const orderData = {
       userId: currentUser?.id ? String(currentUser.id) : (currentUser?.email || null),
        customer: formData,
        items: cartItems,
        totalAmount: subtotal,
        paymentMethod: formData.paymentMethod,
      };

      await placeOrderAPI(orderData, currentUser?.token);
      setStep('success');
    } catch (error) {
      console.error("Order placement failed:", error);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setStep('form');
    onSuccess(); // HomePage.jsx clears the cart and closes the modal
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white max-w-xl w-full rounded-lg shadow-2xl p-6 sm:p-8 z-10 my-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
          <X size={20} />
        </button>

        {step === 'form' ? (
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900 mb-2">Checkout Details</h2>
            <p className="text-xs text-gray-500 mb-6">Complete your shipping information to place the order.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
                  placeholder="Amsa"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
                    placeholder="03001234567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Shipping Address</label>
                <input 
                  type="text" required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
                  placeholder="House #, Street..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">City</label>
                <input 
                  type="text" required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
                  placeholder="Islamabad / Rawalpindi"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">Payment Method</label>
                <select 
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black bg-white"
                >
                  <option value="COD">Cash on Delivery (COD)</option>
                  <option value="Card">Credit / Debit Card</option>
                </select>
              </div>

              {submitError && (
                <p className="text-sm text-red-600">{submitError}</p>
              )}

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-500 uppercase">Total Amount</span>
                  <p className="text-lg font-bold text-black">PKR {subtotal.toLocaleString()}</p>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-white px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Placing Order...' : 'Confirm Order'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={56} />
            <h2 className="text-2xl font-serif text-gray-900 mb-2">Order Confirmed!</h2>
            <p className="text-sm text-gray-600 mb-6">
              Thank you, <span className="font-semibold">{formData.fullName}</span>. Your order has been successfully placed.
            </p>
            <button 
              onClick={handleFinish}
              className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
