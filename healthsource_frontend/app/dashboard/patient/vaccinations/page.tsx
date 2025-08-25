"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar, Shield, Clock, MapPin, Plus, Search, Filter, Download, CheckCircle2, AlertCircle, X } from "lucide-react"

interface Vaccination {
  id: number
  name: string
  date: string
  location: string
  batch: string
  nextDue: string
  status: "completed" | "due" | "scheduled"
  certificate: string
}

interface UpcomingVaccination {
  id: number
  name: string
  dueDate: string
  priority: "high" | "medium" | "low"
  description: string
}

interface Notification {
  id: number
  message: string
  type: "success" | "error"
}

export default function VaccinationDashboard() {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false)
  const [selectedVaccine, setSelectedVaccine] = useState<UpcomingVaccination | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])

  const [vaccinations, setVaccinations] = useState<Vaccination[]>([
    {
      id: 1,
      name: "COVID-19 Booster",
      date: "2024-01-15",
      location: "Apollo Hospital, Mumbai",
      batch: "COV-2024-001",
      nextDue: "2024-07-15",
      status: "completed",
      certificate: "COV-CERT-2024-001",
    },
    {
      id: 2,
      name: "Influenza",
      date: "2023-10-20",
      location: "Fortis Hospital, Delhi",
      batch: "FLU-2023-045",
      nextDue: "2024-10-20",
      status: "completed",
      certificate: "FLU-CERT-2023-045",
    },
    {
      id: 3,
      name: "Hepatitis B",
      date: "2023-06-10",
      location: "Max Hospital, Bangalore",
      batch: "HEP-2023-012",
      nextDue: "2028-06-10",
      status: "completed",
      certificate: "HEP-CERT-2023-012",
    },
    {
      id: 4,
      name: "Tetanus",
      date: "",
      location: "",
      batch: "",
      nextDue: "2024-12-01",
      status: "due",
      certificate: "",
    },
  ])

  const [upcomingVaccinations, setUpcomingVaccinations] = useState<UpcomingVaccination[]>([
    {
      id: 5,
      name: "Tetanus Booster",
      dueDate: "2024-12-01",
      priority: "high",
      description: "Required every 10 years for continued protection",
    },
    {
      id: 6,
      name: "COVID-19 Annual",
      dueDate: "2024-07-15",
      priority: "medium",
      description: "Annual booster recommended for continued immunity",
    },
  ])

  const [newVaccination, setNewVaccination] = useState<Omit<Vaccination, "id" | "status" | "certificate">>({
    name: "",
    date: "",
    location: "",
    batch: "",
    nextDue: ""
  })

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }

  const filteredVaccinations = vaccinations.filter(vaccine => {
    const matchesSearch = vaccine.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = activeFilter === "all" || vaccine.status === activeFilter
    return matchesSearch && matchesFilter
  })

  const addVaccination = () => {
    if (!newVaccination.name || !newVaccination.date) {
      showNotification("Please fill in required fields", "error")
      return
    }

    const newVac: Vaccination = {
      id: Date.now(),
      ...newVaccination,
      status: "completed",
      certificate: `CERT-${Date.now()}`
    }

    setVaccinations(prev => [...prev, newVac])
    setNewVaccination({ name: "", date: "", location: "", batch: "", nextDue: "" })
    setShowAddModal(false)
    showNotification("Vaccination record added successfully!")
  }

  const scheduleVaccination = (vaccine: UpcomingVaccination) => {
    // Remove from upcoming and add to completed
    const updatedVac: Vaccination = {
      id: vaccine.id,
      name: vaccine.name,
      date: new Date().toISOString().split('T')[0],
      location: "Health Center, Mumbai",
      batch: `BATCH-${Date.now()}`,
      nextDue: vaccine.dueDate,
      status: "scheduled",
      certificate: ""
    }

    setVaccinations(prev => [...prev, updatedVac])
    setUpcomingVaccinations(prev => prev.filter(v => v.id !== vaccine.id))
    setShowScheduleModal(false)
    showNotification(`${vaccine.name} scheduled successfully!`)
  }

  const downloadCertificate = (vaccination: Vaccination) => {
    // Simulate download
    showNotification(`Downloading certificate for ${vaccination.name}`)
    // In real app, this would trigger actual download
  }

  const viewCertificate = (vaccination: Vaccination) => {
    showNotification(`Opening certificate for ${vaccination.name}`)
    // In real app, this would open certificate viewer
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all transform ${
              notification.type === "success" 
                ? "bg-green-500 text-white" 
                : "bg-red-500 text-white"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            {notification.message}
          </div>
        ))}
      </div>

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vaccinations
            </h1>
            <p className="text-gray-600 mt-2">Track your immunization history and upcoming vaccines</p>
          </div>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                Add Vaccination
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Vaccination</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vaccine-name">Vaccine Name *</Label>
                  <Select onValueChange={(value) => setNewVaccination(prev => ({ ...prev, name: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vaccine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COVID-19">COVID-19</SelectItem>
                      <SelectItem value="Influenza">Influenza</SelectItem>
                      <SelectItem value="Hepatitis B">Hepatitis B</SelectItem>
                      <SelectItem value="Tetanus">Tetanus</SelectItem>
                      <SelectItem value="MMR">MMR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    type="date"
                    value={newVaccination.date}
                    onChange={(e) => setNewVaccination(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    placeholder="Hospital/Clinic name"
                    value={newVaccination.location}
                    onChange={(e) => setNewVaccination(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="batch">Batch Number</Label>
                  <Input
                    placeholder="Batch ID"
                    value={newVaccination.batch}
                    onChange={(e) => setNewVaccination(prev => ({ ...prev, batch: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="nextDue">Next Due Date</Label>
                  <Input
                    type="date"
                    value={newVaccination.nextDue}
                    onChange={(e) => setNewVaccination(prev => ({ ...prev, nextDue: e.target.value }))}
                  />
                </div>
                <Button onClick={addVaccination} className="w-full">
                  Add Vaccination
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Total Vaccines</CardTitle>
              <Shield className="h-6 w-6 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-800">{vaccinations.filter(v => v.status === 'completed').length}</div>
              <p className="text-xs text-green-600">Lifetime immunizations</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Up to Date</CardTitle>
              <Calendar className="h-6 w-6 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800">{vaccinations.filter(v => v.status === 'completed').length}</div>
              <p className="text-xs text-blue-600">Current vaccinations</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Due Soon</CardTitle>
              <Clock className="h-6 w-6 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-800">{upcomingVaccinations.length}</div>
              <p className="text-xs text-orange-600">Vaccines needed</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="bg-white shadow-lg border-0">
            <TabsTrigger value="history" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Vaccination History
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Certificates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search vaccinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-0 shadow-lg bg-white"
                />
              </div>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-32 border-0 shadow-lg bg-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="due">Due</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredVaccinations.map((vaccination) => (
                <Card key={vaccination.id} className="border-0 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-semibold text-gray-800">{vaccination.name}</h3>
                          <Badge
                            className={`${
                              vaccination.status === "completed" 
                                ? "bg-green-100 text-green-800 border-green-200" 
                                : vaccination.status === "scheduled"
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }`}
                          >
                            {vaccination.status === "completed" ? "✓ Completed" : 
                             vaccination.status === "scheduled" ? "📅 Scheduled" : "⚠ Due"}
                          </Badge>
                        </div>
                        {vaccination.date && (
                          <div className="flex items-center text-sm text-gray-600 space-x-6">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                              {vaccination.date}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-green-500" />
                              {vaccination.location}
                            </div>
                          </div>
                        )}
                        {vaccination.nextDue && (
                          <p className="text-sm text-orange-600 font-medium">Next due: {vaccination.nextDue}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {vaccination.certificate && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => viewCertificate(vaccination)}
                            className="hover:bg-blue-50 hover:border-blue-300 transition-all"
                          >
                            View Certificate
                          </Button>
                        )}
                        {vaccination.status === "due" && (
                          <Button 
                            size="sm" 
                            onClick={() => {
                              // Convert Vaccination to UpcomingVaccination format for scheduling
                              const upcomingVac: UpcomingVaccination = {
                                id: vaccination.id,
                                name: vaccination.name,
                                dueDate: vaccination.nextDue,
                                priority: "high",
                                description: `${vaccination.name} vaccination due`
                              }
                              setSelectedVaccine(upcomingVac)
                              setShowScheduleModal(true)
                            }}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                          >
                            Schedule
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="space-y-4">
              {upcomingVaccinations.map((vaccine) => (
                <Card key={vaccine.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-semibold text-gray-800">{vaccine.name}</h3>
                          <Badge className={vaccine.priority === "high" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}>
                            {vaccine.priority} priority
                          </Badge>
                        </div>
                        <p className="text-gray-600">{vaccine.description}</p>
                        <div className="flex items-center text-sm text-orange-600 font-medium">
                          <Clock className="h-4 w-4 mr-2" />
                          Due: {vaccine.dueDate}
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          setSelectedVaccine(vaccine)
                          setShowScheduleModal(true)
                        }}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                      >
                        Schedule Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vaccinations
                .filter((v) => v.certificate)
                .map((vaccination) => (
                  <Card 
                    key={vaccination.id} 
                    className="border-0 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer bg-gradient-to-br from-white to-blue-50"
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg text-gray-800">{vaccination.name}</h3>
                          <Badge className="bg-green-100 text-green-800 border-green-200">✓ Verified</Badge>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p><strong>Certificate ID:</strong> {vaccination.certificate}</p>
                          <p><strong>Issued:</strong> {vaccination.date}</p>
                          <p><strong>Location:</strong> {vaccination.location}</p>
                        </div>
                        <Button 
                          onClick={() => downloadCertificate(vaccination)}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Certificate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Schedule Modal */}
        <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Vaccination</DialogTitle>
            </DialogHeader>
            {selectedVaccine && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg text-blue-800">{selectedVaccine.name}</h3>
                  <p className="text-blue-600 text-sm">{selectedVaccine.description}</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>Preferred Date</Label>
                    <Input type="date" defaultValue={selectedVaccine.dueDate} />
                  </div>
                  <div>
                    <Label>Preferred Location</Label>
                    <Select defaultValue="apollo">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apollo">Apollo Hospital, Mumbai</SelectItem>
                        <SelectItem value="fortis">Fortis Hospital, Delhi</SelectItem>
                        <SelectItem value="max">Max Hospital, Bangalore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Preferred Time</Label>
                    <Select defaultValue="morning">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (1 PM - 4 PM)</SelectItem>
                        <SelectItem value="evening">Evening (5 PM - 7 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  onClick={() => scheduleVaccination(selectedVaccine)} 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  Confirm Schedule
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}