'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, Star, RefreshCw } from 'lucide-react'
import { farcasterApiService, TraderProfile } from '@/lib/farcasterApi'
import { useState, useEffect } from 'react'

export function TopTraders() {
  const [topTraders, setTopTraders] = useState<TraderProfile[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTraders = async () => {
    try {
      setLoading(true)
      const traders = await farcasterApiService.getTopTraders(10)
      setTopTraders(traders)
    } catch (error) {
      console.error('Error fetching traders:', error)
      // Fallback to mock data
      setTopTraders([
        {
          fid: 1,
          username: 'crypto_king',
          displayName: 'CryptoKing',
          pfpUrl: '👑',
          bio: 'Professional crypto trader',
          custodyAddress: '0x1234...5678',
          tradingStats: {
            totalReturn: 45.2,
            winRate: 78.5,
            totalTrades: 156,
            followers: 2847,
            riskScore: 7
          },
          recentTrades: [],
          isVerified: true,
          lastActive: '2 hours ago'
        },
        {
          fid: 2,
          username: 'defi_master',
          displayName: 'DeFiMaster',
          pfpUrl: '⚡',
          bio: 'DeFi yield farming expert',
          custodyAddress: '0x2345...6789',
          tradingStats: {
            totalReturn: 38.7,
            winRate: 72.1,
            totalTrades: 89,
            followers: 1923,
            riskScore: 8
          },
          recentTrades: [],
          isVerified: true,
          lastActive: '1 hour ago'
        },
        {
          fid: 3,
          username: 'nft_trader',
          displayName: 'NFTTrader',
          pfpUrl: '🎨',
          bio: 'NFT flipper and collector',
          custodyAddress: '0x3456...7890',
          tradingStats: {
            totalReturn: 32.1,
            winRate: 68.9,
            totalTrades: 203,
            followers: 1456,
            riskScore: 9
          },
          recentTrades: [],
          isVerified: false,
          lastActive: '3 hours ago'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTraders()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Top Traders</h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={fetchTraders}
            disabled={loading}
            className="text-sm text-primary hover:underline flex items-center space-x-1"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading traders...</p>
          </div>
        ) : (
          topTraders.map((trader, index) => (
            <motion.div
              key={trader.fid}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="trading-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-lg">
                    {trader.pfpUrl}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <h3 className="font-semibold">{trader.displayName}</h3>
                      {trader.isVerified && <Star className="w-4 h-4 text-blue-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">@{trader.username}</p>
                    <p className="text-xs text-muted-foreground">{trader.bio}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-600">+{trader.tradingStats.totalReturn.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{trader.tradingStats.followers.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Win Rate: {trader.tradingStats.winRate.toFixed(1)}%
                    </p>
                  </div>
                  
                  <button className="trading-button">
                    Follow
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
