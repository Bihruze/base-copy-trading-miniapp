'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, BarChart3, RefreshCw } from 'lucide-react'
import { priceApiService, PriceData } from '@/lib/priceApi'
import { useState, useEffect } from 'react'

export function MarketOverview() {
  const [marketData, setMarketData] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchMarketData = async () => {
    try {
      setLoading(true)
      const data = await priceApiService.getPriceData(['ETH', 'BTC', 'BASE', 'USDC', 'SOL'])
      setMarketData(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching market data:', error)
      // Fallback to mock data
      setMarketData([
        { symbol: 'ETH', price: 2450.50, change24h: 2.45, changePercent24h: 2.45, volume24h: 12500000000, lastUpdated: Date.now() },
        { symbol: 'BTC', price: 42000.00, change24h: -1.23, changePercent24h: -1.23, volume24h: 8700000000, lastUpdated: Date.now() },
        { symbol: 'SOL', price: 98.75, change24h: 5.67, changePercent24h: 5.67, volume24h: 2100000000, lastUpdated: Date.now() },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMarketData()
    
    // Update every 30 seconds
    const interval = setInterval(fetchMarketData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Market Overview</h2>
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={fetchMarketData}
            disabled={loading}
            className="text-sm text-primary hover:underline flex items-center space-x-1"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {marketData.map((market, index) => (
          <motion.div
            key={market.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="trading-card"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-base-primary/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-base-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{market.symbol}</h3>
                  <p className="text-sm text-muted-foreground">{market.name}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold">${market.price.toLocaleString()}</p>
                <div className="flex items-center space-x-1">
                  {market.change24h >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    market.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {market.change24h >= 0 ? '+' : ''}{market.changePercent24h.toFixed(2)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Vol: ${(market.volume24h / 1000000000).toFixed(1)}B
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
