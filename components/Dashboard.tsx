'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Copy, BarChart3, Wallet, Settings } from 'lucide-react'
import { TraderCard } from './TraderCard'
import { PortfolioOverview } from './PortfolioOverview'
import { TopTraders } from './TopTraders'
import { ActiveCopies } from './ActiveCopies'
import { MarketOverview } from './MarketOverview'
import { Portfolio } from '@/types/trading'

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [portfolio, setPortfolio] = useState<Portfolio>({
    totalValue: 1250.50,
    totalPnl: 125.30,
    totalPnlPercent: 10.02,
    activeCopies: 3,
    totalTrades: 15,
    winRate: 73.3
  })

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'traders', label: 'Traders', icon: Users },
    { id: 'copies', label: 'My Copies', icon: Copy },
    { id: 'portfolio', label: 'Portfolio', icon: Wallet },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-base-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Copy Trading Pro</h1>
                <p className="text-sm text-muted-foreground">Follow the best traders</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-base-primary text-base-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <PortfolioOverview portfolio={portfolio} />
              <TopTraders />
              <ActiveCopies />
              <MarketOverview />
            </div>
          )}
          
          {activeTab === 'traders' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Top Traders</h2>
              <div className="grid gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <TraderCard key={i} />
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'copies' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Active Copies</h2>
              <div className="text-center py-8 text-muted-foreground">
                <Copy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No active copies yet</p>
                <p className="text-sm">Start following traders to see your copies here</p>
              </div>
            </div>
          )}
          
          {activeTab === 'portfolio' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Portfolio</h2>
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Portfolio details coming soon</p>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Settings</h2>
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Settings panel coming soon</p>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}