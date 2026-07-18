import { CartItem, OrderData } from './menu-types';

export interface BillBreakdown {
  subtotal: number;
  tax: number;
  serviceCharge: number;
  total: number;
}

// Configuration
const TAX_RATE = 0.05; // 5% tax
const SERVICE_CHARGE_RATE = 0.1; // 10% service charge

export function calculateBill(items: CartItem[]): BillBreakdown {
  const subtotal = parseFloat(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
  );

  const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const serviceCharge = parseFloat((subtotal * SERVICE_CHARGE_RATE).toFixed(2));
  const total = parseFloat((subtotal + tax + serviceCharge).toFixed(2));

  return {
    subtotal,
    tax,
    serviceCharge,
    total,
  };
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function createOrderData(
  items: CartItem[],
  paymentMethod: 'CARD' | 'CASH',
  userId?: string
): OrderData {
  const { subtotal, tax, serviceCharge, total } = calculateBill(items);

  return {
    items,
    subtotal,
    tax,
    serviceCharge,
    total,
    paymentMethod,
    userId,
  };
}
