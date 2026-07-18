"use client";

import { useState } from "react";
import { DailyReport } from "@/lib/types";
import { COMMON_TIMEZONES } from "@/lib/timezone";

export function ReportsScreen() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [tz, setTz] = useState("America/New_York");
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const params = new URLSearchParams({
        date,
        tz,
      });

      const response = await fetch(`/api/reports/daily?${params}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch report");
      }

      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Daily Reports</h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      {/* Filter Form */}
      <form onSubmit={handleSubmit} className="border rounded p-4 bg-gray-50 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Timezone</label>
            <select
              value={tz}
              onChange={(e) => setTz(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              {COMMON_TIMEZONES.map((zone) => (
                <option key={zone.value} value={zone.value}>
                  {zone.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Generate Report"}
        </button>
      </form>

      {/* Report Results */}
      {report && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="border rounded p-4 bg-blue-50">
              <p className="text-sm text-gray-600">Date</p>
              <p className="text-lg font-semibold">{report.date}</p>
            </div>
            <div className="border rounded p-4 bg-blue-50">
              <p className="text-sm text-gray-600">Timezone</p>
              <p className="text-lg font-semibold">{report.timezone}</p>
            </div>
            <div className="border rounded p-4 bg-blue-50">
              <p className="text-sm text-gray-600">Orders</p>
              <p className="text-lg font-semibold">{report.orders.length}</p>
            </div>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded p-4 bg-green-50">
              <p className="text-sm text-gray-600">Gross Total</p>
              <p className="text-2xl font-bold text-green-700">${report.gross_total}</p>
            </div>
            <div className="border rounded p-4 bg-orange-50">
              <p className="text-sm text-gray-600">Card Fees Total</p>
              <p className="text-2xl font-bold text-orange-700">${report.card_fees_total}</p>
            </div>
          </div>

          {/* Orders Table */}
          {report.orders.length > 0 ? (
            <div className="border rounded overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left py-3 px-4">Order ID</th>
                    <th className="text-right py-3 px-4">Subtotal</th>
                    <th className="text-right py-3 px-4">Fee</th>
                    <th className="text-right py-3 px-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {report.orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-xs">{order.id}</td>
                      <td className="py-3 px-4 text-right">${order.subtotal}</td>
                      <td className="py-3 px-4 text-right">${order.convenience_fee}</td>
                      <td className="py-3 px-4 text-right font-semibold">${order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border rounded p-4 text-center text-gray-600">
              No orders found for this date
            </div>
          )}
        </div>
      )}
    </div>
  );
}
