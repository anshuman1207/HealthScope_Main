"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Calendar,
  Award,
  Clock,
  MapPin,
  Stethoscope,
  Star,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const doctors = [
  {
    id: "doc_001",
    name: "Dr. Priya Sharma",
    specialty: "Cardiology",
    department: "Cardiology",
    experience: "15 years",
    rating: 4.9,
    status: "available",
    shift: "Morning",
    patients: 12,
    phone: "+1 (555) 123-4567",
    email: "s.johnson@hospital.com",
    avatar: "/placeholder.svg?height=40&width=40",
    certifications: ["Board Certified Cardiologist", "Advanced Cardiac Life Support"],
    nextAvailable: "Today 2:00 PM",
  },
  {
    id: "doc_002",
    name: "Dr. Michael Chen",
    specialty: "Emergency Medicine",
    department: "Emergency",
    experience: "8 years",
    rating: 4.7,
    status: "busy",
    shift: "Night",
    patients: 8,
    phone: "+1 (555) 234-5678",
    email: "m.chen@hospital.com",
    avatar: "/placeholder.svg?height=40&width=40",
    certifications: ["Emergency Medicine Board", "Trauma Life Support"],
    nextAvailable: "Tomorrow 8:00 AM",
  },
  {
    id: "doc_003",
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    department: "Pediatrics",
    experience: "12 years",
    rating: 4.8,
    status: "available",
    shift: "Morning",
    patients: 15,
    phone: "+1 (555) 345-6789",
    email: "e.rodriguez@hospital.com",
    avatar: "/placeholder.svg?height=40&width=40",
    certifications: ["Pediatric Board Certification", "Neonatal Resuscitation"],
    nextAvailable: "Today 3:30 PM",
  },
  {
    id: "doc_004",
    name: "Dr. James Wilson",
    specialty: "Orthopedic Surgery",
    department: "Surgery",
    experience: "20 years",
    rating: 4.9,
    status: "in-surgery",
    shift: "Morning",
    patients: 6,
    phone: "+1 (555) 456-7890",
    email: "j.wilson@hospital.com",
    avatar: "/placeholder.svg?height=40&width=40",
    certifications: ["Orthopedic Surgery Board", "Sports Medicine"],
    nextAvailable: "Today 6:00 PM",
  },
]

export default function HospitalDoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-600 bg-green-50 border-green-200"
      case "busy":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "in-surgery":
        return "text-red-600 bg-red-50 border-red-200"
      case "off-duty":
        return "text-gray-600 bg-gray-50 border-gray-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || doctor.department === selectedDepartment
    const matchesStatus = selectedStatus === "all" || doctor.status === selectedStatus
    return matchesSearch && matchesDepartment && matchesStatus
  })

  return (
    <DashboardLayout
      title="Doctors Management"
      breadcrumbs={[{ label: "Hospital Dashboard", href: "/dashboard/hospital" }, { label: "Doctors" }]}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Doctor
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-muted-foreground">Total Doctors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">18</p>
                  <p className="text-sm text-muted-foreground">On Duty</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Stethoscope className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">6</p>
                  <p className="text-sm text-muted-foreground">In Surgery</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Doctors List */}
        <Card>
          <CardHeader>
            <CardTitle>Medical Staff Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
                      <AvatarFallback>
                        {doctor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{doctor.name}</h3>
                          <p className="text-muted-foreground">{doctor.specialty}</p>
                        </div>
                        <Badge className={getStatusColor(doctor.status)}>{doctor.status.replace("-", " ")}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{doctor.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{doctor.shift} Shift</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{doctor.patients} Patients</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{doctor.rating}/5.0</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{doctor.experience} experience</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                        </div>
                        <Button size="sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule
                        </Button>
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-muted-foreground">Next available: {doctor.nextAvailable}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
