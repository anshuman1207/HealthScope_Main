"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, MapPin, Clock, User, Phone, AlertTriangle, CheckCircle } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const casesNeedingHelp = [
  {
    id: "CASE001",
    patient: {
      name: "Elena Rodriguez",
      age: 34,
      location: "Salt Lake District",
      avatar: "/patient-female.png",
    },
    condition: "Diabetes Management Support",
    urgency: "high",
    description: "Single mother struggling with diabetes management, needs medication assistance and education",
    submittedBy: "Community Health Worker",
    submittedAt: "2025-08-20 14:30",
    estimatedCost: "$450",
    requiredResources: ["Insulin", "Blood glucose monitor", "Educational materials"],
    contactInfo: "+1 (555) 123-4567",
    status: "new",
  },
  {
    id: "CASE002",
    patient: {
      name: "James Wilson",
      age: 67,
      location: "Riverside Community",
      avatar: "/patient-male.png",
    },
    condition: "Post-Surgery Recovery Support",
    urgency: "medium",
    description: "Elderly patient needs home care assistance after hip replacement surgery",
    submittedBy: "Hospital Social Worker",
    submittedAt: "2025-08-20 11:15",
    estimatedCost: "$800",
    requiredResources: ["Home care aide", "Medical equipment", "Transportation"],
    contactInfo: "+1 (555) 987-6543",
    status: "assigned",
  },
  {
    id: "CASE003",
    patient: {
      name: "Sarah Kim",
      age: 28,
      location: "Suburban Area",
      avatar: "/patient-female-2.png",
    },
    condition: "Mental Health Crisis Support",
    urgency: "critical",
    description: "Young mother experiencing postpartum depression, needs immediate counseling and support",
    submittedBy: "Family Member",
    submittedAt: "2025-08-20 09:45",
    estimatedCost: "$300",
    requiredResources: ["Counseling sessions", "Support group access", "Childcare assistance"],
    contactInfo: "+1 (555) 456-7890",
    status: "in_progress",
  },
]

export default function CasesNeedingHelpPage() {
  const [filter, setFilter] = useState("all")

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "text-blue-600 bg-blue-50"
      case "assigned":
        return "text-orange-600 bg-orange-50"
      case "in_progress":
        return "text-purple-600 bg-purple-50"
      case "completed":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const handleAssignCase = (id: string) => {
    alert(`Assigned case: ${id}`)
  }

  const handleContactPatient = (phone: string) => {
    alert(`Calling: ${phone}`)
  }

  return (
    <DashboardLayout
      title="Cases Needing Help"
      breadcrumbs={[{ label: "NGO Dashboard", href: "/dashboard/ngo" }, { label: "Cases Needing Help" }]}
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Cases</p>
                  <p className="text-2xl font-bold">47</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical Cases</p>
                  <p className="text-2xl font-bold text-red-600">8</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-purple-600">15</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">24</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cases</SelectItem>
              <SelectItem value="new">New Cases</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cases List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Cases Requiring Assistance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {casesNeedingHelp.map((case_, index) => (
              <motion.div
                key={case_.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 border rounded-lg ${case_.urgency === "critical" ? "border-red-200 bg-red-50/50" : "hover:bg-accent/50"} transition-colors`}
              >
                {/* Case Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={case_.patient.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {case_.patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{case_.patient.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Age: {case_.patient.age} • {case_.patient.location}
                      </p>
                      <p className="text-sm font-medium text-primary mt-1">{case_.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getUrgencyColor(case_.urgency)}>{case_.urgency.toUpperCase()}</Badge>
                    <Badge className={getStatusColor(case_.status)}>{case_.status.replace("_", " ")}</Badge>
                  </div>
                </div>

                {/* Case Details */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-3">{case_.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium mb-2">Required Resources:</h4>
                      <ul className="space-y-1">
                        {case_.requiredResources.map((resource, resourceIndex) => (
                          <li key={resourceIndex} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                            <span>{resource}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>Submitted by: {case_.submittedBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{case_.submittedAt}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{case_.patient.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg">
                    <span className="font-medium">Estimated Cost: </span>
                    <span className="text-lg font-bold text-primary">{case_.estimatedCost}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  {case_.status === "new" && (
                    <Button size="sm" onClick={() => handleAssignCase(case_.id)}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Assign Volunteer
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => handleContactPatient(case_.contactInfo)}>
                    <Phone className="h-4 w-4 mr-1" />
                    Contact Patient
                  </Button>
                  <Button size="sm" variant="outline">
                    <MapPin className="h-4 w-4 mr-1" />
                    View Location
                  </Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
