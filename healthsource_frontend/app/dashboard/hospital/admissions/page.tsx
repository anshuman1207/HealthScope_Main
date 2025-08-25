"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Filter, Bed, Clock, User, AlertCircle, Eye, ArrowRightLeft, Calendar, Stethoscope, MapPin, X, Save } from "lucide-react"

export default function HospitalAdmissionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("current")
  const [showNewAdmissionForm, setShowNewAdmissionForm] = useState(false)
  const [newPatient, setNewPatient] = useState({
    patientName: "",
    age: "",
    condition: "",
    room: "",
    status: "stable",
    doctor: ""
  })

  const [currentAdmissions, setCurrentAdmissions] = useState([
    {
      id: "ADM001",
      patientName: "John Smith",
      age: 45,
      condition: "Chest Pain",
      admissionDate: "2024-01-15",
      room: "ICU-101",
      status: "critical",
      doctor: "Dr. Johnson",
      estimatedStay: "3-5 days",
    },
    {
      id: "ADM002",
      patientName: "Sarah Wilson",
      age: 32,
      condition: "Pneumonia",
      admissionDate: "2024-01-14",
      room: "Ward-205",
      status: "stable",
      doctor: "Dr. Brown",
      estimatedStay: "2-3 days",
    },
    {
      id: "ADM003",
      patientName: "Michael Davis",
      age: 67,
      condition: "Hip Fracture",
      admissionDate: "2024-01-13",
      room: "Ortho-301",
      status: "recovering",
      doctor: "Dr. Martinez",
      estimatedStay: "7-10 days",
    },
    {
      id: "ADM004",
      patientName: "Emily Johnson",
      age: 28,
      condition: "Appendicitis",
      admissionDate: "2024-01-16",
      room: "Surgery-102",
      status: "critical",
      doctor: "Dr. Smith",
      estimatedStay: "1-2 days",
    },
    {
      id: "ADM005",
      patientName: "Robert Brown",
      age: 55,
      condition: "Diabetes Management",
      admissionDate: "2024-01-12",
      room: "Ward-301",
      status: "stable",
      doctor: "Dr. Wilson",
      estimatedStay: "4-6 days",
    },
  ])

  const pendingAdmissions = [
    {
      id: "PND001",
      patientName: "Lisa Anderson",
      age: 38,
      condition: "Cardiac Monitoring",
      expectedDate: "2024-01-17",
      priority: "high",
      doctor: "Dr. Taylor",
      estimatedStay: "2-4 days",
    },
    {
      id: "PND002",
      patientName: "James Miller",
      age: 72,
      condition: "Stroke Recovery",
      expectedDate: "2024-01-18",
      priority: "medium",
      doctor: "Dr. Davis",
      estimatedStay: "10-14 days",
    },
  ]

  const dischargedPatients = [
    {
      id: "DIS001",
      patientName: "Maria Garcia",
      age: 41,
      condition: "Gallbladder Surgery",
      dischargeDate: "2024-01-16",
      stayDuration: "3 days",
      doctor: "Dr. Lee",
    },
    {
      id: "DIS002",
      patientName: "David Thompson",
      age: 59,
      condition: "Pneumonia Treatment",
      dischargeDate: "2024-01-15",
      stayDuration: "5 days",
      doctor: "Dr. Brown",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "destructive"
      case "stable":
        return "default"
      case "recovering":
        return "secondary"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "default"
      default:
        return "default"
    }
  }

  const filteredAdmissions = currentAdmissions.filter((admission) => {
    const matchesSearch = admission.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admission.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admission.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admission.room.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || admission.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  interface AdmissionDetails {
    patientName: string
    condition: string
    room: string
    doctor: string
    status: string
  }

  const handleViewDetails = (admission: AdmissionDetails) => {
    alert(`Viewing details for ${admission.patientName}\n\nCondition: ${admission.condition}\nRoom: ${admission.room}\nDoctor: ${admission.doctor}\nStatus: ${admission.status}`)
  }

  interface Admission {
    id: string
    patientName: string
    age: number
    condition: string
    admissionDate: string
    room: string
    status: string
    doctor: string
    estimatedStay: string
  }

  interface PendingAdmission {
    id: string
    patientName: string
    age: number
    condition: string
    expectedDate: string
    priority: string
    doctor: string
    estimatedStay: string
  }

  interface DischargedPatient {
    id: string
    patientName: string
    age: number
    condition: string
    dischargeDate: string
    stayDuration: string
    doctor: string
  }

  const handleTransfer = (admission: Admission) => {
    alert(`Initiating transfer for ${admission.patientName}\n\nCurrent Room: ${admission.room}\nThis would open a room assignment dialog.`)
  }

  const handleNewAdmission = () => {
    setShowNewAdmissionForm(true)
  }

  const handleSaveNewAdmission = () => {
    if (!newPatient.patientName || !newPatient.age || !newPatient.condition || !newPatient.room || !newPatient.doctor) {
      alert("Please fill in all fields")
      return
    }

    const newId = `ADM${String(currentAdmissions.length + 1).padStart(3, '0')}`
    const today = new Date().toISOString().split('T')[0]
    
    const admission = {
      id: newId,
      patientName: newPatient.patientName,
      age: parseInt(newPatient.age),
      condition: newPatient.condition,
      admissionDate: today,
      room: newPatient.room,
      status: newPatient.status,
      doctor: newPatient.doctor,
      estimatedStay: "2-4 days", // Default value
    }

    setCurrentAdmissions([...currentAdmissions, admission])
    setNewPatient({
      patientName: "",
      age: "",
      condition: "",
      room: "",
      status: "stable",
      doctor: ""
    })
    setShowNewAdmissionForm(false)
    setActiveTab("current")
  }

  const handleCancelNewAdmission = () => {
    setNewPatient({
      patientName: "",
      age: "",
      condition: "",
      room: "",
      status: "stable",
      doctor: ""
    })
    setShowNewAdmissionForm(false)
  }

  interface AssignBedPatient {
    id: string
    patientName: string
    age: number
    condition: string
    expectedDate: string
    priority: string
    doctor: string
    estimatedStay: string
  }

  const handleAssignBed = (patient: AssignBedPatient) => {
    alert(`Assigning bed for ${patient.patientName}\n\nPriority: ${patient.priority}\nCondition: ${patient.condition}`)
  }

  const criticalCount = currentAdmissions.filter(a => a.status === "critical").length
  const totalBeds = 150
  const occupiedBeds = currentAdmissions.length + 104 // Adding some mock occupied beds
  const availableBeds = totalBeds - occupiedBeds
  const avgStay = 4.2

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hospital Admissions</h1>
            <p className="text-muted-foreground">Manage patient admissions and bed assignments</p>
          </div>
          <Button onClick={handleNewAdmission}>
            <Plus className="mr-2 h-4 w-4" />
            New Admission
          </Button>
        </div>

        {/* New Admission Form Modal */}
        {showNewAdmissionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>New Patient Admission</CardTitle>
                  <Button variant="ghost" size="icon" onClick={handleCancelNewAdmission}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Fill in the patient details to create a new admission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Patient Name *</label>
                    <Input
                      placeholder="Enter full name"
                      value={newPatient.patientName}
                      onChange={(e) => setNewPatient({...newPatient, patientName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Age *</label>
                    <Input
                      type="number"
                      placeholder="Age"
                      value={newPatient.age}
                      onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Medical Condition *</label>
                  <Input
                    placeholder="Primary condition/diagnosis"
                    value={newPatient.condition}
                    onChange={(e) => setNewPatient({...newPatient, condition: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Room Assignment *</label>
                    <Select value={newPatient.room} onValueChange={(value) => setNewPatient({...newPatient, room: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ICU-103">ICU-103</SelectItem>
                        <SelectItem value="Ward-206">Ward-206</SelectItem>
                        <SelectItem value="Ward-207">Ward-207</SelectItem>
                        <SelectItem value="Ortho-302">Ortho-302</SelectItem>
                        <SelectItem value="Surgery-103">Surgery-103</SelectItem>
                        <SelectItem value="Cardio-201">Cardio-201</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Initial Status</label>
                    <Select value={newPatient.status} onValueChange={(value) => setNewPatient({...newPatient, status: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stable">Stable</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="recovering">Recovering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Attending Doctor *</label>
                  <Select value={newPatient.doctor} onValueChange={(value) => setNewPatient({...newPatient, doctor: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
                      <SelectItem value="Dr. Brown">Dr. Brown</SelectItem>
                      <SelectItem value="Dr. Martinez">Dr. Martinez</SelectItem>
                      <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                      <SelectItem value="Dr. Wilson">Dr. Wilson</SelectItem>
                      <SelectItem value="Dr. Taylor">Dr. Taylor</SelectItem>
                      <SelectItem value="Dr. Davis">Dr. Davis</SelectItem>
                      <SelectItem value="Dr. Lee">Dr. Lee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={handleCancelNewAdmission}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveNewAdmission}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Admission
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Admissions</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentAdmissions.length + 122}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Beds</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableBeds}</div>
              <p className="text-xs text-muted-foreground">Out of {totalBeds} total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{criticalCount}</div>
              <p className="text-xs text-muted-foreground">Requires immediate attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Stay</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgStay}</div>
              <p className="text-xs text-muted-foreground">Days per patient</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="current">Current Admissions ({currentAdmissions.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending Admissions ({pendingAdmissions.length})</TabsTrigger>
            <TabsTrigger value="discharged">Recently Discharged ({dischargedPatients.length})</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients, conditions, doctors, or rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="stable">Stable</SelectItem>
                <SelectItem value="recovering">Recovering</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" title="Advanced Filters">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <TabsContent value="current" className="space-y-4">
            <div className="grid gap-4">
              {filteredAdmissions.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center space-y-2">
                      <Search className="h-8 w-8 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">No admissions found matching your criteria.</p>
                      <Button variant="outline" onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}>
                        Clear Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredAdmissions.map((admission) => (
                  <Card key={admission.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {admission.patientName}
                            <span className="text-sm text-muted-foreground font-normal">({admission.id})</span>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              <Stethoscope className="h-3 w-3" />
                              {admission.condition}
                            </span>
                            <span>Age {admission.age}</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {admission.room}
                            </span>
                          </CardDescription>
                        </div>
                        <Badge variant={getStatusColor(admission.status)} className="capitalize">
                          {admission.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-4">
                        <div>
                          <p className="text-sm font-medium flex items-center gap-1 mb-1">
                            <Calendar className="h-3 w-3" />
                            Admission Date
                          </p>
                          <p className="text-sm text-muted-foreground">{admission.admissionDate}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium flex items-center gap-1 mb-1">
                            <User className="h-3 w-3" />
                            Attending Doctor
                          </p>
                          <p className="text-sm text-muted-foreground">{admission.doctor}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium flex items-center gap-1 mb-1">
                            <Clock className="h-3 w-3" />
                            Estimated Stay
                          </p>
                          <p className="text-sm text-muted-foreground">{admission.estimatedStay}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(admission)}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleTransfer(admission)}
                          >
                            <ArrowRightLeft className="mr-1 h-3 w-3" />
                            Transfer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="grid gap-4">
              {pendingAdmissions.map((patient) => (
                <Card key={patient.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {patient.patientName}
                          <span className="text-sm text-muted-foreground font-normal">({patient.id})</span>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Stethoscope className="h-3 w-3" />
                            {patient.condition}
                          </span>
                          <span>Age {patient.age}</span>
                          <span>Expected: {patient.expectedDate}</span>
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusColor(patient.priority)} className="capitalize">
                        {patient.priority} Priority
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-sm font-medium flex items-center gap-1 mb-1">
                          <User className="h-3 w-3" />
                          Assigned Doctor
                        </p>
                        <p className="text-sm text-muted-foreground">{patient.doctor}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium flex items-center gap-1 mb-1">
                          <Clock className="h-3 w-3" />
                          Estimated Stay
                        </p>
                        <p className="text-sm text-muted-foreground">{patient.estimatedStay}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Status</p>
                        <p className="text-sm text-muted-foreground">Waiting for bed assignment</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleAssignBed(patient)}
                        >
                          <Bed className="mr-1 h-3 w-3" />
                          Assign Bed
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="discharged" className="space-y-4">
            <div className="grid gap-4">
              {dischargedPatients.map((patient) => (
                <Card key={patient.id} className="hover:shadow-md transition-shadow opacity-75">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {patient.patientName}
                          <span className="text-sm text-muted-foreground font-normal">({patient.id})</span>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Stethoscope className="h-3 w-3" />
                            {patient.condition}
                          </span>
                          <span>Age {patient.age}</span>
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Discharged</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-sm font-medium flex items-center gap-1 mb-1">
                          <Calendar className="h-3 w-3" />
                          Discharge Date
                        </p>
                        <p className="text-sm text-muted-foreground">{patient.dischargeDate}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium flex items-center gap-1 mb-1">
                          <User className="h-3 w-3" />
                          Doctor
                        </p>
                        <p className="text-sm text-muted-foreground">{patient.doctor}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium flex items-center gap-1 mb-1">
                          <Clock className="h-3 w-3" />
                          Stay Duration
                        </p>
                        <p className="text-sm text-muted-foreground">{patient.stayDuration}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" disabled>
                          <Eye className="mr-1 h-3 w-3" />
                          View Record
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}