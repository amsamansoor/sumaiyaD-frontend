import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-serif tracking-widest mb-4">SUMAIYA_D</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Premium luxury unstitched and ready-to-wear collections crafted for modern elegance.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-300">Customer Care</h4>
            <ul className="text-xs text-gray-400 space-y-2">
              <li className="hover:text-white cursor-pointer">Order Tracking</li>
              <li className="hover:text-white cursor-pointer">Shipping & Returns</li>
              <li className="hover:text-white cursor-pointer">Size Guide</li>
              <li className="hover:text-white cursor-pointer">Contact Us</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-300">About Us</h4>
            <ul className="text-xs text-gray-400 space-y-2">
              <li className="hover:text-white cursor-pointer">Our Story</li>
              <li className="hover:text-white cursor-pointer">Store Locations</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-300">Newsletter</h4>
            <p className="text-xs text-gray-400 mb-3">Subscribe to get special offers and updates.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-900 border border-gray-700 text-xs text-white px-3 py-2 w-full focus:outline-none focus:border-white"
              />
              <button className="bg-white text-black px-4 py-2 text-xs uppercase font-bold hover:bg-gray-200">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-900 pt-6 text-center text-[10px] text-gray-500 tracking-widest">
          © 2026 SUMAIYA_D. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}