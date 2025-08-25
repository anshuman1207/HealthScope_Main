"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin,
  Layers,
  Filter,
  Search,
  AlertTriangle,
  TrendingUp,
  Users,
  Building2,
  Activity,
  Eye,
  Zap,
  Heart,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface MapLocation {
  id: string
  name: string
  type: "hospital" | "clinic" | "outbreak" | "campaign" | "hotspot"
  lat: number
  lng: number
  data: {
    cases?: number
    severity?: "low" | "medium" | "high" | "critical"
    population?: number
    lastUpdated?: string
    description?: string
    status?: string
  }
}

interface OutbreakData {
  id: string
  disease: string
  location: string
  cases: number
  deaths: number
  recovered: number
  severity: "low" | "medium" | "high" | "critical"
  trend: "increasing" | "stable" | "decreasing"
  lastUpdated: string
  coordinates: { lat: number; lng: number }
}

const mapLocations: MapLocation[] = [
  {
    id: "hosp_001",
    name: "City General Hospital",
    type: "hospital",
    lat: 40.7128,
    lng: -74.006,
    data: {
      cases: 234,
      severity: "medium",
      population: 500,
      status: "operational",
      description: "Main city hospital with 500 bed capacity",
    },
  },
  {
    id: "outbreak_001",
    name: "Flu Outbreak - Salt Lake",
    type: "outbreak",
    lat: 40.7589,
    lng: -73.9851,
    data: {
      cases: 156,
      severity: "high",
      population: 12000,
      lastUpdated: "2025-08-15",
      description: "Seasonal flu outbreak affecting downtown area",
    },
  },
  {
    id: "clinic_001",
    name: "Community Health Clinic",
    type: "clinic",
    lat: 40.7505,
    lng: -73.9934,
    data: {
      cases: 45,
      severity: "low",
      population: 150,
      status: "operational",
      description: "Primary care clinic serving local community",
    },
  },
  {
    id: "campaign_001",
    name: "Vaccination Drive",
    type: "campaign",
    lat: 40.7282,
    lng: -73.7949,
    data: {
      cases: 0,
      severity: "low",
      population: 500,
      status: "active",
      description: "Community vaccination campaign",
    },
  },
  {
    id: "hotspot_001",
    name: "High Risk Area",
    type: "hotspot",
    lat: 40.6892,
    lng: -74.0445,
    data: {
      cases: 89,
      severity: "critical",
      population: 8000,
      lastUpdated: "2025-08-15",
      description: "Area with elevated health risks",
    },
  },
]

const outbreakData: OutbreakData[] = [
  {
    id: "outbreak_001",
    disease: "Seasonal Flu",
    location: "Salt Lake District",
    cases: 156,
    deaths: 2,
    recovered: 89,
    severity: "high",
    trend: "increasing",
    lastUpdated: "2025-08-15",
    coordinates: { lat: 40.7589, lng: -73.9851 },
  },
  {
    id: "outbreak_002",
    disease: "Food Poisoning",
    location: "Riverside Community",
    cases: 34,
    deaths: 0,
    recovered: 28,
    severity: "medium",
    trend: "decreasing",
    lastUpdated: "2025-08-14",
    coordinates: { lat: 40.7282, lng: -73.7949 },
  },
  {
    id: "outbreak_003",
    disease: "Respiratory Infection",
    location: "Industrial Area",
    cases: 89,
    deaths: 1,
    recovered: 45,
    severity: "critical",
    trend: "stable",
    lastUpdated: "2025-08-15",
    coordinates: { lat: 40.6892, lng: -74.0445 },
  },
]

