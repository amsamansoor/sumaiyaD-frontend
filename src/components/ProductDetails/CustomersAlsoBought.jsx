import React from 'react';

export default function CustomersAlsoBought({ products = [], fallbackImg, onViewDetails }) {
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