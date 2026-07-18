'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import OrdersPage from '@/components/pages/OrdersPage'
import { useRealtimeStore } from '@/lib/realtime-store'

export default function OrdersPageRoute() {
  const router = useRouter()
  const { user } = useRealtimeStore()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return <OrdersPage onNavigate={(page) => {
    if (page === 'landing') {
      router.push('/')
    } else if (page === 'dashboard') {
      router.push('/dashboard')
    } else if (page === 'menu') {
      router.push('/dashboard')
    }
  }} />
}
