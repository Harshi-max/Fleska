'use client'

import React, { useState, useEffect } from 'react'
import { Home, Send, AlertCircle, Check, Plus, X } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { useRealtimeStore } from '@/lib/realtime-store'
import { BillSummary } from '@/components/ordering/BillSummary'
import { calculateBill, formatCurrency } from '@/lib/bill-calculator'
import { MenuItem } from '@/lib/menu-types'

interface OrdersPageProps {
  onNavigate: (page: string) => void
}

const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate }) => {
  const { items: cartItems, clearCart, addItem } = useCartStore()
  const { user } = useRealtimeStore()
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'CASH'>('CARD')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  const [submittedOrderId, setSubmittedOrderId] = useState('')
  const [error, setError] = useState('')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false)
  const [newOrderItems, setNewOrderItems] = useState<any[]>([])
  const [newOrderShopId, setNewOrderShopId] = useState('shop_berlin')
  const [newOrderPaymentType, setNewOrderPaymentType] = useState<'CARD' | 'CASH'>('CARD')
  const [newOrderTip, setNewOrderTip] = useState('0.00')
  const [newOrderDiscount, setNewOrderDiscount] = useState('0.00')

  const bill = calculateBill(cartItems)

  // Check if user is admin, chef, or staff
  const canAddItems = true // Temporarily allow all users to see the button
  
  console.log('OrdersPage - User:', user)
  console.log('OrdersPage - User role:', user?.role)
  console.log('OrdersPage - Can add items:', canAddItems)

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu')
      const data = await res.json()
      setMenuItems(data.items || [])
    } catch (error) {
      console.error('Failed to fetch menu:', error)
    }
  }

  const handleAddItem = () => {
    if (selectedItem) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          sku: selectedItem.sku,
          name: selectedItem.name,
          price: selectedItem.price,
          quantity: 1,
          image: selectedItem.image,
        })
      }
      setShowAddItemModal(false)
      setSelectedItem(null)
      setQuantity(1)
    }
  }

  const handleCreateOrder = async () => {
    if (newOrderItems.length === 0) {
      setError('Please add items to the order')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shop_id: newOrderShopId,
          items: newOrderItems,
          payment_type: newOrderPaymentType,
          tip: newOrderTip,
          discount: newOrderDiscount,
        }),
      })

      if (response.ok) {
        const order = await response.json()
        setSubmittedOrderId(order.id)
        setOrderSubmitted(true)
        setShowCreateOrderModal(false)
        setNewOrderItems([])
        setNewOrderTip('0.00')
        setNewOrderDiscount('0.00')
        setTimeout(() => {
          setOrderSubmitted(false)
        }, 3000)
      } else {
        setError('Failed to create order')
      }
    } catch (err) {
      setError('Error creating order')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addNewItemToOrder = (item: MenuItem, qty: number) => {
    setNewOrderItems(prev => {
      const existing = prev.find(i => i.sku === item.sku)
      if (existing) {
        return prev.map(i => i.sku === item.sku ? { ...i, qty: (i.qty || i.quantity || 1) + qty } : i)
      }
      return [...prev, { sku: item.sku, qty }]
    })
  }

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty')
      return
    }

    if (!user) {
      setError('Please login to place an order')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shop_id: 'shop-1',
          items: cartItems.map((item) => ({
            sku: item.sku,
            quantity: item.quantity,
          })),
          payment_type: paymentMethod,
          subtotal: bill.subtotal.toString(),
          tip: '0.00',
          discount: '0.00',
        }),
      })

      if (response.ok) {
        const order = await response.json()
        setSubmittedOrderId(order.id)
        setOrderSubmitted(true)
        clearCart()
        setTimeout(() => {
          setOrderSubmitted(false)
          onNavigate('landing')
        }, 3000)
      } else {
        setError('Failed to submit order')
      }
    } catch (err) {
      setError('Error submitting order')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cartItems.length === 0 && !orderSubmitted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
        {/* Header */}
        <nav
          className="sticky top-0 border-b px-6 py-4 flex justify-between items-center z-10"
          style={{
            backgroundColor: 'rgba(15, 15, 15, 0.95)',
            borderColor: 'rgba(255, 90, 0, 0.2)',
          }}
        >
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold" style={{ color: '#ff5a00' }}>
              Your Orders
            </h1>
            {canAddItems && (
              <button
                onClick={() => setShowCreateOrderModal(true)}
                className="px-3 py-1 rounded-lg text-sm font-bold transition flex items-center gap-2"
                style={{ backgroundColor: '#10b981', color: 'white' }}
              >
                <Plus className="w-4 h-4" />
                Create Order
              </button>
            )}
          </div>
          <button
            onClick={() => onNavigate('landing')}
            className="px-4 py-2 rounded-lg transition flex items-center gap-2"
            style={{ backgroundColor: 'rgba(255, 90, 0, 0.2)', color: '#ff5a00' }}
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        </nav>

        {/* Empty State */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#9ca3af' }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#e5e7eb' }}>
              Your cart is empty
            </h2>
            <p style={{ color: '#9ca3af' }} className="mb-6">
              Start by adding items from the menu
            </p>
            <button
              onClick={() => onNavigate('menu')}
              className="px-6 py-3 rounded-lg text-white font-bold transition"
              style={{ backgroundColor: '#ff5a00' }}
            >
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (orderSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f0f0f' }}>
        <div className="text-center">
          <Check className="w-16 h-16 mx-auto mb-4" style={{ color: '#10b981' }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#e5e7eb' }}>
            Order Submitted Successfully!
          </h2>
          <p style={{ color: '#9ca3af' }} className="mb-2">
            Order ID: <span style={{ color: '#ff5a00' }}>{submittedOrderId}</span>
          </p>
          <p style={{ color: '#9ca3af' }}>Redirecting to home...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f0f' }}>
      {/* Header */}
      <nav
        className="sticky top-0 border-b px-6 py-4 flex justify-between items-center z-10"
        style={{
          backgroundColor: 'rgba(15, 15, 15, 0.95)',
          borderColor: 'rgba(255, 90, 0, 0.2)',
        }}
      >
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold" style={{ color: '#ff5a00' }}>
            Your Orders
          </h1>
          {canAddItems && (
            <>
              <button
                onClick={() => setShowCreateOrderModal(true)}
                className="px-3 py-1 rounded-lg text-sm font-bold transition flex items-center gap-2"
                style={{ backgroundColor: '#10b981', color: 'white' }}
              >
                <Plus className="w-4 h-4" />
                Create Order
              </button>
              <button
                onClick={() => setShowAddItemModal(true)}
                className="px-3 py-1 rounded-lg text-sm font-bold transition flex items-center gap-2"
                style={{ backgroundColor: '#ff5a00', color: 'white' }}
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </>
          )}
        </div>
        <button
          onClick={() => onNavigate('landing')}
          className="px-4 py-2 rounded-lg transition flex items-center gap-2"
          style={{ backgroundColor: 'rgba(255, 90, 0, 0.2)', color: '#ff5a00' }}
        >
          <Home className="w-5 h-5" />
          Home
        </button>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#e5e7eb' }}>
                Order Items ({cartItems.length})
              </h2>

              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.sku}
                    className="p-4 rounded-lg border flex justify-between items-center"
                    style={{
                      backgroundColor: 'rgba(15, 15, 15, 0.5)',
                      borderColor: 'rgba(255, 90, 0, 0.2)',
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p style={{ color: '#e5e7eb' }} className="font-bold">
                          {item.name}
                        </p>
                        <p style={{ color: '#9ca3af' }} className="text-sm">
                          {item.sku}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p style={{ color: '#ff5a00' }} className="font-bold">
                        {item.quantity}x {formatCurrency(item.price)}
                      </p>
                      <p style={{ color: '#e5e7eb' }} className="font-bold">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#e5e7eb' }}>
                Payment Method
              </h3>
              <div className="space-y-3">
                {['CARD', 'CASH'].map((method) => (
                  <label key={method} className="flex items-center p-4 rounded-lg border cursor-pointer transition"
                    style={{
                      backgroundColor: paymentMethod === method as any
                        ? 'rgba(255, 90, 0, 0.1)'
                        : 'rgba(15, 15, 15, 0.5)',
                      borderColor: paymentMethod === method as any
                        ? 'rgba(255, 90, 0, 0.5)'
                        : 'rgba(255, 90, 0, 0.2)',
                    }}>
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method as any}
                      onChange={(e) => setPaymentMethod(e.target.value as 'CARD' | 'CASH')}
                      className="w-4 h-4"
                      style={{ accentColor: '#ff5a00' }}
                    />
                    <span style={{ color: '#e5e7eb' }} className="ml-3 font-mono font-bold">
                      {method === 'CARD' ? 'Credit/Debit Card' : 'Cash'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                }}
              >
                <p style={{ color: '#ef4444' }} className="text-sm">
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* Bill Summary */}
          <div>
            <BillSummary items={cartItems} showItemDetails={false} />

            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting || cartItems.length === 0}
              className="w-full mt-6 px-6 py-3 rounded-lg text-white font-bold transition disabled:opacity-50"
              style={{ backgroundColor: '#ff5a00' }}
            >
              {isSubmitting ? 'Submitting...' : `Place Order - ${formatCurrency(bill.total)}`}
            </button>

            {!user && (
              <button
                onClick={() => onNavigate('login')}
                className="w-full mt-3 px-6 py-3 rounded-lg text-white font-bold transition"
                style={{ backgroundColor: 'rgba(255, 90, 0, 0.2)', color: '#ff5a00' }}
              >
                Login to Place Order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Create Order Modal */}
      {showCreateOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto" style={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(255, 90, 0, 0.3)" }}>
            <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: "rgba(255, 90, 0, 0.2)" }}>
              <h3 className="text-lg font-bold" style={{ color: "#e5e7eb" }}>Create New Order</h3>
              <button onClick={() => setShowCreateOrderModal(false)} style={{ color: "#9ca3af" }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-2 block" style={{ color: "#9ca3af" }}>Shop</label>
                  <select
                    value={newOrderShopId}
                    onChange={(e) => setNewOrderShopId(e.target.value)}
                    className="w-full px-3 py-2 rounded"
                    style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255, 90, 0, 0.2)", color: "#e5e7eb" }}
                  >
                    <option value="shop_berlin">Trattoria Mitte (Berlin)</option>
                    <option value="shop_chicago">Windy City Diner (Chicago)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm mb-2 block" style={{ color: "#9ca3af" }}>Payment Type</label>
                  <select
                    value={newOrderPaymentType}
                    onChange={(e) => setNewOrderPaymentType(e.target.value as 'CARD' | 'CASH')}
                    className="w-full px-3 py-2 rounded"
                    style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255, 90, 0, 0.2)", color: "#e5e7eb" }}
                  >
                    <option value="CARD">CARD</option>
                    <option value="CASH">CASH</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-2 block" style={{ color: "#9ca3af" }}>Tip ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newOrderTip}
                    onChange={(e) => setNewOrderTip(e.target.value)}
                    className="w-full px-3 py-2 rounded"
                    style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255, 90, 0, 0.2)", color: "#e5e7eb" }}
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block" style={{ color: "#9ca3af" }}>Discount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newOrderDiscount}
                    onChange={(e) => setNewOrderDiscount(e.target.value)}
                    className="w-full px-3 py-2 rounded"
                    style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255, 90, 0, 0.2)", color: "#e5e7eb" }}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm mb-2 block" style={{ color: "#9ca3af" }}>Add Items</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {menuItems.map((item) => (
                    <div
                      key={item.sku}
                      className="flex items-center justify-between p-2 rounded border"
                      style={{ backgroundColor: "rgba(15, 15, 15, 0.5)", borderColor: "rgba(255, 90, 0, 0.2)" }}
                    >
                      <div>
                        <div className="text-sm font-bold" style={{ color: "#e5e7eb" }}>{item.name}</div>
                        <div className="text-xs" style={{ color: "#9ca3af" }}>${item.price.toFixed(2)}</div>
                      </div>
                      <button
                        onClick={() => addNewItemToOrder(item, 1)}
                        className="px-2 py-1 rounded text-xs"
                        style={{ backgroundColor: "#ff5a00", color: "white" }}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {newOrderItems.length > 0 && (
                <div>
                  <label className="text-sm mb-2 block" style={{ color: "#9ca3af" }}>Order Items</label>
                  <div className="space-y-1">
                    {newOrderItems.map((item, idx) => {
                      const menuItem = menuItems.find(m => m.sku === item.sku)
                      return (
                        <div key={idx} className="flex justify-between items-center p-2 rounded" style={{ backgroundColor: "rgba(15, 15, 15, 0.5)" }}>
                          <span style={{ color: "#e5e7eb" }}>{menuItem?.name || item.sku} x{item.qty}</span>
                          <button
                            onClick={() => setNewOrderItems(prev => prev.filter((_, i) => i !== idx))}
                            className="text-xs"
                            style={{ color: "#ef4444" }}
                          >
                            Remove
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <button
                onClick={handleCreateOrder}
                disabled={isSubmitting || newOrderItems.length === 0}
                className="w-full px-4 py-2 rounded-lg font-bold text-white transition disabled:opacity-50"
                style={{ backgroundColor: "#10b981" }}
              >
                {isSubmitting ? 'Creating...' : 'Create Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto" style={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(255, 90, 0, 0.3)" }}>
            <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: "rgba(255, 90, 0, 0.2)" }}>
              <h3 className="text-lg font-bold" style={{ color: "#e5e7eb" }}>Add Item to Order</h3>
              <button onClick={() => setShowAddItemModal(false)} style={{ color: "#9ca3af" }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {menuItems.map((item) => (
                  <div
                    key={item.sku}
                    onClick={() => setSelectedItem(item)}
                    className={`p-4 rounded-lg border cursor-pointer transition ${
                      selectedItem?.sku === item.sku
                        ? "border-orange-500"
                        : "border-gray-700"
                    }`}
                    style={{
                      backgroundColor: "rgba(15, 15, 15, 0.5)",
                      borderColor: selectedItem?.sku === item.sku ? "rgba(255, 90, 0, 0.5)" : "rgba(255, 90, 0, 0.2)",
                    }}
                  >
                    <div className="font-bold" style={{ color: "#e5e7eb" }}>{item.name}</div>
                    <div className="text-sm" style={{ color: "#9ca3af" }}>${item.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
              {selectedItem && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm mb-2 block" style={{ color: "#9ca3af" }}>Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded"
                      style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255, 90, 0, 0.2)", color: "#e5e7eb" }}
                    />
                  </div>
                  <button
                    onClick={handleAddItem}
                    className="w-full px-4 py-2 rounded-lg font-bold text-white transition"
                    style={{ backgroundColor: "#ff5a00" }}
                  >
                    Add {quantity} x {selectedItem.name}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersPage
