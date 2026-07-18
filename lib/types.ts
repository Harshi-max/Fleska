export interface DailyReport {
  date: string
  revenue: number
  orders: number
  avgOrderValue: number
  topItems: { name: string; quantity: number }[]
}

export interface Order {
  id: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: Date
}

export interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  image?: string
  description?: string
}

export interface Table {
  id: string
  number: number
  capacity: number
  status: 'available' | 'occupied' | 'reserved'
  orderId?: string
}

export interface Staff {
  id: string
  name: string
  role: 'manager' | 'waiter' | 'chef' | 'cashier'
  performanceScore: number
}

export interface Inventory {
  id: string
  name: string
  quantity: number
  unit: string
  minLevel: number
  category: string
}
