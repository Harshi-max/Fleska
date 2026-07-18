"use client";

import { useState, useEffect } from "react";
import { Download, FileText, Calendar, DollarSign, Search } from "lucide-react";
import { orderStore } from "@/lib/store";

export function BillingScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchResult, setSearchResult] = useState<any | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        const allOrders = data.orders || [];
        console.log('BillingScreen - Fetched orders from API:', allOrders);
        setOrders(allOrders);

        // Calculate total revenue
        const total = allOrders.reduce((sum: number, order: any) => {
          return sum + parseFloat(order.total || "0");
        }, 0);
        setTotalRevenue(total);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
    // Refresh orders every 2 seconds
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  // Mock data for display when no orders exist
  const displayOrders = orders.length > 0 ? orders : [
    {
      id: 'ORD-DEMO-001',
      placed_at: new Date().toISOString(),
      total: '45.50',
      payment_type: 'CARD',
      status: 'completed',
      items: [{ sku: 'PIZZA_M', quantity: 2, item_price: '12.99' }],
      subtotal: '25.98',
      convenience_fee: '1.04',
      dual_pricing_surcharge: '1.04',
      tip: '0.00',
      discount: '0.00'
    },
    {
      id: 'ORD-DEMO-002',
      placed_at: new Date(Date.now() - 3600000).toISOString(),
      total: '18.82',
      payment_type: 'CASH',
      status: 'completed',
      items: [{ sku: 'BURGER_C', quantity: 1, item_price: '9.49' }, { sku: 'FRIES', quantity: 2, item_price: '3.33' }],
      subtotal: '16.15',
      convenience_fee: '0.00',
      dual_pricing_surcharge: '0.00',
      tip: '2.67',
      discount: '0.00'
    }
  ];

  const displayRevenue = orders.length > 0 ? totalRevenue : 64.32;

  const exportReceipt = (order: any) => {
    const receiptContent = `
FLEKSA RESTAURANT - RECEIPT
============================
Order ID: ${order.id}
Date: ${new Date(order.placed_at).toLocaleString()}
Payment Type: ${order.payment_type}
----------------------------
Items:
${order.items.map((item: any) => `- ${item.sku} x${item.quantity} @ $${item.item_price || '0.00'}`).join('\n')}
----------------------------
Subtotal: $${order.subtotal}
${order.dual_pricing_surcharge && parseFloat(order.dual_pricing_surcharge) > 0 ? `Dual Pricing Surcharge: $${order.dual_pricing_surcharge}` : ''}
Convenience Fee: $${order.convenience_fee}
Tip: $${order.tip}
Discount: $${order.discount}
Total: $${order.total}
============================
Thank you for dining with us!
    `;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAllBilling = () => {
    const billingContent = `
FLEKSA RESTAURANT - BILLING REPORT
==================================
Generated: ${new Date().toLocaleString()}
Total Orders: ${displayOrders.length}
Total Revenue: $${displayRevenue.toFixed(2)}
==================================
ORDER DETAILS:
${displayOrders.map((order, index) => `
${index + 1}. Order ID: ${order.id}
   Date: ${new Date(order.placed_at).toLocaleString()}
   Total: $${order.total}
   Payment: ${order.payment_type}
   Subtotal: $${order.subtotal}
   Convenience Fee: $${order.convenience_fee}
   Dual Pricing Surcharge: $${order.dual_pricing_surcharge || '0.00'}
   Tip: $${order.tip}
   Discount: $${order.discount}
   Items: ${order.items.map((item: any) => `${item.sku}(${item.quantity})`).join(', ')}
`).join('\n')}
==================================
    `;

    const blob = new Blob([billingContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `billing-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const searchOrder = () => {
    if (!searchOrderId.trim()) {
      setSearchResult(null);
      return;
    }
    
    const searchTerm = searchOrderId.trim().toLowerCase();
    console.log('BillingScreen - Searching for:', searchTerm);
    console.log('BillingScreen - Available orders from API:', orders.length);
    console.log('BillingScreen - Order IDs from API:', orders.map(o => o.id));
    
    // First try to find in API orders
    let found = orders.find(order => {
      const orderId = (order.id || '').toLowerCase();
      return orderId.includes(searchTerm);
    });
    
    // If not found in API orders, try orderStore directly
    if (!found) {
      console.log('BillingScreen - Not found in API orders, checking orderStore directly');
      const storeOrders = orderStore.listAllOrders();
      console.log('BillingScreen - Orders from store:', storeOrders.length);
      console.log('BillingScreen - Order IDs from store:', storeOrders.map(o => o.id));
      
      found = storeOrders.find(order => {
        const orderId = (order.id || '').toLowerCase();
        return orderId.includes(searchTerm);
      });
    }
    
    console.log('BillingScreen - Search result:', found);
    setSearchResult(found || null);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      // Refresh orders by triggering a fetch
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data.orders || []);
      // Update search result if it matches
      if (searchResult && searchResult.id === orderId) {
        const updated = (data.orders || []).find((o: any) => o.id === orderId);
        setSearchResult(updated || null);
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "#e5e7eb" }}>
            Billing
          </h1>
          <p style={{ color: "#9ca3af" }}>Manage invoices and payments</p>
        </div>
        <button
          onClick={exportAllBilling}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-bold text-white transition-all"
          style={{ backgroundColor: "#ff5a00" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ff7a1a")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ff5a00")}
        >
          <Download className="w-4 h-4" />
          Export All
        </button>
      </div>

      {/* Order Search */}
      <div
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: "rgba(15, 15, 15, 0.5)",
          borderColor: "rgba(255, 90, 0, 0.2)",
        }}
      >
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Order ID..."
            value={searchOrderId}
            onChange={(e) => setSearchOrderId(e.target.value)}
            className="flex-1 px-3 py-2 rounded text-sm"
            style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255, 90, 0, 0.2)", color: "#e5e7eb" }}
          />
          <button
            onClick={searchOrder}
            className="px-4 py-2 rounded font-mono text-sm font-bold text-white transition-all"
            style={{ backgroundColor: "#ff5a00" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ff7a1a")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ff5a00")}
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Result */}
      {searchResult && (
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: "rgba(15, 15, 15, 0.5)",
            borderColor: "rgba(16, 185, 129, 0.3)",
          }}
        >
          <h3 className="text-lg font-bold mb-3" style={{ color: "#e5e7eb" }}>
            Order Found: {searchResult.id}
          </h3>
          <div className="space-y-2 text-sm">
            <p style={{ color: "#9ca3af" }}>
              <span style={{ color: "#e5e7eb" }}>Status:</span> {searchResult.status}
            </p>
            <p style={{ color: "#9ca3af" }}>
              <span style={{ color: "#e5e7eb" }}>Total:</span> ${searchResult.total}
            </p>
            <p style={{ color: "#9ca3af" }}>
              <span style={{ color: "#e5e7eb" }}>Items:</span> {searchResult.items.map((i: any) => `${i.sku} x${i.quantity}`).join(', ')}
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => updateOrderStatus(searchResult.id, 'preparing')}
                className="px-3 py-1 rounded text-xs"
                style={{ backgroundColor: "rgba(255, 90, 0, 0.2)", color: "#ff5a00" }}
              >
                Mark Preparing
              </button>
              <button
                onClick={() => updateOrderStatus(searchResult.id, 'ready')}
                className="px-3 py-1 rounded text-xs"
                style={{ backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#10b981" }}
              >
                Mark Ready
              </button>
              <button
                onClick={() => updateOrderStatus(searchResult.id, 'completed')}
                className="px-3 py-1 rounded text-xs"
                style={{ backgroundColor: "rgba(59, 130, 246, 0.2)", color: "#3b82f6" }}
              >
                Mark Completed
              </button>
              <button
                onClick={() => exportReceipt(searchResult)}
                className="px-3 py-1 rounded text-xs"
                style={{ backgroundColor: "rgba(255, 90, 0, 0.2)", color: "#ff5a00" }}
              >
                Export Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {searchOrderId && !searchResult && (
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            borderColor: "rgba(239, 68, 68, 0.3)",
          }}
        >
          <p style={{ color: "#ef4444" }}>Order not found</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: "rgba(15, 15, 15, 0.5)",
            borderColor: "rgba(255, 90, 0, 0.2)",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5" style={{ color: "#ff5a00" }} />
            <span style={{ color: "#9ca3af" }}>Total Revenue</span>
          </div>
          <p className="text-3xl font-bold" style={{ color: "#ff5a00" }}>
            ${displayRevenue.toFixed(2)}
          </p>
        </div>

        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: "rgba(15, 15, 15, 0.5)",
            borderColor: "rgba(255, 90, 0, 0.2)",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5" style={{ color: "#ff5a00" }} />
            <span style={{ color: "#9ca3af" }}>Total Orders</span>
          </div>
          <p className="text-3xl font-bold" style={{ color: "#e5e7eb" }}>
            {displayOrders.length}
          </p>
        </div>

        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: "rgba(15, 15, 15, 0.5)",
            borderColor: "rgba(255, 90, 0, 0.2)",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5" style={{ color: "#ff5a00" }} />
            <span style={{ color: "#9ca3af" }}>Average Order</span>
          </div>
          <p className="text-3xl font-bold" style={{ color: "#e5e7eb" }}>
            ${displayOrders.length > 0 ? (displayRevenue / displayOrders.length).toFixed(2) : "0.00"}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{
          backgroundColor: "rgba(15, 15, 15, 0.5)",
          borderColor: "rgba(255, 90, 0, 0.2)",
        }}
      >
        <div className="p-4 border-b" style={{ borderColor: "rgba(255, 90, 0, 0.2)" }}>
          <h2 className="text-lg font-bold" style={{ color: "#e5e7eb" }}>
            Recent Transactions
          </h2>
        </div>

        {displayOrders.length === 0 ? (
          <div className="p-8 text-center" style={{ color: "#9ca3af" }}>
            No orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255, 90, 0, 0.2)" }}>
                  <th className="text-left p-4 font-mono text-sm" style={{ color: "#9ca3af" }}>
                    Order ID
                  </th>
                  <th className="text-left p-4 font-mono text-sm" style={{ color: "#9ca3af" }}>
                    Date
                  </th>
                  <th className="text-left p-4 font-mono text-sm" style={{ color: "#9ca3af" }}>
                    Payment
                  </th>
                  <th className="text-left p-4 font-mono text-sm" style={{ color: "#9ca3af" }}>
                    Items
                  </th>
                  <th className="text-right p-4 font-mono text-sm" style={{ color: "#9ca3af" }}>
                    Total
                  </th>
                  <th className="text-center p-4 font-mono text-sm" style={{ color: "#9ca3af" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayOrders.map((order) => (
                  <tr
                    key={order.id}
                    style={{ borderBottom: "1px solid rgba(255, 90, 0, 0.1)" }}
                  >
                    <td className="p-4 font-mono text-sm" style={{ color: "#e5e7eb" }}>
                      {order.id}
                    </td>
                    <td className="p-4 text-sm" style={{ color: "#9ca3af" }}>
                      {new Date(order.placed_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className="px-2 py-1 rounded text-xs font-mono"
                        style={{
                          backgroundColor:
                            order.payment_type === "CARD"
                              ? "rgba(59, 130, 246, 0.2)"
                              : "rgba(16, 185, 129, 0.2)",
                          color:
                            order.payment_type === "CARD"
                              ? "#3b82f6"
                              : "#10b981",
                        }}
                      >
                        {order.payment_type}
                      </span>
                    </td>
                    <td className="p-4 text-sm" style={{ color: "#9ca3af" }}>
                      {order.items.length} items
                    </td>
                    <td className="p-4 text-right font-bold" style={{ color: "#ff5a00" }}>
                      ${parseFloat(order.total).toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => exportReceipt(order)}
                        className="px-3 py-1 rounded text-sm transition-colors flex items-center gap-1 mx-auto"
                        style={{
                          backgroundColor: "rgba(255, 90, 0, 0.2)",
                          color: "#ff5a00",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "rgba(255, 90, 0, 0.3)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "rgba(255, 90, 0, 0.2)")
                        }
                      >
                        <Download className="w-4 h-4" />
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
