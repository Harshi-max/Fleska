export interface AnalyticsResponse {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  topItems: Array<{
    sku: string
    quantity: number
    revenue: number
  }>
  hourlyMetrics: Array<{
    hour: number
    orders: number
    revenue: number
  }>
  dateRange: {
    start: string
    end: string
  }
}
