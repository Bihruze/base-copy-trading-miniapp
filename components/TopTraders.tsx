'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, Star } from 'lucide-react'

export function TopTraders() {
  const topTraders = [
    {
      id: 1,
      name: 'CryptoKing',
      username: '@crypto_king',
      avatar: '👑',
      performance: 45.2,
      followers: 2847,
      isFollowing: false
    },
    {
      id: 2,
      name: 'DeFiMaster',
      username: '@defi_master',
      avatar: '⚡',
      performance: 38.7,
      followers: 1923,
      isFollowing: true
    },
    {
      id: 3,
      name: 'NFTTrader',
      username: '@nft_trader',
      avatar: '🎨',
      performance: 32.1,
      followers: 1456,
      isFollowing: false
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Top Traders</h2>
        <button className="text-sm text-base-primary hover:underline">
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {topTraders.map((trader, index) => (
          <motion.div
            key={trader.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="trading-card"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-base-primary/10 rounded-full text-lg">
                  {trader.avatar}
                </div>
                <div>
                  <h3 className="font-semibold">{trader.name}</h3>
                  <p className="text-sm text-muted-foreground">{trader.username}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-600">+{trader.performance}%</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{trader.followers.toLocaleString()}</span>
                  </div>
                </div>
                
                <button
                  className={`p-2 rounded-full transition-colors ${
                    trader.isFollowing
                      ? 'bg-base-primary text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <Star className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
