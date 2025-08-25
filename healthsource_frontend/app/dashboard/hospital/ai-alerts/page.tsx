"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Brain, Heart, Activity, Clock, CheckCircle, X } from "lucide-react"

export default function HospitalAIAlertsPage() {
  const [priorityFilter, setPriorityFilter] = useState("all")

  const alerts = [
    {
      id: "AI001",
      type: "critical",
      title: "Sepsis Risk Detected",
      patient: "Rahul Verma - Room ICU-101",
      description: "AI model detected early signs of sepsis based on vital signs and lab results",
      confidence: 94,
      timestamp: "2 minutes ago",
      status: "active",
      icon: AlertTriangle,
      color: "destructive",
    },
    {
      id: "AI002",
      type: "high",
      title: "Cardiac Arrhythmia Pattern",
      patient: "Priya Sharma - Room Ward-205",
      description: "Irregular heart rhythm pattern detected in continuous monitoring",
      confidence: 87,
      timestamp: "15 minutes ago",
      status: "active",
      icon: Heart,
      color: "destructive",
    },
    {
      id: "AI003",
      type: "medium",
      title: "Fall Risk Assessment",
      patient: "Michael Davis - Room Ortho-301",
      description: "Patient mobility patterns suggest increased fall risk",
      confidence: 76,
      timestamp: "1 hour ago",
      status: "acknowledged",
      icon: Activity,
      color: "default",
    },
  ]

  const getAlertIcon = (IconComponent: any) => <IconComponent className="h-4 w-4" />

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Alerts</h1>
            <p className="text-muted-foreground">AI-powered patient monitoring and early warning system</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">Configure AI Models</Button>
            <Button>Alert Settings</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Requiring attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Immediate action needed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2m</div>
              <p className="text-xs text-muted-foreground">Minutes to acknowledge</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.7%</div>
              <p className="text-xs text-muted-foreground">AI prediction accuracy</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="active">Active Alerts</TabsTrigger>
              <TabsTrigger value="acknowledged">Acknowledged</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4">
              {alerts
                .filter((alert) => alert.status === "active")
                .map((alert) => (
                  <Card key={alert.id} className="border-l-4 border-l-red-500">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getAlertIcon(alert.icon)}
                          <div>
                            <CardTitle className="text-lg">{alert.title}</CardTitle>
                            <CardDescription>{alert.patient}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={alert.color}>{alert.type} priority</Badge>
                          <Badge variant="outline">{alert.confidence}% confidence</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{alert.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Acknowledge
                          </Button>
                          <Button variant="outline" size="sm">
                            View Patient
                          </Button>
                          <Button variant="outline" size="sm">
                            <X className="mr-2 h-4 w-4" />
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="acknowledged">
            <Card>
              <CardHeader>
                <CardTitle>Acknowledged Alerts</CardTitle>
                <CardDescription>Alerts that have been reviewed by medical staff</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {alerts
                    .filter((alert) => alert.status === "acknowledged")
                    .map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getAlertIcon(alert.icon)}
                          <div>
                            <p className="font-medium">{alert.title}</p>
                            <p className="text-sm text-muted-foreground">{alert.patient}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">Acknowledged</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resolved">
            <Card>
              <CardHeader>
                <CardTitle>Resolved Alerts</CardTitle>
                <CardDescription>Successfully resolved AI alerts from the past 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No resolved alerts in the selected timeframe.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
