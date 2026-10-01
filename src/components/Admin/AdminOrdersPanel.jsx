import React, { useState, useEffect } from 'react';
import { Clock, Truck, CheckCircle2 } from 'lucide-react';
import { fetchAllOrders, updateOrderStatusAPI } from '../../Service/api';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'];

// One accent (#7A1F2B, drawn from the bridal photography) reserved for what
// needs attention. Everything else stays ink/muted — restraint over a
// different color per status.
const STATUS_TEXT_STYLES = {
  pending: 'text-[#7A1F2B]',
  processing: 'text-[#1A1A1A]',
  dispatched: 'text-[#1A1A1A]',
  delivered: 'text-[#5B6B57]',
  cancelled: 'text-[#8A8580] line-through',
};

export default function AdminOrdersPanel({ currentUser }) {
  const token = currentUser?.token || currentUser;

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllOrders(token);
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatusAPI(orderId, newStatus, token);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Could not update order status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const safeOrders = (orders || []).filter(Boolean);
  const pendingCount = safeOrders.filter((o) => (o.status || '').toLowerCase() === 'pending').length;
  const dispatchedCount = safeOrders.filter((o) => (o.status || '').toLowerCase() === 'dispatched').length;
  const deliveredCount = safeOrders.filter((o) => (o.status || '').toLowerCase() === 'delivered').length;

  return (
    <>
      {/* Stats strip — matches the Products tab's stat bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border border-[#E5E2DC] divide-y sm:divide-y-0 sm:divide-x divide-[#E5E2DC] mb-10 bg-white">
        <div className="flex items-center gap-4 px-6 py-6">
          <Clock size={20} className="text-[#7A1F2B]" strokeWidth={1.75} />
          <div>
            <p className="text-xs uppercase tracking-wide text-[#8A8580]">Pending</p>
            <p className="font-serif text-2xl mt-0.5 text-[#7A1F2B]">{pendingCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 px-6 py-6">
          <Truck size={20} className="text-[#8A8580]" strokeWidth={1.75} />
          <div>
            <p className="text-xs uppercase tracking-wide text-[#8A8580]">Dispatched</p>
            <p className="font-serif text-2xl mt-0.5">{dispatchedCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 px-6 py-6">
          <CheckCircle2 size={20} className="text-[#8A8580]" strokeWidth={1.75} />
          <div>
            <p className="text-xs uppercase tracking-wide text-[#8A8580]">Delivered</p>
            <p className="font-serif text-2xl mt-0.5">{deliveredCount}</p>
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white border border-[#E5E2DC]">
        <div className="px-6 py-5 border-b border-[#E5E2DC]">
          <h2 className="font-serif text-xl">All Orders</h2>
          <p className="text-xs text-[#8A8580] mt-0.5">Update status to notify customers automatically via email.</p>
        </div>

        {isLoading ? (
          <p className="text-sm text-[#8A8580] p-6">Loading orders…</p>
        ) : safeOrders.length === 0 ? (
          <p className="text-sm text-[#8A8580] p-6">No orders yet.</p>
        ) : (
          <>
            {/* Mobile: stacked cards */}
            <div className="sm:hidden divide-y divide-[#F1EFEA]">
              {safeOrders.map((order) => {
                const statusKey = (order.status || 'pending').toLowerCase();
                return (
                  <div key={order.id} className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-serif text-lg">#{order.id}</span>
                      <span className="text-xs text-[#8A8580]">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{order.fullName}</p>
                    <p className="text-xs text-[#8A8580] mb-2">{order.phone} · {order.city}</p>
                    <p className="text-xs text-[#5C5850] mb-3">
                      {order.items?.map((i) => `${i.title} x${i.quantity}`).join(', ')}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">PKR {order.totalAmount?.toLocaleString()}</span>
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-semibold uppercase tracking-wide bg-transparent border border-[#E5E2DC] px-2.5 py-1.5 focus:outline-none focus:border-[#1A1A1A] disabled:opacity-50 ${STATUS_TEXT_STYLES[statusKey] || STATUS_TEXT_STYLES.pending}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop / tablet: table */}
            <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[#8A8580] uppercase tracking-wide border-b border-[#E5E2DC]">
                  <th className="py-3 px-6 font-medium">Order</th>
                  <th className="py-3 px-6 font-medium">Customer</th>
                  <th className="py-3 px-6 font-medium">City</th>
                  <th className="py-3 px-6 font-medium">Items</th>
                  <th className="py-3 px-6 font-medium">Total</th>
                  <th className="py-3 px-6 font-medium">Date</th>
                  <th className="py-3 px-6 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {safeOrders.map((order) => {
                  const statusKey = (order.status || 'pending').toLowerCase();
                  return (
                    <tr key={order.id} className="border-b border-[#F1EFEA] last:border-0">
                      <td className="py-4 px-6 font-serif">#{order.id}</td>
                      <td className="py-4 px-6">
                        <p className="font-medium">{order.fullName}</p>
                        <p className="text-xs text-[#8A8580]">{order.phone}</p>
                      </td>
                      <td className="py-4 px-6 text-[#5C5850]">{order.city}</td>
                      <td className="py-4 px-6 text-xs text-[#5C5850] max-w-xs">
                        {order.items?.map((i) => `${i.title} x${i.quantity}`).join(', ')}
                      </td>
                      <td className="py-4 px-6 font-medium">
                        PKR {order.totalAmount?.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-xs text-[#8A8580]">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-xs font-semibold uppercase tracking-wide bg-transparent border border-[#E5E2DC] px-2.5 py-1.5 focus:outline-none focus:border-[#1A1A1A] disabled:opacity-50 ${STATUS_TEXT_STYLES[statusKey] || STATUS_TEXT_STYLES.pending}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
