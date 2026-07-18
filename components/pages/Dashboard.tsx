'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Settings, Home, Clock } from 'lucide-react'

interface DashboardProps {
  onNavigate: (page: string) => void
}

// QR Code Display Component
const QRCodeDisplay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedTable, setSelectedTable] = useState(2)
  const [qrValue, setQrValue] = useState('https://fleksa.restaurant/order?table=2')

  useEffect(() => {
    // Generate QR code using canvas
    if (canvasRef.current && typeof window !== 'undefined') {
      import('qr-code-styling').then((QRCodeStyling) => {
        const qrCode = new QRCodeStyling.default({
          width: 180,
          height: 180,
          data: qrValue,
          image: 'https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg',
          dotsOptions: {
            color: '#000000',
            type: 'rounded',
          },
          backgroundOptions: {
            color: '#ffffff',
          },
          cornersSquareOptions: {
            type: 'extra-rounded',
          },
          margin: 10,
        })
        qrCode.append(canvasRef.current!)
      })
    }
  }, [qrValue])

  const handleTableChange = (table: number) => {
    setSelectedTable(table)
    setQrValue(`https://fleksa.restaurant/order?table=${table}`)
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center">
      <h3 className="text-lg font-bold mb-4">QR Order & Pay</h3>
      <div className="bg-white p-4 rounded-lg mb-4 flex items-center justify-center" style={{ width: 200, height: 200 }}>
        <canvas ref={canvasRef} />
      </div>
      <p className="text-sm text-gray-400 text-center mb-4">Scan to order and pay</p>
      
      {/* Table Selection */}
      <div className="mb-4">
        <label className="text-xs text-gray-500 mb-2 block">Select Table:</label>
        <div className="flex gap-2 flex-wrap justify-center">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((table) => (
            <button
              key={table}
              onClick={() => handleTableChange(table)}
              className={`px-3 py-1 rounded text-sm transition ${
                selectedTable === table
                  ? 'bg-yellow-500 text-black font-bold'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {table}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500">Table {selectedTable}</p>
      <p className="text-xs text-green-400 mt-2">● Payment Ready</p>
    </div>
  )
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 18736.65,
    orders: 1243,
    newCustomers: 356,
    avgOrderValue: 23.45,
  })

  const [revenueData, setRevenueData] = useState([
    { date: 'May 20', revenue: 2400 },
    { date: 'May 21', revenue: 2700 },
    { date: 'May 22', revenue: 3200 },
    { date: 'May 23', revenue: 2900 },
    { date: 'May 24', revenue: 3500 },
    { date: 'May 25', revenue: 4100 },
    { date: 'May 26', revenue: 3800 },
  ])

  const [orderChannels] = useState([
    { name: 'Online', value: 45 },
    { name: 'Dine-In', value: 30 },
    { name: 'Pickup', value: 20 },
    { name: 'QR Order', value: 5 },
  ])

  const [recentOrders] = useState([
    { id: '#257', channel: 'Online', time: '15 mins', amount: '$42.37', status: 'Preparing' },
    { id: '#256', channel: 'QR Order', time: '25 mins', amount: '$36.19', status: 'Completed' },
    { id: '#255', channel: 'Online', time: '45 mins', amount: '$28.50', status: 'Completed' },
  ])

  const [upcomingReservations] = useState([
    { time: '12:30 PM', table: 'Table 4', guests: '4 Guests', name: 'Sarah Jefferson' },
    { time: '1:00 PM', table: 'Table 2', guests: '2 Guests', name: 'Mia Khalifa' },
    { time: '3:00 PM', table: 'Table 7', guests: '6 Guests', name: 'Sarah Jefferson' },
  ])

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        orders: prev.orders + Math.floor(Math.random() * 3),
        totalRevenue: prev.totalRevenue + Math.random() * 100,
      }))

      setRevenueData((prev) => [
        ...prev.slice(1),
        { date: `May ${Math.floor(Math.random() * 31)}`, revenue: Math.floor(Math.random() * 5000 + 2000) },
      ])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 bg-black/60 border-b border-gray-700">
        <div className="flex items-center gap-2 text-2xl font-bold text-yellow-500">
          🍱 FLEKSA
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => onNavigate('landing')}
            className="px-4 py-2 hover:bg-gray-800 rounded-lg transition flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
          <button
            onClick={() => onNavigate('orders')}
            className="px-4 py-2 hover:bg-gray-800 rounded-lg transition"
          >
            Orders
          </button>
          <button className="px-4 py-2 hover:bg-gray-800 rounded-lg transition">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800/50 border-r border-gray-700 p-6">
          <h3 className="font-bold text-xl mb-6">Dashboard</h3>
          <div className="text-sm text-gray-400 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            May 20 - May 26, 2024
          </div>
          <div className="space-y-3 text-sm">
            <div className="bg-yellow-500/20 border border-yellow-600 px-3 py-2 rounded cursor-pointer">
              Dashboard
            </div>
            <div className="hover:bg-gray-700/50 px-3 py-2 rounded cursor-pointer">Orders</div>
            <div className="hover:bg-gray-700/50 px-3 py-2 rounded cursor-pointer">Customers</div>
            <div className="hover:bg-gray-700/50 px-3 py-2 rounded cursor-pointer">Marketing</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Metrics Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Revenue', value: `$${metrics.totalRevenue.toFixed(2)}`, change: '+24.6%', time: 'vs last 7 days' },
              { label: 'Orders', value: metrics.orders.toLocaleString(), change: '+18%', time: 'vs last 7 days' },
              { label: 'New Customers', value: metrics.newCustomers.toLocaleString(), change: '-12.3%', time: 'vs last 7 days' },
              { label: 'Avg. Order Value', value: `$${metrics.avgOrderValue.toFixed(2)}`, change: '+10.3%', time: 'vs last 7 days' },
            ].map((metric, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">{metric.label}</p>
                <p className="text-3xl font-bold mb-2">{metric.value}</p>
                <div className="flex justify-between text-xs">
                  <span className="text-green-400">{metric.change}</span>
                  <span className="text-gray-500">{metric.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts and QR Section */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Revenue Chart */}
            <div className="md:col-span-2 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Revenue Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#FBBF24" dot={{ fill: '#FBBF24' }} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* QR Code Section */}
            <QRCodeDisplay />
          </div>

          {/* Orders by Channel and Recent Orders */}
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {/* Orders by Channel */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Orders by Channel</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={orderChannels}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {orderChannels.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                <p className="text-2xl font-bold text-yellow-500">{metrics.orders.toLocaleString()}</p>
                <p className="text-gray-400">Total Orders</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Recent Orders</h3>
                <a href="#" className="text-blue-400 text-sm hover:underline">
                  View all
                </a>
              </div>
              <div className="space-y-3">
                {recentOrders.map((order, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-gray-700/30 rounded">
                    <div>
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-sm text-gray-400">{order.channel} • {order.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{order.amount}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.status === 'Completed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Reservations */}
          <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Upcoming Reservations</h3>
            <div className="space-y-3">
              {upcomingReservations.map((res, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-gray-700/30 rounded">
                  <div className="flex items-center gap-4">
                    <div className="text-yellow-500 font-bold">{res.time}</div>
                    <div>
                      <p className="font-semibold">{res.table}</p>
                      <p className="text-sm text-gray-400">{res.guests}</p>
                    </div>
                  </div>
                  <p className="text-gray-400">{res.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
