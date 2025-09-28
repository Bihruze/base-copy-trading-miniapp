'use client'

import { useState, useEffect } from 'react'

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [marketData, setMarketData] = useState<Record<string, any>>({})
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    // Mock WebSocket connection
    setIsConnected(true)
  }, [])

  const subscribeToMarket = (symbol: string) => {
    // Mock market data
    setMarketData(prev => ({
      ...prev,
      [symbol]: {
        price: 2450.50,
        change: 2.45,
        volume: '12.5B'
      }
    }))
  }

  const unsubscribeFromMarket = (symbol: string) => {
    setMarketData(prev => {
      const newData = { ...prev }
      delete newData[symbol]
      return newData
    })
  }

  const sendTradeSignal = (traderAddress: string, tradeData: any) => {
    console.log('Trade signal sent:', { traderAddress, tradeData })
  }

  const sendCopyTrade = (tradeData: any) => {
    console.log('Copy trade sent:', tradeData)
  }

  return {
    isConnected,
    marketData,
    notifications,
    subscribeToMarket,
    unsubscribeFromMarket,
    sendTradeSignal,
    sendCopyTrade,
  }
}