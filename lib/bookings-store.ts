export interface Booking {
  id: string
  name: string
  email: string
  phone?: string
  date: string
  time: string
  guests: number
  duration?: number
  table_id?: string
  specialRequests?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

class BookingsStore {
  private bookings: Map<string, Booking> = new Map()
  private counter = 0

  createBooking(data: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking {
    const id = `BK-${Date.now()}-${++this.counter}`
    const booking: Booking = {
      ...data,
      id,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    this.bookings.set(id, booking)
    return booking
  }

  getBooking(id: string): Booking | undefined {
    return this.bookings.get(id)
  }

  listBookings(): Booking[] {
    return Array.from(this.bookings.values())
  }

  updateBookingStatus(id: string, status: Booking['status']): Booking | undefined {
    const booking = this.bookings.get(id)
    if (!booking) return undefined

    booking.status = status
    return booking
  }

  cancelBooking(id: string): Booking | undefined {
    const booking = this.bookings.get(id)
    if (!booking) return undefined

    booking.status = 'cancelled'
    return booking
  }
}

export const bookingsStore = new BookingsStore()
