export interface Trader {
  id: string
  name: string
  username: string
  avatar: string
  performance: {
    totalReturn: number
    winRate: number
    maxDrawdown: number
    totalTrades: number
    followers: number
  }
  isFollowing: boolean
  isCopying: boolean
  riskLevel: 'low' | 'medium' | 'high'
  lastActive: string
}

export interface Trade {
  id: string
  traderId: string
  symbol: string
  side: 'buy' | 'sell'
  amount: number
  price: number
  timestamp: string
  status: 'pending' | 'executed' | 'failed'
  pnl?: number
}

export interface CopySettings {
  traderId: string
  maxPositionSize: number
  stopLoss: number
  takeProfit: number
  isActive: boolean
}

export interface Portfolio {
  totalValue: number
  totalPnl: number
  totalPnlPercent: number
  activeCopies: number
  totalTrades: number
  winRate: number
}

export interface MarketData {
  symbol: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
}
