// import { format, subDays, subWeeks, subMonths } from 'date-fns'

export interface AnalyticsData {
  portfolio: {
    totalValue: number
    totalPnl: number
    totalPnlPercent: number
    winRate: number
    sharpeRatio: number
    maxDrawdown: number
    totalTrades: number
    activeCopies: number
  }
  performance: {
    daily: PerformanceData[]
    weekly: PerformanceData[]
    monthly: PerformanceData[]
  }
  traders: {
    topPerformers: TraderPerformance[]
    worstPerformers: TraderPerformance[]
    mostFollowed: TraderPerformance[]
  }
  trades: {
    totalVolume: number
    averageTradeSize: number
    mostTradedAssets: AssetPerformance[]
    profitByAsset: AssetPerformance[]
  }
  risk: {
    var95: number
    var99: number
    expectedShortfall: number
    beta: number
  }
}

export interface PerformanceData {
  date: string
  value: number
  pnl: number
  pnlPercent: number
  trades: number
}

export interface TraderPerformance {
  address: string
  name: string
  performance: number
  winRate: number
  totalTrades: number
  followers: number
  riskScore: number
}

export interface AssetPerformance {
  symbol: string
  name: string
  volume: number
  pnl: number
  trades: number
  winRate: number
}

class AnalyticsService {
  private data: AnalyticsData | null = null

  // Calculate portfolio analytics
  calculatePortfolioAnalytics(portfolioData: any[]): AnalyticsData['portfolio'] {
    const totalValue = portfolioData.reduce((sum, p) => sum + p.value, 0)
    const totalPnl = portfolioData.reduce((sum, p) => sum + p.pnl, 0)
    const totalPnlPercent = totalValue > 0 ? (totalPnl / totalValue) * 100 : 0
    
    const winningTrades = portfolioData.filter(p => p.pnl > 0).length
    const totalTrades = portfolioData.length
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0

    // Calculate Sharpe ratio (simplified)
    const returns = portfolioData.map(p => p.pnlPercent)
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    const sharpeRatio = variance > 0 ? avgReturn / Math.sqrt(variance) : 0

    // Calculate max drawdown
    let maxDrawdown = 0
    let peak = totalValue
    for (const p of portfolioData) {
      if (p.value > peak) peak = p.value
      const drawdown = (peak - p.value) / peak
      if (drawdown > maxDrawdown) maxDrawdown = drawdown
    }

    return {
      totalValue,
      totalPnl,
      totalPnlPercent,
      winRate,
      sharpeRatio,
      maxDrawdown: maxDrawdown * 100,
      totalTrades,
      activeCopies: portfolioData.filter(p => p.isActive).length
    }
  }

