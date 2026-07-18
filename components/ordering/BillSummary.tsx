'use client';

import React from 'react';
import { CartItem } from '@/lib/menu-types';
import { BillBreakdown, calculateBill, formatCurrency } from '@/lib/bill-calculator';

interface BillSummaryProps {
  items: CartItem[];
  showItemDetails?: boolean;
}

export function BillSummary({ items, showItemDetails = true }: BillSummaryProps) {
  const bill = calculateBill(items);

  return (
    <div
      className="rounded-lg border p-6"
      style={{
        backgroundColor: 'rgba(15, 15, 15, 0.5)',
        borderColor: 'rgba(255, 90, 0, 0.3)',
      }}
    >
      <h3 className="text-lg font-bold mb-4 text-white">Bill Summary</h3>

      {showItemDetails && items.length > 0 && (
        <div className="mb-4 pb-4 border-b" style={{ borderColor: 'rgba(255, 90, 0, 0.2)' }}>
          <h4 className="text-sm font-mono mb-3" style={{ color: '#9ca3af' }}>
            Items
          </h4>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.sku} className="flex justify-between text-sm">
                <span style={{ color: '#e5e7eb' }}>
                  {item.name} x {item.quantity}
                </span>
                <span style={{ color: '#f59e0b' }}>
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span style={{ color: '#9ca3af' }}>Subtotal</span>
          <span style={{ color: '#e5e7eb' }}>{formatCurrency(bill.subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span style={{ color: '#9ca3af' }}>Tax (5%)</span>
          <span style={{ color: '#e5e7eb' }}>{formatCurrency(bill.tax)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span style={{ color: '#9ca3af' }}>Service Charge (10%)</span>
          <span style={{ color: '#e5e7eb' }}>{formatCurrency(bill.serviceCharge)}</span>
        </div>

        <div
          className="pt-3 border-t"
          style={{ borderColor: 'rgba(255, 90, 0, 0.3)' }}
        >
          <div className="flex justify-between">
            <span className="font-bold" style={{ color: '#f59e0b' }}>
              Total
            </span>
            <span className="font-bold text-lg" style={{ color: '#ff5a00' }}>
              {formatCurrency(bill.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
