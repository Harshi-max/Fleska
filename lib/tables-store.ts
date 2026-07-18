export interface Table {
  id: string
  number: number
  capacity: number
  status: 'available' | 'occupied' | 'reserved'
  currentOrder?: string
}

class TablesStore {
  private tables: Map<string, Table> = new Map()

  constructor() {
    this.initializeTables()
  }

  private initializeTables(): void {
    for (let i = 1; i <= 19; i++) {
      const capacity = i <= 4 ? 2 : i <= 12 ? 4 : 6
      this.tables.set(`TBL-${i}`, {
        id: `TBL-${i}`,
        number: i,
        capacity,
        status: 'available'
      })
    }
  }

  getTable(id: string): Table | undefined {
    return this.tables.get(id)
  }

  listTables(): Table[] {
    return Array.from(this.tables.values())
  }

  updateTableStatus(id: string, status: Table['status'], currentOrder?: string): Table | undefined {
    const table = this.tables.get(id)
    if (!table) return undefined

    table.status = status
    table.currentOrder = currentOrder
    return table
  }

  getAvailableTables(): Table[] {
    return Array.from(this.tables.values()).filter(t => t.status === 'available')
  }
}

export const tablesStore = new TablesStore()
