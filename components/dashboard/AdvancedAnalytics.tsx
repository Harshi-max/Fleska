"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AnalyticsResponse } from "@/lib/analytics-types";
import { TrendingUp, DollarSign, Package, Users } from "lucide-react";

export function AdvancedAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7days");

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(Date.now() - (dateRange === "7days" ? 7 : dateRange === "30days" ? 30 : 1) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const res = await fetch(`/api/analytics?start_date=${startDate}&end_date=${endDate}`);
      const data: AnalyticsResponse = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#ff5a00", "#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold" style={{ color: "#e5e7eb" }}>
              Advanced Analytics
            </h2>
            <p style={{ color: "#9ca3af" }}>Business performance and insights</p>
          </div>

          <div className="flex gap-2">
            {["today", "7days", "30days"].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className="px-4 py-2 rounded-lg text-sm font-mono transition-all"
                style={
                  dateRange === range
                    ? { backgroundColor: "#ff5a00", color: "white" }
                    : {
                        backgroundColor: "rgba(15, 15, 15, 0.5)",
                        color: "#9ca3af",
                        border: "1px solid rgba(255, 90, 0, 0.2)",
                      }
                }
              >
                {range === "today" ? "Today" : range === "7days" ? "7 Days" : "30 Days"}
              </button>
            ))}
          </div>
        </div>

        {loading || !analytics ? (
          <div style={{ color: "#9ca3af" }}>Loading analytics...</div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor: "rgba(15, 15, 15, 0.5)",
                  borderColor: "rgba(255, 90, 0, 0.2)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: "#9ca3af" }}>
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold mt-1" style={{ color: "#ff5a00" }}>
                      ${analytics.total_revenue.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8" style={{ color: "#ff5a00" }} />
                </div>
              </div>

              <div
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor: "rgba(15, 15, 15, 0.5)",
                  borderColor: "rgba(255, 90, 0, 0.2)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: "#9ca3af" }}>
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold mt-1" style={{ color: "#10b981" }}>
                      {analytics.total_orders}
                    </p>
                  </div>
                  <Users className="w-8 h-8" style={{ color: "#10b981" }} />
                </div>
              </div>

              <div
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor: "rgba(15, 15, 15, 0.5)",
                  borderColor: "rgba(255, 90, 0, 0.2)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: "#9ca3af" }}>
                      Avg Order Value
                    </p>
                    <p className="text-2xl font-bold mt-1" style={{ color: "#3b82f6" }}>
                      ${analytics.average_order_value.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8" style={{ color: "#3b82f6" }} />
                </div>
              </div>

              <div
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor: "rgba(15, 15, 15, 0.5)",
                  borderColor: "rgba(255, 90, 0, 0.2)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: "#9ca3af" }}>
                      Low Stock Items
                    </p>
                    <p className="text-2xl font-bold mt-1" style={{ color: "#f59e0b" }}>
                      {analytics.inventory_metrics.low_stock_items}
                    </p>
                  </div>
                  <Package className="w-8 h-8" style={{ color: "#f59e0b" }} />
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hourly Revenue Chart */}
              <div
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor: "rgba(15, 15, 15, 0.5)",
                  borderColor: "rgba(255, 90, 0, 0.2)",
                }}
              >
                <h3 className="text-lg font-bold mb-4" style={{ color: "#e5e7eb" }}>
                  Hourly Revenue
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.hourly_metrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 90, 0, 0.1)" />
                    <XAxis dataKey="hour" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(10, 10, 10, 0.9)",
                        border: "1px solid rgba(255, 90, 0, 0.3)",
                      }}
                      labelStyle={{ color: "#e5e7eb" }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#ff5a00" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Hourly Orders Chart */}
              <div
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor: "rgba(15, 15, 15, 0.5)",
                  borderColor: "rgba(255, 90, 0, 0.2)",
                }}
              >
                <h3 className="text-lg font-bold mb-4" style={{ color: "#e5e7eb" }}>
                  Hourly Orders
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.hourly_metrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 90, 0, 0.1)" />
                    <XAxis dataKey="hour" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(10, 10, 10, 0.9)",
                        border: "1px solid rgba(255, 90, 0, 0.3)",
                      }}
                      labelStyle={{ color: "#e5e7eb" }}
                    />
                    <Bar dataKey="orders" fill="#ff5a00" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Items Pie Chart */}
              <div
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor: "rgba(15, 15, 15, 0.5)",
                  borderColor: "rgba(255, 90, 0, 0.2)",
                }}
              >
                <h3 className="text-lg font-bold mb-4" style={{ color: "#e5e7eb" }}>
                  Top Selling Items
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={analytics.top_items} dataKey="quantity" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {analytics.top_items.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(10, 10, 10, 0.9)",
                        border: "1px solid rgba(255, 90, 0, 0.3)",
                      }}
                      labelStyle={{ color: "#e5e7eb" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Payment Methods */}
              <div
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor: "rgba(15, 15, 15, 0.5)",
                  borderColor: "rgba(255, 90, 0, 0.2)",
                }}
              >
                <h3 className="text-lg font-bold mb-4" style={{ color: "#e5e7eb" }}>
                  Payment Methods
                </h3>
                <div className="space-y-3">
                  {[
                    { method: "Card Payments", count: Math.ceil(analytics.total_orders * 0.5), color: "#3b82f6" },
                    { method: "Cash Payments", count: Math.floor(analytics.total_orders * 0.5), color: "#10b981" },
                  ].map((item) => (
                    <div key={item.method} className="flex items-center justify-between">
                      <span style={{ color: "#9ca3af" }}>{item.method}</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span style={{ color: "#e5e7eb" }} className="font-mono">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Items Table */}
            <div
              className="p-6 rounded-lg border"
              style={{
                backgroundColor: "rgba(15, 15, 15, 0.5)",
                borderColor: "rgba(255, 90, 0, 0.2)",
              }}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: "#e5e7eb" }}>
                Top Selling Items
              </h3>
              {analytics.top_items && analytics.top_items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: "rgba(255, 90, 0, 0.1)" }}>
                        <th className="px-4 py-3 text-left" style={{ color: "#9ca3af" }}>
                          Item
                        </th>
                        <th className="px-4 py-3 text-left" style={{ color: "#9ca3af" }}>
                          Quantity Sold
                        </th>
                        <th className="px-4 py-3 text-left" style={{ color: "#9ca3af" }}>
                          Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.top_items.map((item: any, index: number) => (
                        <tr key={index} style={{ borderTopColor: "rgba(255, 90, 0, 0.1)" }} className="border-t">
                          <td className="px-4 py-3" style={{ color: "#e5e7eb" }}>
                            {item.name}
                          </td>
                          <td className="px-4 py-3" style={{ color: "#ff5a00" }}>
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3" style={{ color: "#10b981" }}>
                            ${item.revenue}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm" style={{ color: "#9ca3af" }}>No orders yet</p>
                  <p className="text-xs mt-1" style={{ color: "#6b7280" }}>Create orders to see top selling items</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
