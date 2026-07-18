"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Plus } from "lucide-react";
import type { InventoryItem } from "@/lib/inventory-store";

interface InventoryResponse {
  inventory: InventoryItem[];
}

export function InventoryScreen() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [restockingItem, setRestockingItem] = useState<string | null>(null);
  const [restockQuantity, setRestockQuantity] = useState("20");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data: InventoryResponse = await res.json();
      setInventory(data.inventory || []);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (sku: string) => {
    const quantity = parseInt(restockQuantity);
    if (quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    try {
      const res = await fetch("/api/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku,
          quantity,
          type: "add",
          reason: "manual_restock",
        }),
      });

      if (res.ok) {
        await fetchInventory();
        setRestockingItem(null);
        setRestockQuantity("20");
        alert("Stock updated successfully");
      } else {
        alert("Failed to update stock");
      }
    } catch (error) {
      console.error("Failed to restock:", error);
      alert("Error restocking item");
    }
  };

  const lowStockItems = inventory.filter((item) => item.quantity <= 20);
  const okStockItems = inventory.filter((item) => item.quantity > 20);

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold" style={{ color: "#e5e7eb" }}>
            Inventory Management
          </h2>
          <p style={{ color: "#9ca3af" }}>Track stock levels and manage reorders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: "rgba(15, 15, 15, 0.5)",
              borderColor: "rgba(255, 90, 0, 0.2)",
            }}
          >
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              Total Items
            </p>
            <p className="text-2xl font-bold" style={{ color: "#e5e7eb" }}>
              {inventory.length}
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
              Low Stock
            </p>
            <p className="text-2xl font-bold" style={{ color: "#f59e0b" }}>
              {lowStockItems.length}
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
              Good Stock
            </p>
            <p className="text-2xl font-bold" style={{ color: "#10b981" }}>
              {okStockItems.length}
            </p>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              borderColor: "rgba(239, 68, 68, 0.3)",
            }}
          >
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-mono font-bold text-red-400">Low Stock Alert</p>
                <p style={{ color: "#9ca3af" }}>You have {lowStockItems.length} items with low stock</p>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Table */}
        {loading ? (
          <div style={{ color: "#9ca3af" }}>Loading inventory...</div>
        ) : (
          <div className="space-y-4">
            {lowStockItems.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3" style={{ color: "#e5e7eb" }}>
                  Low Stock Items
                </h3>
                <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "rgba(255, 90, 0, 0.2)" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: "rgba(255, 90, 0, 0.1)" }}>
                        <th className="px-4 py-3 text-left" style={{ color: "#9ca3af" }}>
                          SKU
                        </th>
                        <th className="px-4 py-3 text-left" style={{ color: "#9ca3af" }}>
                          Current Stock
                        </th>
                        <th className="px-4 py-3 text-left" style={{ color: "#9ca3af" }}>
                          Last Updated
                        </th>
                        <th className="px-4 py-3 text-left" style={{ color: "#9ca3af" }}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockItems.map((item) => (
                        <tr
                          key={item.sku}
                          style={{ borderTopColor: "rgba(255, 90, 0, 0.1)" }}
                          className="border-t hover:bg-opacity-50"
                        >
                          <td className="px-4 py-3">
                            <p className="font-mono" style={{ color: "#e5e7eb" }}>
                              {item.sku}
                            </p>
                          </td>
                          <td className="px-4 py-3" style={{ color: "#f59e0b" }}>
                            {item.quantity} units
                          </td>
                          <td className="px-4 py-3" style={{ color: "#9ca3af" }}>
                            {new Date(item.lastUpdated).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setRestockingItem(item.sku)}
                              className="px-2 py-1 rounded text-xs font-mono text-white transition-all"
                              style={{ backgroundColor: "#ff5a00" }}
                            >
                              <Plus className="w-3 h-3 inline mr-1" />
                              Restock
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {okStockItems.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3" style={{ color: "#e5e7eb" }}>
                  Available Stock
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {okStockItems.map((item) => (
                    <div
                      key={item.sku}
                      className="p-4 rounded-lg border"
                      style={{
                        backgroundColor: "rgba(15, 15, 15, 0.5)",
                        borderColor: "rgba(255, 90, 0, 0.2)",
                      }}
                    >
                      <p className="text-sm font-mono" style={{ color: "#9ca3af" }}>
                        {item.sku}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <div>
                          <p className="text-xs" style={{ color: "#9ca3af" }}>
                            Current Stock
                          </p>
                          <p className="text-lg font-bold" style={{ color: "#10b981" }}>
                            {item.quantity} units
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs" style={{ color: "#9ca3af" }}>
                            Updated
                          </p>
                          <p className="text-xs" style={{ color: "#9ca3af" }}>
                            {new Date(item.lastUpdated).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Restock Modal */}
        {restockingItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className="p-6 rounded-lg border w-96"
              style={{
                backgroundColor: "rgba(15, 15, 15, 0.95)",
                borderColor: "rgba(255, 90, 0, 0.3)",
              }}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: "#e5e7eb" }}>
                Restock Item
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-mono mb-2" style={{ color: "#9ca3af" }}>
                    SKU
                  </label>
                  <p style={{ color: "#e5e7eb" }} className="text-sm">
                    {restockingItem}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-mono mb-2" style={{ color: "#9ca3af" }}>
                    Quantity to Add
                  </label>
                  <input
                    type="number"
                    value={restockQuantity}
                    onChange={(e) => setRestockQuantity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-[#e5e7eb]"
                    style={{ backgroundColor: "rgba(15, 15, 15, 0.5)", border: "1px solid rgba(255, 90, 0, 0.2)" }}
                    min="1"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => handleRestock(restockingItem)}
                    className="flex-1 px-4 py-2 rounded-lg text-white font-bold transition"
                    style={{ backgroundColor: "#ff5a00" }}
                  >
                    Restock
                  </button>
                  <button
                    onClick={() => setRestockingItem(null)}
                    className="flex-1 px-4 py-2 rounded-lg text-white font-bold transition"
                    style={{ backgroundColor: "rgba(255, 90, 0, 0.2)", color: "#ff5a00" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
