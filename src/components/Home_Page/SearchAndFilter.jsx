import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function SearchAndFilter({ searchTerm, setSearchTerm, sortBy, setSortBy }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      
      {/* Search Input Bar */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-black transition-colors"
        />
      </div>

      {/* Price Sorting Selector */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <SlidersHorizontal size={16} className="text-gray-500" />
        <span className="text-xs font-semibold uppercase text-gray-500">Sort By:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black bg-white cursor-pointer"
        >
          <option value="default">Featured</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

    </div>
  );
}