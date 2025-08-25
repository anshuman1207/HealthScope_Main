"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, X, Clock, User, Building, FileText, Eye } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const pendingApprovals = [
  {
    id: "APP001",
    type: "user_registration",
    title: "Doctor Registration - Dr. Priya Sharma",
    description: "Cardiologist seeking platform access",
    submittedBy: "Dr. Priya Sharma",
    submittedAt: "2025-08-20 14:30",
    priority: "high",
    details: {
      specialty: "Cardiology",
      hospital: "City General Hospital",
      license: "MD123456",
      experience: "8 years",
    },
  },
  {
    id: "APP002",
    type: "hospital_registration",
    title: "Hospital Registration - Metro Health Center",
    description: "New hospital requesting platform integration",
    submittedBy: "Admin Team",
    submittedAt: "2025-08-20 10:15",
    priority: "medium",
    details: {
      beds: "150",
      departments: "12",
      location: "Salt Lake Metro",
      accreditation: "JCI Certified",
    },
  },
  {
    id: "APP003",
    type: "ngo_registration",
    title: "NGO Registration - Health for All Foundation",
    description: "Community health NGO application",
    submittedBy: "Anita Menon",
    submittedAt: "2025-08-19 16:45",
    priority: "medium",
    details: {
      focus: "Community Health",
      volunteers: "50+",
      coverage: "Rural Areas",
      established: "2018",
    },
  },
]

export default function ApprovalsPage() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const handleApprove = (id: string) => {
    alert(`Approved: ${id}`)
  }

  const handleReject = (id: string) => {
    alert(`Rejected: ${id}`)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-orange-600 bg-orange-50"
      case "low":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "user_registration":
        return User
      case "hospital_registration":
        return Building
      case "ngo_registration":
        return FileText
      default:
        return FileText
    }
  }

  return (
    <DashboardLayout title="Approvals" breadcrumbs={[{ label: "Admin" }, { label: "Approvals" }]}>
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search approvals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="user_registration">User Registration</SelectItem>
                <SelectItem value="hospital_registration">Hospital Registration</SelectItem>
                <SelectItem value="ngo_registration">NGO Registration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Approval Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved Today</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected Today</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <X className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                  <p className="text-2xl font-bold">2.4h</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingApprovals.map((approval, index) => {
              const IconComponent = getTypeIcon(approval.type)
              return (
                <motion.div
                  key={approval.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{approval.title}</h4>
                        <p className="text-sm text-muted-foreground">{approval.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted by {approval.submittedBy} • {approval.submittedAt}
                        </p>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(approval.priority)}>{approval.priority}</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 text-sm">
                    {Object.entries(approval.details).map(([key, value]) => (
                      <div key={key} className="bg-muted/50 p-2 rounded">
                        <span className="font-medium capitalize">{key}: </span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApprove(approval.id)}>
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(approval.id)}>
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
