"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, User, Phone, MapPin, Plus, Search, ChevronLeft, ChevronRight, X, Edit, Trash2 } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

const appointments = [
  {
    id: "apt_001",
    patient: "Priya Sharma",
    age: 34,
    condition: "Diabetes Follow-up",
    date: "2025-08-22",
    time: "09:00 AM",
    duration: 30,
    type: "in-person",
    status: "confirmed",
    priority: "routine",
    phone: "+91 97653 15623",
    notes: "Regular check-up, review blood sugar logs",
  },
  {
    id: "apt_002",
    patient: "Michael Chen",
    age: 45,
    condition: "Hypertension Consultation",
    date: "2025-08-22",
    time: "10:30 AM",
    duration: 45,
    type: "in-person",
    status: "confirmed",
    priority: "urgent",
    phone: "+91 73248 37480",
    notes: "Blood pressure concerns, medication adjustment needed",
  },
  {
    id: "apt_003",
    patient: "Emily Rodriguez",
    age: 28,
    condition: "Annual Physical",
    date: "2025-08-22",
    time: "02:00 PM",
    duration: 60,
    type: "in-person",
    status: "pending",
    priority: "routine",
    phone: "+91 83942 29384",
    notes: "First visit, comprehensive health assessment",
  },
  {
    id: "apt_004",
    patient: "David Kumar",
    age: 52,
    condition: "Back Pain Consultation",
    date: "2025-08-25",
    time: "11:00 AM",
    duration: 45,
    type: "in-person",
    status: "confirmed",
    priority: "routine",
    phone: "+91 72394 29348",
    notes: "Follow-up on physical therapy progress",
  },
  {
    id: "apt_005",
    patient: "Sarah Johnson",
    age: 39,
    condition: "Allergy Testing",
    date: "2025-08-26",
    time: "03:30 PM",
    duration: 90,
    type: "in-person",
    status: "pending",
    priority: "routine",
    phone: "+91 92342 293423",
    notes: "Seasonal allergy assessment and testing",
  },
]

const timeSlots = [
  { time: "09:00 AM", available: false, appointment: appointments[0] },
  { time: "09:30 AM", available: true },
  { time: "10:00 AM", available: true },
  { time: "10:30 AM", available: false, appointment: appointments[1] },
  { time: "11:00 AM", available: true },
  { time: "11:30 AM", available: true },
  { time: "02:00 PM", available: false, appointment: appointments[2] },
  { time: "02:30 PM", available: true },
  { time: "03:00 PM", available: true },
  { time: "03:30 PM", available: true },
]

