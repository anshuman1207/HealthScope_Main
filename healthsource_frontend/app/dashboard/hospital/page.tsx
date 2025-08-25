"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  Bed,
  Users,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Clock,
  UserCheck,
  Package,
  Heart,
  Stethoscope,
  Building2,
  Plus,
  Eye,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link';


const hospitalMetrics = [
  {
    title: "Bed Occupancy",
    value: "87%",
    total: "234/270",
    change: "+5%",
    trend: "up",
    icon: Bed,
    color: "text-blue-600",
    status: "normal",
  },
  {
    title: "Active Staff",
    value: "156",
    total: "156/180",
    change: "-3",
    trend: "down",
    icon: UserCheck,
    color: "text-green-600",
    status: "normal",
  },
  {
    title: "Critical Patients",
    value: "12",
    total: "12/20",
    change: "+2",
    trend: "up",
    icon: Heart,
    color: "text-red-600",
    status: "warning",
  },
  {
    title: "Equipment Status",
    value: "94%",
    total: "47/50",
    change: "+1",
    trend: "up",
    icon: Stethoscope,
    color: "text-purple-600",
    status: "good",
  },
]

const departmentStatus = [
  {
    name: "Emergency",
    occupancy: 92,
    capacity: 25,
    current: 23,
    waitTime: "15 min",
    status: "critical",
    staff: 8,
  },
  {
    name: "ICU",
    occupancy: 85,
    capacity: 20,
    current: 17,
    waitTime: "N/A",
    status: "high",
    staff: 12,
  },
  {
    name: "General Ward",
    occupancy: 78,
    capacity: 120,
    current: 94,
    waitTime: "2 hours",
    status: "normal",
    staff: 24,
  },
  {
    name: "Pediatrics",
    occupancy: 65,
    capacity: 30,
    current: 19,
    waitTime: "45 min",
    status: "normal",
    staff: 10,
  },
  {
    name: "Maternity",
    occupancy: 70,
    capacity: 25,
    current: 18,
    waitTime: "30 min",
    status: "normal",
    staff: 8,
  },
  {
    name: "Surgery",
    occupancy: 60,
    capacity: 15,
    current: 9,
    waitTime: "1 hour",
    status: "normal",
    staff: 15,
  },
]

const recentAlerts = [
  {
    id: "alert_001",
    type: "critical",
    title: "ICU Bed 7 - Patient vitals critical",
    time: "5 min ago",
    department: "ICU",
    priority: "high",
  },
  {
    id: "alert_002",
    type: "equipment",
    title: "MRI Machine #2 - Maintenance required",
    time: "15 min ago",
    department: "Radiology",
    priority: "medium",
  },
  {
    id: "alert_003",
    type: "staffing",
    title: "Night shift understaffed - Emergency",
    time: "30 min ago",
    department: "Emergency",
    priority: "high",
  },
  {
    id: "alert_004",
    type: "supply",
    title: "Low stock alert - Surgical masks",
    time: "1 hour ago",
    department: "Supply Chain",
    priority: "medium",
  },
]

const upcomingSchedule = [
  {
    id: "sched_001",
    type: "surgery",
    title: "Cardiac Surgery - Room 3",
    time: "14:30",
    duration: "3 hours",
    staff: "Dr. Johnson, 2 nurses",
    status: "confirmed",
  },
  {
    id: "sched_002",
    type: "maintenance",
    title: "CT Scanner Maintenance",
    time: "16:00",
    duration: "2 hours",
    staff: "Tech Team",
    status: "scheduled",
  },
  {
    id: "sched_003",
    type: "meeting",
    title: "Department Heads Meeting",
    time: "17:00",
    duration: "1 hour",
    staff: "All Heads",
    status: "confirmed",
  },
]

export default function HospitalDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("today")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "normal":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-orange-600 bg-orange-50"
      case "low":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 90) return "text-red-600"
    if (occupancy >= 80) return "text-orange-600"
    return "text-green-600"
  }

  return (
    <DashboardLayout title="Hospital Dashboard" breadcrumbs={[{ label: "Hospital Dashboard" }]}>
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Admit Patient
          </Button>
          <Button variant="outline">
            <Bed className="h-4 w-4 mr-2" />
            Bed Management
          </Button>
          <Button variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Staff Schedule
          </Button>
          <Link href="/dashboard/hospital/inventory">
          <Button variant="outline">
            <Package className="h-4 w-4 mr-2" />
            Inventory
          </Button>
          </Link>
        </div>

        {/* Hospital Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hospitalMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-sm text-muted-foreground">{metric.total}</p>
                      <p className={`text-sm ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {metric.change} from yesterday
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-50 ${metric.color}`}>
                      <metric.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Status */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Department Status
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {departmentStatus.map((dept, index) => (
                  <motion.div
                    key={dept.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{dept.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {dept.current}/{dept.capacity} beds • {dept.staff} staff
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(dept.status)}>{dept.status}</Badge>
                        <span className="text-sm text-muted-foreground">Wait: {dept.waitTime}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Occupancy</span>
                        <span className={getOccupancyColor(dept.occupancy)}>{dept.occupancy}%</span>
                      </div>
                      <Progress value={dept.occupancy} className="h-2" />
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Alerts & Schedule */}
          <div className="space-y-6">
            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 border rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm line-clamp-2">{alert.title}</h5>
                      <Badge variant="outline" className={getAlertColor(alert.priority)}>
                        {alert.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{alert.department}</span>
                      <span>{alert.time}</span>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingSchedule.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 border rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm">{item.title}</h5>
                      <Badge variant="outline">{item.status}</Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.time} ({item.duration})
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {item.staff}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hospital Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Hospital Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <TabsList>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTimeframe} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">342</div>
                    <div className="text-sm text-muted-foreground">Patients Treated</div>
                    <div className="text-xs text-green-600 mt-1">+12% vs yesterday</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">28</div>
                    <div className="text-sm text-muted-foreground">Surgeries Completed</div>
                    <div className="text-xs text-green-600 mt-1">+5% vs yesterday</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">4.2</div>
                    <div className="text-sm text-muted-foreground">Avg Length of Stay</div>
                    <div className="text-xs text-red-600 mt-1">+0.3 days vs yesterday</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">96%</div>
                    <div className="text-sm text-muted-foreground">Patient Satisfaction</div>
                    <div className="text-xs text-green-600 mt-1">+2% vs yesterday</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
