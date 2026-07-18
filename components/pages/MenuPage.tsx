'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Home, Plus, Minus, LogOut, LogIn } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { useAuthStore } from '@/lib/auth-store'
import { CartItem, MenuItem } from '@/lib/menu-types'

interface MenuPageProps {
  onNavigate: (page: string) => void
}

const MenuPage: React.FC<MenuPageProps> = ({ onNavigate }) => {
  const { items: cartItems, addItem, removeItem, updateQuantity } = useCartStore()
  const { user, logout } = useAuthStore()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

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
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (item: MenuItem) => {
    const cartItem: CartItem = {
      sku: item.sku,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    }
    addItem(cartItem)
  }

  const removeFromCart = (sku: string) => {
    const cartItem = cartItems.find((item) => item.sku === sku)
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(sku, cartItem.quantity - 1)
      } else {
        removeItem(sku)
      }
    }
  }

  const getCartItemQuantity = (sku: string) => {
    return cartItems.find((item) => item.sku === sku)?.quantity || 0
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading menu...</div>
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
        <div className="flex items-center gap-2 text-2xl font-bold" style={{ color: '#ff5a00' }}>
          Restaurant POS - Menu
        </div>
        <div className="flex gap-4 items-center">
          {user && (
            <span style={{ color: '#9ca3af' }} className="text-sm">
              Welcome, {user.name}
            </span>
          )}
          <button
            onClick={() => onNavigate('landing')}
            className="px-4 py-2 rounded-lg transition flex items-center gap-2"
            style={{ backgroundColor: 'rgba(255, 90, 0, 0.2)', color: '#ff5a00' }}
          >
            <Home className="w-5 h-5" />
            Home
          </button>
          {user && (
            <button
              onClick={() => {
                logout()
                onNavigate('landing')
              }}
              className="px-4 py-2 rounded-lg transition flex items-center gap-2"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          )}
          {!user && (
            <button
              onClick={() => onNavigate('login')}
              className="px-4 py-2 rounded-lg transition flex items-center gap-2"
              style={{ backgroundColor: '#ff5a00', color: 'white' }}
            >
              <LogIn className="w-5 h-5" />
              Login
            </button>
          )}
          <button
            onClick={() => onNavigate('orders')}
            className="px-4 py-2 rounded-lg transition relative"
            style={{ backgroundColor: '#ff5a00', color: 'white' }}
          >
            Order
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#ef4444' }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#e5e7eb' }}>
          Menu
        </h1>
        <p style={{ color: '#9ca3af' }} className="mb-8">
          Fresh and delicious items to order
        </p>

        {/* Menu Grid */}
        {menuItems.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {menuItems.map((item) => (
              <div
                key={item.sku}
                className="rounded-xl overflow-hidden border transition"
                style={{
                  backgroundColor: 'rgba(15, 15, 15, 0.5)',
                  borderColor: 'rgba(255, 90, 0, 0.2)',
                }}
              >
                {/* Image */}
                {item.image && (
                  <div className="relative h-48 w-full">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: '#e5e7eb' }}>
                        {item.name}
                      </h3>
                      <p className="text-sm font-mono" style={{ color: '#9ca3af' }}>
                        {item.sku}
                      </p>
                    </div>
                    <span
                      className="text-xs px-2 py-1 rounded font-mono"
                      style={{
                        backgroundColor: item.available ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: item.available ? '#10b981' : '#ef4444',
                      }}
                    >
                      {item.available ? 'Available' : 'Out'}
                    </span>
                  </div>

                  <p style={{ color: '#9ca3af' }} className="text-sm mb-3">
                    {item.category}
                  </p>

                  {/* Price */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold" style={{ color: '#ff5a00' }}>
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="flex items-center gap-2">
                    {getCartItemQuantity(item.sku) === 0 ? (
                      <button
                        onClick={() => addToCart(item)}
                        disabled={!item.available}
                        className="flex-1 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                        style={{ backgroundColor: '#ff5a00' }}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div
                        className="flex-1 flex items-center justify-between rounded-lg px-3 py-2"
                        style={{ backgroundColor: 'rgba(255, 90, 0, 0.2)' }}
                      >
                        <button
                          onClick={() => removeFromCart(item.sku)}
                          className="transition"
                          style={{ color: '#ff5a00' }}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold" style={{ color: '#ff5a00' }}>
                          {getCartItemQuantity(item.sku)}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="transition"
                          style={{ color: '#ff5a00' }}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: '#9ca3af' }} className="text-center py-12">
            No menu items available
          </div>
        )}

        {/* Cart Summary */}
        {cartCount > 0 && (
          <div
            className="fixed bottom-6 right-6 rounded-xl shadow-2xl p-6 max-w-sm border"
            style={{
              backgroundColor: 'rgba(15, 15, 15, 0.95)',
              borderColor: 'rgba(255, 90, 0, 0.3)',
            }}
          >
            <h3 className="font-bold text-lg mb-4" style={{ color: '#e5e7eb' }}>
              Cart Summary
            </h3>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.sku} className="flex justify-between text-sm">
                  <span style={{ color: '#e5e7eb' }}>{item.name}</span>
                  <span style={{ color: '#ff5a00' }} className="font-semibold">
                    {item.quantity}x ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="border-t pt-4"
              style={{ borderColor: 'rgba(255, 90, 0, 0.3)' }}
            >
              <div className="flex justify-between font-bold text-lg mb-4">
                <span style={{ color: '#9ca3af' }}>Total:</span>
                <span style={{ color: '#ff5a00' }}>${cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={() => onNavigate('orders')}
                className="w-full text-white font-bold py-2 rounded-lg transition"
                style={{ backgroundColor: '#ff5a00' }}
              >
                Proceed to Orders
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MenuPage