  // Calculate performance over time
  calculatePerformanceData(trades: any[], period: 'daily' | 'weekly' | 'monthly'): PerformanceData[] {
    const now = new Date()
    const periods = {
      daily: 30,
      weekly: 12,
      monthly: 12
    }

    const data: PerformanceData[] = []
    let startDate: Date

    switch (period) {
      case 'daily':
        startDate = new Date(now.getTime() - periods.daily * 24 * 60 * 60 * 1000)
        break
      case 'weekly':
        startDate = new Date(now.getTime() - periods.weekly * 7 * 24 * 60 * 60 * 1000)
        break
      case 'monthly':
        startDate = new Date(now.getTime() - periods.monthly * 30 * 24 * 60 * 60 * 1000)
        break
    }

    // Group trades by period
    const groupedTrades = this.groupTradesByPeriod(trades, period, startDate)
    
    let cumulativeValue = 0
    let cumulativePnl = 0

    for (const [date, periodTrades] of Object.entries(groupedTrades)) {
      const periodPnl = periodTrades.reduce((sum, t) => sum + t.pnl, 0)
      const periodPnlPercent = cumulativeValue > 0 ? (periodPnl / cumulativeValue) * 100 : 0
      
      cumulativeValue += periodTrades.reduce((sum, t) => sum + t.amount, 0)
      cumulativePnl += periodPnl

      data.push({
        date,
        value: cumulativeValue,
        pnl: cumulativePnl,
        pnlPercent: periodPnlPercent,
        trades: periodTrades.length
      })
    }

    return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  // Group trades by time period
  private groupTradesByPeriod(trades: any[], period: string, startDate: Date): Record<string, any[]> {
    const grouped: Record<string, any[]> = {}

    trades.forEach(trade => {
      const tradeDate = new Date(trade.timestamp)
      if (tradeDate < startDate) return

      let key: string
      switch (period) {
        case 'daily':
          key = tradeDate.toISOString().split('T')[0]
          break
        case 'weekly':
          key = `${tradeDate.getFullYear()}-W${Math.ceil(tradeDate.getDate() / 7)}`
          break
        case 'monthly':
          key = `${tradeDate.getFullYear()}-${String(tradeDate.getMonth() + 1).padStart(2, '0')}`
          break
        default:
          key = tradeDate.toISOString().split('T')[0]
      }

      if (!grouped[key]) grouped[key] = []
      grouped[key].push(trade)
    })

    return grouped
  }

  // Calculate trader performance analytics
  calculateTraderAnalytics(traders: any[]): AnalyticsData['traders'] {
    const sortedByPerformance = [...traders].sort((a, b) => b.performance - a.performance)
    const sortedByFollowers = [...traders].sort((a, b) => b.followers - a.followers)

    return {
      topPerformers: sortedByPerformance.slice(0, 5).map(t => ({
        address: t.address,
        name: t.name,
        performance: t.performance,
        winRate: t.winRate,
        totalTrades: t.totalTrades,
        followers: t.followers,
        riskScore: this.calculateRiskScore(t)
      })),
      worstPerformers: sortedByPerformance.slice(-5).reverse().map(t => ({
        address: t.address,
        name: t.name,
        performance: t.performance,
        winRate: t.winRate,
        totalTrades: t.totalTrades,
        followers: t.followers,
        riskScore: this.calculateRiskScore(t)
      })),
      mostFollowed: sortedByFollowers.slice(0, 5).map(t => ({
        address: t.address,
        name: t.name,
        performance: t.performance,
        winRate: t.winRate,
        totalTrades: t.totalTrades,
        followers: t.followers,
        riskScore: this.calculateRiskScore(t)
      }))
    }
  }

  // Calculate trade analytics
  calculateTradeAnalytics(trades: any[]): AnalyticsData['trades'] {
    const totalVolume = trades.reduce((sum, t) => sum + t.amount, 0)
    const averageTradeSize = trades.length > 0 ? totalVolume / trades.length : 0

    // Group by asset
    const assetGroups: Record<string, any[]> = {}
    trades.forEach(trade => {
      if (!assetGroups[trade.symbol]) assetGroups[trade.symbol] = []
      assetGroups[trade.symbol].push(trade)
    })

    const mostTradedAssets = Object.entries(assetGroups)
      .map(([symbol, assetTrades]) => ({
        symbol,
        name: symbol,
        volume: assetTrades.reduce((sum, t) => sum + t.amount, 0),
        pnl: assetTrades.reduce((sum, t) => sum + t.pnl, 0),
        trades: assetTrades.length,
        winRate: (assetTrades.filter(t => t.pnl > 0).length / assetTrades.length) * 100
      }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 10)

    const profitByAsset = Object.entries(assetGroups)
      .map(([symbol, assetTrades]) => ({
        symbol,
        name: symbol,
        volume: assetTrades.reduce((sum, t) => sum + t.amount, 0),
        pnl: assetTrades.reduce((sum, t) => sum + t.pnl, 0),
        trades: assetTrades.length,
        winRate: (assetTrades.filter(t => t.pnl > 0).length / assetTrades.length) * 100
      }))
      .sort((a, b) => b.pnl - a.pnl)
      .slice(0, 10)

    return {
      totalVolume,
      averageTradeSize,
      mostTradedAssets,
      profitByAsset
    }
  }

  // Calculate risk metrics
  calculateRiskMetrics(portfolioData: any[]): AnalyticsData['risk'] {
    const returns = portfolioData.map(p => p.pnlPercent)
    const sortedReturns = [...returns].sort((a, b) => a - b)

    // Value at Risk (VaR)
    const var95Index = Math.floor(sortedReturns.length * 0.05)
    const var99Index = Math.floor(sortedReturns.length * 0.01)
    const var95 = sortedReturns[var95Index] || 0
    const var99 = sortedReturns[var99Index] || 0

    // Expected Shortfall (Conditional VaR)
    const tailReturns = sortedReturns.slice(0, var95Index)
    const expectedShortfall = tailReturns.length > 0 
      ? tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length 
      : 0

    // Beta (simplified - would need market data)
    const beta = 1.0 // Placeholder

    return {
      var95,
      var99,
      expectedShortfall,
      beta
    }
  }

  // Calculate risk score for a trader
  private calculateRiskScore(trader: any): number {
    const factors = [
      trader.maxDrawdown / 100, // Lower is better
      (100 - trader.winRate) / 100, // Lower is better
      trader.volatility || 0.1, // Lower is better
    ]

    const avgFactor = factors.reduce((sum, f) => sum + f, 0) / factors.length
    return Math.max(0, Math.min(100, (1 - avgFactor) * 100))
  }

  // Generate comprehensive analytics report
  generateAnalyticsReport(
    portfolioData: any[],
    trades: any[],
    traders: any[]
  ): AnalyticsData {
    const portfolio = this.calculatePortfolioAnalytics(portfolioData)
    const performance = {
      daily: this.calculatePerformanceData(trades, 'daily'),
      weekly: this.calculatePerformanceData(trades, 'weekly'),
      monthly: this.calculatePerformanceData(trades, 'monthly')
    }
    const traders_analytics = this.calculateTraderAnalytics(traders)
    const trades_analytics = this.calculateTradeAnalytics(trades)
    const risk = this.calculateRiskMetrics(portfolioData)

    return {
      portfolio,
      performance,
      traders: traders_analytics,
      trades: trades_analytics,
      risk
    }
  }

  // Get analytics data
  getAnalytics(): AnalyticsData | null {
    return this.data
  }

  // Set analytics data
  setAnalytics(data: AnalyticsData) {
    this.data = data
  }
}

export const analyticsService = new AnalyticsService()
