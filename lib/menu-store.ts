export interface MenuItem {
  sku: string
  name: string
  price: number
  category: string
  available: boolean
  image?: string
}

class MenuStore {
  private items: Map<string, MenuItem> = new Map()

  constructor() {
    this.initializeMenu()
  }

  private initializeMenu(): void {
    const defaultItems: MenuItem[] = [
      { sku: 'PIZZA_M', name: 'Pizza Margherita', price: 12.99, category: 'Main Course', available: true },
      { sku: 'BURGER_C', name: 'Classic Burger', price: 9.49, category: 'Main Course', available: true },
      { sku: 'FRIES', name: 'Fries', price: 3.33, category: 'Sides', available: true },
      { sku: 'SODA', name: 'Soda', price: 0.10, category: 'Beverages', available: true },
      { sku: 'WINGS_6', name: 'Wings (6pc)', price: 7.77, category: 'Appetizers', available: true },
      { sku: 'SALAD_G', name: 'Greek Salad', price: 10.01, category: 'Salads', available: true },
      { sku: 'ESPRESSO', name: 'Espresso', price: 1.99, category: 'Beverages', available: true },
      { sku: 'TIRAMISU', name: 'Tiramisu', price: 6.66, category: 'Desserts', available: true },
    ]

    defaultItems.forEach(item => {
      this.items.set(item.sku, item)
    })
  }

  getItem(sku: string): MenuItem | undefined {
    return this.items.get(sku)
  }

  listItems(): MenuItem[] {
    return Array.from(this.items.values())
  }

  updateItem(sku: string, updates: Partial<MenuItem>): MenuItem | undefined {
    const item = this.items.get(sku)
    if (!item) return undefined

    Object.assign(item, updates)
    return item
  }

  addItem(item: MenuItem): MenuItem {
    this.items.set(item.sku, item)
    return item
  }

  removeItem(sku: string): boolean {
    return this.items.delete(sku)
  }

  listByCategory(category: string): MenuItem[] {
    return Array.from(this.items.values()).filter(item => item.category === category)
  }
}

export const menuStore = new MenuStore()
