"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Plus, Search, Video, Phone } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mockAppointments = [
  {
    id: "APT001",
    doctor: {
      name: "Dr. Priya Sharma",
      specialty: "Endocrinology",
      avatar: "/caring-doctor.png",
    },
    date: "2025-08-22",
    time: "2:00 PM",
    type: "Follow-up",
    status: "confirmed",
    location: "City Medical Center",
    consultationType: "in-person",
    reason: "Diabetes follow-up and medication review",
  },
  {
    id: "APT002",
    doctor: {
      name: "Dr. Michael Chen",
      specialty: "Cardiology",
      avatar: "/cardiologist.png",
    },
    date: "2025-08-28",
    time: "10:30 AM",
    type: "Consultation",
    status: "confirmed",
    location: "Heart Care Clinic",
    consultationType: "video",
    reason: "Chest pain evaluation",
  },
  {
    id: "APT003",
    doctor: {
      name: "Dr. Emily Rodriguez",
      specialty: "General Practice",
      avatar: "/general-doctor.png",
    },
    date: "2024-02-05",
    time: "9:00 AM",
    type: "Annual Checkup",
    status: "pending",
    location: "Family Health Center",
    consultationType: "in-person",
    reason: "Annual physical examination",
  },
]

const mockAvailableDoctors = [
  {
    id: "DOC001",
    name: "Dr. Priya Sharma",
    specialty: "Endocrinology",
    rating: 4.9,
    nextAvailable: "2025-08-25",
    avatar: "/endocrinologist.png",
  },
  {
    id: "DOC002",
    name: "Dr. Michael Chen",
    specialty: "Cardiology",
    rating: 4.8,
    nextAvailable: "2025-08-24",
    avatar: "/cardiologist.png",
  },
  {
    id: "DOC003",
    name: "Dr. Emily Rodriguez",
    specialty: "General Practice",
    rating: 4.7,
    nextAvailable: "2025-08-23",
    avatar: "/general-doctor.png",
  },
]

export default function Appointments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [appointmentReason, setAppointmentReason] = useState("")
  const [appointments, setAppointments] = useState(mockAppointments)
  const [cancelledAppointments, setCancelledAppointments] = useState<string[]>([])

  const filteredAppointments = appointments
    .map(appointment => ({
      ...appointment,
      status: cancelledAppointments.includes(appointment.id) ? 'cancelled' : appointment.status
    }))
    .filter((appointment) => {
      const matchesSearch =
        appointment.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "all" || appointment.status === filterStatus

      return matchesSearch && matchesStatus
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getConsultationIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const handleBookAppointment = () => {
    // In real app, this would make an API call
    alert("Appointment booking request sent! You'll receive a confirmation shortly.")
    setShowBookingDialog(false)
    setSelectedDoctor("")
    setAppointmentReason("")
  }

  const handleCancelAppointment = (appointmentId: string) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      setCancelledAppointments(prev => [...prev, appointmentId])
      alert("Appointment cancelled successfully.")
    }
  }

  return (
    <DashboardLayout title="Appointments" breadcrumbs={[{ label: "Appointments" }]}>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Book New Appointment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="doctor">Select Doctor</Label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAvailableDoctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {doctor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{doctor.name}</p>
                              <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Textarea
                    id="reason"
                    placeholder="Describe your symptoms or reason for the appointment..."
                    value={appointmentReason}
                    onChange={(e) => setAppointmentReason(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleBookAppointment}
                  className="w-full"
                  disabled={!selectedDoctor || !appointmentReason.trim()}
                >
                  Request Appointment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={appointment.doctor.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {appointment.doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="space-y-1">
                        <h3 className="font-semibold">{appointment.doctor.name}</h3>
                        <p className="text-sm text-muted-foreground">{appointment.doctor.specialty}</p>
                        <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {appointment.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {getConsultationIcon(appointment.consultationType)}
                        <span className="capitalize">{appointment.consultationType}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                      <Badge variant="outline">{appointment.type}</Badge>

                      <div className="flex gap-2 mt-2">
                        {appointment.status !== 'cancelled' ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            Cancel
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground px-3 py-1">
                            Cancelled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "You don't have any appointments scheduled yet"}
              </p>
              <Button onClick={() => setShowBookingDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Book Your First Appointment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}