'use client'

import { motion } from 'framer-motion'
import { Copy, TrendingUp, TrendingDown, Settings, Pause, Play } from 'lucide-react'

export function ActiveCopies() {
  const activeCopies = [
    {
      id: 1,
      traderName: 'CryptoKing',
      traderAvatar: '👑',
      symbol: 'ETH/USDT',
      side: 'buy',
      amount: 0.5,
      price: 2450.50,
      pnl: 125.30,
      pnlPercent: 5.1,
      isActive: true
    },
    {
      id: 2,
      traderName: 'DeFiMaster',
      traderAvatar: '⚡',
      symbol: 'BTC/USDT',
      side: 'sell',
      amount: 0.1,
      price: 42000.00,
      pnl: -50.20,
      pnlPercent: -1.2,
      isActive: true
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Active Copies</h2>
        <span className="text-sm text-muted-foreground">{activeCopies.length} active</span>
      </div>
      
      {activeCopies.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Copy className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No active copies</p>
          <p className="text-sm">Start following traders to see your copies here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeCopies.map((copy, index) => (
            <motion.div
              key={copy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="trading-card"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-base-primary/10 rounded-full flex items-center justify-center text-lg">
                    {copy.traderAvatar}
                  </div>
                  <div>
                    <h3 className="font-semibold">{copy.traderName}</h3>
                    <p className="text-sm text-muted-foreground">{copy.symbol}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-muted rounded-full">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-muted rounded-full">
                    {copy.isActive ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-semibold">
                    {copy.side.toUpperCase()} {copy.amount} {copy.symbol.split('/')[0]}
                  </p>
                  <p className="text-sm text-muted-foreground">@ ${copy.price.toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">P&L</p>
                  <div className="flex items-center space-x-1">
                    {copy.pnl >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`font-semibold ${copy.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {copy.pnl >= 0 ? '+' : ''}${copy.pnl.toFixed(2)}
                    </span>
                  </div>
                  <p className={`text-sm ${copy.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {copy.pnl >= 0 ? '+' : ''}{copy.pnlPercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
