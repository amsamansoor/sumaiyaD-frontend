import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export default function ProductTable({ safeProducts = [], onEdit, onDelete }) {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-base font-bold uppercase tracking-wider text-gray-900 mb-4 border-b pb-3">
        Product Catalog ({safeProducts.length})
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold bg-gray-50">
              <th className="py-3 px-4">Item</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {safeProducts.map((item, index) => (
              <tr key={item.id || item._id || `product-${index}`} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 flex items-center gap-3">
                  <img
                    src={item.imageUrl || item.image}
                    alt={item.title}
                    className="w-12 h-14 object-cover rounded bg-gray-100"
                  />
                  <span className="font-medium text-gray-900">{item.title}</span>
                </td>
                <td className="py-3 px-4 text-gray-600">{item.category}</td>
                <td className="py-3 px-4 font-semibold text-gray-900">
                  PKR {Number(item.price || 0).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete && onDelete(item.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}