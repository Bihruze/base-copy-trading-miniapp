// Live price data service
export interface PriceData {
  symbol: string
  price: number
  change24h: number
  changePercent24h: number
  volume24h: number
  marketCap?: number
  lastUpdated: number
}

export interface TraderData {
  address: string
  username: string
  avatar: string
  totalReturn: number
  winRate: number
  totalTrades: number
  followers: number
  isVerified: boolean
  lastActive: string
  riskLevel: 'low' | 'medium' | 'high'
}

class PriceApiService {
  private baseUrl = 'https://api.coingecko.com/api/v3'
  private cache: Map<string, PriceData> = new Map()
  private cacheTimeout = 30000 // 30 seconds

  // Get live price data for cryptocurrencies
  async getPriceData(symbols: string[]): Promise<PriceData[]> {
    const results: PriceData[] = []
    
    for (const symbol of symbols) {
      try {
        // Check cache first
        const cached = this.cache.get(symbol)
        if (cached && Date.now() - cached.lastUpdated < this.cacheTimeout) {
          results.push(cached)
          continue
        }

        // Fetch from API
        const response = await fetch(
          `${this.baseUrl}/simple/price?ids=${this.getCoinGeckoId(symbol)}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
        )
        
        if (!response.ok) {
          throw new Error(`Failed to fetch price for ${symbol}`)
        }

        const data = await response.json()
        const coinData = data[this.getCoinGeckoId(symbol)]
        
        if (coinData) {
          const priceData: PriceData = {
            symbol: symbol.toUpperCase(),
            price: coinData.usd,
            change24h: coinData.usd_24h_change || 0,
            changePercent24h: coinData.usd_24h_change || 0,
            volume24h: coinData.usd_24h_vol || 0,
            marketCap: coinData.usd_market_cap || 0,
            lastUpdated: Date.now()
          }
          
          this.cache.set(symbol, priceData)
          results.push(priceData)
        }
      } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error)
        // Fallback to mock data
        results.push(this.getMockPriceData(symbol))
      }
    }
    
    return results
  }

  // Get top traders from Farcaster (mock implementation)
  async getTopTraders(): Promise<TraderData[]> {
    // In a real implementation, this would fetch from Farcaster API
    // For now, return mock data with realistic trader profiles
    return [
      {
        address: '0x1234...5678',
        username: '@crypto_king',
        avatar: '👑',
        totalReturn: 45.2,
        winRate: 78.5,
        totalTrades: 156,
        followers: 2847,
        isVerified: true,
        lastActive: '2 hours ago',
        riskLevel: 'medium'
      },
      {
        address: '0x2345...6789',
        username: '@defi_master',
        avatar: '🚀',
        totalReturn: 38.7,
        winRate: 72.1,
        totalTrades: 89,
        followers: 1923,
        isVerified: true,
        lastActive: '1 hour ago',
        riskLevel: 'high'
      },
      {
        address: '0x3456...7890',
        username: '@nft_trader',
        avatar: '🎨',
        totalReturn: 32.1,
        winRate: 68.9,
        totalTrades: 203,
        followers: 1456,
        isVerified: false,
        lastActive: '3 hours ago',
        riskLevel: 'high'
      },
      {
        address: '0x4567...8901',
        username: '@diamond_hands',
        avatar: '💎',
        totalReturn: 28.9,
        winRate: 85.2,
        totalTrades: 67,
        followers: 3245,
        isVerified: true,
        lastActive: '30 minutes ago',
        riskLevel: 'low'
      },
      {
        address: '0x5678...9012',
        username: '@base_builder',
        avatar: '🏗️',
        totalReturn: 41.3,
        winRate: 75.8,
        totalTrades: 124,
        followers: 2156,
        isVerified: true,
        lastActive: '1 hour ago',
        riskLevel: 'medium'
      }
    ]
  }

  // Get trader performance data
  async getTraderPerformance(address: string): Promise<any> {
    // Mock implementation - in real app, fetch from blockchain
    return {
      address,
      totalReturn: Math.random() * 100 - 20,
      winRate: Math.random() * 40 + 60,
      totalTrades: Math.floor(Math.random() * 200) + 50,
      followers: Math.floor(Math.random() * 5000) + 100,
      riskScore: Math.floor(Math.random() * 10) + 1,
      lastActive: '2 hours ago'
    }
  }

  private getCoinGeckoId(symbol: string): string {
    const mapping: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'BASE': 'base',
      'USDC': 'usd-coin',
      'USDT': 'tether',
      'SOL': 'solana',
      'MATIC': 'matic-network',
      'AVAX': 'avalanche-2',
      'LINK': 'chainlink',
      'UNI': 'uniswap'
    }
    return mapping[symbol.toUpperCase()] || 'bitcoin'
  }

  private getMockPriceData(symbol: string): PriceData {
    const basePrice = Math.random() * 1000 + 100
    const change = (Math.random() - 0.5) * 20
    
    return {
      symbol: symbol.toUpperCase(),
      price: basePrice,
      change24h: change,
      changePercent24h: change,
      volume24h: Math.random() * 1000000000,
      marketCap: Math.random() * 10000000000,
      lastUpdated: Date.now()
    }
  }
}

export const priceApiService = new PriceApiService()
