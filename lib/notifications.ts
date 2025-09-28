// import { toast } from 'react-hot-toast'

export interface NotificationData {
  id: string
  type: 'trade' | 'copy' | 'profit' | 'loss' | 'alert' | 'info'
  title: string
  message: string
  timestamp: number
  data?: any
}

class NotificationService {
  private notifications: NotificationData[] = []
  private maxNotifications = 100

  // Add notification
  addNotification(notification: Omit<NotificationData, 'id' | 'timestamp'>) {
    const newNotification: NotificationData = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    }

    this.notifications.unshift(newNotification)
    
    // Keep only the latest notifications
    if (this.notifications.length > this.maxNotifications) {
      this.notifications = this.notifications.slice(0, this.maxNotifications)
    }

    // Show toast notification
    this.showToast(newNotification)

    return newNotification
  }

  // Show toast notification
  private showToast(notification: NotificationData) {
    // Mock toast notification
    console.log('Toast notification:', notification)
  }

  // Get all notifications
  getNotifications() {
    return this.notifications
  }

  // Get notifications by type
  getNotificationsByType(type: NotificationData['type']) {
    return this.notifications.filter(n => n.type === type)
  }

  // Mark notification as read
  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id)
    if (notification) {
      // In a real app, you'd update this in a database
      // For now, we'll just remove it from the array
      this.notifications = this.notifications.filter(n => n.id !== id)
    }
  }

  // Clear all notifications
  clearAll() {
    this.notifications = []
  }

  // Clear notifications by type
  clearByType(type: NotificationData['type']) {
    this.notifications = this.notifications.filter(n => n.type !== type)
  }

  // Get unread count
  getUnreadCount() {
    return this.notifications.length
  }

  // Trade-specific notifications
  notifyTradeExecuted(traderName: string, symbol: string, side: 'buy' | 'sell', amount: number) {
    this.addNotification({
      type: 'trade',
      title: 'Trade Executed',
      message: `${traderName} executed ${side.toUpperCase()} ${amount} ${symbol}`,
      data: { traderName, symbol, side, amount }
    })
  }

  notifyCopyTradeExecuted(traderName: string, symbol: string, amount: number, pnl?: number) {
    const message = pnl 
      ? `Copied ${traderName}'s trade: ${amount} ${symbol} (P&L: ${pnl > 0 ? '+' : ''}${pnl})`
      : `Copied ${traderName}'s trade: ${amount} ${symbol}`
    
    this.addNotification({
      type: 'copy',
      title: 'Copy Trade Executed',
      message,
      data: { traderName, symbol, amount, pnl }
    })
  }

  notifyProfit(amount: number, percentage: number) {
    this.addNotification({
      type: 'profit',
      title: 'Profit Realized',
      message: `+$${amount.toFixed(2)} (+${percentage.toFixed(2)}%)`,
      data: { amount, percentage }
    })
  }

  notifyLoss(amount: number, percentage: number) {
    this.addNotification({
      type: 'loss',
      title: 'Loss Realized',
      message: `-$${Math.abs(amount).toFixed(2)} (${percentage.toFixed(2)}%)`,
      data: { amount, percentage }
    })
  }

  notifyStopLossHit(symbol: string, price: number) {
    this.addNotification({
      type: 'alert',
      title: 'Stop Loss Triggered',
      message: `Stop loss hit for ${symbol} at $${price}`,
      data: { symbol, price }
    })
  }

  notifyTakeProfitHit(symbol: string, price: number) {
    this.addNotification({
      type: 'profit',
      title: 'Take Profit Triggered',
      message: `Take profit hit for ${symbol} at $${price}`,
      data: { symbol, price }
    })
  }

  notifyTraderUpdate(traderName: string, performance: number) {
    this.addNotification({
      type: 'info',
      title: 'Trader Update',
      message: `${traderName}'s performance: ${performance > 0 ? '+' : ''}${performance.toFixed(2)}%`,
      data: { traderName, performance }
    })
  }

  notifyConnectionStatus(connected: boolean) {
    this.addNotification({
      type: 'info',
      title: 'Connection Status',
      message: connected ? 'Connected to trading network' : 'Disconnected from trading network',
      data: { connected }
    })
  }
}

export const notificationService = new NotificationService()
