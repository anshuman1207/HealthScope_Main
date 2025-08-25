"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, AlertTriangle, Clock, CheckCircle, XCircle, Filter, Search, Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

const mockAlerts = [
  {
    id: 1,
    type: "critical",
    title: "Critical Patient Alert",
    message: "Patient Arjun Mehta (ID: 12345) showing severe symptoms requiring immediate attention",
    timestamp: "2 minutes ago",
    patient: "Arjun Mehta",
    patientId: "12345",
    status: "unread",
    priority: "high",
  },
  {
    id: 2,
    type: "ai",
    title: "AI Analysis Complete",
    message: "AI analysis for chest X-ray of Priya Sharma shows potential pneumonia indicators",
    timestamp: "15 minutes ago",
    patient: "Priya Sharma",
    patientId: "67890",
    status: "unread",
    priority: "medium",
  },
  {
    id: 3,
    type: "appointment",
    title: "Appointment Reminder",
    message: "Upcoming appointment with Michael Brown in 30 minutes",
    timestamp: "30 minutes ago",
    patient: "Michael Brown",
    patientId: "54321",
    status: "read",
    priority: "low",
  },
  {
    id: 4,
    type: "lab",
    title: "Lab Results Available",
    message: "Blood test results for Emma Davis are now available for review",
    timestamp: "1 hour ago",
    patient: "Emma Davis",
    patientId: "98765",
    status: "read",
    priority: "medium",
  },
  {
    id: 5,
    type: "system",
    title: "System Maintenance",
    message: "Scheduled system maintenance will occur tonight from 2:00 AM to 4:00 AM",
    timestamp: "2 hours ago",
    patient: null,
    patientId: null,
    status: "unread",
    priority: "low",
  },
]

const alertTypeIcons = {
  critical: AlertTriangle,
  ai: Bell,
  appointment: Clock,
  lab: CheckCircle,
  system: XCircle,
}

const priorityColors = {
  high: "destructive",
  medium: "default",
  low: "secondary",
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAlerts = alerts.filter((alert) => {
    const matchesFilter = filter === "all" || alert.type === filter || alert.status === filter
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.patient && alert.patient.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const markAsRead = (alertId: number) => {
    setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, status: "read" } : alert)))
  }

  const markAllAsRead = () => {
    setAlerts(alerts.map((alert) => ({ ...alert, status: "read" })))
  }

  const deleteAlert = (alertId: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== alertId))
  }

  const unreadCount = alerts.filter((alert) => alert.status === "unread").length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Alerts</h1>
            <p className="text-muted-foreground">Manage your notifications and alerts ({unreadCount} unread)</p>
          </div>
          <Button onClick={markAllAsRead} disabled={unreadCount === 0}>
            Mark All as Read
          </Button>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter alerts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alerts</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="ai">AI Analysis</SelectItem>
                  <SelectItem value="appointment">Appointments</SelectItem>
                  <SelectItem value="lab">Lab Results</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No alerts found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "You're all caught up! No new alerts at this time."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map((alert, index) => {
              const IconComponent = alertTypeIcons[alert.type as keyof typeof alertTypeIcons]

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`transition-all hover:shadow-md ${
                      alert.status === "unread" ? "border-l-4 border-l-primary bg-primary/5" : ""
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-2 rounded-lg ${
                            alert.type === "critical"
                              ? "bg-destructive/10 text-destructive"
                              : alert.type === "ai"
                                ? "bg-blue-500/10 text-blue-600"
                                : alert.type === "appointment"
                                  ? "bg-orange-500/10 text-orange-600"
                                  : alert.type === "lab"
                                    ? "bg-green-500/10 text-green-600"
                                    : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">{alert.title}</h3>
                                {alert.status === "unread" && (
                                  <Badge variant="secondary" className="text-xs">
                                    New
                                  </Badge>
                                )}
                                <Badge variant={priorityColors[alert.priority as keyof typeof priorityColors]}>
                                  {alert.priority}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground mb-2">{alert.message}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{alert.timestamp}</span>
                                {alert.patient && <span>Patient: {alert.patient}</span>}
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {alert.status === "unread" && (
                                  <DropdownMenuItem onClick={() => markAsRead(alert.id)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Mark as Read
                                  </DropdownMenuItem>
                                )}
                                {alert.patient && (
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Patient
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => deleteAlert(alert.id)} className="text-destructive">
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Delete Alert
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
