import { create } from 'zustand';
import { CartItem } from './menu-types';

interface CartStore {
  items: CartItem[];
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  subtotal: 0,

  addItem: (item: CartItem) => {
    const { items } = get();
    const existingItem = items.find((i) => i.sku === item.sku);

    if (existingItem) {
      // Update quantity if item exists
      const updatedItems = items.map((i) =>
        i.sku === item.sku ? { ...i, quantity: i.quantity + item.quantity } : i
      );
      set({ items: updatedItems });
    } else {
      // Add new item
      set({ items: [...items, item] });
    }
  },

  removeItem: (sku: string) => {
    const { items } = get();
    set({ items: items.filter((i) => i.sku !== sku) });
  },

  updateQuantity: (sku: string, quantity: number) => {
    const { items } = get();
    if (quantity <= 0) {
      set({ items: items.filter((i) => i.sku !== sku) });
    } else {
      const updatedItems = items.map((i) =>
        i.sku === sku ? { ...i, quantity } : i
      );
      set({ items: updatedItems });
    }
  },

  clearCart: () => {
    set({ items: [], subtotal: 0 });
  },

  getSubtotal: () => {
    const { items } = get();
    return parseFloat(
      items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
    );
  },
}));
