"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, AlertTriangle, Building2, Users, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MapWidgetProps {
  title?: string
  height?: string
  showControls?: boolean
  focusArea?: "outbreaks" | "hospitals" | "campaigns" | "all"
}

interface QuickLocation {
  id: string
  name: string
  type: "hospital" | "outbreak" | "campaign"
  severity: "low" | "medium" | "high" | "critical"
  cases: number
  coordinates: { x: number; y: number }
}

const quickLocations: QuickLocation[] = [
  {
    id: "quick_001",
    name: "City General",
    type: "hospital",
    severity: "medium",
    cases: 234,
    coordinates: { x: 65, y: 40 },
  },
  {
    id: "quick_002",
    name: "Flu Outbreak",
    type: "outbreak",
    severity: "high",
    cases: 156,
    coordinates: { x: 45, y: 25 },
  },
  {
    id: "quick_003",
    name: "Vaccination Drive",
    type: "campaign",
    severity: "low",
    cases: 0,
    coordinates: { x: 75, y: 60 },
  },
  {
    id: "quick_004",
    name: "Emergency Response",
    type: "outbreak",
    severity: "critical",
    cases: 89,
    coordinates: { x: 30, y: 70 },
  },
]

export function MapWidget({
  title = "Health Map Overview",
  height = "h-80",
  showControls = true,
  focusArea = "all",
}: MapWidgetProps) {
  const [selectedLocation, setSelectedLocation] = useState<QuickLocation | null>(null)

  const filteredLocations = quickLocations.filter((location) => {
    if (focusArea === "all") return true
    if (focusArea === "outbreaks") return location.type === "outbreak"
    if (focusArea === "hospitals") return location.type === "hospital"
    if (focusArea === "campaigns") return location.type === "campaign"
    return true
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
        return <Building2 className="h-3 w-3" />
      case "outbreak":
        return <AlertTriangle className="h-3 w-3" />
      case "campaign":
        return <Users className="h-3 w-3" />
      default:
        return <MapPin className="h-3 w-3" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {title}
          </CardTitle>
          {showControls && (
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Full Map
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg ${height} overflow-hidden`}>
          {/* Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 opacity-50" />

          {/* Grid Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <defs>
              <pattern id="widget-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#94a3b8" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#widget-grid)" />
          </svg>

          {/* Map Locations */}
          {filteredLocations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute cursor-pointer"
              style={{
                left: `${location.coordinates.x}%`,
                top: `${location.coordinates.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => setSelectedLocation(location)}
            >
              <div
                className={`relative p-1.5 rounded-full ${getSeverityColor(
                  location.severity,
                )} text-white shadow-md hover:scale-110 transition-transform`}
              >
                {getTypeIcon(location.type)}

                {/* Pulse for Critical */}
                {location.severity === "critical" && (
                  <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
                )}

                {/* Cases Badge */}
                {location.cases > 0 && (
                  <div className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full px-1 min-w-[16px] text-center leading-4">
                    {location.cases}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Mini Legend */}
          <div className="absolute bottom-2 left-2 bg-white/90 p-2 rounded text-xs">
            <div className="flex gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span>High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Location Info */}
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 border rounded-lg bg-accent/50"
          >
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-sm">{selectedLocation.name}</h5>
              <Badge className={`${getSeverityColor(selectedLocation.severity)} text-white`}>
                {selectedLocation.severity}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="capitalize">{selectedLocation.type}</span>
              {selectedLocation.cases > 0 && <span>{selectedLocation.cases} cases</span>}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
