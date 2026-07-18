"use client";

import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertCircle } from "lucide-react";

const kitchenMetrics = [
  { time: "00:00", activeOrders: 2, avgPrepTime: 14, perMin: 3.2, serverLoad: 42 },
  { time: "02:00", activeOrders: 1, avgPrepTime: 12, perMin: 2.1, serverLoad: 35 },
  { time: "04:00", activeOrders: 0, avgPrepTime: 0, perMin: 0, serverLoad: 28 },
  { time: "06:00", activeOrders: 3, avgPrepTime: 15, perMin: 2.8, serverLoad: 45 },
  { time: "08:00", activeOrders: 8, avgPrepTime: 16, perMin: 4.2, serverLoad: 62 },
  { time: "10:00", activeOrders: 12, avgPrepTime: 18, perMin: 5.1, serverLoad: 75 },
  { time: "12:00", activeOrders: 15, avgPrepTime: 19, perMin: 6.3, serverLoad: 85 },
  { time: "14:00", activeOrders: 11, avgPrepTime: 17, perMin: 5.8, serverLoad: 72 },
  { time: "16:00", activeOrders: 7, avgPrepTime: 15, perMin: 4.1, serverLoad: 55 },
  { time: "18:00", activeOrders: 14, avgPrepTime: 18, perMin: 6.2, serverLoad: 82 },
  { time: "20:00", activeOrders: 16, avgPrepTime: 20, perMin: 7.1, serverLoad: 92 },
  { time: "22:00", activeOrders: 9, avgPrepTime: 15, perMin: 4.5, serverLoad: 58 },
];

const currentOrders = [
  { id: "ORD-1048", items: ["Paneer Butter Masala", "Naan"], prepTime: "14m 32s", status: "Cooking" },
  { id: "ORD-1049", items: ["Biryani"], prepTime: "8m 15s", status: "Plating" },
  { id: "ORD-1050", items: ["Pizza", "Salad"], prepTime: "3m 48s", status: "Waiting" },
  { id: "ORD-1051", items: ["Dosa", "Sambar"], prepTime: "21m 10s", status: "Cooking" },
  { id: "ORD-1052", items: ["Cold Coffee"], prepTime: "1m 05s", status: "Ready" },
];

export function KitchenMonitoring() {
  const [liveData, setLiveData] = useState({
    activeOrders: 7,
    avgPrepTime: "14m",
    perMinute: 3.2,
    serverLoad: 42,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData({
        activeOrders: Math.floor(Math.random() * 16) + 1,
        avgPrepTime: `${Math.floor(Math.random() * 15) + 10}m`,
        perMinute: parseFloat((Math.random() * 7 + 1).toFixed(1)),
        serverLoad: Math.floor(Math.random() * 60) + 30,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6 overflow-y-auto" style={{ height: "calc(100vh - 64px)" }}>
      {/* Live System Metrics */}
      <div className="rounded-lg p-6" style={{ backgroundColor: "rgba(15, 15, 15, 0.8)", border: "1px solid rgba(255, 90, 0, 0.2)" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold" style={{ color: "#e5e7eb" }}>Real-time Kitchen Monitoring</h2>
            <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>LIVE SYSTEM METRICS</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded" style={{ backgroundColor: "#10b98120" }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#10b981" }}></div>
            <span className="text-xs" style={{ color: "#10b981" }}>LIVE</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded" style={{ backgroundColor: "rgba(26, 26, 26, 0.5)" }}>
            <div className="text-xs font-mono uppercase mb-2" style={{ color: "#9ca3af" }}>Active Orders</div>
            <div className="text-3xl font-bold font-mono" style={{ color: "#ff5a00" }}>{liveData.activeOrders}</div>
          </div>

          <div className="p-4 rounded" style={{ backgroundColor: "rgba(26, 26, 26, 0.5)" }}>
            <div className="text-xs font-mono uppercase mb-2" style={{ color: "#9ca3af" }}>Avg Prep Time</div>
            <div className="text-3xl font-bold font-mono" style={{ color: "#ff5a00" }}>{liveData.avgPrepTime}</div>
          </div>

          <div className="p-4 rounded" style={{ backgroundColor: "rgba(26, 26, 26, 0.5)" }}>
            <div className="text-xs font-mono uppercase mb-2" style={{ color: "#9ca3af" }}>Per Min</div>
            <div className="text-3xl font-bold font-mono" style={{ color: "#ff5a00" }}>{liveData.perMinute}</div>
          </div>

          <div className="p-4 rounded" style={{ backgroundColor: "rgba(26, 26, 26, 0.5)" }}>
            <div className="text-xs font-mono uppercase mb-2" style={{ color: "#9ca3af" }}>Server</div>
            <div className="text-3xl font-bold font-mono" style={{ color: "#ff5a00" }}>{liveData.serverLoad}%</div>
          </div>
        </div>

        {/* Live Chart */}
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={kitchenMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 90, 0, 0.1)" />
            <XAxis dataKey="time" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #ff5a00" }} />
            <Line type="monotone" dataKey="activeOrders" stroke="#ff5a00" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Current Orders */}
      <div className="rounded-lg p-6" style={{ backgroundColor: "rgba(15, 15, 15, 0.8)", border: "1px solid rgba(255, 90, 0, 0.2)" }}>
        <h2 className="text-xl font-bold mb-6" style={{ color: "#e5e7eb" }}>Current Kitchen Orders</h2>

        <div className="space-y-3">
          {currentOrders.map((order) => {
            const statusColor = order.status === "Ready" ? "#10b981" : order.status === "Plating" ? "#ff5a00" : "#9ca3af";

            return (
              <div
                key={order.id}
                className="p-4 rounded flex items-center justify-between"
                style={{
                  backgroundColor: "rgba(26, 26, 26, 0.5)",
                  border: `1px solid ${statusColor}30`,
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono font-bold" style={{ color: statusColor }}>{order.id}</span>
                    <div className="flex gap-2 flex-wrap">
                      {order.items.map((item, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "#ff5a00" + "20", color: "#e5e7eb" }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs" style={{ color: "#9ca3af" }}>Prep Time: {order.prepTime}</div>
                </div>
                <div
                  className="px-3 py-1 rounded text-xs font-mono"
                  style={{ backgroundColor: statusColor + "20", color: statusColor }}
                >
                  {order.status}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alerts */}
      <div className="rounded-lg p-4 flex items-center gap-3" style={{ backgroundColor: "#f59e0b" + "20", border: "1px solid #f59e0b" }}>
        <AlertCircle className="w-5 h-5" style={{ color: "#f59e0b" }} />
        <div>
          <div style={{ color: "#f59e0b" }} className="font-semibold text-sm">Kitchen Load Alert</div>
          <div style={{ color: "#f59e0b" }} className="text-xs">Server load is at 92% capacity. Consider prioritizing orders.</div>
        </div>
      </div>
    </div>
  );
}
