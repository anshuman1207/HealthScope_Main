"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, TrendingUp, AlertTriangle, Activity, Download, Eye, EyeOff } from "lucide-react"

// Type definitions
interface DataPoint {
  id: string;
  lat: number;
  lng: number;
  disease: string;
  intensity: number;
  cases: number;
  location: string;
}

interface DiseaseConfig {
  name: string;
  color: string;
  visible: boolean;
  count: number;
}

interface CommunityMetric {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ComponentType<any>;
  color: string;
}

// Kolkata area bounds
const KOLKATA_BOUNDS = {
  north: 22.6500,
  south: 22.4500,
  east: 88.4500,
  west: 88.2500
}

// Generate random data points around Kolkata
const generateKolkataDataPoints = (): DataPoint[] => {
  const diseases = [
    { name: "Diabetes", color: "#ef4444", baseIntensity: 0.7 },
    { name: "Hypertension", color: "#f59e0b", baseIntensity: 0.6 },
    { name: "Respiratory", color: "#8b5cf6", baseIntensity: 0.8 },
    { name: "Mental Health", color: "#06b6d4", baseIntensity: 0.5 }
  ]

  const kolkataAreas = [
    "Park Street", "Salt Lake", "New Town", "Howrah", "Ballygunge", 
    "Alipore", "Behala", "Jadavpur", "Kankurgachi", "Dum Dum",
    "Barrackpore", "Tollygunge", "Garia", "Rajarhat", "Santoshpur",
    "Baguiati", "Panihati", "Kamarhati", "Barasat", "Madhyamgram"
  ]

  const dataPoints: DataPoint[] = []

  diseases.forEach(disease => {
    for (let i = 0; i < 250; i++) {
      // Generate random coordinates within Kolkata bounds
      const lat = KOLKATA_BOUNDS.south + Math.random() * (KOLKATA_BOUNDS.north - KOLKATA_BOUNDS.south)
      const lng = KOLKATA_BOUNDS.west + Math.random() * (KOLKATA_BOUNDS.east - KOLKATA_BOUNDS.west)
      
      // Add some clustering around major areas
      const clusterLat = lat + (Math.random() - 0.5) * 0.02
      const clusterLng = lng + (Math.random() - 0.5) * 0.02
      
      dataPoints.push({
        id: `${disease.name}-${i}`,
        lat: Math.max(KOLKATA_BOUNDS.south, Math.min(KOLKATA_BOUNDS.north, clusterLat)),
        lng: Math.max(KOLKATA_BOUNDS.west, Math.min(KOLKATA_BOUNDS.east, clusterLng)),
        disease: disease.name,
        intensity: Math.max(0.2, disease.baseIntensity + (Math.random() - 0.5) * 0.4),
        cases: Math.floor(Math.random() * 50) + 1,
        location: kolkataAreas[Math.floor(Math.random() * kolkataAreas.length)]
      })
    }
  })

  return dataPoints
}

