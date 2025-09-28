import { io, Socket } from 'socket.io-client'

class WebSocketService {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect() {
    if (this.socket?.connected) return

    this.socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001', {
      transports: ['websocket'],
      autoConnect: true,
    })

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
    })

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
      this.handleReconnect()
    })

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      this.handleReconnect()
    })
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.socket?.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Market data subscriptions
  subscribeToMarketData(symbol: string, callback: (data: any) => void) {
    if (!this.socket) return

    this.socket.emit('subscribe-market', symbol)
    this.socket.on(`market-${symbol}`, callback)
  }

  unsubscribeFromMarketData(symbol: string) {
    if (!this.socket) return

    this.socket.emit('unsubscribe-market', symbol)
    this.socket.off(`market-${symbol}`)
  }

  // Trader performance subscriptions
  subscribeToTraderPerformance(traderAddress: string, callback: (data: any) => void) {
    if (!this.socket) return

    this.socket.emit('subscribe-trader', traderAddress)
    this.socket.on(`trader-${traderAddress}`, callback)
  }

  unsubscribeFromTraderPerformance(traderAddress: string) {
    if (!this.socket) return

    this.socket.emit('unsubscribe-trader', traderAddress)
    this.socket.off(`trader-${traderAddress}`)
  }

  // Copy trading subscriptions
  subscribeToCopyTrades(userAddress: string, callback: (data: any) => void) {
    if (!this.socket) return

    this.socket.emit('subscribe-copy-trades', userAddress)
    this.socket.on(`copy-trades-${userAddress}`, callback)
  }

  unsubscribeFromCopyTrades(userAddress: string) {
    if (!this.socket) return

    this.socket.emit('unsubscribe-copy-trades', userAddress)
    this.socket.off(`copy-trades-${userAddress}`)
  }

  // Portfolio updates
  subscribeToPortfolio(userAddress: string, callback: (data: any) => void) {
    if (!this.socket) return

    this.socket.emit('subscribe-portfolio', userAddress)
    this.socket.on(`portfolio-${userAddress}`, callback)
  }

  unsubscribeFromPortfolio(userAddress: string) {
    if (!this.socket) return

    this.socket.emit('unsubscribe-portfolio', userAddress)
    this.socket.off(`portfolio-${userAddress}`)
  }

  // Trade notifications
  subscribeToTradeNotifications(userAddress: string, callback: (data: any) => void) {
    if (!this.socket) return

    this.socket.emit('subscribe-notifications', userAddress)
    this.socket.on(`notifications-${userAddress}`, callback)
  }

  unsubscribeFromTradeNotifications(userAddress: string) {
    if (!this.socket) return

    this.socket.emit('unsubscribe-notifications', userAddress)
    this.socket.off(`notifications-${userAddress}`)
  }

  // Send trade signal
  sendTradeSignal(traderAddress: string, tradeData: any) {
    if (!this.socket) return

    this.socket.emit('trade-signal', {
      trader: traderAddress,
      ...tradeData
    })
  }

  // Send copy trade execution
  sendCopyTrade(userAddress: string, tradeData: any) {
    if (!this.socket) return

    this.socket.emit('copy-trade', {
      user: userAddress,
      ...tradeData
    })
  }

  get isConnected() {
    return this.socket?.connected || false
  }
}

export const websocketService = new WebSocketService()
