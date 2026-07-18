export interface MenuItem {
  sku: string
  name: string
  price: number
}

export interface OrderItem {
  sku: string
  quantity: number
}

export interface FeeCalculation {
  subtotal: string
  card_fee: string
  convenience_fee: string
  total: string
  invariant_check: {
    passed: boolean
    error?: string
  }
}

// Convert dollars to cents
export const toCents = (dollars: string | number): number => {
  const num = typeof dollars === 'string' ? parseFloat(dollars) : dollars
  return Math.round(num * 100)
}

// Convert cents to dollars
export const fromCents = (cents: number): string => {
  return (cents / 100).toFixed(2)
}

// Validate order items exist in menu
export const validateItems = (items: OrderItem[], menu: MenuItem[]): void => {
  const menuSkus = new Set(menu.map(m => m.sku))
  
  for (const item of items) {
    if (!menuSkus.has(item.sku)) {
      throw new Error(`Item with SKU ${item.sku} not found in menu`)
    }
    if (item.quantity <= 0) {
      throw new Error(`Quantity must be greater than 0 for SKU ${item.sku}`)
    }
  }
}

// Calculate fees for an order
export const calculateFees = (
  items: OrderItem[],
  menu: MenuItem[],
  paymentType: string,
  tipStr: string = '0.00',
  discountStr: string = '0.00'
): FeeCalculation => {
  try {
    const menuMap = new Map(menu.map(m => [m.sku, m]))
    
    // Calculate subtotal in cents
    let subtotalCents = 0
    for (const item of items) {
      const menuItem = menuMap.get(item.sku)
      if (!menuItem) {
        throw new Error(`Item ${item.sku} not found in menu`)
      }
      subtotalCents += toCents(menuItem.price) * item.quantity
    }

    // Apply discount
    const discountCents = toCents(discountStr)
    subtotalCents = Math.max(0, subtotalCents - discountCents)

    // Calculate card fee (2.9% + $0.30)
    const cardFeeCents = paymentType === 'CARD' ? Math.ceil(subtotalCents * 0.029) + 30 : 0

    // Convenience fee (1%)
    const convenienceFeeCents = Math.ceil(subtotalCents * 0.01)

    // Calculate total
    const tipCents = toCents(tipStr)
    const totalCents = subtotalCents + cardFeeCents + convenienceFeeCents + tipCents

    // Invariant check: all values must be non-negative
    const passed = subtotalCents >= 0 && cardFeeCents >= 0 && convenienceFeeCents >= 0 && tipCents >= 0

    return {
      subtotal: fromCents(subtotalCents),
      card_fee: fromCents(cardFeeCents),
      convenience_fee: fromCents(convenienceFeeCents),
      total: fromCents(totalCents),
      invariant_check: {
        passed,
        error: passed ? undefined : 'Invalid fee calculation'
      }
    }
  } catch (error) {
    throw error
  }
}