// Leaflet Map Component
const LeafletMap = ({ 
  data, 
  diseaseConfig 
}: {
  data: DataPoint[];
  diseaseConfig: DiseaseConfig[];
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const styleRef = useRef<HTMLStyleElement | null>(null)
  const initializingRef = useRef(false)

  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      if (typeof window === 'undefined' || !mapRef.current || leafletMapRef.current || initializingRef.current) {
        return
      }

      // Set flag to prevent multiple initializations
      initializingRef.current = true

      // Check if container already has a map
      if (mapRef.current.classList.contains('leaflet-container')) {
        initializingRef.current = false
        return
      }

      try {
        // Add Leaflet CSS if not already added
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css'
          document.head.appendChild(link)
          
          // Wait for CSS to load
          await new Promise((resolve) => {
            link.onload = resolve
            setTimeout(resolve, 1000) // Fallback timeout
          })
        }

        // Add custom CSS if not already added
        if (!styleRef.current) {
          const style = document.createElement('style')
          style.textContent = `
            .leaflet-container { height: 500px; width: 100%; }
            .leaflet-popup-content { font-size: 12px; }
            .disease-marker {
              border: 2px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .heat-circle {
              border-radius: 50%;
              pointer-events: none;
            }
          `
          document.head.appendChild(style)
          styleRef.current = style
        }

        // Import and initialize Leaflet
        const L = await import('leaflet')
        
        // Final check before initialization
        if (!mapRef.current || leafletMapRef.current || mapRef.current.classList.contains('leaflet-container')) {
          initializingRef.current = false
          return
        }

        // Initialize map
        leafletMapRef.current = L.map(mapRef.current, {
          center: [22.5726, 88.3639],
          zoom: 12,
          zoomControl: true,
          scrollWheelZoom: true
        })

        // Add tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        }).addTo(leafletMapRef.current)

      } catch (error) {
        console.error('Error initializing map:', error)
        leafletMapRef.current = null
      } finally {
        initializingRef.current = false
      }
    }

    initializeMap()

    // Cleanup function
    return () => {
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove()
        } catch (error) {
          console.error('Error during map cleanup:', error)
        }
        leafletMapRef.current = null
      }
      
      if (styleRef.current?.parentNode) {
        try {
          styleRef.current.parentNode.removeChild(styleRef.current)
        } catch (error) {
          console.error('Error removing styles:', error)
        }
        styleRef.current = null
      }

      // Reset container
      if (mapRef.current) {
        mapRef.current.className = 'w-full h-[500px] rounded-lg overflow-hidden border'
        mapRef.current.innerHTML = ''
      }
      
      initializingRef.current = false
    }
  }, [])

  // Update markers when data or config changes
  useEffect(() => {
    if (leafletMapRef.current && typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        try {
          // Clear existing markers
          markersRef.current.forEach(marker => {
            try {
              leafletMapRef.current.removeLayer(marker)
            } catch (error) {
              console.warn('Error removing marker:', error)
            }
          })
          markersRef.current = []

          // Add heat circles first (behind markers)
          const visibleData = data.filter(point => 
            diseaseConfig.find(d => d.name === point.disease)?.visible
          )

          visibleData.forEach(point => {
            const disease = diseaseConfig.find(d => d.name === point.disease)
            if (!disease) return

            try {
              // Create heat zone circle with pixel-based radius
              const heatRadius = point.intensity * 30 + 15
              const heatCircle = L.circleMarker([point.lat, point.lng], {
                color: disease.color,
                fillColor: disease.color,
                fillOpacity: 0.15,
                opacity: 0,
                radius: heatRadius,
                weight: 0
              }).addTo(leafletMapRef.current)

              markersRef.current.push(heatCircle)
            } catch (error) {
              console.warn('Error creating heat circle:', error)
            }
          })

          // Add data point markers
          visibleData.forEach(point => {
            const disease = diseaseConfig.find(d => d.name === point.disease)
            if (!disease) return

            try {
              // Create custom marker
              const markerSize = Math.max(8, point.intensity * 16)
              const markerHtml = `
                <div class="disease-marker" style="
                  background-color: ${disease.color};
                  width: ${markerSize}px;
                  height: ${markerSize}px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 8px;
                  color: white;
                  font-weight: bold;
                ">${point.cases}</div>
              `

              const customIcon = L.divIcon({
                html: markerHtml,
                iconSize: [markerSize, markerSize],
                className: 'custom-marker'
              })

              const marker = L.marker([point.lat, point.lng], { icon: customIcon })
                .bindPopup(`
                  <div class="p-2">
                    <div class="font-bold text-sm" style="color: ${disease.color}">${point.disease}</div>
                    <div class="text-xs mt-1">
                      <div><strong>Location:</strong> ${point.location}</div>
                      <div><strong>Cases:</strong> ${point.cases}</div>
                      <div><strong>Intensity:</strong> ${(point.intensity * 100).toFixed(1)}%</div>
                      <div><strong>Coordinates:</strong> ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</div>
                    </div>
                  </div>
                `)
                .addTo(leafletMapRef.current)

              markersRef.current.push(marker)
            } catch (error) {
              console.warn('Error creating marker:', error)
            }
          })
        } catch (error) {
          console.error('Error updating markers:', error)
        }
      }).catch(error => {
        console.error('Error loading Leaflet for marker update:', error)
      })
    }
  }, [data, diseaseConfig])

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-[500px] rounded-lg overflow-hidden border" />
      
      {/* Map overlay info */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md z-[1000]">
        <div className="text-xs font-medium mb-1 text-gray-700">Active Points</div>
        <div className="text-lg font-bold text-gray-900">
          {data.filter(point => diseaseConfig.find(d => d.name === point.disease)?.visible).length}
        </div>
      </div>

      {/* Map legend */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md max-w-xs z-[1000]">
        <div className="text-xs font-medium mb-2 text-gray-700">Disease Distribution - Kolkata</div>
        <div className="grid grid-cols-1 gap-1">
          {diseaseConfig.filter(d => d.visible).map(disease => (
            <div key={disease.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: disease.color }}
              />
              <span className="text-xs text-gray-700">{disease.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t text-xs text-gray-600">
          <div>• Numbers: Case count</div>
          <div>• Circles: Affected areas</div>
        </div>
      </div>
    </div>
  )
}

const communityMetrics: CommunityMetric[] = [
  {
    title: "Total Cases",
    value: "2,847",
    change: "+12%",
    trend: "up",
    icon: AlertTriangle,
    color: "text-red-600",
  },
  {
    title: "Active Diseases",
    value: "4",
    change: "0%",
    trend: "up",
    icon: Activity,
    color: "text-blue-600",
  },
  {
    title: "Coverage Area",
    value: "Kolkata Metro",
    change: "+8%",
    trend: "up",
    icon: MapPin,
    color: "text-green-600",
  },
  {
    title: "Detection Rate",
    value: "89%",
    change: "+5%",
    trend: "up",
    icon: TrendingUp,
    color: "text-purple-600",
  },
]

export default function CommunityHeatmap() {
  const [dataPoints] = useState<DataPoint[]>(() => generateKolkataDataPoints())
  const [diseaseConfig, setDiseaseConfig] = useState<DiseaseConfig[]>([
    { name: "Diabetes", color: "#ef4444", visible: true, count: 250 },
    { name: "Hypertension", color: "#f59e0b", visible: true, count: 250 },
    { name: "Respiratory", color: "#8b5cf6", visible: true, count: 250 },
    { name: "Mental Health", color: "#06b6d4", visible: true, count: 250 }
  ])

  const toggleDisease = (diseaseName: string) => {
    setDiseaseConfig(prev => 
      prev.map(disease => 
        disease.name === diseaseName 
          ? { ...disease, visible: !disease.visible }
          : disease
      )
    )
  }

  const visibleDiseases = diseaseConfig.filter(d => d.visible)
  const totalVisibleCases = dataPoints
    .filter(point => diseaseConfig.find(d => d.name === point.disease)?.visible)
    .reduce((sum, point) => sum + point.cases, 0)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900">Kolkata Disease Distribution Map</h1>
          <p className="text-gray-600 mt-2">
            Real-time visualization of disease patterns across Kolkata with 1,000 data points from various localities
          </p>
        </div>

        {/* Community Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {communityMetrics.map((metric) => (
            <div
              key={metric.title}
              className="bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.title === "Total Cases" ? totalVisibleCases.toLocaleString() : metric.value}
                  </p>
                  <p className={`text-sm ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {metric.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-gray-50 ${metric.color}`}>
                  <metric.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Map */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold">Disease Distribution Map - Kolkata</h2>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-600">
                      {visibleDiseases.length} of 4 diseases visible
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                      <Download className="h-4 w-4" />
                      Export
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <LeafletMap 
                  data={dataPoints}
                  diseaseConfig={diseaseConfig}
                />
              </div>
            </div>
          </div>

          {/* Disease Controls */}
          <div>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">Disease Layers</h3>
                <p className="text-sm text-gray-600 mt-1">Toggle visibility</p>
              </div>
              <div className="p-4 space-y-3">
                {diseaseConfig.map((disease) => (
                  <div
                    key={disease.name}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => toggleDisease(disease.name)}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: disease.color }}
                      ></div>
                      <div>
                        <div className="font-medium text-sm">{disease.name}</div>
                        <div className="text-xs text-gray-600">{disease.count} points</div>
                      </div>
                    </div>
                    <button
                      className={`p-1 rounded transition-colors ${
                        disease.visible 
                          ? 'text-blue-600 hover:bg-blue-50' 
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      {disease.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t bg-gray-50">
                <div className="text-sm font-medium mb-2">Map Legend</div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>• Markers: Individual cases</div>
                  <div>• Numbers: Case count</div>
                  <div>• Circles: Affected areas</div>
                  <div>• Click markers for details</div>
                </div>
              </div>
            </div>

            {/* Location Stats */}
            <div className="bg-white rounded-lg shadow-sm mt-4">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">Top Affected Areas</h3>
              </div>
              <div className="p-4">
                {["Park Street", "Salt Lake", "New Town", "Howrah", "Ballygunge"].map((area, index) => (
                  <div key={area} className="flex justify-between items-center py-2 border-b last:border-0">
                    <span className="text-sm font-medium">{area}</span>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                      {Math.floor(Math.random() * 50) + 20} cases
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Disease Statistics */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Disease Distribution Analysis - Kolkata Metropolitan Area</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {diseaseConfig.map((disease) => {
                const diseaseData = dataPoints.filter(point => point.disease === disease.name)
                const totalCases = diseaseData.reduce((sum, point) => sum + point.cases, 0)
                const avgIntensity = diseaseData.reduce((sum, point) => sum + point.intensity, 0) / diseaseData.length
                
                return (
                  <div key={disease.name} className="text-center">
                    <div 
                      className="w-8 h-8 rounded-full mx-auto mb-2 border-2 border-white shadow-sm"
                      style={{ backgroundColor: disease.color }}
                    ></div>
                    <h4 className="font-semibold text-gray-900">{disease.name}</h4>
                    <div className="mt-2 space-y-1">
                      <div className="text-2xl font-bold text-gray-900">{totalCases.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Cases</div>
                      <div className="text-sm text-gray-600">
                        Avg Intensity: {(avgIntensity * 100).toFixed(1)}%
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        disease.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {disease.visible ? 'Visible' : 'Hidden'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}