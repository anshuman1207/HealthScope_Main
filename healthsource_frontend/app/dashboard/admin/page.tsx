"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Activity,
  Database,
  Shield,
  TrendingUp,
  AlertTriangle,
  Server,
  Globe,
  BarChart3,
  Settings,
  UserCheck,
  Building2,
  Plus,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const systemMetrics = [
  {
    title: "Total Users",
    value: "24,847",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    breakdown: "18.2K patients, 3.4K doctors, 2.1K NGOs, 1.1K hospitals",
  },
  {
    title: "System Uptime",
    value: "99.9%",
    change: "+0.1%",
    trend: "up",
    icon: Server,
    color: "text-green-600",
    breakdown: "Last 30 days average",
  },
  {
    title: "Active Sessions",
    value: "3,247",
    change: "+8%",
    trend: "up",
    icon: Activity,
    color: "text-purple-600",
    breakdown: "Peak: 4.2K at 2:00 PM",
  },
  {
    title: "Data Storage",
    value: "2.4 TB",
    change: "+15%",
    trend: "up",
    icon: Database,
    color: "text-orange-600",
    breakdown: "78% capacity used",
  },
]

const userRoleDistribution = [
  { role: "Patient", count: 18234, percentage: 73.4, color: "bg-blue-500" },
  { role: "Doctor", count: 3421, percentage: 13.8, color: "bg-green-500" },
  { role: "NGO", count: 2156, percentage: 8.7, color: "bg-purple-500" },
  { role: "Hospital", count: 1036, percentage: 4.1, color: "bg-orange-500" },
]

const systemAlerts = [
  {
    id: "alert_001",
    type: "security",
    title: "Multiple failed login attempts detected",
    severity: "high",
    time: "10 min ago",
    status: "investigating",
  },
  {
    id: "alert_002",
    type: "performance",
    title: "Database query response time increased",
    severity: "medium",
    time: "25 min ago",
    status: "monitoring",
  },
  {
    id: "alert_003",
    type: "capacity",
    title: "Storage capacity approaching 80%",
    severity: "medium",
    time: "1 hour ago",
    status: "acknowledged",
  },
  {
    id: "alert_004",
    type: "integration",
    title: "Third-party API rate limit warning",
    severity: "low",
    time: "2 hours ago",
    status: "resolved",
  },
]

const recentActivities = [
  {
    id: "act_001",
    type: "user",
    title: "New hospital registered: City General Hospital",
    time: "15 min ago",
    icon: Building2,
    color: "text-blue-600",
  },
  {
    id: "act_002",
    type: "system",
    title: "System backup completed successfully",
    time: "1 hour ago",
    icon: Database,
    color: "text-green-600",
  },
  {
    id: "act_003",
    type: "security",
    title: "Security patch deployed to production",
    time: "3 hours ago",
    icon: Shield,
    color: "text-purple-600",
  },
  {
    id: "act_004",
    type: "user",
    title: "Bulk user verification completed (234 users)",
    time: "5 hours ago",
    icon: UserCheck,
    color: "text-orange-600",
  },
]

const platformStats = [
  {
    category: "Health Reports Generated",
    value: "45,234",
    change: "+18%",
    period: "This month",
  },
  {
    category: "AI Analyses Performed",
    value: "12,847",
    change: "+25%",
    period: "This month",
  },
  {
    category: "Appointments Scheduled",
    value: "89,456",
    change: "+12%",
    period: "This month",
  },
  {
    category: "Community Campaigns",
    value: "156",
    change: "+8%",
    period: "This month",
  },
]

export default function AdminDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("month")

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "investigating":
        return "text-red-600 bg-red-50"
      case "monitoring":
        return "text-orange-600 bg-orange-50"
      case "acknowledged":
        return "text-blue-600 bg-blue-50"
      case "resolved":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <DashboardLayout title="Admin Dashboard" breadcrumbs={[{ label: "Admin Dashboard" }]}>
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
          <Button variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            Security Center
          </Button>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className={`text-sm ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {metric.change} from last month
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-50 ${metric.color}`}>
                      <metric.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{metric.breakdown}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Role Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userRoleDistribution.map((role, index) => (
                <motion.div
                  key={role.role}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{role.role}</span>
                    <span className="text-sm text-muted-foreground">
                      {role.count.toLocaleString()} ({role.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${role.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${role.percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                    />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {systemAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 border rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-sm line-clamp-2">{alert.title}</h5>
                    <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={getStatusColor(alert.status)}>
                      {alert.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className={`p-2 rounded-full bg-gray-50 ${activity.color}`}>
                    <activity.icon className="h-3 w-3" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Platform Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Platform Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <TabsList>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
                <TabsTrigger value="quarter">This Quarter</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTimeframe} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {platformStats.map((stat, index) => (
                    <motion.div
                      key={stat.category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-4 border rounded-lg"
                    >
                      <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                      <div className="text-sm text-muted-foreground mb-1">{stat.category}</div>
                      <div className="text-xs text-green-600">
                        {stat.change} {stat.period}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Server Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>CPU Usage</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Memory Usage</span>
                  <span>62%</span>
                </div>
                <Progress value={62} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Disk Usage</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Global Reach
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Countries</span>
                <span className="font-semibold">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Cities</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Languages Supported</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Time Zones</span>
                <span className="font-semibold">18</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Security Score</span>
                <Badge className="text-green-600 bg-green-50">Excellent</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Last Security Scan</span>
                <span className="text-sm text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Vulnerabilities</span>
                <span className="font-semibold text-green-600">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">SSL Certificate</span>
                <Badge className="text-green-600 bg-green-50">Valid</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
