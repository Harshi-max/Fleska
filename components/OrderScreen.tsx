"use client";

import { useState, useEffect } from "react";
import { MenuItem } from "@/lib/menu-types";
import { Order } from "@/lib/store";
import { useRealtimeStore } from "@/lib/realtime-store";
import { Plus } from "lucide-react";

interface OrderItem {
  sku: string;
  quantity: number;
  item_price: string;
}

interface OrderScreenProps {
  onComplete: (order: Order) => void;
}

// Menu items are defined in lib/fixtures-loader.ts
const STATIC_MENU: MenuItem[] = [
  { sku: "BURGER_C", name: "Classic Burger", price: 9.49, category: "Main", available: true },
  { sku: "FRIES", name: "Fries", price: 3.33, category: "Sides", available: true },
  { sku: "SODA", name: "Soda", price: 0.10, category: "Beverages", available: true },
  { sku: "PIZZA_M", name: "Pizza Margherita", price: 12.99, category: "Main", available: true },
  { sku: "WINGS_6", name: "Wings (6pc)", price: 7.77, category: "Appetizers", available: true },
  { sku: "SALAD_G", name: "Greek Salad", price: 10.01, category: "Salads", available: true },
  { sku: "ESPRESSO", name: "Espresso", price: 1.99, category: "Beverages", available: true },
  { sku: "TIRAMISU", name: "Tiramisu", price: 6.66, category: "Desserts", available: true },
];

export function OrderScreen({ onComplete }: OrderScreenProps) {
  const { user } = useRealtimeStore();
  const [cart, setCart] = useState<Map<string, OrderItem>>(new Map());
  const [paymentType, setPaymentType] = useState<"CARD" | "CASH">("CARD");
  const [tip, setTip] = useState("0.00");
  const [discount, setDiscount] = useState("0.00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Order | null>(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemSku, setNewItemSku] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Main");

  // Check if user can add items (admin, staff, chef, manager)
  const canAddItems = user?.role === 'admin' || user?.role === 'staff' || user?.role === 'chef' || user?.role === 'manager';

  const handleAddItem = (id: string, price: number) => {
    const current = cart.get(id);
    const updated = new Map(cart);

    if (current) {
      updated.set(id, {
        ...current,
        quantity: current.quantity + 1,
      });
    } else {
      updated.set(id, {
        sku: id,
        quantity: 1,
        item_price: price.toString(),
      });
    }

    setCart(updated);
  };

  const handleRemoveItem = (id: string) => {
    const current = cart.get(id);
    if (!current) return;

    const updated = new Map(cart);
    if (current.quantity > 1) {
      updated.set(id, {
        ...current,
        quantity: current.quantity - 1,
      });
    } else {
      updated.delete(id);
    }

    setCart(updated);
  };

  const handleAddNewMenuItem = () => {
    if (!newItemSku || !newItemName || !newItemPrice) {
      setError("Please fill in all fields");
      return;
    }

    const newItem: MenuItem = {
      sku: newItemSku,
      name: newItemName,
      price: parseFloat(newItemPrice),
      category: newItemCategory,
      available: true,
    };

    STATIC_MENU.push(newItem);
    setShowAddItemModal(false);
    setNewItemSku("");
    setNewItemName("");
    setNewItemPrice("");
    setNewItemCategory("Main");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const items = Array.from(cart.values());
      if (items.length === 0) {
        throw new Error("Cart is empty");
      }

      // Calculate subtotal from cart items
      const subtotal = items.reduce((sum, item) => {
        const price = parseFloat(item.item_price || "0");
        return sum + (price * item.quantity);
      }, 0);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shop_id: "shop_1",
          items,
          payment_type: paymentType,
          subtotal: subtotal.toFixed(2),
          tip,
          discount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      const order = await response.json();
      setResult(order);
      setCart(new Map());
      setTip("0.00");
      setDiscount("0.00");
      onComplete(order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded">
        <h2 className="text-lg font-semibold text-green-900 mb-2">Order Created!</h2>
        <div className="space-y-1 text-sm text-green-800">
          <p>Order ID: {result.id}</p>
          <p>Subtotal: ${result.subtotal}</p>
          <p>Convenience Fee: ${result.convenience_fee}</p>
          <p>Total: ${result.total}</p>
        </div>
        <button
          onClick={() => setResult(null)}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Create Another Order
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create Order</h1>
        <div className="flex gap-2">
          {canAddItems && (
            <button
              type="button"
              onClick={() => setShowAddItemModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Order Item
            </button>
          )}
          <button
            type="submit"
            form="order-form"
            disabled={loading || cart.size === 0}
            className="px-6 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Order"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      <form id="order-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Menu Items */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Menu Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {STATIC_MENU.map((item) => (
              <div key={item.sku} className="border rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">${item.price}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddItem(item.sku, item.price)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
                {cart.has(item.sku) && (
                  <div className="flex items-center justify-between text-sm">
                    <span>Qty: {cart.get(item.sku)!.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.sku)}
                      className="px-2 py-0.5 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Payment Type</label>
          <div className="flex gap-4">
            {(["CARD", "CASH"] as const).map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment_type"
                  value={type}
                  checked={paymentType === type}
                  onChange={(e) => setPaymentType(e.target.value as "CARD" | "CASH")}
                  className="w-4 h-4"
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Tip and Discount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tip ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Discount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        {/* Submit button is now in header */}
      </form>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Order Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">SKU</label>
                <input
                  type="text"
                  value={newItemSku}
                  onChange={(e) => setNewItemSku(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., BURGER_SPICY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., Spicy Burger"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., 10.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Main">Main</option>
                  <option value="Sides">Sides</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Appetizers">Appetizers</option>
                  <option value="Salads">Salads</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowAddItemModal(false)}
                className="flex-1 px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewMenuItem}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
