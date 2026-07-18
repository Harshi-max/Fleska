"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, X } from "lucide-react";
import { MenuItem } from "@/lib/menu-types";
import { EditMenuModal } from "./EditMenuModal";
import { useRealtimeStore } from "@/lib/realtime-store";

interface MenuResponse {
  items: MenuItem[];
}

export function MenuScreen() {
  const { user } = useRealtimeStore();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newItemData, setNewItemData] = useState({
    sku: "",
    name: "",
    price: "",
    category: "Appetizers",
    available: true,
    image: "",
  });

  const isAdmin = user?.role === 'admin' || user?.role === 'manager';

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      console.log('MenuScreen - Fetching menu...');
      const res = await fetch("/api/menu");
      console.log('MenuScreen - Response status:', res.status);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data: MenuResponse = await res.json();
      console.log('MenuScreen - Fetched data:', data);
      setMenu(data.items);
    } catch (error) {
      console.error("MenuScreen - Failed to fetch menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedItem: MenuItem) => {
    setMenu(menu.map((item) => (item.sku === updatedItem.sku ? updatedItem : item)));
    fetchMenu();
  };

  const handleDeleteItem = async (sku: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) {
      return
    }

    try {
      const res = await fetch(`/api/menu/${sku}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setMenu(menu.filter((item) => item.sku !== sku))
      } else {
        alert("Failed to delete menu item")
      }
    } catch (error) {
      console.error("Failed to delete menu item:", error)
      alert("Error deleting menu item")
    }
  };

  const handleAddItem = async () => {
    if (!newItemData.sku || !newItemData.name || !newItemData.price) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: newItemData.sku,
          name: newItemData.name,
          price: parseFloat(newItemData.price),
          category: newItemData.category,
          available: newItemData.available,
          image: newItemData.image,
        }),
      })

      if (res.ok) {
        const addedItem = await res.json()
        setMenu([...menu, addedItem])
        setShowAddForm(false)
        setNewItemData({
          sku: "",
          name: "",
          price: "",
          category: "Appetizers",
          available: true,
          image: "",
        })
        alert("Item added successfully")
      } else {
        alert("Failed to add menu item")
      }
    } catch (error) {
      console.error("Failed to add menu item:", error)
      alert("Error adding menu item")
    }
  };

  const filteredMenu = menu.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(menu.map((item) => item.category))];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold" style={{ color: "#e5e7eb" }}>
              Menu Management
            </h2>
            <p style={{ color: "#9ca3af" }}>Manage your restaurant's menu items and pricing</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-bold text-white transition-all"
              style={{ backgroundColor: "#ff5a00" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ff7a1a")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ff5a00")}
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5" style={{ color: "#9ca3af" }} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg text-[#e5e7eb] placeholder-[#9ca3af] focus:outline-none transition-colors"
              style={{
                backgroundColor: "rgba(15, 15, 15, 0.5)",
                border: "1px solid rgba(255, 90, 0, 0.2)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255, 90, 0, 0.5)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255, 90, 0, 0.2)")}
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            {["all", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-2 rounded-lg text-sm font-mono transition-all"
                style={
                  selectedCategory === cat
                    ? { backgroundColor: "#ff5a00", color: "white" }
                    : {
                        backgroundColor: "rgba(15, 15, 15, 0.5)",
                        color: "#9ca3af",
                        border: "1px solid rgba(255, 90, 0, 0.2)",
                      }
                }
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        {loading ? (
          <div style={{ color: "#9ca3af" }}>Loading menu items...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenu.map((item) => (
              <div
                key={item.sku}
                className="p-4 rounded-lg border transition-all"
                style={{
                  backgroundColor: "rgba(15, 15, 15, 0.5)",
                  borderColor: "rgba(255, 90, 0, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(15, 15, 15, 0.8)";
                  e.currentTarget.style.borderColor = "rgba(255, 90, 0, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(15, 15, 15, 0.5)";
                  e.currentTarget.style.borderColor = "rgba(255, 90, 0, 0.2)";
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-[#e5e7eb]">{item.name}</h3>
                    <p className="text-sm font-mono" style={{ color: "#9ca3af" }}>
                      {item.sku}
                    </p>
                  </div>
                  <span
                    className="px-2 py-1 rounded text-xs font-mono"
                    style={{
                      backgroundColor: item.available
                        ? "rgba(16, 185, 129, 0.2)"
                        : "rgba(239, 68, 68, 0.2)",
                      color: item.available ? "#10b981" : "#ef4444",
                    }}
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </div>

                <p className="text-sm text-[#9ca3af] mb-3">{item.category}</p>

                <div className="mb-3">
                  <p className="text-xs text-[#9ca3af]">Price</p>
                  <p className="font-mono text-[#ff5a00] text-lg">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex gap-2">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleEditClick(item)}
                        className="flex-1 px-2 py-1 rounded text-sm transition-colors flex items-center justify-center gap-1"
                        style={{
                          backgroundColor: "rgba(255, 90, 0, 0.2)",
                          color: "#ff5a00",
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.sku)}
                        className="flex-1 px-2 py-1 rounded text-sm transition-colors flex items-center justify-center gap-1"
                        style={{
                          backgroundColor: "rgba(239, 68, 68, 0.2)",
                          color: "#ef4444",
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        <EditMenuModal
          isOpen={isEditModalOpen}
          item={editingItem}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSaveEdit}
        />

        {/* Add Item Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className="p-6 rounded-lg border w-96 max-h-[90vh] overflow-y-auto"
              style={{
                backgroundColor: "rgba(15, 15, 15, 0.95)",
                borderColor: "rgba(255, 90, 0, 0.3)",
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold" style={{ color: "#e5e7eb" }}>
                  Add New Menu Item
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  style={{ color: "#9ca3af" }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-mono mb-2" style={{ color: "#9ca3af" }}>
                    SKU
                  </label>
                  <input
                    type="text"
                    value={newItemData.sku}
                    onChange={(e) => setNewItemData({ ...newItemData, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-[#e5e7eb] placeholder-[#9ca3af]"
                    style={{ backgroundColor: "rgba(15, 15, 15, 0.5)", border: "1px solid rgba(255, 90, 0, 0.2)" }}
                    placeholder="e.g., WINGS-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono mb-2" style={{ color: "#9ca3af" }}>
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={newItemData.name}
                    onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-[#e5e7eb] placeholder-[#9ca3af]"
                    style={{ backgroundColor: "rgba(15, 15, 15, 0.5)", border: "1px solid rgba(255, 90, 0, 0.2)" }}
                    placeholder="e.g., Jumbo Wings"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono mb-2" style={{ color: "#9ca3af" }}>
                    Price
                  </label>
                  <input
                    type="number"
                    value={newItemData.price}
                    onChange={(e) => setNewItemData({ ...newItemData, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-[#e5e7eb] placeholder-[#9ca3af]"
                    style={{ backgroundColor: "rgba(15, 15, 15, 0.5)", border: "1px solid rgba(255, 90, 0, 0.2)" }}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono mb-2" style={{ color: "#9ca3af" }}>
                    Category
                  </label>
                  <select
                    value={newItemData.category}
                    onChange={(e) => setNewItemData({ ...newItemData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-[#e5e7eb]"
                    style={{ backgroundColor: "rgba(15, 15, 15, 0.5)", border: "1px solid rgba(255, 90, 0, 0.2)" }}
                  >
                    <option>Appetizers</option>
                    <option>Main Course</option>
                    <option>Desserts</option>
                    <option>Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-mono mb-2" style={{ color: "#9ca3af" }}>
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={newItemData.image}
                    onChange={(e) => setNewItemData({ ...newItemData, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-[#e5e7eb] placeholder-[#9ca3af]"
                    style={{ backgroundColor: "rgba(15, 15, 15, 0.5)", border: "1px solid rgba(255, 90, 0, 0.2)" }}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newItemData.available}
                    onChange={(e) => setNewItemData({ ...newItemData, available: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label className="text-sm" style={{ color: "#9ca3af" }}>
                    Available
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleAddItem}
                    className="flex-1 px-4 py-2 rounded-lg text-white font-bold transition"
                    style={{ backgroundColor: "#ff5a00" }}
                  >
                    Add Item
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
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
