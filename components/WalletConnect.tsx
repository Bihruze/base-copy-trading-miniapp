'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { motion } from 'framer-motion'
import { Wallet, LogOut, Copy, CheckCircle } from 'lucide-react'
import { formatAddress } from '@/lib/utils'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isConnected && address) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center space-x-3"
      >
        <div className="flex items-center space-x-2 bg-card border border-border rounded-lg px-3 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium">Connected</span>
        </div>
        
        <div className="flex items-center space-x-2 bg-muted rounded-lg px-3 py-2">
          <span className="text-sm font-mono">{formatAddress(address)}</span>
          <button
            onClick={handleCopyAddress}
            className="p-1 hover:bg-muted-foreground/20 rounded"
          >
            {copied ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        
        <button
          onClick={() => disconnect()}
          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 text-destructive" />
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="text-center">
        <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Connect your wallet to start copy trading
        </p>
      </div>

      <div className="space-y-3">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
            className="w-full flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-base-primary/10 rounded-full flex items-center justify-center">
                <Wallet className="w-4 h-4 text-base-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium">{connector.name}</p>
                <p className="text-sm text-muted-foreground">
                  {connector.type === 'injected' ? 'Browser Extension' : 'Mobile Wallet'}
                </p>
              </div>
            </div>
            <div className="w-2 h-2 bg-base-primary rounded-full"></div>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
