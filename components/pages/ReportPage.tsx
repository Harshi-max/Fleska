'use client'

import React, { useState } from 'react'
import { Home, Calendar, DollarSign, FileText } from 'lucide-react'

interface ReportPageProps {
  onNavigate: (page: string) => void
}

const ReportPage: React.FC<ReportPageProps> = ({ onNavigate }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [timezone, setTimezone] = useState('America/Chicago')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [report, setReport] = useState<any>(null)

  const timezones = [
    'America/Chicago',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/Berlin',
    'Europe/London',
    'Asia/Tokyo',
    'UTC'
  ]

  const handleFetchReport = async () => {
    setLoading(true)
    setError('')
    setReport(null)

    try {
      const response = await fetch(`/api/reports/daily?date=${date}&tz=${timezone}`)
      
      if (response.ok) {
        const data = await response.json()
        setReport(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch report')
      }
    } catch (err) {
      setError('Error fetching report')
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
        <h1 className="text-2xl font-bold" style={{ color: '#ff5a00' }}>
          Daily Report
        </h1>
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
        <div className="space-y-6">
          {/* Date and Timezone Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm mb-2 block" style={{ color: '#9ca3af' }}>
                Date
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" style={{ color: '#ff5a00' }} />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg"
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255, 90, 0, 0.2)', color: '#e5e7eb' }}
                />
              </div>
            </div>
            <div>
              <label className="text-sm mb-2 block" style={{ color: '#9ca3af' }}>
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255, 90, 0, 0.2)', color: '#e5e7eb' }}
              >
                {timezones.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleFetchReport}
            disabled={loading}
            className="w-full px-6 py-3 rounded-lg text-white font-bold transition disabled:opacity-50"
            style={{ backgroundColor: '#ff5a00' }}
          >
            {loading ? 'Loading...' : 'Generate Report'}
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

          {report && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <div
                  className="p-6 rounded-lg border"
                  style={{
                    backgroundColor: 'rgba(15, 15, 15, 0.5)',
                    borderColor: 'rgba(255, 90, 0, 0.2)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5" style={{ color: '#ff5a00' }} />
                    <span style={{ color: '#9ca3af' }}>Order Count</span>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: '#ff5a00' }}>
                    {report.order_count}
                  </p>
                </div>

                <div
                  className="p-6 rounded-lg border"
                  style={{
                    backgroundColor: 'rgba(15, 15, 15, 0.5)',
                    borderColor: 'rgba(255, 90, 0, 0.2)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-5 h-5" style={{ color: '#10b981' }} />
                    <span style={{ color: '#9ca3af' }}>Gross Total</span>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: '#10b981' }}>
                    ${report.gross_total}
                  </p>
                </div>

                <div
                  className="p-6 rounded-lg border"
                  style={{
                    backgroundColor: 'rgba(15, 15, 15, 0.5)',
                    borderColor: 'rgba(255, 90, 0, 0.2)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-5 h-5" style={{ color: '#3b82f6' }} />
                    <span style={{ color: '#9ca3af' }}>Card Fees</span>
                  </div>
                  <p className="text-3xl font-bold" style={{ color: '#3b82f6' }}>
                    ${report.card_fees_total}
                  </p>
                </div>
              </div>

              {/* Report Info */}
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: 'rgba(15, 15, 15, 0.5)',
                  borderColor: 'rgba(255, 90, 0, 0.2)',
                }}
              >
                <h3 className="text-lg font-bold mb-3" style={{ color: '#e5e7eb' }}>
                  Report Details
                </h3>
                <div className="space-y-2 text-sm">
                  <p style={{ color: '#9ca3af' }}>
                    <span style={{ color: '#e5e7eb' }}>Date:</span> {report.date}
                  </p>
                  <p style={{ color: '#9ca3af' }}>
                    <span style={{ color: '#e5e7eb' }}>Timezone:</span> {report.tz}
                  </p>
                </div>
              </div>

              {/* Orders List */}
              {report.orders && report.orders.length > 0 && (
                <div
                  className="p-6 rounded-lg border"
                  style={{
                    backgroundColor: 'rgba(15, 15, 15, 0.5)',
                    borderColor: 'rgba(255, 90, 0, 0.2)',
                  }}
                >
                  <h3 className="text-lg font-bold mb-4" style={{ color: '#e5e7eb' }}>
                    Orders for {report.date}
                  </h3>
                  <div className="space-y-2">
                    {report.orders.map((order: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 rounded"
                        style={{ backgroundColor: 'rgba(255, 90, 0, 0.05)' }}
                      >
                        <div>
                          <p className="text-sm font-bold" style={{ color: '#e5e7eb' }}>
                            {order.id}
                          </p>
                          <p className="text-xs" style={{ color: '#9ca3af' }}>
                            {new Date(order.placed_at).toLocaleString()}
                          </p>
                        </div>
                        <p className="font-bold" style={{ color: '#10b981' }}>
                          ${order.total}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.orders && report.orders.length === 0 && (
                <div
                  className="p-6 rounded-lg border text-center"
                  style={{
                    backgroundColor: 'rgba(15, 15, 15, 0.5)',
                    borderColor: 'rgba(255, 90, 0, 0.2)',
                  }}
                >
                  <p style={{ color: '#9ca3af' }}>No orders found for this date</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportPage
