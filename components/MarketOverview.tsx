'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'

export function MarketOverview() {
  const marketData = [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2450.50,
      change24h: 2.45,
      volume: '12.5B',
      marketCap: '295.2B'
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 42000.00,
      change24h: -1.23,
      volume: '8.7B',
      marketCap: '820.1B'
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      price: 98.75,
      change24h: 5.67,
      volume: '2.1B',
      marketCap: '42.3B'
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Market Overview</h2>
        <button className="text-sm text-base-primary hover:underline">
          View All
        </button>
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
                    {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Vol: {market.volume}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
