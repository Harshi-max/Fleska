'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ReportPage from '@/components/pages/ReportPage'
import { useRealtimeStore } from '@/lib/realtime-store'

export default function ReportPageRoute() {
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

  return (
    <ReportPage 
      onNavigate={(page) => {
        if (page === 'landing') {
          router.push('/')
        }
      }} 
    />
  )
}
