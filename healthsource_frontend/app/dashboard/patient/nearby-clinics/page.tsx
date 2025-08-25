"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Phone, Clock, Star, Navigation, Search, Map, Loader2, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Clinic {
  id: string
  name: string
  type: "hospital" | "clinic" | "urgent-care" | "pharmacy" | "doctor"
  address: string
  phone?: string
  distance: number
  rating?: number
  reviews?: number
  hours?: string
  services: string[]
  waitTime?: string
  acceptsInsurance?: boolean
  coordinates: { lat: number; lng: number }
}

interface UserLocation {
  lat: number
  lng: number
  accuracy?: number
}

// Haversine formula for distance calculation
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Query Overpass API for real healthcare data
const fetchNearbyHealthcare = async (lat: number, lng: number, radius = 5000): Promise<Clinic[]> => {
  try {
    const query = `
      [out:json][timeout:25];
      (
        nwr["amenity"="hospital"](around:${radius},${lat},${lng});
        nwr["amenity"="clinic"](around:${radius},${lat},${lng});
        nwr["amenity"="pharmacy"](around:${radius},${lat},${lng});
        nwr["amenity"="doctors"](around:${radius},${lat},${lng});
        nwr["healthcare"](around:${radius},${lat},${lng});
      );
      out center meta;
    `
    
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
    })
    
    if (!response.ok) throw new Error('Failed to fetch data')
    
    const data = await response.json()
    
    return data.elements.map((element: any) => {
      const coords = element.center || { lat: element.lat, lon: element.lon }
      const tags = element.tags || {}
      
      let type: Clinic['type'] = 'clinic'
      if (tags.amenity === 'hospital') type = 'hospital'
      else if (tags.amenity === 'pharmacy') type = 'pharmacy'
      else if (tags.amenity === 'doctors') type = 'doctor'
      else if (tags.healthcare === 'urgent_care') type = 'urgent-care'
      
      const distance = calculateDistance(lat, lng, coords.lat, coords.lon)
      
      return {
        id: element.id.toString(),
        name: tags.name || tags.operator || `${type.charAt(0).toUpperCase() + type.slice(1)} Facility`,
        type,
        address: tags['addr:full'] || 
                 `${tags['addr:housenumber'] || ''} ${tags['addr:street'] || ''}, ${tags['addr:city'] || ''}`.trim() || 
                 'Address not available',
        phone: tags.phone || tags['contact:phone'],
        distance: Math.round(distance * 100) / 100,
        rating: Math.random() * 2 + 3, // Mock rating between 3-5
        reviews: Math.floor(Math.random() * 200) + 10,
        hours: tags.opening_hours || 'Hours not available',
        services: [
          ...(type === 'hospital' ? ['Emergency', 'Surgery'] : []),
          ...(type === 'pharmacy' ? ['Prescriptions', 'Over-the-counter'] : []),
          ...(type === 'clinic' ? ['General Practice', 'Consultations'] : []),
          'Healthcare Services'
        ],
        waitTime: `${Math.floor(Math.random() * 45) + 5} min`,
        acceptsInsurance: Math.random() > 0.2,
        coordinates: { lat: coords.lat, lng: coords.lon }
      }
    }).filter((clinic: Clinic) => clinic.distance <= 10) // Within 10 miles
    .sort((a: Clinic, b: Clinic) => a.distance - b.distance)
    .slice(0, 20) // Limit to 20 results
  } catch (error) {
    console.error('Error fetching healthcare data:', error)
    return []
  }
}

// Get user location with IP fallback
const getUserLocation = async (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        async (error) => {
          console.warn('Geolocation failed, using IP location:', error)
          try {
            // Fallback to IP-based location
            const response = await fetch('https://ipapi.co/json/')
            const data = await response.json()
            resolve({
              lat: data.latitude,
              lng: data.longitude
            })
          } catch (ipError) {
            // Ultimate fallback - Kolkata coordinates
            resolve({
              lat: 40.7128,
              lng: -74.0060
            })
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      )
    } else {
      reject(new Error('Geolocation not supported'))
    }
  })
}

