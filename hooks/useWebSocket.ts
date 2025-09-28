'use client'

import { useEffect, useState, useCallback } from 'react'
// import { useAccount } from 'wagmi'
import { websocketService } from '@/lib/websocket'

export function useWebSocket() {
  // const { address } = useAccount()
  const address = '0x1234...5678' // Mock address
  const [isConnected, setIsConnected] = useState(false)
  const [marketData, setMarketData] = useState<any>({})
  const [traderPerformance, setTraderPerformance] = useState<any>({})
  const [copyTrades, setCopyTrades] = useState<any[]>([])
  const [portfolio, setPortfolio] = useState<any>({})
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    websocketService.connect()
    setIsConnected(websocketService.isConnected)

    return () => {
      websocketService.disconnect()
    }
  }, [])

  // Market data subscription
  const subscribeToMarket = useCallback((symbol: string) => {
    websocketService.subscribeToMarketData(symbol, (data) => {
      setMarketData(prev => ({
        ...prev,
        [symbol]: data
      }))
    })
  }, [])

  const unsubscribeFromMarket = useCallback((symbol: string) => {
    websocketService.unsubscribeFromMarketData(symbol)
    setMarketData(prev => {
      const newData = { ...prev }
      delete newData[symbol]
      return newData
    })
  }, [])

  // Trader performance subscription
  const subscribeToTrader = useCallback((traderAddress: string) => {
    websocketService.subscribeToTraderPerformance(traderAddress, (data) => {
      setTraderPerformance(prev => ({
        ...prev,
        [traderAddress]: data
      }))
    })
  }, [])

  const unsubscribeFromTrader = useCallback((traderAddress: string) => {
    websocketService.unsubscribeFromTraderPerformance(traderAddress)
    setTraderPerformance(prev => {
      const newData = { ...prev }
      delete newData[traderAddress]
      return newData
    })
  }, [])

  // Copy trades subscription
  const subscribeToCopyTrades = useCallback(() => {
    if (!address) return

    websocketService.subscribeToCopyTrades(address, (data) => {
      setCopyTrades(prev => [...prev, data])
    })
  }, [address])

  const unsubscribeFromCopyTrades = useCallback(() => {
    if (!address) return

    websocketService.unsubscribeFromCopyTrades(address)
  }, [address])

  // Portfolio subscription
  const subscribeToPortfolio = useCallback(() => {
    if (!address) return

    websocketService.subscribeToPortfolio(address, (data) => {
      setPortfolio(data)
    })
  }, [address])

  const unsubscribeFromPortfolio = useCallback(() => {
    if (!address) return

    websocketService.unsubscribeFromPortfolio(address)
  }, [address])

  // Notifications subscription
  const subscribeToNotifications = useCallback(() => {
    if (!address) return

    websocketService.subscribeToTradeNotifications(address, (data) => {
      setNotifications(prev => [data, ...prev].slice(0, 50)) // Keep last 50 notifications
    })
  }, [address])

  const unsubscribeFromNotifications = useCallback(() => {
    if (!address) return

    websocketService.unsubscribeFromTradeNotifications(address)
  }, [address])

  // Send trade signal
  const sendTradeSignal = useCallback((traderAddress: string, tradeData: any) => {
    websocketService.sendTradeSignal(traderAddress, tradeData)
  }, [])

  // Send copy trade
  const sendCopyTrade = useCallback((tradeData: any) => {
    if (!address) return

    websocketService.sendCopyTrade(address, tradeData)
  }, [address])

  // Auto-subscribe when address changes
  useEffect(() => {
    if (address) {
      subscribeToCopyTrades()
      subscribeToPortfolio()
      subscribeToNotifications()
    }

    return () => {
      unsubscribeFromCopyTrades()
      unsubscribeFromPortfolio()
      unsubscribeFromNotifications()
    }
  }, [address, subscribeToCopyTrades, subscribeToPortfolio, subscribeToNotifications, unsubscribeFromCopyTrades, unsubscribeFromPortfolio, unsubscribeFromNotifications])

  return {
    isConnected,
    marketData,
    traderPerformance,
    copyTrades,
    portfolio,
    notifications,
    subscribeToMarket,
    unsubscribeFromMarket,
    subscribeToTrader,
    unsubscribeFromTrader,
    sendTradeSignal,
    sendCopyTrade,
  }
}
