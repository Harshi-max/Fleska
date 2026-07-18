import { create } from 'zustand'
import type { User } from './auth-service'

interface RealtimeStore {
  user: User | null
  setUser: (user: User | null) => void
  startPolling: () => void
  stopPolling: () => void
}

export const useRealtimeStore = create<RealtimeStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  startPolling: () => {},
  stopPolling: () => {},
}))

export const pollRealtimeData = async () => {
  // Mock real-time data polling
  return {
    revenue: Math.random() * 50000,
    orders: Math.floor(Math.random() * 1000),
    customers: Math.floor(Math.random() * 500),
  }
}
