// hooks/use-notifications.ts
import { useState, useEffect, useCallback } from "react"

interface Notification {
  id: string
  type: "info" | "warning" | "success" | "urgent"
  title: string
  message: string
  time: string
  read: boolean
}

const mockNotifications: Record<string, Notification[]> = {
  patient: [
    {
      id: "1",
      type: "urgent",
      title: "AI Health Alert",
      message: "Your recent symptoms suggest you should consult a doctor within 24 hours.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      type: "info",
      title: "Appointment Reminder",
      message: "You have an appointment with Dr. Smith tomorrow at 2:00 PM.",
      time: "1 day ago",
      read: false,
    },
    {
      id: "3",
      type: "success",
      title: "Report Ready",
      message: "Your blood test results are now available.",
      time: "2 days ago",
      read: true,
    },
  ],
  doctor: [
    {
      id: "1",
      type: "urgent",
      title: "Critical Patient Alert",
      message: "Patient Arjun Mehta shows high-risk indicators requiring immediate attention.",
      time: "30 minutes ago",
      read: false,
    },
    {
      id: "2",
      type: "warning",
      title: "AI Flagged Case",
      message: "New case flagged by AI for potential diabetes complications.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "3",
      type: "info",
      title: "Referral Request",
      message: "Dr. Johnson has referred a patient to your care.",
      time: "4 hours ago",
      read: true,
    },
  ],
  ngo: [
    {
      id: "1",
      type: "warning",
      title: "Community Health Alert",
      message: "Increased respiratory cases detected in Sector 7.",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "2",
      type: "info",
      title: "New Match Suggestion",
      message: "5 new cases match your organization's criteria.",
      time: "3 hours ago",
      read: false,
    },
  ],
  hospital: [
    {
      id: "1",
      type: "urgent",
      title: "Bed Capacity Alert",
      message: "ICU capacity at 95%. Consider patient transfers.",
      time: "45 minutes ago",
      read: false,
    },
    {
      id: "2",
      type: "warning",
      title: "Inventory Low",
      message: "Critical medical supplies running low.",
      time: "2 hours ago",
      read: false,
    },
  ],
  admin: [
    {
      id: "1",
      type: "info",
      title: "System Update",
      message: "Scheduled maintenance completed successfully.",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "2",
      type: "warning",
      title: "Pending Approvals",
      message: "12 doctor verification requests awaiting approval.",
      time: "3 hours ago",
      read: false,
    },
  ],
}

// Global state management
class NotificationManager {
  private listeners: Set<() => void> = new Set()
  private notifications: Map<string, Notification[]> = new Map()

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  notify() {
    this.listeners.forEach(listener => listener())
  }

  getNotifications(userRole: string): Notification[] {
    if (!this.notifications.has(userRole)) {
      const defaultNotifications = mockNotifications[userRole as keyof typeof mockNotifications] || []
      this.notifications.set(userRole, [...defaultNotifications])
    }
    return this.notifications.get(userRole)!
  }

  updateNotifications(userRole: string, notifications: Notification[]) {
    this.notifications.set(userRole, notifications)
    this.notify()
  }

  getUnreadCount(userRole: string): number {
    const notifications = this.getNotifications(userRole)
    return notifications.filter(n => !n.read).length
  }
}

const notificationManager = new NotificationManager()

export function useNotifications(userRole?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    if (!userRole) return

    const updateNotifications = () => {
      const userNotifications = notificationManager.getNotifications(userRole)
      setNotifications([...userNotifications])
    }

    updateNotifications()

    const unsubscribe = notificationManager.subscribe(() => {
      updateNotifications()
      forceUpdate(prev => prev + 1)
    })

    return () => { unsubscribe };
  }, [userRole])

  const markAsRead = useCallback((id: string) => {
    if (!userRole) return

    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
    notificationManager.updateNotifications(userRole, updatedNotifications)
  }, [notifications, userRole])

  const markAllAsRead = useCallback(() => {
    if (!userRole) return

    const updatedNotifications = notifications.map(n => ({ ...n, read: true }))
    notificationManager.updateNotifications(userRole, updatedNotifications)
  }, [notifications, userRole])

  const unreadCount = userRole ? notificationManager.getUnreadCount(userRole) : 0

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  }
}