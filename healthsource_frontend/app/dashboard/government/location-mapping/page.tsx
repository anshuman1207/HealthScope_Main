"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { MapPin, Filter, Download, Users, AlertTriangle, TrendingUp } from "lucide-react"

export default function LocationMappingPage() {
  const [selectedLayer, setSelectedLayer] = useState("vaccination")
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [selectedState, setSelectedState] = useState("all")

  const mapLayers = [
    { id: "vaccination", name: "Vaccination Coverage", color: "bg-blue-500" },
    { id: "outbreaks", name: "Disease Outbreaks", color: "bg-red-500" },
    { id: "hospitals", name: "Healthcare Facilities", color: "bg-green-500" },
    { id: "demographics", name: "Population Density", color: "bg-purple-500" },
  ]

  const stateData = [
    {
      state: "Maharashtra",
      vaccinationRate: 89.2,
      outbreaks: 3,
      hospitals: 1247,
      population: 112374333,
      riskLevel: "Medium",
      coordinates: { lat: 19.7515, lng: 75.7139 },
    },
    {
      state: "Uttar Pradesh",
      vaccinationRate: 76.8,
      outbreaks: 5,
      hospitals: 2156,
      population: 199812341,
      riskLevel: "High",
      coordinates: { lat: 26.8467, lng: 80.9462 },
    },
    {
      state: "Kerala",
      vaccinationRate: 94.6,
      outbreaks: 1,
      hospitals: 892,
      population: 33406061,
      riskLevel: "Low",
      coordinates: { lat: 10.8505, lng: 76.2711 },
    },
    {
      state: "Tamil Nadu",
      vaccinationRate: 91.3,
      outbreaks: 2,
      hospitals: 1089,
      population: 72147030,
      riskLevel: "Low",
      coordinates: { lat: 11.1271, lng: 78.6569 },
    },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Location Mapping</h1>
            <p className="text-muted-foreground">Interactive geographic visualization of health data across India</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Map Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Map
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">States Monitored</CardTitle>
              <MapPin className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">+ 8 Union Territories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Facilities</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25,847</div>
              <p className="text-xs text-muted-foreground">Hospitals & Clinics</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk Areas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Districts requiring attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coverage Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87.4%</div>
              <p className="text-xs text-muted-foreground">National average</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Map Controls</CardTitle>
              <CardDescription>Configure map layers and visualization options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Data Layer</label>
                <Select value={selectedLayer} onValueChange={setSelectedLayer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select layer" />
                  </SelectTrigger>
                  <SelectContent>
                    {mapLayers.map((layer) => (
                      <SelectItem key={layer.id} value={layer.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${layer.color}`} />
                          {layer.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">State Filter</label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                    <SelectItem value="kerala">Kerala</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Show Heatmap</label>
                <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Active Layers</label>
                {mapLayers.map((layer) => (
                  <div key={layer.id} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${layer.color}`} />
                    <span className="text-sm">{layer.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interactive Map Placeholder */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>India Health Map</CardTitle>
              <CardDescription>Interactive visualization of health data across Indian states</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="text-gray-500 font-medium">Interactive Map Component</p>
                  <p className="text-sm text-gray-400">Real-time health data visualization would be displayed here</p>
                  <div className="flex gap-2 justify-center mt-4">
                    <Badge variant="outline">Zoom Controls</Badge>
                    <Badge variant="outline">Layer Toggle</Badge>
                    <Badge variant="outline">Data Points</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* State Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>State-wise Health Data</CardTitle>
            <CardDescription>Detailed health metrics for each state</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stateData.map((state, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{state.state}</h3>
                      <Badge className={getRiskColor(state.riskLevel)}>{state.riskLevel} Risk</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {state.coordinates.lat.toFixed(2)}, {state.coordinates.lng.toFixed(2)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Vaccination Rate</p>
                      <p className="font-semibold text-lg text-blue-600">{state.vaccinationRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Active Outbreaks</p>
                      <p className="font-semibold text-lg text-red-600">{state.outbreaks}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Health Facilities</p>
                      <p className="font-semibold text-lg">{state.hospitals.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Population</p>
                      <p className="font-semibold text-lg">{(state.population / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-3">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Generate Report
                    </Button>
                    <Button size="sm">Focus on Map</Button>
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
