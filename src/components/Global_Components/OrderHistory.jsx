import { useState, useEffect } from "react";
import { fetchUserOrders } from "../../Service/api";
/**
 * OrderHistory
 * -------------------------------------------------------------------------
 * Drop-in replacement for the "Order history" placeholder already in
 * App.js's account view:
 *
 *   <div className="md:col-span-2">
 *     <h2 className="text-2xl font-light mb-4">Order history</h2>
 *     <p className="text-sm text-gray-600">You haven't placed any orders yet.</p>
 *   </div>
 *
 * Replace that block with:
 *
 *   <div className="md:col-span-2">
 *     <OrderHistory currentUser={currentUser} />
 *   </div>
 *
 * (Remove the "Order history" <h2> from App.js since this component
 * renders its own heading.)
 * -------------------------------------------------------------------------
 */
export default function OrderHistory({ currentUser }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const userId = currentUser.id || currentUser.email;

    fetchUserOrders(userId, currentUser.token)
      .then((data) => setOrders(data || []))
      .catch(() => setError("Could not load your orders right now."))
      .finally(() => setIsLoading(false));
  }, [currentUser]);

  return (
    <div>
      <h2 className="text-2xl font-light mb-4">Order history</h2>

      {isLoading && (
        <p className="text-sm text-gray-500">Loading your orders...</p>
      )}

      {!isLoading && error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <p className="text-sm text-gray-600">
          You haven't placed any orders yet.
        </p>
      )}

      {!isLoading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium">Order #{order.id}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="text-xs text-gray-600 mb-3 flex gap-3 flex-wrap">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-10 h-12 bg-gray-100 flex-shrink-0 overflow-hidden">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span>{item.title} × {item.quantity}</span>
                  </div>
                ))}
              </div>

              <p className="text-sm font-medium">
                PKR {order.totalAmount?.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-gray-100 text-gray-700",
    processing: "bg-blue-50 text-blue-700",
    dispatched: "bg-amber-50 text-amber-700",
    shipped: "bg-amber-50 text-amber-700",
    delivered: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-700",
  };

  const style = styles[(status || "").toLowerCase()] || styles.pending;

  return (
    <span className={`text-xs px-2 py-1 uppercase tracking-wide ${style}`}>
      {status}
    </span>
  );
}
