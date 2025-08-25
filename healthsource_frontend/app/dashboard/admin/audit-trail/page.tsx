"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react"
import { useState } from "react"

const auditLogs = [
  {
    id: "1",
    timestamp: "2025-08-15 14:30:25",
    user: "Dr. Priya Sharma",
    role: "Doctor",
    action: "Patient Record Access",
    resource: "Patient ID: 12345",
    ip: "192.168.1.100",
    status: "success",
    details: "Accessed patient medical history",
  },
  {
    id: "2",
    timestamp: "2025-08-15 14:28:15",
    user: "Admin User",
    role: "Admin",
    action: "User Role Change",
    resource: "User: arjun.mehta@hospital.com",
    ip: "192.168.1.50",
    status: "success",
    details: "Changed role from Nurse to Doctor",
  },
  {
    id: "3",
    timestamp: "2025-08-15 14:25:10",
    user: "Unknown",
    role: "N/A",
    action: "Failed Login Attempt",
    resource: "admin@healthscope.ai",
    ip: "203.0.113.45",
    status: "failed",
    details: "Multiple failed login attempts detected",
  },
  {
    id: "4",
    timestamp: "2025-08-15 14:20:05",
    user: "NGO Coordinator",
    role: "NGO",
    action: "Campaign Creation",
    resource: "Campaign: Vaccination Drive 2024",
    ip: "192.168.1.75",
    status: "success",
    details: "Created new vaccination campaign",
  },
  {
    id: "5",
    timestamp: "2025-08-15 14:15:30",
    user: "Hospital Admin",
    role: "Hospital",
    action: "System Configuration",
    resource: "Notification Settings",
    ip: "192.168.1.25",
    status: "warning",
    details: "Modified critical alert thresholds",
  },
]

const statusColors = {
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
}

const statusIcons = {
  success: CheckCircle,
  failed: XCircle,
  warning: AlertTriangle,
}

export default function AuditTrailPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    const matchesRole = roleFilter === "all" || log.role.toLowerCase() === roleFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesRole
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
            <p className="text-muted-foreground">Monitor and track all system activities and user actions</p>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users, actions, or resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="hospital">Hospital</SelectItem>
                  <SelectItem value="ngo">NGO</SelectItem>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs */}
        <Card>
          <CardHeader>
            <CardTitle>System Activity Log</CardTitle>
            <CardDescription>
              Showing {filteredLogs.length} of {auditLogs.length} audit entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLogs.map((log) => {
                const StatusIcon = statusIcons[log.status as keyof typeof statusIcons]
                return (
                  <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <StatusIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium">{log.action}</p>
                          <Badge className={statusColors[log.status as keyof typeof statusColors]}>{log.status}</Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {log.timestamp}
                        </div>
                      </div>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">User:</span> {log.user} ({log.role})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Resource:</span> {log.resource}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">IP Address:</span> {log.ip}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Details:</span> {log.details}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
