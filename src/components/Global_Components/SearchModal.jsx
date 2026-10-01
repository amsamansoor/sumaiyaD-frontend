import React from 'react';
import { X, Search } from 'lucide-react';

export default function SearchModal({ isOpen, onClose, searchQuery, setSearchQuery, results, onSelectProduct }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white max-w-2xl mx-auto mt-20 p-6 rounded-lg shadow-2xl z-10">
        <div className="flex items-center border-b border-gray-200 pb-4">
          <Search className="text-gray-400 mr-3" size={20} />
          <input 
            type="text"
            autoFocus
            placeholder="Search collections, fabrics, or styles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-lg focus:outline-none text-gray-900"
          />
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Search Results */}
        <div className="mt-6 max-h-96 overflow-y-auto space-y-4">
          {searchQuery && results.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-6">No matching items found.</p>
          ) : (
            results.map((product) => (
              <div 
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
              >
                <img src={product.image} alt={product.title} className="w-12 h-16 object-cover rounded" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{product.title}</h4>
                  <p className="text-xs text-gray-500">{product.category}</p>
                  <p className="text-xs font-bold text-black mt-1">PKR {product.price.toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}