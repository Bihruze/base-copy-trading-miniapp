'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Users, Copy, Star, MoreHorizontal } from 'lucide-react'

export function TraderCard() {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  
  // Mock data
  const trader = {
    name: 'CryptoKing',
    username: '@crypto_king',
    avatar: '👑',
    performance: {
      totalReturn: 45.2,
      winRate: 78.5,
      maxDrawdown: -12.3,
      totalTrades: 156,
      followers: 2847
    },
    riskLevel: 'medium' as const,
    lastActive: '2 hours ago'
  }

  const isPositive = trader.performance.totalReturn >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="trading-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-base-primary/10 rounded-full flex items-center justify-center text-2xl">
            {trader.avatar}
          </div>
          <div>
            <h3 className="font-semibold">{trader.name}</h3>
            <p className="text-sm text-muted-foreground">{trader.username}</p>
            <p className="text-xs text-muted-foreground">Active {trader.lastActive}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-muted rounded-full">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Return</p>
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{trader.performance.totalReturn}%
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Win Rate</p>
          <p className="font-semibold">{trader.performance.winRate}%</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Followers</p>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold">{trader.performance.followers.toLocaleString()}</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Risk Level</p>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            trader.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
            trader.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {trader.riskLevel.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
            isFollowing
              ? 'bg-base-primary text-white'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>{isFollowing ? 'Following' : 'Follow'}</span>
        </button>
        
        <button
          onClick={() => setIsCopying(!isCopying)}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
            isCopying
              ? 'bg-base-secondary text-white'
              : 'bg-base-primary text-white hover:bg-base-primary/90'
          }`}
        >
          <Copy className="w-4 h-4" />
          <span>{isCopying ? 'Copying' : 'Copy'}</span>
        </button>
      </div>
    </motion.div>
  )
}
