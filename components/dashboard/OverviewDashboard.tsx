"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MetricCard } from "./MetricCard";
import { Activity, Clock, Zap, Users } from "lucide-react";

// Mock data
const revenueData = [
  { day: "Mon", revenue: 45000, lastWeek: 42000 },
  { day: "Tue", revenue: 52000, lastWeek: 48000 },
  { day: "Wed", revenue: 48000, lastWeek: 46000 },
  { day: "Thu", revenue: 61000, lastWeek: 58000 },
  { day: "Fri", revenue: 75000, lastWeek: 72000 },
  { day: "Sat", revenue: 82000, lastWeek: 79000 },
  { day: "Sun", revenue: 68000, lastWeek: 65000 },
];

const topSellingItems = [
  { name: "Biryani", value: 245, fill: "#ff5a00" },
  { name: "Burger", value: 189, fill: "#374151" },
  { name: "Pizza", value: 156, fill: "#4b5563" },
  { name: "Pasta", value: 124, fill: "#6b7280" },
];

const recentOrders = [
  {
    id: "ORD-001",
    item: "Biryani Combo",
    time: "2 min ago",
    status: "Delivered",
    amount: "₹450",
  },
  {
    id: "ORD-002",
    item: "Paneer Pizza",
    time: "5 min ago",
    status: "Ready",
    amount: "₹580",
  },
  {
    id: "ORD-003",
    item: "Burger Meal",
    time: "8 min ago",
    status: "Preparing",
    amount: "₹320",
  },
  {
    id: "ORD-004",
    item: "Pasta Primavera",
    time: "12 min ago",
    status: "Pending",
    amount: "₹480",
  },
];

const statusColors = {
  Delivered: "text-success bg-success/10",
  Ready: "text-warning bg-warning/10",
  Preparing: "text-primary bg-primary/10",
  Pending: "text-muted-foreground bg-muted/10",
};

export function OverviewDashboard() {
  const [totalRevenue, setTotalRevenue] = useState("₹1,24,580");
  const [totalOrders, setTotalOrders] = useState("342");

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Today's Revenue"
          value={totalRevenue}
          change={12}
          icon={<Activity className="w-6 h-6" />}
        />
        <MetricCard
          label="Total Orders"
          value={totalOrders}
          change={8}
          icon={<Zap className="w-6 h-6" />}
        />
        <MetricCard
          label="Active Tables"
          value="18"
          change={15}
          icon={<Users className="w-6 h-6" />}
        />
        <MetricCard
          label="Kitchen Queue"
          value="7"
          change={5}
          icon={<Clock className="w-6 h-6" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Analytics */}
        <div className="lg:col-span-2 enterprise-panel">
          <h3 className="text-lg font-bold text-foreground font-mono mb-4">
            Revenue Analytics
          </h3>
          <div className="text-sm text-muted-foreground font-mono mb-4 flex gap-4">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-primary rounded-full"></span> This Week
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-muted rounded-full"></span> Last Week
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 90, 0, 0.1)"
              />
              <XAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f0f0f",
                  border: "1px solid rgba(255, 90, 0, 0.2)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#e5e7eb" }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#ff5a00"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="lastWeek"
                stroke="#6b7280"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Selling Items */}
        <div className="enterprise-panel flex flex-col">
          <h3 className="text-lg font-bold text-foreground font-mono mb-4">
            Top Selling Items
          </h3>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topSellingItems}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {topSellingItems.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f0f0f",
                    border: "1px solid rgba(255, 90, 0, 0.2)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {topSellingItems.map((item) => (
              <div key={item.name} className="flex justify-between text-sm">
                <span className="text-muted-foreground font-mono">
                  {item.name}
                </span>
                <span className="text-foreground font-mono font-bold">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="enterprise-panel">
          <h3 className="text-lg font-bold text-foreground font-mono mb-4">
            Recent Orders
          </h3>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-mono font-bold text-sm text-foreground">
                    {order.id}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {order.item}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground font-mono">
                    {order.time}
                  </p>
                  <span
                    className={`inline-block mt-1 px-2 py-1 rounded text-xs font-mono font-bold ${
                      statusColors[order.status as keyof typeof statusColors]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="enterprise-panel">
          <h3 className="text-lg font-bold text-foreground font-mono mb-4">
            Activity Feed
          </h3>
          <div className="space-y-3 text-sm">
            {[
              "New order received from Table 5",
              "Kitchen completed order ORD-428",
              "Payment processed: ₹2,450",
              "Staff member John logged in",
              "Low stock alert: Biryani Rice",
              "Customer feedback: 5-star rating",
            ].map((activity, i) => (
              <div
                key={i}
                className="flex gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors"
              >
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground font-mono">{activity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