// Map Component using OpenStreetMap
const MapComponent = ({ userLocation, clinics, selectedClinic }: {
  userLocation: UserLocation | null
  clinics: Clinic[]
  selectedClinic?: Clinic
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [mapId, setMapId] = useState(0)

  useEffect(() => {
    if (!mapRef.current || !userLocation) return

    // Generate unique map ID to avoid container reuse
    const currentMapId = Date.now()
    setMapId(currentMapId)

    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      const L = (await import('leaflet')).default
      
      // Fix for default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      })

      // Properly cleanup existing map
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        } catch (e) {
          console.log('Map cleanup error (expected):', e)
        }
      }

      // Clear the container
      if (mapRef.current) {
        mapRef.current.innerHTML = ''
      }

      // Small delay to ensure cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 100))

      if (!mapRef.current) return

      try {
        const map = L.map(mapRef.current, { 
          preferCanvas: true,
          zoomControl: true,
          attributionControl: true
        }).setView([userLocation.lat, userLocation.lng], 12)
        
        mapInstanceRef.current = map

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map)

        // User location marker
        const userIcon = L.divIcon({
          html: '<div style="background: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>',
          className: '',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })
        
        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup('Your Location')

        // Clinic markers
        clinics.forEach(clinic => {
          const color = {
            hospital: '#ef4444',
            clinic: '#3b82f6',
            'urgent-care': '#f97316',
            pharmacy: '#22c55e',
            doctor: '#8b5cf6'
          }[clinic.type] || '#6b7280'

          const clinicIcon = L.divIcon({
            html: `<div style="background: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
            className: '',
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          })

          L.marker([clinic.coordinates.lat, clinic.coordinates.lng], { icon: clinicIcon })
            .addTo(map)
            .bindPopup(`
              <div>
                <strong>${clinic.name}</strong><br>
                <small>${clinic.type.charAt(0).toUpperCase() + clinic.type.slice(1)}</small><br>
                <small>${clinic.distance} miles away</small>
              </div>
            `)
        })

        // Fit bounds to show all markers
        if (clinics.length > 0) {
          const group = L.featureGroup([
            L.marker([userLocation.lat, userLocation.lng]),
            ...clinics.map(clinic => L.marker([clinic.coordinates.lat, clinic.coordinates.lng]))
          ])
          map.fitBounds(group.getBounds().pad(0.1))
        }
      } catch (error) {
        console.error('Map initialization error:', error)
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        } catch (e) {
          console.log('Cleanup error (expected):', e)
        }
      }
    }
  }, [userLocation, clinics, mapId])

  return (
    <>
      <link 
        rel="stylesheet" 
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border relative" 
        style={{ zIndex: 1 }}
        key={mapId}
      />
    </>
  )
}

export default function NearbyClinics() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("distance")
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [locationStatus, setLocationStatus] = useState<'pending' | 'granted' | 'denied'>('pending')

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        setLocationStatus('pending')
        
        const location = await getUserLocation()
        setUserLocation(location)
        setLocationStatus('granted')
        
        const healthcareData = await fetchNearbyHealthcare(location.lat, location.lng)
        setClinics(healthcareData)
        
        if (healthcareData.length === 0) {
          setError('No healthcare facilities found in your area. Showing sample data.')
          // Fallback to mock data if no real data found
          const mockData: Clinic[] = [
            {
              id: "mock_1",
              name: "General Hospital",
              type: "hospital",
              address: "Near your location",
              distance: 0.8,
              rating: 4.5,
              reviews: 234,
              hours: "24/7",
              services: ["Emergency", "Surgery", "General Medicine"],
              waitTime: "15 min",
              acceptsInsurance: true,
              coordinates: { lat: location.lat + 0.01, lng: location.lng + 0.01 }
            },
            {
              id: "mock_2",
              name: "Family Care Clinic",
              type: "clinic",
              address: "Salt Lake Medical Center",
              distance: 1.2,
              rating: 4.2,
              reviews: 89,
              hours: "8AM - 8PM",
              services: ["General Practice", "Consultations", "Vaccinations"],
              waitTime: "25 min",
              acceptsInsurance: true,
              coordinates: { lat: location.lat - 0.01, lng: location.lng - 0.01 }
            },
            {
              id: "mock_3",
              name: "QuickCare Urgent Care",
              type: "urgent-care",
              address: "Main Street Plaza",
              distance: 0.5,
              rating: 4.0,
              reviews: 156,
              hours: "7AM - 11PM",
              services: ["Urgent Care", "X-rays", "Minor Surgery"],
              waitTime: "10 min",
              acceptsInsurance: true,
              coordinates: { lat: location.lat + 0.005, lng: location.lng - 0.005 }
            },
            {
              id: "mock_4",
              name: "HealthPlus Pharmacy",
              type: "pharmacy",
              address: "Shopping Center",
              distance: 0.3,
              rating: 4.3,
              reviews: 67,
              hours: "9AM - 9PM",
              services: ["Prescriptions", "Over-the-counter", "Immunizations"],
              waitTime: "5 min",
              acceptsInsurance: true,
              coordinates: { lat: location.lat - 0.005, lng: location.lng + 0.005 }
            }
          ]
          setClinics(mockData)
        }
      } catch (error) {
        setError('Unable to get your location. Please enable location services or try again.')
        setLocationStatus('denied')
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  // Fixed filtering logic
  const filteredClinics = clinics
    .filter((clinic) => {
      const searchLower = searchTerm.toLowerCase().trim()
      
      // Search filter
      const matchesSearch = !searchLower || 
        clinic.name.toLowerCase().includes(searchLower) ||
        clinic.address.toLowerCase().includes(searchLower) ||
        clinic.type.toLowerCase().includes(searchLower) ||
        clinic.services.some((service) => service.toLowerCase().includes(searchLower)) ||
        (clinic.phone && clinic.phone.includes(searchTerm))
      
      // Type filter
      const matchesType = filterType === "all" || clinic.type === filterType
      
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return a.distance - b.distance
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        default:
          return 0
      }
    })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "hospital":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "clinic":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "urgent-care":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "pharmacy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "doctor":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "urgent-care":
        return "Urgent Care"
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  const handleGetDirections = (clinic: Clinic) => {
    const url = `https://www.openstreetmap.org/directions?from=${userLocation?.lat},${userLocation?.lng}&to=${clinic.coordinates.lat},${clinic.coordinates.lng}`
    window.open(url, '_blank')
  }

  const handleCall = (phone?: string) => {
    if (phone) {
      window.location.href = `tel:${phone}`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Nearby Healthcare</h1>
            <p className="text-muted-foreground">Finding healthcare facilities near you...</p>
          </div>
          
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Getting your location and finding nearby healthcare...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Nearby Healthcare</h1>
          <p className="text-muted-foreground">
            Healthcare facilities within {userLocation ? '10 miles' : 'your area'}
            {userLocation && (
              <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </span>
            )}
          </p>
        </div>

        {error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Search and Filters - Fixed z-index */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by name, address, services, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div style={{ zIndex: 100 }} className="relative">
                  <Select value={filterType} onValueChange={(value) => setFilterType(value)}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent className="z-[100]" style={{ zIndex: 100 }}>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="hospital">Hospitals</SelectItem>
                      <SelectItem value="clinic">Clinics</SelectItem>
                      <SelectItem value="urgent-care">Urgent Care</SelectItem>
                      <SelectItem value="pharmacy">Pharmacies</SelectItem>
                      <SelectItem value="doctor">Doctors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div style={{ zIndex: 99 }} className="relative">
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="z-[99]" style={{ zIndex: 99 }}>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Clinics List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Results Count */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  {filteredClinics.length === 0 
                    ? 'No facilities found'
                    : `Showing ${filteredClinics.length} healthcare ${filteredClinics.length === 1 ? 'facility' : 'facilities'}`
                  }
                  {searchTerm && ` matching "${searchTerm}"`}
                  {filterType !== 'all' && ` in ${getTypeLabel(filterType).toLowerCase()}`}
                </p>
                {searchTerm && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </Button>
                )}
              </div>

              {filteredClinics.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">No healthcare facilities found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredClinics.map((clinic) => (
                  <Card key={clinic.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{clinic.name}</h3>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {clinic.address}
                          </p>
                        </div>
                        <Badge className={getTypeColor(clinic.type)}>{getTypeLabel(clinic.type)}</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Navigation className="h-4 w-4 text-muted-foreground" />
                          <span>{clinic.distance} mi</span>
                        </div>
                        {clinic.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{clinic.rating.toFixed(1)} ({clinic.reviews})</span>
                          </div>
                        )}
                        {clinic.waitTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{clinic.waitTime}</span>
                          </div>
                        )}
                        {clinic.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">{clinic.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">Services:</p>
                        <div className="flex flex-wrap gap-2">
                          {clinic.services.map((service, serviceIndex) => (
                            <Badge key={serviceIndex} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          {clinic.hours && (
                            <>
                              <span className="text-muted-foreground">Hours: </span>
                              <span className="font-medium">{clinic.hours}</span>
                            </>
                          )}
                          {clinic.acceptsInsurance && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Insurance Accepted
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {clinic.phone && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCall(clinic.phone)}
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                          )}
                          <Button 
                            size="sm"
                            onClick={() => handleGetDirections(clinic)}
                          >
                            <Navigation className="h-4 w-4 mr-1" />
                            Directions
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Map */}
            <div>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    Healthcare Map
                  </h3>
                  {userLocation ? (
                    <MapComponent 
                      userLocation={userLocation}
                      clinics={filteredClinics}
                    />
                  ) : (
                    <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Map unavailable</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}