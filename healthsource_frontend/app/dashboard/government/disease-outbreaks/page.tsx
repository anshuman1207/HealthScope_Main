"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, MapPin, TrendingUp, Users, Search, Download, Bell } from "lucide-react"

export default function DiseaseOutbreaksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedState, setSelectedState] = useState("all")
  const [selectedSeverity, setSelectedSeverity] = useState("all")

  const outbreaks = [
    {
      id: 1,
      disease: "Dengue",
      location: "Delhi",
      cases: 1247,
      deaths: 8,
      severity: "High",
      status: "Active",
      startDate: "2024-01-15",
      lastUpdate: "2024-01-20",
      containmentLevel: 85,
    },
    {
      id: 2,
      disease: "Chikungunya",
      location: "Maharashtra",
      cases: 892,
      deaths: 3,
      severity: "Medium",
      status: "Contained",
      startDate: "2024-01-10",
      lastUpdate: "2024-01-19",
      containmentLevel: 95,
    },
    {
      id: 3,
      disease: "Malaria",
      location: "West Bengal",
      cases: 2156,
      deaths: 15,
      severity: "High",
      status: "Active",
      startDate: "2024-01-08",
      lastUpdate: "2024-01-20",
      containmentLevel: 70,
    },
    {
      id: 4,
      disease: "Hepatitis A",
      location: "Gujarat",
      cases: 456,
      deaths: 2,
      severity: "Low",
      status: "Monitoring",
      startDate: "2024-01-12",
      lastUpdate: "2024-01-18",
      containmentLevel: 90,
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-red-100 text-red-800 border-red-200"
      case "Contained":
        return "bg-green-100 text-green-800 border-green-200"
      case "Monitoring":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Disease Outbreaks</h1>
            <p className="text-muted-foreground">Monitor and manage disease outbreaks across India</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Set Alert
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Outbreaks</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4,751</div>
              <p className="text-xs text-muted-foreground">+156 today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">States Affected</CardTitle>
              <MapPin className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">Out of 28 states</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Containment Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by disease or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="west-bengal">West Bengal</SelectItem>
                  <SelectItem value="gujarat">Gujarat</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Severity Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Outbreaks Table */}
        <Card>
          <CardHeader>
            <CardTitle>Current Outbreaks</CardTitle>
            <CardDescription>Real-time monitoring of disease outbreaks across India</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {outbreaks.map((outbreak) => (
                <div key={outbreak.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{outbreak.disease}</h3>
                      <Badge className={getSeverityColor(outbreak.severity)}>{outbreak.severity} Risk</Badge>
                      <Badge className={getStatusColor(outbreak.status)}>{outbreak.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {outbreak.location}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Cases</p>
                      <p className="font-semibold text-lg">{outbreak.cases.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deaths</p>
                      <p className="font-semibold text-lg text-red-600">{outbreak.deaths}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Containment</p>
                      <p className="font-semibold text-lg">{outbreak.containmentLevel}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Start Date</p>
                      <p className="font-semibold">{new Date(outbreak.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Update</p>
                      <p className="font-semibold">{new Date(outbreak.lastUpdate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Update Status
                    </Button>
                    <Button size="sm">Containment Plan</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
