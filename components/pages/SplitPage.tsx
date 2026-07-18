'use client'

import React, { useState } from 'react'
import { Home, ArrowLeft, Users, Check } from 'lucide-react'

interface SplitPageProps {
  onNavigate: (page: string) => void
  orderId?: string
}

const SplitPage: React.FC<SplitPageProps> = ({ onNavigate, orderId }) => {
  const [ways, setWays] = useState(2)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<any>(null)
  const [manualOrderId, setManualOrderId] = useState(orderId || '')
  const [useManualId, setUseManualId] = useState(!orderId)

  const handleSplit = async () => {
    const targetOrderId = useManualId ? manualOrderId.trim() : orderId
    
    if (!targetOrderId) {
      setError('Please enter an order ID')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/orders/${targetOrderId}/split`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ways }),
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to split order')
      }
    } catch (err) {
      setError('Error splitting order')
      console.error(err)
    } finally {
      setLoading(false)
    }
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
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 rounded-lg transition flex items-center gap-2"
            style={{ backgroundColor: 'rgba(255, 90, 0, 0.2)', color: '#ff5a00' }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold" style={{ color: '#ff5a00' }}>
            Split Bill
          </h1>
        </div>
        <button
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 rounded-lg transition flex items-center gap-2"
          style={{ backgroundColor: 'rgba(255, 90, 0, 0.2)', color: '#ff5a00' }}
        >
          <Home className="w-5 h-5" />
          Home
        </button>
      </nav>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Order ID Input */}
        <div className="mb-6">
          <label className="text-sm mb-2 block" style={{ color: '#9ca3af' }}>
            Order ID
          </label>
          <input
            type="text"
            value={manualOrderId}
            onChange={(e) => setManualOrderId(e.target.value)}
            placeholder="Enter order ID (e.g., ORD-1234567890-abc123)"
            className="w-full px-4 py-3 rounded-lg"
            style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255, 90, 0, 0.2)', color: '#e5e7eb' }}
          />
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Enter the order ID you want to split
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm mb-2 block" style={{ color: '#9ca3af' }}>
              Number of People
            </label>
            <div className="flex items-center gap-4">
              <Users className="w-5 h-5" style={{ color: '#ff5a00' }} />
              <input
                type="number"
                min="2"
                max="20"
                value={ways}
                onChange={(e) => setWays(parseInt(e.target.value) || 2)}
                className="flex-1 px-4 py-3 rounded-lg"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255, 90, 0, 0.2)', color: '#e5e7eb' }}
              />
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Split between 2-20 people
            </p>
          </div>

          <button
            onClick={handleSplit}
            disabled={loading}
            className="w-full px-6 py-3 rounded-lg text-white font-bold transition disabled:opacity-50"
            style={{ backgroundColor: '#ff5a00' }}
          >
            {loading ? 'Calculating...' : 'Split Bill'}
          </button>

          {error && (
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
              }}
            >
              <p style={{ color: '#ef4444' }}>{error}</p>
            </div>
          )}

          {result && (
            <div
              className="p-6 rounded-lg border"
              style={{
                backgroundColor: 'rgba(15, 15, 15, 0.5)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Check className="w-5 h-5" style={{ color: '#10b981' }} />
                <h3 className="text-lg font-bold" style={{ color: '#e5e7eb' }}>
                  Split Complete
                </h3>
              </div>
              
              <div className="mb-4 p-4 rounded" style={{ backgroundColor: 'rgba(255, 90, 0, 0.1)' }}>
                <p style={{ color: '#9ca3af' }}>Total Amount</p>
                <p className="text-2xl font-bold" style={{ color: '#ff5a00' }}>
                  ${result.total}
                </p>
              </div>

              <div>
                <p className="text-sm mb-2" style={{ color: '#9ca3af' }}>
                  Each person pays:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {result.shares.map((share: string, index: number) => (
                    <div
                      key={index}
                      className="p-3 rounded text-center"
                      style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                    >
                      <p className="text-sm" style={{ color: '#9ca3af' }}>Person {index + 1}</p>
                      <p className="text-lg font-bold" style={{ color: '#10b981' }}>
                        ${share}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-3 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                <p className="text-xs" style={{ color: '#6b7280' }}>
                  All shares sum exactly to the total with maximum difference of $0.01
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SplitPage
