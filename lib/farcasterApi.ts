// Farcaster API integration for trader discovery
export interface FarcasterUser {
  fid: number
  username: string
  displayName: string
  pfpUrl: string
  followerCount: number
  followingCount: number
  isVerified: boolean
  bio: string
  custodyAddress: string
}

export interface FarcasterCast {
  hash: string
  text: string
  timestamp: string
  author: FarcasterUser
  embeds?: any[]
  reactions?: {
    likes: number
    recasts: number
    replies: number
  }
}

export interface TraderProfile {
  fid: number
  username: string
  displayName: string
  pfpUrl: string
  bio: string
  custodyAddress: string
  tradingStats: {
    totalReturn: number
    winRate: number
    totalTrades: number
    followers: number
    riskScore: number
  }
  recentTrades: any[]
  isVerified: boolean
  lastActive: string
}

class FarcasterApiService {
  private baseUrl = 'https://api.warpcast.com/v2'
  private apiKey = process.env.NEXT_PUBLIC_FARCASTER_API_KEY || ''

  // Get top traders from Farcaster based on trading activity
  async getTopTraders(limit: number = 20): Promise<TraderProfile[]> {
    try {
      // In a real implementation, this would query Farcaster API
      // For now, return mock data with realistic profiles
      const mockTraders: TraderProfile[] = [
        {
          fid: 12345,
          username: 'crypto_king',
          displayName: 'Crypto King 👑',
          pfpUrl: 'https://i.imgur.com/avatar1.png',
          bio: 'Professional crypto trader | 5+ years experience | Sharing alpha daily',
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
          fid: 23456,
          username: 'defi_master',
          displayName: 'DeFi Master 🚀',
          pfpUrl: 'https://i.imgur.com/avatar2.png',
          bio: 'DeFi yield farming expert | Building on Base | High risk, high reward',
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
          fid: 34567,
          username: 'nft_trader',
          displayName: 'NFT Trader 🎨',
          pfpUrl: 'https://i.imgur.com/avatar3.png',
          bio: 'NFT flipper | Blue chip collector | Market sentiment expert',
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
        },
        {
          fid: 45678,
          username: 'diamond_hands',
          displayName: 'Diamond Hands 💎',
          pfpUrl: 'https://i.imgur.com/avatar4.png',
          bio: 'Long-term investor | Rarely sells | Focus on fundamentals',
          custodyAddress: '0x4567...8901',
          tradingStats: {
            totalReturn: 28.9,
            winRate: 85.2,
            totalTrades: 67,
            followers: 3245,
            riskScore: 4
          },
          recentTrades: [],
          isVerified: true,
          lastActive: '30 minutes ago'
        },
        {
          fid: 56789,
          username: 'base_builder',
          displayName: 'Base Builder 🏗️',
          pfpUrl: 'https://i.imgur.com/avatar5.png',
          bio: 'Base ecosystem builder | Early adopter | Community focused',
          custodyAddress: '0x5678...9012',
          tradingStats: {
            totalReturn: 41.3,
            winRate: 75.8,
            totalTrades: 124,
            followers: 2156,
            riskScore: 6
          },
          recentTrades: [],
          isVerified: true,
          lastActive: '1 hour ago'
        }
      ]

      return mockTraders.slice(0, limit)
    } catch (error) {
      console.error('Error fetching top traders:', error)
      return []
    }
  }

  // Get trader's recent casts
  async getTraderCasts(fid: number, limit: number = 10): Promise<FarcasterCast[]> {
    try {
      // Mock implementation
      return [
        {
          hash: '0xabc123',
          text: 'Just opened a long position on $ETH. Target: $2000 🚀',
          timestamp: new Date().toISOString(),
          author: {
            fid,
            username: 'trader',
            displayName: 'Trader',
            pfpUrl: '',
            followerCount: 1000,
            followingCount: 500,
            isVerified: true,
            bio: '',
            custodyAddress: ''
          },
          reactions: {
            likes: 45,
            recasts: 12,
            replies: 8
          }
        }
      ]
    } catch (error) {
      console.error('Error fetching trader casts:', error)
      return []
    }
  }

  // Get trader's trading history
  async getTraderTradingHistory(address: string): Promise<any[]> {
    try {
      // Mock implementation - in real app, fetch from blockchain
      return [
        {
          id: '1',
          type: 'buy',
          asset: 'ETH',
          amount: 1.5,
          price: 1850.50,
          timestamp: Date.now() - 3600000,
          pnl: 125.30
        },
        {
          id: '2',
          type: 'sell',
          asset: 'BTC',
          amount: 0.1,
          price: 27500.00,
          timestamp: Date.now() - 7200000,
          pnl: -50.20
        }
      ]
    } catch (error) {
      console.error('Error fetching trading history:', error)
      return []
    }
  }

  // Search traders by username or address
  async searchTraders(query: string): Promise<TraderProfile[]> {
    try {
      const allTraders = await this.getTopTraders(50)
      return allTraders.filter(trader => 
        trader.username.toLowerCase().includes(query.toLowerCase()) ||
        trader.displayName.toLowerCase().includes(query.toLowerCase()) ||
        trader.custodyAddress.toLowerCase().includes(query.toLowerCase())
      )
    } catch (error) {
      console.error('Error searching traders:', error)
      return []
    }
  }

  // Get trader's followers
  async getTraderFollowers(fid: number): Promise<FarcasterUser[]> {
    try {
      // Mock implementation
      return []
    } catch (error) {
      console.error('Error fetching followers:', error)
      return []
    }
  }

  // Follow a trader
  async followTrader(fid: number): Promise<boolean> {
    try {
      // Mock implementation
      console.log(`Following trader ${fid}`)
      return true
    } catch (error) {
      console.error('Error following trader:', error)
      return false
    }
  }

  // Unfollow a trader
  async unfollowTrader(fid: number): Promise<boolean> {
    try {
      // Mock implementation
      console.log(`Unfollowing trader ${fid}`)
      return true
    } catch (error) {
      console.error('Error unfollowing trader:', error)
      return false
    }
  }
}

export const farcasterApiService = new FarcasterApiService()
