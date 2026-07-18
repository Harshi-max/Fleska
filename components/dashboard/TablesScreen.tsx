"use client";

import React, { useState, useEffect } from "react";
import { Users, Clock, CheckCircle } from "lucide-react";
import { Table, TablesResponse } from "@/lib/tables-types";
import { TableBookingModal } from "./TableBookingModal";

export function TablesScreen() {
  const [tables, setTables] = useState<Table[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState<{ isOpen: boolean; table?: Table }>({ isOpen: false });

  useEffect(() => {
    fetchTables();
    // Auto-refresh tables every 5 seconds
    const interval = setInterval(fetchTables, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchTables = async () => {
    try {
      console.log('TablesScreen - Fetching tables...');
      const res = await fetch("/api/tables");
      console.log('TablesScreen - Response status:', res.status);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data: TablesResponse = await res.json();
      console.log('TablesScreen - Fetched data:', data);
      setTables(data.tables);

      // Group tables by capacity (creating sections)
      const groupedSections: any[] = [];
      const twoSeaterTables = data.tables.filter((t) => t.capacity === 2);
      const fourSeaterTables = data.tables.filter((t) => t.capacity === 4);
      const sixSeaterTables = data.tables.filter((t) => t.capacity === 6);

      if (twoSeaterTables.length > 0) {
        groupedSections.push({
          id: "two-seater",
          name: "Two Seater Tables",
          capacity_total: twoSeaterTables.reduce((sum, t) => sum + t.capacity, 0),
          tables: twoSeaterTables,
        });
      }

      if (fourSeaterTables.length > 0) {
        groupedSections.push({
          id: "four-seater",
          name: "Four Seater Tables",
          capacity_total: fourSeaterTables.reduce((sum, t) => sum + t.capacity, 0),
          tables: fourSeaterTables,
        });
      }

      if (sixSeaterTables.length > 0) {
        groupedSections.push({
          id: "six-seater",
          name: "Six Seater Tables",
          capacity_total: sixSeaterTables.reduce((sum, t) => sum + t.capacity, 0),
          tables: sixSeaterTables,
        });
      }

      setSections(groupedSections);

      // Calculate statistics
      const totalTables = data.tables.length;
      const occupiedTables = data.tables.filter((t) => t.status === "occupied").length;
      const availableTables = data.tables.filter((t) => t.status === "available").length;
      const reservedTables = data.tables.filter((t) => t.status === "reserved").length;
      const totalCapacity = data.tables.reduce((sum, t) => sum + t.capacity, 0);

      setStatistics({
        total_tables: totalTables,
        occupied_tables: occupiedTables,
        available_tables: availableTables,
        reserved: reservedTables,
        total_capacity: totalCapacity,
      });
    } catch (error) {
      console.error("Failed to fetch tables:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "#ef4444";
      case "reserved":
        return "#f59e0b";
      case "cleaning":
        return "#8b5cf6";
      default:
        return "#10b981";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "occupied":
        return "🔴";
      case "reserved":
        return "🟡";
      case "cleaning":
        return "🟣";
      default:
        return "🟢";
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold" style={{ color: "#e5e7eb" }}>
            Table Management
          </h2>
          <p style={{ color: "#9ca3af" }}>Monitor table availability and occupancy</p>
        </div>

        {/* Statistics */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: "rgba(15, 15, 15, 0.5)",
                borderColor: "rgba(255, 90, 0, 0.2)",
              }}
            >
              <p className="text-sm" style={{ color: "#9ca3af" }}>
                Total Tables
              </p>
              <p className="text-2xl font-bold" style={{ color: "#e5e7eb" }}>
                {statistics.total_tables}
              </p>
            </div>
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: "rgba(15, 15, 15, 0.5)",
                borderColor: "rgba(255, 90, 0, 0.2)",
              }}
            >
              <p className="text-sm" style={{ color: "#9ca3af" }}>
                Available
              </p>
              <p className="text-2xl font-bold" style={{ color: "#10b981" }}>
                {statistics.available}
              </p>
            </div>
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: "rgba(15, 15, 15, 0.5)",
                borderColor: "rgba(255, 90, 0, 0.2)",
              }}
            >
              <p className="text-sm" style={{ color: "#9ca3af" }}>
                Occupied
              </p>
              <p className="text-2xl font-bold" style={{ color: "#ef4444" }}>
                {statistics.occupied}
              </p>
            </div>
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: "rgba(15, 15, 15, 0.5)",
                borderColor: "rgba(255, 90, 0, 0.2)",
              }}
            >
              <p className="text-sm" style={{ color: "#9ca3af" }}>
                Reserved
              </p>
              <p className="text-2xl font-bold" style={{ color: "#f59e0b" }}>
                {statistics.reserved}
              </p>
            </div>
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: "rgba(15, 15, 15, 0.5)",
                borderColor: "rgba(255, 90, 0, 0.2)",
              }}
            >
              <p className="text-sm" style={{ color: "#9ca3af" }}>
                Capacity
              </p>
              <p className="text-2xl font-bold" style={{ color: "#ff5a00" }}>
                {statistics.total_capacity}
              </p>
            </div>
          </div>
        )}

        {/* Tables by Section */}
        {loading ? (
          <div style={{ color: "#9ca3af" }}>Loading tables...</div>
        ) : (
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.id}>
                <div className="mb-4">
                  <h3 className="text-lg font-bold" style={{ color: "#e5e7eb" }}>
                    {section.name}
                  </h3>
                  <p className="text-sm" style={{ color: "#9ca3af" }}>
                    Capacity: {section.capacity_total} guests
                  </p>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {section.tables.map((table: Table) => (
                    <div
                      key={table.id}
                      onClick={() => setBookingModal({ isOpen: true, table })}
                      className="p-4 rounded-lg border text-center transition-all cursor-pointer hover:scale-105"
                      style={{
                        backgroundColor: "rgba(15, 15, 15, 0.5)",
                        borderColor: getStatusColor(table.status),
                        borderWidth: "2px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(15, 15, 15, 0.8)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(15, 15, 15, 0.5)";
                      }}
                    >
                      <p className="text-2xl mb-1">{getStatusIcon(table.status)}</p>
                      <p className="font-bold text-lg" style={{ color: "#e5e7eb" }}>
                        T{table.table_number}
                      </p>
                      <p className="text-xs" style={{ color: "#9ca3af" }}>
                        {table.capacity} seats
                      </p>
                      <div className="mt-2 flex items-center justify-center gap-1">
                        <Users className="w-3 h-3" style={{ color: "#9ca3af" }} />
                        <span className="text-xs" style={{ color: "#9ca3af" }}>
                          {table.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: "rgba(15, 15, 15, 0.5)",
            borderColor: "rgba(255, 90, 0, 0.2)",
            border: "1px solid",
          }}
        >
          <p className="text-sm font-mono mb-3" style={{ color: "#9ca3af" }}>
            Status Legend
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">🟢</span>
              <span className="text-sm" style={{ color: "#9ca3af" }}>
                Available
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🔴</span>
              <span className="text-sm" style={{ color: "#9ca3af" }}>
                Occupied
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🟡</span>
              <span className="text-sm" style={{ color: "#9ca3af" }}>
                Reserved
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🟣</span>
              <span className="text-sm" style={{ color: "#9ca3af" }}>
                Cleaning
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <TableBookingModal
        isOpen={bookingModal.isOpen}
        onClose={() => setBookingModal({ isOpen: false })}
        table={bookingModal.table}
      />
    </div>
  );
}
