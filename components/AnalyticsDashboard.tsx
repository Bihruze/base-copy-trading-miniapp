'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Shield, 
  Users,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { analyticsService, AnalyticsData } from '@/lib/analytics'

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Mock data for demonstration
    const mockPortfolioData = [
      { value: 1000, pnl: 50, pnlPercent: 5, isActive: true },
      { value: 1200, pnl: 80, pnlPercent: 6.67, isActive: true },
      { value: 1100, pnl: -20, pnlPercent: -1.82, isActive: false },
    ]

    const mockTrades = [
      { timestamp: Date.now() - 86400000, amount: 100, pnl: 10, pnlPercent: 10, symbol: 'ETH' },
      { timestamp: Date.now() - 172800000, amount: 200, pnl: -5, pnlPercent: -2.5, symbol: 'BTC' },
    ]

    const mockTraders = [
      { address: '0x123', name: 'CryptoKing', performance: 45.2, winRate: 78, totalTrades: 156, followers: 2847 },
      { address: '0x456', name: 'DeFiMaster', performance: 38.7, winRate: 72, totalTrades: 98, followers: 1923 },
    ]

    const analyticsData = analyticsService.generateAnalyticsReport(mockPortfolioData, mockTrades, mockTraders)
    setAnalytics(analyticsData)
  }, [])

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-base-primary"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'traders', label: 'Traders', icon: Users },
    { id: 'risk', label: 'Risk', icon: Shield },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-muted-foreground">Live Data</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && <OverviewTab analytics={analytics} />}
        {activeTab === 'performance' && <PerformanceTab analytics={analytics} />}
        {activeTab === 'traders' && <TradersTab analytics={analytics} />}
        {activeTab === 'risk' && <RiskTab analytics={analytics} />}
      </motion.div>
    </div>
  )
}

function OverviewTab({ analytics }: { analytics: AnalyticsData }) {
  const metrics = [
    {
      title: 'Total Value',
      value: `$${analytics.portfolio.totalValue.toLocaleString()}`,
      change: analytics.portfolio.totalPnlPercent,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Total P&L',
      value: `$${analytics.portfolio.totalPnl.toLocaleString()}`,
      change: analytics.portfolio.totalPnlPercent,
      icon: TrendingUp,
      color: analytics.portfolio.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Win Rate',
      value: `${analytics.portfolio.winRate.toFixed(1)}%`,
      change: 0,
      icon: Target,
      color: 'text-blue-600'
    },
    {
      title: 'Active Copies',
      value: analytics.portfolio.activeCopies.toString(),
      change: 0,
      icon: Activity,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="trading-card"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">{metric.title}</h3>
                <Icon className={`w-4 h-4 ${metric.color}`} />
              </div>
              <p className="text-2xl font-bold">{metric.value}</p>
              {metric.change !== 0 && (
                <p className={`text-sm ${metric.color}`}>
                  {metric.change > 0 ? '+' : ''}{metric.change.toFixed(2)}%
                </p>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Performance Chart */}
      <div className="trading-card">
        <h3 className="text-lg font-semibold mb-4">Portfolio Performance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.performance.daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#0052FF" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function PerformanceTab({ analytics }: { analytics: AnalyticsData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Performance */}
        <div className="trading-card">
          <h3 className="text-lg font-semibold mb-4">Daily Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.performance.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="pnl" stroke="#00D4AA" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Performance */}
        <div className="trading-card">
          <h3 className="text-lg font-semibold mb-4">Weekly Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.performance.weekly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="trades" fill="#0052FF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Asset Performance */}
      <div className="trading-card">
        <h3 className="text-lg font-semibold mb-4">Asset Performance</h3>
        <div className="space-y-3">
          {analytics.trades.profitByAsset.slice(0, 5).map((asset, index) => (
            <div key={asset.symbol} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-base-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">{asset.symbol[0]}</span>
                </div>
                <div>
                  <p className="font-medium">{asset.symbol}</p>
                  <p className="text-sm text-muted-foreground">{asset.trades} trades</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${asset.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {asset.pnl >= 0 ? '+' : ''}${asset.pnl.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">{asset.winRate.toFixed(1)}% win rate</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TradersTab({ analytics }: { analytics: AnalyticsData }) {
  return (
    <div className="space-y-6">
      {/* Top Performers */}
      <div className="trading-card">
        <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
        <div className="space-y-3">
          {analytics.traders.topPerformers.map((trader, index) => (
            <div key={trader.address} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-base-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium">{trader.name}</p>
                  <p className="text-sm text-muted-foreground">{trader.followers} followers</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">+{trader.performance.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">{trader.winRate.toFixed(1)}% win rate</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Scores */}
      <div className="trading-card">
        <h3 className="text-lg font-semibold mb-4">Trader Risk Scores</h3>
        <div className="space-y-3">
          {analytics.traders.topPerformers.map((trader) => (
            <div key={trader.address} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-base-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">{trader.name[0]}</span>
                </div>
                <div>
                  <p className="font-medium">{trader.name}</p>
                  <p className="text-sm text-muted-foreground">{trader.totalTrades} trades</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      trader.riskScore >= 80 ? 'bg-green-500' :
                      trader.riskScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${trader.riskScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{trader.riskScore.toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RiskTab({ analytics }: { analytics: AnalyticsData }) {
  const riskMetrics = [
    {
      title: 'Value at Risk (95%)',
      value: `${analytics.risk.var95.toFixed(2)}%`,
      description: 'Maximum expected loss in 95% of scenarios',
      icon: AlertTriangle,
      color: 'text-yellow-600'
    },
    {
      title: 'Value at Risk (99%)',
      value: `${analytics.risk.var99.toFixed(2)}%`,
      description: 'Maximum expected loss in 99% of scenarios',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      title: 'Expected Shortfall',
      value: `${analytics.risk.expectedShortfall.toFixed(2)}%`,
      description: 'Average loss in worst-case scenarios',
      icon: TrendingDown,
      color: 'text-red-600'
    },
    {
      title: 'Beta',
      value: analytics.risk.beta.toFixed(2),
      description: 'Correlation with market movements',
      icon: Activity,
      color: 'text-blue-600'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {riskMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="trading-card"
            >
              <div className="flex items-center space-x-3 mb-3">
                <Icon className={`w-5 h-5 ${metric.color}`} />
                <h3 className="font-semibold">{metric.title}</h3>
              </div>
              <p className="text-2xl font-bold mb-2">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.description}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Risk Summary */}
      <div className="trading-card">
        <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Portfolio Risk Level</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-muted rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${Math.max(0, 100 - analytics.portfolio.maxDrawdown)}%` }}
                />
              </div>
              <span className="text-sm font-medium">
                {analytics.portfolio.maxDrawdown < 10 ? 'Low' : 
                 analytics.portfolio.maxDrawdown < 25 ? 'Medium' : 'High'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sharpe Ratio</span>
            <span className={`text-sm font-medium ${
              analytics.portfolio.sharpeRatio > 1 ? 'text-green-600' :
              analytics.portfolio.sharpeRatio > 0.5 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {analytics.portfolio.sharpeRatio.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
