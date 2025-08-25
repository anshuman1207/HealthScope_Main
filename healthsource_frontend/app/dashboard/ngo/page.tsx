"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Heart,
  TrendingUp,
  MapPin,
  Calendar,
  Package,
  Target,
  Award,
  Activity,
  AlertTriangle,
  Plus,
  Eye,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const communityMetrics = [
  {
    title: "People Reached",
    value: "12,847",
    change: "+18%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Active Campaigns",
    value: "8",
    change: "+2",
    trend: "up",
    icon: Target,
    color: "text-green-600",
  },
  {
    title: "Volunteers",
    value: "156",
    change: "+12",
    trend: "up",
    icon: Heart,
    color: "text-red-600",
  },
  {
    title: "Resources Distributed",
    value: "2,340",
    change: "+5%",
    trend: "up",
    icon: Package,
    color: "text-purple-600",
  },
]

const activeCampaigns = [
  {
    id: "camp_001",
    name: "Diabetes Awareness Drive",
    location: "Salt Lake Community Center",
    startDate: "2025-08-20",
    endDate: "2025-08-25",
    status: "active",
    progress: 75,
    volunteers: 24,
    peopleReached: 1200,
    priority: "high",
  },
  {
    id: "camp_002",
    name: "Child Vaccination Program",
    location: "Rural Health Clinics",
    startDate: "2025-08-15",
    endDate: "2024-02-15",
    status: "active",
    progress: 45,
    volunteers: 18,
    peopleReached: 850,
    priority: "critical",
  },
  {
    id: "camp_003",
    name: "Mental Health Support Groups",
    location: "Multiple Locations",
    startDate: "2025-08-10",
    endDate: "2024-03-10",
    status: "active",
    progress: 30,
    volunteers: 12,
    peopleReached: 320,
    priority: "medium",
  },
]

const recentActivities = [
  {
    id: "act_001",
    type: "campaign",
    title: "New volunteer joined Diabetes Awareness Drive",
    time: "2 hours ago",
    icon: Users,
    color: "text-blue-600",
  },
  {
    id: "act_002",
    type: "resource",
    title: "Medical supplies delivered to Rural Clinic #3",
    time: "4 hours ago",
    icon: Package,
    color: "text-green-600",
  },
  {
    id: "act_003",
    type: "alert",
    title: "Low vaccine stock alert - Hepatitis B",
    time: "6 hours ago",
    icon: AlertTriangle,
    color: "text-red-600",
  },
  {
    id: "act_004",
    type: "achievement",
    title: "Reached 1000+ people milestone in vaccination program",
    time: "1 day ago",
    icon: Award,
    color: "text-purple-600",
  },
]

const upcomingEvents = [
  {
    id: "event_001",
    title: "Community Health Fair",
    date: "2025-08-25",
    time: "9:00 AM",
    location: "Central Park",
    volunteers: 15,
    status: "confirmed",
  },
  {
    id: "event_002",
    title: "Volunteer Training Session",
    date: "2025-08-28",
    time: "2:00 PM",
    location: "NGO Headquarters",
    volunteers: 8,
    status: "planning",
  },
  {
    id: "event_003",
    title: "Mobile Health Screening",
    date: "2024-02-01",
    time: "10:00 AM",
    location: "Riverside Community",
    volunteers: 12,
    status: "confirmed",
  },
]

export default function NGODashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("month")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "medium":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50"
      case "planning":
        return "text-blue-600 bg-blue-50"
      case "completed":
        return "text-gray-600 bg-gray-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <DashboardLayout title="NGO Dashboard" breadcrumbs={[{ label: "NGO Dashboard" }]}>
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
          <Button variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Manage Volunteers
          </Button>
          <Button variant="outline">
            <Package className="h-4 w-4 mr-2" />
            Resource Distribution
          </Button>
          <Button variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            Community Map
          </Button>
        </div>

        {/* Community Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {communityMetrics.map((metric, index) => (
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
                      <p className={`text-sm ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {metric.change} from last month
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
          {/* Active Campaigns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Active Campaigns
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeCampaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{campaign.name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {campaign.location}
                        </p>
                      </div>
                      <Badge className={getPriorityColor(campaign.priority)}>{campaign.priority}</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{campaign.progress}%</span>
                      </div>
                      <Progress value={campaign.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {campaign.volunteers} volunteers
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {campaign.peopleReached} reached
                      </span>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events & Recent Activity */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 border rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm">{event.title}</h5>
                      <Badge variant="outline" className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {event.date} at {event.time}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{event.volunteers} volunteers assigned</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
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
        </div>

        {/* Community Health Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Community Health Impact
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">2,847</div>
                    <div className="text-sm text-muted-foreground">Health Screenings</div>
                    <div className="text-xs text-green-600 mt-1">+15% vs last period</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">1,234</div>
                    <div className="text-sm text-muted-foreground">Vaccinations Given</div>
                    <div className="text-xs text-green-600 mt-1">+22% vs last period</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">456</div>
                    <div className="text-sm text-muted-foreground">Education Sessions</div>
                    <div className="text-xs text-green-600 mt-1">+8% vs last period</div>
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
