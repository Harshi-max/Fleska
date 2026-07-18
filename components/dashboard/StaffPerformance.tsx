"use client";

import React from "react";
import { Download } from "lucide-react";

const staffMembers = [
  { id: "RK", name: "Raj Kumar", role: "Admin", orders: 42, avgTime: "12m", rating: 4.8 },
  { id: "PS", name: "Priya Sharma", role: "Manager", orders: 38, avgTime: "10m", rating: 4.9 },
  { id: "AV", name: "Amit Verma", role: "Chef", orders: 56, avgTime: "14m", rating: 4.7 },
  { id: "SP", name: "Sneha Patel", role: "Waiter", orders: 31, avgTime: "8m", rating: 4.6 },
];

const reports = [
  { id: 1, name: "Daily Sales Report", format: "PDF", size: "2.3 MB", download: true },
  { id: 2, name: "Tax Summary (GST)", format: "PDF", size: "1.5 MB", download: true },
  { id: 3, name: "Inventory Usage", format: "CSV", size: "856 KB", download: true },
  { id: 4, name: "Staff Performance", format: "CSV", size: "1.2 MB", download: true },
];

const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin": return "#ff5a00";
    case "Manager": return "#3b82f6";
    case "Chef": return "#a855f7";
    case "Waiter": return "#10b981";
    default: return "#9ca3af";
  }
};

export function StaffPerformance() {
  return (
    <div className="p-6 space-y-6 overflow-y-auto" style={{ height: "calc(100vh - 64px)" }}>
      {/* Staff Performance */}
      <div className="rounded-lg p-6" style={{ backgroundColor: "rgba(15, 15, 15, 0.8)", border: "1px solid rgba(255, 90, 0, 0.2)" }}>
        <h2 className="text-xl font-bold mb-2" style={{ color: "#e5e7eb" }}>Staff Performance</h2>
        <p className="text-xs mb-6" style={{ color: "#9ca3af" }}>TEAM OVERVIEW</p>

        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255, 90, 0, 0.1)" }}>
              <th className="text-left py-3 px-3 text-xs font-mono uppercase" style={{ color: "#9ca3af" }}>Member</th>
              <th className="text-left py-3 px-3 text-xs font-mono uppercase" style={{ color: "#9ca3af" }}>Role</th>
              <th className="text-left py-3 px-3 text-xs font-mono uppercase" style={{ color: "#9ca3af" }}>Orders</th>
              <th className="text-left py-3 px-3 text-xs font-mono uppercase" style={{ color: "#9ca3af" }}>Avg Time</th>
              <th className="text-left py-3 px-3 text-xs font-mono uppercase" style={{ color: "#9ca3af" }}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {staffMembers.map((staff) => (
              <tr key={staff.id} style={{ borderBottom: "1px solid rgba(255, 90, 0, 0.1)" }}>
                <td className="py-4 px-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold"
                      style={{ backgroundColor: getRoleColor(staff.role), color: "#050505" }}
                    >
                      {staff.id}
                    </div>
                    <span style={{ color: "#e5e7eb" }}>{staff.name}</span>
                  </div>
                </td>
                <td className="py-4 px-3">
                  <span
                    className="px-3 py-1 rounded text-xs font-mono"
                    style={{ backgroundColor: getRoleColor(staff.role) + "20", color: getRoleColor(staff.role) }}
                  >
                    {staff.role}
                  </span>
                </td>
                <td className="py-4 px-3" style={{ color: "#e5e7eb" }}>{staff.orders}</td>
                <td className="py-4 px-3" style={{ color: "#e5e7eb" }}>{staff.avgTime}</td>
                <td className="py-4 px-3">
                  <div className="flex items-center gap-1" style={{ color: "#ff5a00" }}>
                    ⭐ {staff.rating}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reports & Export */}
      <div className="rounded-lg p-6" style={{ backgroundColor: "rgba(15, 15, 15, 0.8)", border: "1px solid rgba(255, 90, 0, 0.2)" }}>
        <h2 className="text-xl font-bold mb-2" style={{ color: "#e5e7eb" }}>Reports & Export</h2>
        <p className="text-xs mb-6" style={{ color: "#9ca3af" }}>DOWNLOADABLE REPORTS</p>

        <div className="grid grid-cols-2 gap-4">
          {reports.map((report) => (
            <div key={report.id} className="p-4 rounded flex justify-between items-center" style={{ backgroundColor: "rgba(26, 26, 26, 0.5)", border: "1px solid rgba(255, 90, 0, 0.1)" }}>
              <div>
                <div style={{ color: "#e5e7eb" }}>{report.name}</div>
                <div className="text-xs mt-1" style={{ color: "#9ca3af" }}>
                  {report.format} • {report.size}
                </div>
              </div>
              <button
                className="flex items-center gap-1 px-3 py-2 rounded text-xs font-mono transition-colors"
                style={{ backgroundColor: "#ff5a00", color: "#050505" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#ff7a1a"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ff5a00"}
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
