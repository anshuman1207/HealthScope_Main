"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Star,
  Edit,
  MoreHorizontal,
  UserPlus,
  Send,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Volunteer {
  id: string
  name: string
  email: string
  phone: string
  location: string
  joinDate: string
  status: "active" | "inactive" | "pending"
  skills: string[]
  availability: "full-time" | "part-time" | "weekends" | "flexible"
  campaigns: number
  hoursContributed: number
  rating: number
  avatar?: string
  specializations: string[]
  lastActive: string
}

const volunteers: Volunteer[] = [
  {
    id: "vol_001",
    name: "Priya Sharma",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "Salt Lake District",
    joinDate: "2023-06-15",
    status: "active",
    skills: ["First Aid", "Community Outreach", "Data Collection"],
    availability: "part-time",
    campaigns: 8,
    hoursContributed: 156,
    rating: 4.9,
    specializations: ["Health Education", "Emergency Response"],
    lastActive: "2025-08-15",
  },
  {
    id: "vol_002",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    location: "Riverside Community",
    joinDate: "2023-08-22",
    status: "active",
    skills: ["Medical Background", "Translation", "Leadership"],
    availability: "weekends",
    campaigns: 12,
    hoursContributed: 203,
    rating: 4.8,
    specializations: ["Vaccination Programs", "Medical Screening"],
    lastActive: "2025-08-14",
  },
  {
    id: "vol_003",
    name: "Lisa Rodriguez",
    email: "lisa.rodriguez@email.com",
    phone: "+1 (555) 345-6789",
    location: "Central Park Area",
    joinDate: "2023-09-10",
    status: "active",
    skills: ["Psychology", "Counseling", "Group Facilitation"],
    availability: "flexible",
    campaigns: 6,
    hoursContributed: 89,
    rating: 4.7,
    specializations: ["Mental Health Support", "Community Counseling"],
    lastActive: "2025-08-13",
  },
  {
    id: "vol_004",
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (555) 456-7890",
    location: "Tech District",
    joinDate: "2023-11-05",
    status: "pending",
    skills: ["IT Support", "Data Analysis", "Social Media"],
    availability: "part-time",
    campaigns: 0,
    hoursContributed: 0,
    rating: 0,
    specializations: ["Digital Outreach", "Data Management"],
    lastActive: "2025-08-10",
  },
]

export default function VolunteerManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null)

  const filteredVolunteers = volunteers.filter((volunteer) => {
    const matchesSearch =
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || volunteer.status === statusFilter
    const matchesAvailability = availabilityFilter === "all" || volunteer.availability === availabilityFilter

    return matchesSearch && matchesStatus && matchesAvailability
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50"
      case "inactive":
        return "text-gray-600 bg-gray-50"
      case "pending":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "full-time":
        return "text-blue-600 bg-blue-50"
      case "part-time":
        return "text-purple-600 bg-purple-50"
      case "weekends":
        return "text-orange-600 bg-orange-50"
      case "flexible":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <DashboardLayout
      title="Volunteer Management"
      breadcrumbs={[{ label: "NGO Dashboard", href: "/dashboard/ngo" }, { label: "Volunteers" }]}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search volunteers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Availability</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="weekends">Weekends</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Volunteer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite New Volunteer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="volunteer@email.com" />
                </div>
                <div>
                  <Label htmlFor="message">Invitation Message</Label>
                  <Textarea id="message" placeholder="Personalized invitation message..." rows={4} />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Volunteer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Volunteers</p>
                  <p className="text-2xl font-bold">{volunteers.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {volunteers.filter((v) => v.status === "active").length}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold">{volunteers.reduce((sum, v) => sum + v.hoursContributed, 0)}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">
                    {(
                      volunteers.reduce((sum, v) => sum + v.rating, 0) / volunteers.filter((v) => v.rating > 0).length
                    ).toFixed(1)}
                  </p>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Volunteer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredVolunteers.map((volunteer, index) => (
              <motion.div
                key={volunteer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={volunteer.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {volunteer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{volunteer.name}</CardTitle>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(volunteer.rating)}
                            <span className="text-sm text-muted-foreground ml-1">({volunteer.rating.toFixed(1)})</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge className={getStatusColor(volunteer.status)}>{volunteer.status}</Badge>
                        <Badge variant="outline" className={getAvailabilityColor(volunteer.availability)}>
                          {volunteer.availability}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {volunteer.email}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {volunteer.phone}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {volunteer.location}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Skills</h5>
                      <div className="flex flex-wrap gap-1">
                        {volunteer.skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Specializations</h5>
                      <div className="flex flex-wrap gap-1">
                        {volunteer.specializations.map((spec, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Campaigns</span>
                        <p className="font-semibold">{volunteer.campaigns}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Hours</span>
                        <p className="font-semibold">{volunteer.hoursContributed}</p>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Joined: {volunteer.joinDate} • Last active: {volunteer.lastActive}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Mail className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  )
}