export default function DoctorAppointments() {
  const [selectedDate, setSelectedDate] = useState("2025-08-22")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 7)) // August 2025
  const [activeView, setActiveView] = useState("list")
  const [selectedAppointment, setSelectedAppointment] = useState<typeof appointments[0] | null>(null)
  const [appointmentsList, setAppointmentsList] = useState(appointments)
  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    time: "",
    notes: ""
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-50"
      case "pending":
        return "text-orange-600 bg-orange-50"
      case "cancelled":
        return "text-red-600 bg-red-50"
      case "completed":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-50 border-red-200"
      case "routine":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const filteredAppointments = appointmentsList.filter((apt) => {
    const matchesSearch =
      apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.condition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || apt.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointmentsList(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: "cancelled" }
          : apt
      )
    )
  }

  const handleRescheduleAppointment = (appointmentId: string) => {
    if (rescheduleData.date && rescheduleData.time) {
      setAppointmentsList(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { 
                ...apt, 
                date: rescheduleData.date, 
                time: rescheduleData.time,
                notes: rescheduleData.notes || apt.notes,
                status: "confirmed"
              }
            : apt
        )
      )
      setRescheduleData({ date: "", time: "", notes: "" })
    }
  }

  const handleConfirmAppointment = (appointmentId: string) => {
    setAppointmentsList(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: "confirmed" }
          : apt
      )
    )
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const getAppointmentsForDate = (day: number) => {
    if (!day) return []
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return appointmentsList.filter(apt => apt.date === dateStr)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <DashboardLayout title="Appointments" breadcrumbs={[{ label: "Appointments" }]}>
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
          <Button 
            variant={activeView === "calendar" ? "default" : "outline"}
            onClick={() => setActiveView("calendar")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search patients or conditions..."
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
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Appointment List</TabsTrigger>
            <TabsTrigger value="schedule">Daily Schedule</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {filteredAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{appointment.patient}</h3>
                          <p className="text-muted-foreground">Age: {appointment.age}</p>
                          <p className="text-sm font-medium">{appointment.condition}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(appointment.priority)}>{appointment.priority}</Badge>
                        <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {appointment.time} ({appointment.duration}min)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="capitalize">{appointment.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.phone}</span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>Notes:</strong> {appointment.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedAppointment(appointment)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Appointment Details</DialogTitle>
                          </DialogHeader>
                          {selectedAppointment && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Patient Name</Label>
                                  <p className="text-lg font-semibold">{selectedAppointment.patient}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Age</Label>
                                  <p>{selectedAppointment.age} years</p>
                                </div>
                              </div>
                              
                              <div>
                                <Label className="text-sm font-medium">Condition</Label>
                                <p className="font-medium">{selectedAppointment.condition}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Date & Time</Label>
                                  <p>{selectedAppointment.date} at {selectedAppointment.time}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Duration</Label>
                                  <p>{selectedAppointment.duration} minutes</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Type</Label>
                                  <p className="capitalize">{selectedAppointment.type}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Phone</Label>
                                  <p>{selectedAppointment.phone}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Status</Label>
                                  <Badge className={getStatusColor(selectedAppointment.status)}>
                                    {selectedAppointment.status}
                                  </Badge>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Priority</Label>
                                  <Badge className={getPriorityColor(selectedAppointment.priority)}>
                                    {selectedAppointment.priority}
                                  </Badge>
                                </div>
                              </div>

                              {selectedAppointment.notes && (
                                <div>
                                  <Label className="text-sm font-medium">Notes</Label>
                                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                                    {selectedAppointment.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedAppointment(appointment)
                              setRescheduleData({
                                date: appointment.date,
                                time: appointment.time,
                                notes: appointment.notes
                              })
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Reschedule
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reschedule Appointment</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium">Patient</Label>
                              <p className="font-semibold">{appointment.patient}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="reschedule-date">New Date</Label>
                                <Input
                                  id="reschedule-date"
                                  type="date"
                                  value={rescheduleData.date}
                                  onChange={(e) => setRescheduleData(prev => ({ ...prev, date: e.target.value }))}
                                />
                              </div>
                              <div>
                                <Label htmlFor="reschedule-time">New Time</Label>
                                <Input
                                  id="reschedule-time"
                                  type="time"
                                  value={rescheduleData.time.replace(" AM", "").replace(" PM", "")}
                                  onChange={(e) => setRescheduleData(prev => ({ ...prev, time: e.target.value }))}
                                />
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="reschedule-notes">Additional Notes</Label>
                              <Textarea
                                id="reschedule-notes"
                                placeholder="Add any notes about the rescheduling..."
                                value={rescheduleData.notes}
                                onChange={(e) => setRescheduleData(prev => ({ ...prev, notes: e.target.value }))}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button 
                              onClick={() => handleRescheduleAppointment(appointment.id)}
                              disabled={!rescheduleData.date || !rescheduleData.time}
                            >
                              Confirm Reschedule
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel the appointment for {appointment.patient}? 
                              This action will mark the appointment as cancelled.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Cancel Appointment
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {appointment.status === "pending" && (
                        <Button 
                          size="sm"
                          onClick={() => handleConfirmAppointment(appointment.id)}
                        >
                          Confirm
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Daily Schedule - {selectedDate}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {timeSlots.map((slot, index) => (
                  <motion.div
                    key={slot.time}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 border rounded-lg ${
                      slot.available
                        ? "border-dashed border-muted-foreground/30 hover:bg-muted/50"
                        : "border-solid bg-primary/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium w-20">{slot.time}</div>
                        {slot.appointment ? (
                          <div>
                            <p className="font-medium">{slot.appointment.patient}</p>
                            <p className="text-sm text-muted-foreground">{slot.appointment.condition}</p>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">Available</p>
                        )}
                      </div>
                      {slot.available ? (
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Book
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(slot.appointment?.status || "")}>
                            {slot.appointment?.status}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {dayNames.map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentMonth).map((day, index) => {
                    const dayAppointments = day ? getAppointmentsForDate(day) : []
                    const isToday = day && 
                      currentMonth.getFullYear() === 2025 && 
                      currentMonth.getMonth() === 7 && 
                      day === 22
                    
                    return (
                      <div
                        key={index}
                        className={`min-h-[100px] p-2 border rounded-lg ${
                          day 
                            ? isToday 
                              ? "bg-primary/10 border-primary/30" 
                              : "hover:bg-muted/50" 
                            : "bg-transparent border-transparent"
                        }`}
                      >
                        {day && (
                          <>
                            <div className={`text-sm font-medium mb-1 ${
                              isToday ? "text-primary" : ""
                            }`}>
                              {day}
                            </div>
                            <div className="space-y-1">
                              {dayAppointments.slice(0, 2).map(apt => (
                                <div
                                  key={apt.id}
                                  className="text-xs p-1 rounded bg-primary/20 text-primary truncate"
                                  title={`${apt.time} - ${apt.patient}`}
                                >
                                  {apt.time} {apt.patient}
                                </div>
                              ))}
                              {dayAppointments.length > 2 && (
                                <div className="text-xs text-muted-foreground">
                                  +{dayAppointments.length - 2} more
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}