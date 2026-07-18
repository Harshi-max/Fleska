import { create } from 'zustand'

export interface OrderItem {
  sku: string
  quantity: number
}

export interface Order {
  id: string
  placed_at: string
  shop_id: string
  items: OrderItem[]
  payment_type: 'CARD' | 'CASH'
  subtotal: string
  card_fee: string
  convenience_fee: string
  dual_pricing_surcharge: string
  tip: string
  discount: string
  total: string
  status: 'pending' | 'preparing' | 'ready' | 'completed'
}

interface OrderStore {
  orders: Map<string, Order>
  createOrder: (orderData: Omit<Order, 'id' | 'status'>) => Order
  getOrder: (id: string) => Order | undefined
  listOrders: (shopId: string) => Order[]
  updateOrderStatus: (id: string, status: Order['status']) => Order | undefined
  listAllOrders: () => Order[]
}

const generateId = (): string => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: new Map(),

  createOrder: (orderData: Omit<Order, 'id' | 'status'>) => {
    const order: Order = {
      ...orderData,
      id: generateId(),
      status: 'pending'
    }

    const { orders } = get()
    orders.set(order.id, order)
    set({ orders: new Map(orders) })
    return order
  },

  getOrder: (id: string) => {
    const { orders } = get()
    return orders.get(id)
  },

  listOrders: (shopId: string) => {
    const { orders } = get()
    return Array.from(orders.values()).filter(o => o.shop_id === shopId)
  },

  updateOrderStatus: (id: string, status: Order['status']) => {
    const { orders } = get()
    const order = orders.get(id)

    if (!order) return undefined

    order.status = status
    orders.set(id, order)
    set({ orders: new Map(orders) })
    return order
  },

  listAllOrders: () => {
    const { orders } = get()
    return Array.from(orders.values())
  }
}))

// Legacy class for backward compatibility
class OrderStoreClass {
  private orders: Map<string, Order> = new Map()

  constructor() {
    // Try to load from global storage if available
    if (typeof global !== 'undefined' && (global as any).orderStoreData) {
      this.orders = new Map((global as any).orderStoreData)
    }
  }

  private persistToGlobal() {
    if (typeof global !== 'undefined') {
      (global as any).orderStoreData = Array.from(this.orders.entries())
    }
  }

  private generateId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`
  }

  createOrder(orderData: Omit<Order, 'id' | 'status'>): Order {
    const order: Order = {
      ...orderData,
      id: this.generateId(),
      status: 'pending'
    }

    this.orders.set(order.id, order)
    this.persistToGlobal()
    return order
  }

  getOrder(id: string): Order | undefined {
    return this.orders.get(id)
  }

  listOrders(shopId: string): Order[] {
    return Array.from(this.orders.values()).filter(o => o.shop_id === shopId)
  }

  updateOrderStatus(id: string, status: Order['status']): Order | undefined {
    const order = this.orders.get(id)

    if (!order) return undefined

    order.status = status
    this.persistToGlobal()
    return order
  }

  listAllOrders(): Order[] {
    return Array.from(this.orders.values())
  }
}

export const orderStore = new OrderStoreClass()

