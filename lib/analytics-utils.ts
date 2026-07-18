export interface Order {
  placed_at: string
  total: string
  items: Array<{ sku: string; quantity: number }>
}

export interface HourlyMetrics {
  hour: number
  orders: number
  revenue: number
}

export interface TopItem {
  sku: string
  quantity: number
  revenue: number
}

export const getDateRangeOrders = (
  orders: Order[],
  startDate: string,
  endDate: string
): Order[] => {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()

  return orders.filter(order => {
    const orderTime = new Date(order.placed_at).getTime()
    return orderTime >= start && orderTime <= end
  })
}

export const calculateHourlyMetrics = (orders: Order[]): HourlyMetrics[] => {
  const metrics = new Map<number, { orders: number; revenue: number }>()

  for (let i = 0; i < 24; i++) {
    metrics.set(i, { orders: 0, revenue: 0 })
  }

  orders.forEach(order => {
    const hour = new Date(order.placed_at).getHours()
    const current = metrics.get(hour) || { orders: 0, revenue: 0 }
    current.orders += 1
    current.revenue += parseFloat(order.total)
    metrics.set(hour, current)
  })

  return Array.from(metrics.entries()).map(([hour, { orders, revenue }]) => ({
    hour,
    orders,
    revenue: Math.round(revenue * 100) / 100
  }))
}

export const getTopItems = (orders: Order[], limit: number = 5): TopItem[] => {
  const items = new Map<string, { quantity: number; revenue: number }>()

  orders.forEach(order => {
    order.items.forEach(item => {
      const current = items.get(item.sku) || { quantity: 0, revenue: 0 }
      current.quantity += item.quantity
      current.revenue += parseFloat(order.total) * (item.quantity / order.items.length)
      items.set(item.sku, current)
    })
  })

  return Array.from(items.entries())
    .map(([sku, { quantity, revenue }]) => ({
      sku,
      quantity,
      revenue: Math.round(revenue * 100) / 100
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}
