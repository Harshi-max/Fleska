"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { orderStore } from "@/lib/store";
import { menuStore } from "@/lib/menu-store";

const revenueData = [
  { day: "Mon", "This Week": 95, "Last Week": 78 },
  { day: "Tue", "This Week": 105, "Last Week": 82 },
  { day: "Wed", "This Week": 98, "Last Week": 88 },
  { day: "Thu", "This Week": 112, "Last Week": 95 },
  { day: "Fri", "This Week": 125, "Last Week": 108 },
  { day: "Sat", "This Week": 118, "Last Week": 105 },
  { day: "Sun", "This Week": 102, "Last Week": 92 },
];

const inventoryData = [
  { name: "Vegetables", value: 76, color: "#ff5a00" },
  { name: "Dairy", value: 15, color: "#374151" },
  { name: "Grains", value: 6, color: "#4b5563" },
  { name: "Spices", value: 2, color: "#6b7280" },
  { name: "Beverages", value: 1, color: "#9ca3af" },
];

const activityFeed = [
  { id: 1, type: "order", text: "New order #ORD-1048 placed at Table 12", time: "2m ago" },
  { id: 2, type: "inventory", text: "Inventory alert: Fresh Tomatoes critically low", time: "4m ago" },
  { id: 3, type: "payment", text: "Payment received: ₹1,560 (Order #ORD-1044)", time: "8m ago" },
  { id: 4, type: "staff", text: "Staff Raj Kumar completed 42nd order today", time: "15m ago" },
  { id: 5, type: "report", text: "Daily tax summary auto-generated", time: "1h ago" },
];

const lowStockAlerts = [
  { item: "Fresh Tomatoes", current: 5, reorder: 50 },
  { item: "Paneer", current: 12, reorder: 40 },
  { item: "Basmati Rice", current: 8, reorder: 60 },
];

