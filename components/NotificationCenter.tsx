'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, AlertTriangle, TrendingUp, TrendingDown, Copy, Info } from 'lucide-react'
import { notificationService, NotificationData } from '@/lib/notifications'
import { formatDistanceToNow } from 'date-fns'

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Load notifications
    setNotifications(notificationService.getNotifications())
    setUnreadCount(notificationService.getUnreadCount())

    // Listen for new notifications
    const interval = setInterval(() => {
      setNotifications(notificationService.getNotifications())
      setUnreadCount(notificationService.getUnreadCount())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getNotificationIcon = (type: NotificationData['type']) => {
    switch (type) {
      case 'trade':
        return <TrendingUp className="w-4 h-4 text-blue-600" />
      case 'copy':
        return <Copy className="w-4 h-4 text-green-600" />
      case 'profit':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'loss':
        return <TrendingDown className="w-4 h-4 text-red-600" />
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'info':
        return <Info className="w-4 h-4 text-blue-600" />
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getNotificationColor = (type: NotificationData['type']) => {
    switch (type) {
      case 'profit':
        return 'border-l-green-500 bg-green-50 dark:bg-green-950'
      case 'loss':
        return 'border-l-red-500 bg-red-50 dark:bg-red-950'
      case 'alert':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950'
      case 'trade':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950'
      case 'copy':
        return 'border-l-purple-500 bg-purple-50 dark:bg-purple-950'
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-950'
    }
  }

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id)
    setNotifications(notificationService.getNotifications())
    setUnreadCount(notificationService.getUnreadCount())
  }

  const clearAll = () => {
    notificationService.clearAll()
    setNotifications([])
    setUnreadCount(0)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-muted rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-12 w-80 bg-card border border-border rounded-lg shadow-lg z-50"
          >
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-3 border-l-4 ${getNotificationColor(notification.type)} hover:bg-muted/50 transition-colors`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">{notification.title}</h4>
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 hover:bg-muted rounded"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
