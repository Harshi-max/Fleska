"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface TableBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  table?: { id: string; table_number: number; capacity: number };
}

export function TableBookingModal({ isOpen, onClose, table }: TableBookingModalProps) {
  const [formData, setFormData] = useState({
    guest_name: "",
    guest_phone: "",
    guest_email: "",
    booking_date: "",
    booking_time: "",
    guest_count: "2",
    duration_minutes: "120",
    special_requests: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    console.log('TableBookingModal - table object:', table);
    console.log('TableBookingModal - table_id being sent:', table?.id);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table_id: table?.id,
          ...formData,
          guest_count: parseInt(formData.guest_count),
          duration_minutes: parseInt(formData.duration_minutes),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Booking failed");
      }

      setMessage({ type: "success", text: "Table booked successfully!" });
      setTimeout(() => {
        setFormData({
          guest_name: "",
          guest_phone: "",
          guest_email: "",
          booking_date: "",
          booking_time: "",
          guest_count: "2",
          duration_minutes: "120",
          special_requests: "",
        });
        onClose();
      }, 1500);
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Booking failed" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="rounded-lg w-full max-w-md max-h-96 overflow-y-auto" style={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(255, 90, 0, 0.3)" }}>
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: "rgba(255, 90, 0, 0.2)" }}>
          <h3 className="text-lg font-bold" style={{ color: "#e5e7eb" }}>Book Table {table?.table_number}</h3>
          <button onClick={onClose} style={{ color: "#9ca3af" }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-mono uppercase mb-2 block" style={{ color: "#9ca3af" }}>Guest Name *</label>
            <input
              type="text"
              value={formData.guest_name}
              onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
              className="w-full px-3 py-2 rounded text-sm"
              style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255, 90, 0, 0.2)", color: "#e5e7eb" }}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase mb-2 block" style={{ color: "#9ca3af" }}>Phone *</label>
              <input
                type="tel"
                value={formData.guest_phone}
                onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255, 90, 0, 0.2)", color: "#e5e7eb" }}
                required
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase mb-2 block" style={{ color: "#9ca3af" }}>Email</label>
              <input
                type="email"
                value={formData.guest_email}
                onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255, 90, 0, 0.2)", color: "#e5e7eb" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase mb-2 block" style={{ color: "#9ca3af" }}>Date *</label>
              <input
                type="date"
                value={formData.booking_date}
                onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255, 90, 0, 0.2)", color: "#e5e7eb" }}
                required
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase mb-2 block" style={{ color: "#9ca3af" }}>Time *</label>
              <input
                type="time"
                value={formData.booking_time}
                onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255, 90, 0, 0.2)", color: "#e5e7eb" }}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase mb-2 block" style={{ color: "#9ca3af" }}>Guests *</label>
              <select
                value={formData.guest_count}
                onChange={(e) => setFormData({ ...formData, guest_count: e.target.value })}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255, 90, 0, 0.2)", color: "#e5e7eb" }}
                required
              >
                {Array.from({ length: table?.capacity || 10 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono uppercase mb-2 block" style={{ color: "#9ca3af" }}>Duration</label>
              <select
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255, 90, 0, 0.2)", color: "#e5e7eb" }}
              >
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
                <option value="180">3 hours</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase mb-2 block" style={{ color: "#9ca3af" }}>Special Requests</label>
            <textarea
              value={formData.special_requests}
              onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
              className="w-full px-3 py-2 rounded text-sm"
              rows={3}
              style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255, 90, 0, 0.2)", color: "#e5e7eb" }}
            />
          </div>

          {message && (
            <div
              className="p-3 rounded text-sm"
              style={{
                backgroundColor: message.type === "success" ? "#10b981" + "20" : "#ef4444" + "20",
                color: message.type === "success" ? "#10b981" : "#ef4444",
              }}
            >
              {message.text}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded font-mono text-sm transition-colors"
              style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255, 90, 0, 0.2)", color: "#e5e7eb" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded font-mono text-sm font-bold text-white transition-colors"
              style={{ backgroundColor: "#ff5a00" }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#ff7a1a")}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = "#ff5a00")}
            >
              {loading ? "Booking..." : "Book Table"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
