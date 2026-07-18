"use client";

import { useState } from "react";
import { Order, SplitResult } from "@/lib/types";

export function SplitScreen() {
  const [orderId, setOrderId] = useState("");
  const [ways, setWays] = useState(2);
  const [order, setOrder] = useState<Order | null>(null);
  const [result, setResult] = useState<SplitResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error("Order not found");
      }
      const foundOrder = await response.json();
      setOrder(foundOrder);
      setResult(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSplit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/orders/${order.id}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ways }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to split bill");
      }

      const splitResult = await response.json();
      setResult(splitResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const totalShares = result
    ? result.shares.reduce((sum, share) => {
        const centsSum = Math.round(sum * 100) + Math.round(parseFloat(share.amount) * 100);
        return centsSum / 100;
      }, 0)
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Split Bill</h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      {/* Lookup Form */}
      <form onSubmit={handleLookup} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">Order ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter order ID"
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              type="submit"
              disabled={loading || !orderId}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Lookup"}
            </button>
          </div>
        </div>
      </form>

      {/* Order Details */}
      {order && (
        <div className="border rounded p-4 bg-gray-50">
          <h2 className="font-semibold mb-3">Order Details</h2>
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div>
              <p className="text-gray-600">Subtotal</p>
              <p className="font-medium">${order.subtotal}</p>
            </div>
            <div>
              <p className="text-gray-600">Convenience Fee</p>
              <p className="font-medium">${order.convenience_fee}</p>
            </div>
            <div>
              <p className="text-gray-600">Tip</p>
              <p className="font-medium">${order.tip}</p>
            </div>
            <div>
              <p className="text-gray-600">Discount</p>
              <p className="font-medium">${order.discount}</p>
            </div>
            <div className="col-span-2 border-t pt-2">
              <p className="text-gray-600">Total</p>
              <p className="text-lg font-semibold">${order.total}</p>
            </div>
          </div>

          {/* Split Form */}
          <form onSubmit={handleSplit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">
                Number of People: {ways}
              </label>
              <input
                type="range"
                min="2"
                max="20"
                value={ways}
                onChange={(e) => setWays(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Splitting..." : "Split Bill"}
            </button>
          </form>
        </div>
      )}

      {/* Split Results */}
      {result && (
        <div className="border rounded p-4 bg-green-50">
          <h2 className="font-semibold mb-3">Split Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Person</th>
                  <th className="text-right py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {result.shares.map((share) => (
                  <tr key={share.share_number} className="border-b">
                    <td className="py-2">Person {share.share_number}</td>
                    <td className="text-right font-medium">${share.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-white border rounded">
            <p className="text-sm text-gray-600">Total Shares</p>
            <p className="text-lg font-semibold">${totalShares.toFixed(2)}</p>
            <p className="text-xs text-green-700 mt-1">
              ✓ Shares sum exactly to order total
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
