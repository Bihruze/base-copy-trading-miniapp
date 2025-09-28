'use client'

import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { Dashboard } from '@/components/Dashboard'
import { LoadingScreen } from '@/components/LoadingScreen'

export default function Home() {
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize the Base Mini App SDK
        await sdk.actions.ready()
        setIsReady(true)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to initialize Base Mini App:', error)
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <main className="min-h-screen bg-background">
      <Dashboard />
    </main>
  )
}