export function DashboardOverview() {
  const [topSellingItems, setTopSellingItems] = useState<{ name: string; count: number }[]>([
    { name: "Paneer Butter Masala", count: 342 },
    { name: "Chicken Biryani", count: 318 },
    { name: "Masala Dosa", count: 296 },
    { name: "Garden Pizza", count: 284 },
    { name: "Cold Coffee", count: 272 },
  ]);
  const [recentOrders, setRecentOrders] = useState<{ id: string; table: string; amount: string; status: string }[]>([
    { id: "ORD-1048", table: "T-12", amount: "₹1,240", status: "Preparing" },
    { id: "ORD-1047", table: "T-05", amount: "₹680", status: "Ready" },
    { id: "ORD-1046", table: "T-18", amount: "₹2,140", status: "Delivered" },
    { id: "ORD-1045", table: "T-03", amount: "₹920", status: "Pending" },
    { id: "ORD-1044", table: "TO", amount: "₹1,560", status: "Delivered" },
  ]);

  useEffect(() => {
    const fetchDashboardData = () => {
      const orders = orderStore.listAllOrders();
      console.log('DashboardOverview - Fetched orders:', orders);
      console.log('DashboardOverview - Orders count:', orders.length);

      // Calculate top selling items
      const itemSales = new Map<string, number>();
      orders.forEach(order => {
        console.log('DashboardOverview - Processing order items:', order.items);
        order.items.forEach((item: any) => {
          const current = itemSales.get(item.sku) || 0;
          itemSales.set(item.sku, current + item.quantity);
          console.log(`DashboardOverview - Item ${item.sku}: quantity ${item.quantity}, total ${current + item.quantity}`);
        });
      });

      console.log('DashboardOverview - Item sales map:', Array.from(itemSales.entries()));

      // Map SKUs to item names
      const itemNames = new Map<string, string>();
      itemSales.forEach((_, sku) => {
        const menuItem = menuStore.getItem(sku);
        if (menuItem) {
          itemNames.set(sku, menuItem.name);
        }
      });

      const sortedItems = Array.from(itemSales.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([sku, count]) => ({ 
          name: itemNames.get(sku) || sku, 
          count 
        }));

      console.log('DashboardOverview - Sorted items:', sortedItems);

      // Always update with calculated data (even if empty)
      setTopSellingItems(sortedItems);

      // Get recent orders
      const recent = orders.slice(-5).reverse().map(order => ({
        id: order.id,
        table: `T-${Math.floor(Math.random() * 20) + 1}`,
        amount: `$${parseFloat(order.total).toFixed(2)}`,
        status: order.status === 'completed' ? 'Delivered' : order.status === 'ready' ? 'Ready' : 'Preparing'
      }));

      setRecentOrders(recent);
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6 overflow-y-auto" style={{ height: "calc(100vh - 64px)" }}>
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg p-6" style={{ backgroundColor: "rgba(15, 15, 15, 0.8)", border: "1px solid rgba(255, 90, 0, 0.2)" }}>
          <div className="text-xs font-mono uppercase tracking-wider" style={{ color: "#9ca3af" }}>Today's Revenue</div>
          <div className="text-4xl font-bold font-mono mt-2" style={{ color: "#ff5a00" }}>₹1,24,580</div>
          <div className="text-sm mt-2 flex items-center gap-1" style={{ color: "#10b981" }}>
            <TrendingUp className="w-4 h-4" /> +12%
          </div>
        </div>

        <div className="rounded-lg p-6" style={{ backgroundColor: "rgba(15, 15, 15, 0.8)", border: "1px solid rgba(255, 90, 0, 0.2)" }}>
          <div className="text-xs font-mono uppercase tracking-wider" style={{ color: "#9ca3af" }}>Total Orders</div>
          <div className="text-4xl font-bold font-mono mt-2" style={{ color: "#e5e7eb" }}>342</div>
          <div className="text-sm mt-2 flex items-center gap-1" style={{ color: "#10b981" }}>
            <TrendingUp className="w-4 h-4" /> +8%
          </div>
        </div>

        <div className="rounded-lg p-6" style={{ backgroundColor: "rgba(15, 15, 15, 0.8)", border: "1px solid rgba(255, 90, 0, 0.2)" }}>
          <div className="text-xs font-mono uppercase tracking-wider" style={{ color: "#9ca3af" }}>Active Tables</div>
          <div className="text-4xl font-bold font-mono mt-2" style={{ color: "#e5e7eb" }}>18</div>
          <div className="text-sm mt-2 flex items-center gap-1" style={{ color: "#10b981" }}>
            <TrendingUp className="w-4 h-4" /> +15%
          </div>
        </div>

        <div className="rounded-lg p-6" style={{ backgroundColor: "rgba(15, 15, 15, 0.8)", border: "1px solid rgba(255, 90, 0, 0.2)" }}>
          <div className="text-xs font-mono uppercase tracking-wider" style={{ color: "#9ca3af" }}>Kitchen Queue</div>
          <div className="text-4xl font-bold font-mono mt-2" style={{ color: "#e5e7eb" }}>7</div>
          <div className="text-sm mt-2" style={{ color: "#f59e0b" }}>⚠ -3</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-3 gap-4">
        {/* Revenue Analytics */}
        <div className="col-span-2 rounded-lg p-6" style={{ backgroundColor: "rgba(15, 15, 15, 0.8)", border: "1px solid rgba(255, 90, 0, 0.2)" }}>
          <h3 className="text-sm font-mono uppercase tracking-wider mb-4" style={{ color: "#9ca3af" }}>Revenue Analytics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 90, 0, 0.1)" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #ff5a00" }} />
              <Legend />
              <Line type="monotone" dataKey="This Week" stroke="#ff5a00" strokeWidth={2} />
              <Line type="monotone" dataKey="Last Week" stroke="#374151" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Selling Items */}
        <div className="rounded-lg p-6" style={{ backgroundColor: "rgba(15, 15, 15, 0.8)", border: "1px solid rgba(255, 90, 0, 0.2)" }}>
          <h3 className="text-sm font-mono uppercase tracking-wider mb-4" style={{ color: "#9ca3af" }}>Top Selling Items</h3>
          {topSellingItems.length > 0 ? (
            <div className="space-y-3">
              {topSellingItems.map((item) => (
                <div key={item.name} className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: "#e5e7eb" }}>{item.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 rounded w-32" style={{ backgroundColor: "#ff5a00" }}></div>
                    <span className="text-xs" style={{ color: "#9ca3af" }}>{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm" style={{ color: "#9ca3af" }}>No orders yet</p>
              <p className="text-xs mt-1" style={{ color: "#6b7280" }}>Create orders to see top selling items</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-4">
        {/* Inventory Distribution */}
        <div className="rounded-lg p-6" style={{ backgroundColor: "rgba(15, 15, 15, 0.8)", border: "1px solid rgba(255, 90, 0, 0.2)" }}>
          <h3 className="text-sm font-mono uppercase tracking-wider mb-4" style={{ color: "#9ca3af" }}>Inventory Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={inventoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                {inventoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center text-2xl font-bold font-mono mt-2" style={{ color: "#ff5a00" }}>276</div>
          <div className="text-xs text-center mt-1" style={{ color: "#9ca3af" }}>Total Items</div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-lg p-6" style={{ backgroundColor: "rgba(15, 15, 15, 0.8)", border: "1px solid rgba(255, 90, 0, 0.2)" }}>
          <h3 className="text-sm font-mono uppercase tracking-wider mb-4" style={{ color: "#9ca3af" }}>Recent Orders</h3>
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center text-xs py-2 border-b" style={{ borderColor: "rgba(255, 90, 0, 0.1)" }}>
                <div>
                  <div style={{ color: "#e5e7eb" }}>{order.id}</div>
                  <div style={{ color: "#9ca3af" }}>{order.table}</div>
                </div>
                <div className="text-right">
                  <div style={{ color: "#e5e7eb" }}>{order.amount}</div>
                  <div style={{ color: order.status === "Delivered" ? "#10b981" : order.status === "Ready" ? "#ff5a00" : "#f59e0b" }}>{order.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="rounded-lg p-6" style={{ backgroundColor: "rgba(15, 15, 15, 0.8)", border: "1px solid rgba(255, 90, 0, 0.2)" }}>
          <h3 className="text-sm font-mono uppercase tracking-wider mb-4" style={{ color: "#9ca3af" }}>Activity Feed</h3>
          <div className="space-y-3">
            {activityFeed.map((activity) => (
              <div key={activity.id} className="text-xs">
                <div style={{ color: "#e5e7eb" }}>{activity.text}</div>
                <div style={{ color: "#9ca3af" }}>{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="rounded-lg p-6" style={{ backgroundColor: "rgba(15, 15, 15, 0.8)", border: "1px solid rgba(255, 90, 0, 0.2)" }}>
        <h3 className="text-sm font-mono uppercase tracking-wider mb-4" style={{ color: "#f59e0b" }}>Low Stock Alerts</h3>
        <div className="grid grid-cols-3 gap-4">
          {lowStockAlerts.map((alert) => (
            <div key={alert.item} className="p-3 rounded" style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
              <div style={{ color: "#e5e7eb" }}>{alert.item}</div>
              <div className="text-xs mt-1" style={{ color: "#f59e0b" }}>
                {alert.current} / {alert.reorder} units
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
