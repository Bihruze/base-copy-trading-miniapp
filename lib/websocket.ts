// Mock WebSocket service for Base Mini App
class WebSocketService {
  private isConnected = false

  connect() {
    this.isConnected = true
    console.log('WebSocket connected (mock)')
  }

  disconnect() {
    this.isConnected = false
    console.log('WebSocket disconnected (mock)')
  }

  subscribeToMarketData(symbol: string, callback: (data: any) => void) {
    console.log(`Subscribed to market data for ${symbol}`)
    // Mock data
    setTimeout(() => {
      callback({
        price: 2450.50,
        change: 2.45,
        volume: '12.5B'
      })
    }, 1000)
  }

  unsubscribeFromMarketData(symbol: string) {
    console.log(`Unsubscribed from market data for ${symbol}`)
  }

  subscribeToTraderPerformance(traderAddress: string, callback: (data: any) => void) {
    console.log(`Subscribed to trader performance for ${traderAddress}`)
  }

  unsubscribeFromTraderPerformance(traderAddress: string) {
    console.log(`Unsubscribed from trader performance for ${traderAddress}`)
  }

  subscribeToCopyTrades(userAddress: string, callback: (data: any) => void) {
    console.log(`Subscribed to copy trades for ${userAddress}`)
  }

  unsubscribeFromCopyTrades(userAddress: string) {
    console.log(`Unsubscribed from copy trades for ${userAddress}`)
  }

  subscribeToPortfolio(userAddress: string, callback: (data: any) => void) {
    console.log(`Subscribed to portfolio for ${userAddress}`)
  }

  unsubscribeFromPortfolio(userAddress: string) {
    console.log(`Unsubscribed from portfolio for ${userAddress}`)
  }

  subscribeToTradeNotifications(userAddress: string, callback: (data: any) => void) {
    console.log(`Subscribed to trade notifications for ${userAddress}`)
  }

  unsubscribeFromTradeNotifications(userAddress: string) {
    console.log(`Unsubscribed from trade notifications for ${userAddress}`)
  }

  sendTradeSignal(traderAddress: string, tradeData: any) {
    console.log('Trade signal sent:', { traderAddress, tradeData })
  }

  sendCopyTrade(userAddress: string, tradeData: any) {
    console.log('Copy trade sent:', { userAddress, tradeData })
  }

  get connected() {
    return this.isConnected
  }
}

export const websocketService = new WebSocketService()