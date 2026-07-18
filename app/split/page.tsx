'use client'

import { useRouter } from 'next/navigation'
import SplitPage from '@/components/pages/SplitPage'

export default function SplitPageRoute() {
  const router = useRouter()

  return (
    <SplitPage 
      onNavigate={(page) => {
        if (page === 'landing') {
          router.push('/')
        } else if (page === 'orders') {
          router.push('/orders')
        }
      }} 
    />
  )
}
