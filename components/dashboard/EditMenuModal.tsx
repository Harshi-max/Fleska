'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { MenuItem } from '@/lib/menu-types';

interface EditMenuModalProps {
  isOpen: boolean;
  item: MenuItem | null;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
}

export function EditMenuModal({ isOpen, item, onClose, onSave }: EditMenuModalProps) {
  const [formData, setFormData] = useState<MenuItem>({
    sku: '',
    name: '',
    price: 0,
    category: '',
    available: true,
    image: '',
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Send update to API
      const response = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave(formData);
        onClose();
      }
    } catch (error) {
      console.error('Failed to update menu item:', error);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-opacity-95 rounded-lg p-6 w-full max-w-md"
        style={{ backgroundColor: 'rgba(15, 15, 15, 0.95)' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Edit Menu Item</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-opacity-20 rounded transition-all"
            style={{ backgroundColor: 'rgba(255, 90, 0, 0.2)' }}
          >
            <X className="w-5 h-5 text-orange-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              SKU
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              disabled
              className="w-full px-3 py-2 rounded border bg-opacity-30 text-white opacity-50"
              style={{
                backgroundColor: 'rgba(30, 30, 30, 0.3)',
                borderColor: 'rgba(255, 90, 0, 0.3)',
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded border bg-opacity-50 text-white focus:outline-none focus:border-orange-500"
              style={{
                backgroundColor: 'rgba(30, 30, 30, 0.5)',
                borderColor: 'rgba(255, 90, 0, 0.3)',
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              className="w-full px-3 py-2 rounded border bg-opacity-50 text-white focus:outline-none focus:border-orange-500"
              style={{
                backgroundColor: 'rgba(30, 30, 30, 0.5)',
                borderColor: 'rgba(255, 90, 0, 0.3)',
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded border bg-opacity-50 text-white focus:outline-none focus:border-orange-500"
              style={{
                backgroundColor: 'rgba(30, 30, 30, 0.5)',
                borderColor: 'rgba(255, 90, 0, 0.3)',
              }}
            >
              <option value="">Select a category</option>
              <option value="Appetizers">Appetizers</option>
              <option value="Main Course">Main Course</option>
              <option value="Desserts">Desserts</option>
              <option value="Beverages">Beverages</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Image URL
            </label>
            <input
              type="text"
              name="image"
              value={formData.image || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border bg-opacity-50 text-white focus:outline-none focus:border-orange-500"
              style={{
                backgroundColor: 'rgba(30, 30, 30, 0.5)',
                borderColor: 'rgba(255, 90, 0, 0.3)',
              }}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="w-4 h-4 rounded"
              style={{ accentColor: '#ff5a00' }}
            />
            <label className="ml-2 text-sm" style={{ color: '#9ca3af' }}>
              Available
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded font-mono font-bold text-white transition-all"
              style={{
                backgroundColor: 'rgba(255, 90, 0, 0.2)',
                color: '#ff5a00',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded font-mono font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#ff5a00' }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
