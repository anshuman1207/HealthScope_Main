"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, Eye, Clock, CheckCircle, XCircle, FileText } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const dataRequests = [
  {
    id: "DR001",
    requester: "Dr. Priya Sharma",
    requestType: "Patient Analytics",
    description: "Anonymized patient data for diabetes research study",
    requestedAt: "2025-08-20 14:30",
    status: "pending",
    priority: "high",
    dataType: "Medical Records",
    purpose: "Research",
    estimatedSize: "2.5 GB",
  },
  {
    id: "DR002",
    requester: "Metro Health Center",
    requestType: "Hospital Statistics",
    description: "Quarterly performance metrics and patient flow data",
    requestedAt: "2025-08-20 10:15",
    status: "approved",
    priority: "medium",
    dataType: "Analytics",
    purpose: "Performance Review",
    estimatedSize: "150 MB",
  },
  {
    id: "DR003",
    requester: "Health for All NGO",
    requestType: "Community Health Data",
    description: "Regional health indicators for community outreach planning",
    requestedAt: "2025-08-19 16:45",
    status: "processing",
    priority: "medium",
    dataType: "Public Health",
    purpose: "Community Planning",
    estimatedSize: "500 MB",
  },
]

export default function DataRequestsPage() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const handleApprove = (id: string) => {
    alert(`Approved data request: ${id}`)
  }

  const handleReject = (id: string) => {
    alert(`Rejected data request: ${id}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50"
      case "rejected":
        return "text-red-600 bg-red-50"
      case "pending":
        return "text-orange-600 bg-orange-50"
      case "processing":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return CheckCircle
      case "rejected":
        return XCircle
      case "pending":
        return Clock
      case "processing":
        return Download
      default:
        return FileText
    }
  }

  return (
    <DashboardLayout title="Data Requests" breadcrumbs={[{ label: "Admin" }, { label: "Data Requests" }]}>
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search data requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Request Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold">47</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">8</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-600">32</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data Volume</p>
                  <p className="text-2xl font-bold">12.4 TB</p>
                </div>
                <Download className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Data Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dataRequests.map((request, index) => {
              const StatusIcon = getStatusIcon(request.status)
              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <StatusIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{request.requestType}</h4>
                        <p className="text-sm text-muted-foreground">{request.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Requested by {request.requester} • {request.requestedAt}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 text-sm">
                    <div className="bg-muted/50 p-2 rounded">
                      <span className="font-medium">Data Type: </span>
                      <span className="text-muted-foreground">{request.dataType}</span>
                    </div>
                    <div className="bg-muted/50 p-2 rounded">
                      <span className="font-medium">Purpose: </span>
                      <span className="text-muted-foreground">{request.purpose}</span>
                    </div>
                    <div className="bg-muted/50 p-2 rounded">
                      <span className="font-medium">Size: </span>
                      <span className="text-muted-foreground">{request.estimatedSize}</span>
                    </div>
                    <div className="bg-muted/50 p-2 rounded">
                      <span className="font-medium">Priority: </span>
                      <span className="text-muted-foreground capitalize">{request.priority}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {request.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => handleApprove(request.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(request.id)}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {request.status === "approved" && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
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