export default function InteractiveMap() {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [mapLayers, setMapLayers] = useState({
    hospitals: true,
    clinics: true,
    outbreaks: true,
    campaigns: true,
    hotspots: true,
    heatmap: false,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [heatmapIntensity, setHeatmapIntensity] = useState([70])

  const filteredLocations = mapLocations.filter((location) => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === "all" || location.data.severity === severityFilter
    const matchesLayer = mapLayers[location.type as keyof typeof mapLayers]

    return matchesSearch && matchesSeverity && matchesLayer
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hospital":
        return <Building2 className="h-4 w-4" />
      case "clinic":
        return <Heart className="h-4 w-4" />
      case "outbreak":
        return <AlertTriangle className="h-4 w-4" />
      case "campaign":
        return <Users className="h-4 w-4" />
      case "hotspot":
        return <Zap className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "text-red-600"
      case "decreasing":
        return "text-green-600"
      case "stable":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <DashboardLayout title="Health Map & Outbreak Tracking" breadcrumbs={[{ label: "Health Map" }]}>
      <div className="space-y-6">
        {/* Map Controls */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row gap-4 justify-between">
              <div className="flex flex-1 gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button variant="outline" size="sm">
                  <Layers className="h-4 w-4 mr-2" />
                  Layers
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(mapLayers).map(([layer, enabled]) => (
                <div key={layer} className="flex items-center space-x-2">
                  <Switch
                    id={layer}
                    checked={enabled}
                    onCheckedChange={(checked) => setMapLayers((prev) => ({ ...prev, [layer]: checked }))}
                  />
                  <Label htmlFor={layer} className="text-sm capitalize">
                    {layer}
                  </Label>
                </div>
              ))}
            </div>

            {mapLayers.heatmap && (
              <div className="mt-4 space-y-2">
                <Label className="text-sm">Heatmap Intensity</Label>
                <Slider
                  value={heatmapIntensity}
                  onValueChange={setHeatmapIntensity}
                  max={100}
                  step={10}
                  className="w-full max-w-md"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Interactive Map */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Interactive Health Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-[600px] overflow-hidden">
                  {/* Mock Map Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 opacity-50" />

                  {/* Map Grid Lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-20">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>

                  {/* Map Locations */}
                  <AnimatePresence>
                    {filteredLocations.map((location, index) => (
                      <motion.div
                        key={location.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="absolute cursor-pointer"
                        style={{
                          left: `${((location.lng + 74.1) / 0.3) * 100}%`,
                          top: `${((40.8 - location.lat) / 0.15) * 100}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        onClick={() => setSelectedLocation(location)}
                      >
                        <div
                          className={`relative p-2 rounded-full ${getSeverityColor(
                            location.data.severity || "low",
                          )} text-white shadow-lg hover:scale-110 transition-transform`}
                        >
                          {getTypeIcon(location.type)}

                          {/* Pulse Animation for Critical Items */}
                          {location.data.severity === "critical" && (
                            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
                          )}

                          {/* Cases Badge */}
                          {location.data.cases && location.data.cases > 0 && (
                            <div className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full px-1 min-w-[20px] text-center">
                              {location.data.cases}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Heatmap Overlay */}
                  {mapLayers.heatmap && (
                    <div className="absolute inset-0 pointer-events-none">
                      {filteredLocations.map((location) => (
                        <div
                          key={`heatmap-${location.id}`}
                          className="absolute rounded-full"
                          style={{
                            left: `${((location.lng + 74.1) / 0.3) * 100}%`,
                            top: `${((40.8 - location.lat) / 0.15) * 100}%`,
                            transform: "translate(-50%, -50%)",
                            width: `${(location.data.cases || 10) * 2}px`,
                            height: `${(location.data.cases || 10) * 2}px`,
                            background: `radial-gradient(circle, rgba(239, 68, 68, ${
                              heatmapIntensity[0] / 100
                            }) 0%, transparent 70%)`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Map Legend */}
                  <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                    <h4 className="font-semibold text-sm mb-2">Legend</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <span>Critical</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full" />
                        <span>High</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span>Medium</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span>Low</span>
                      </div>
                    </div>
                  </div>

                  {/* Zoom Controls */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button size="sm" variant="outline" className="bg-white">
                      +
                    </Button>
                    <Button size="sm" variant="outline" className="bg-white">
                      -
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location Details & Outbreak Data */}
          <div className="space-y-6">
            {/* Selected Location Details */}
            {selectedLocation ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={selectedLocation.id}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {getTypeIcon(selectedLocation.type)}
                      {selectedLocation.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getSeverityColor(selectedLocation.data.severity || "low")} text-white`}>
                        {selectedLocation.data.severity}
                      </Badge>
                      <Badge variant="outline">{selectedLocation.type}</Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">{selectedLocation.data.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedLocation.data.cases && (
                        <div>
                          <span className="text-muted-foreground">Cases</span>
                          <p className="font-semibold">{selectedLocation.data.cases}</p>
                        </div>
                      )}
                      {selectedLocation.data.population && (
                        <div>
                          <span className="text-muted-foreground">Capacity</span>
                          <p className="font-semibold">{selectedLocation.data.population}</p>
                        </div>
                      )}
                    </div>

                    {selectedLocation.data.lastUpdated && (
                      <div className="text-xs text-muted-foreground">
                        Last updated: {selectedLocation.data.lastUpdated}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Activity className="h-3 w-3 mr-1" />
                        Track
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Select a Location</h3>
                  <p className="text-muted-foreground text-sm">
                    Click on any marker on the map to view detailed information.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Active Outbreaks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Active Outbreaks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {outbreakData.map((outbreak, index) => (
                  <motion.div
                    key={outbreak.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => {
                      const location = mapLocations.find((l) => l.id === outbreak.id)
                      if (location) setSelectedLocation(location)
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm">{outbreak.disease}</h5>
                      <Badge className={getSeverityColor(outbreak.severity) + " text-white"}>{outbreak.severity}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{outbreak.location}</p>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Cases</span>
                        <p className="font-semibold">{outbreak.cases}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Deaths</span>
                        <p className="font-semibold text-red-600">{outbreak.deaths}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Recovered</span>
                        <p className="font-semibold text-green-600">{outbreak.recovered}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className={`font-medium ${getTrendColor(outbreak.trend)}`}>
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                        {outbreak.trend}
                      </span>
                      <span className="text-muted-foreground">{outbreak.lastUpdated}</span>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
