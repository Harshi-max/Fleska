export interface InventoryItem {
  sku: string
  quantity: number
  lastUpdated: string
}

interface InventoryMovement {
  sku: string
  quantity: number
  type: 'add' | 'deduct'
  timestamp: string
  reason?: string
}

class InventoryStore {
  private inventory: Map<string, InventoryItem> = new Map()
  private movements: InventoryMovement[] = []

  constructor() {
    this.initializeInventory()
  }

  private initializeInventory(): void {
    // Initialize with default stock
    const defaultStock: Record<string, number> = {
      'JUMBO-WINGS': 50,
      'BONELESS-WINGS': 40,
      'CRISPY-WINGS': 45,
      'CHICKEN-CHILLY': 30,
      'CHICKEN-65': 35,
      'CHICKEN-LOLLIPOP': 25,
      'BUTTER-NAAN': 100,
      'GARLIC-NAAN': 100,
      'BIRYANI-COMBO': 20,
      'MASALA-CHAI': 60
    }

    Object.entries(defaultStock).forEach(([sku, quantity]) => {
      this.inventory.set(sku, {
        sku,
        quantity,
        lastUpdated: new Date().toISOString()
      })
    })
  }

  getStock(sku: string): number {
    return this.inventory.get(sku)?.quantity ?? 0
  }

  addStock(sku: string, quantity: number, reason?: string): InventoryItem {
    const current = this.inventory.get(sku) || {
      sku,
      quantity: 0,
      lastUpdated: new Date().toISOString()
    }

    current.quantity += quantity
    current.lastUpdated = new Date().toISOString()
    this.inventory.set(sku, current)

    this.movements.push({
      sku,
      quantity,
      type: 'add',
      timestamp: new Date().toISOString(),
      reason
    })

    return current
  }

  deductStock(sku: string, quantity: number, reason: string = 'order'): InventoryItem {
    const current = this.inventory.get(sku)
    if (!current) {
      throw new Error(`SKU ${sku} not found in inventory`)
    }

    if (current.quantity < quantity) {
      throw new Error(`Insufficient stock for ${sku}. Available: ${current.quantity}, Requested: ${quantity}`)
    }

    current.quantity -= quantity
    current.lastUpdated = new Date().toISOString()
    this.inventory.set(sku, current)

    this.movements.push({
      sku,
      quantity,
      type: 'deduct',
      timestamp: new Date().toISOString(),
      reason
    })

    return current
  }

  listInventory(): InventoryItem[] {
    return Array.from(this.inventory.values())
  }

  getMovements(sku?: string, limit: number = 100): InventoryMovement[] {
    let filtered = this.movements

    if (sku) {
      filtered = filtered.filter(m => m.sku === sku)
    }

    return filtered.slice(-limit)
  }
}

export const inventoryStore = new InventoryStore()
export const inventoryMovementStore = inventoryStore
