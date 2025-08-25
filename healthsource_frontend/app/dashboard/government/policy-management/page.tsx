"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { FileText, TrendingUp, Search, Filter, Download, AlertCircle, CheckCircle } from "lucide-react"

export default function PolicyManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const policies = [
    {
      id: 1,
      title: "National Vaccination Policy 2024",
      category: "Vaccination",
      status: "Active",
      implementationDate: "2024-01-01",
      lastReview: "2024-01-15",
      nextReview: "2024-07-01",
      compliance: 94.2,
      statesImplemented: 26,
      budget: 125000000000,
      priority: "High",
    },
    {
      id: 2,
      title: "Disease Surveillance Framework",
      category: "Surveillance",
      status: "Under Review",
      implementationDate: "2024-03-01",
      lastReview: "2024-01-10",
      nextReview: "2024-02-15",
      compliance: 78.6,
      statesImplemented: 18,
      budget: 45000000000,
      priority: "High",
    },
    {
      id: 3,
      title: "Healthcare Worker Safety Protocol",
      category: "Safety",
      status: "Draft",
      implementationDate: "2024-04-01",
      lastReview: "2024-01-20",
      nextReview: "2024-02-20",
      compliance: 0,
      statesImplemented: 0,
      budget: 28000000000,
      priority: "Medium",
    },
    {
      id: 4,
      title: "Emergency Response Guidelines",
      category: "Emergency",
      status: "Active",
      implementationDate: "2023-06-01",
      lastReview: "2024-01-05",
      nextReview: "2024-06-01",
      compliance: 89.1,
      statesImplemented: 28,
      budget: 67000000000,
      priority: "High",
    },
  ]

  const policyMetrics = [
    { metric: "Policy Compliance Rate", value: "87.4%", change: "+2.1%", trend: "up" },
    { metric: "Implementation Speed", value: "156 days", change: "-12 days", trend: "up" },
    { metric: "Stakeholder Satisfaction", value: "4.2/5", change: "+0.3", trend: "up" },
    { metric: "Budget Utilization", value: "92.8%", change: "+5.2%", trend: "up" },
  ]

  const stakeholders = [
    { name: "Ministry of Health", role: "Primary Authority", engagement: "High", lastContact: "2024-01-20" },
    { name: "State Health Departments", role: "Implementation", engagement: "High", lastContact: "2024-01-19" },
    { name: "WHO India", role: "Advisory", engagement: "Medium", lastContact: "2024-01-15" },
    { name: "Medical Associations", role: "Consultation", engagement: "Medium", lastContact: "2024-01-18" },
    { name: "NGO Partners", role: "Community Outreach", engagement: "High", lastContact: "2024-01-17" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Draft":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Suspended":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case "High":
        return "bg-green-100 text-green-800 border-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Policy Management</h1>
            <p className="text-muted-foreground">Healthcare policy development and implementation tracking</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Policy Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              New Policy
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">+3 new this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87.4%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last quarter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Pending approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹2.65L Cr</div>
              <p className="text-xs text-muted-foreground">Allocated for 2024</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Policy Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search policies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Policy Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="vaccination">Vaccination</SelectItem>
                  <SelectItem value="surveillance">Surveillance</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Policy Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="review">Under Review</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="policies" className="space-y-4">
          <TabsList>
            <TabsTrigger value="policies">Policy Overview</TabsTrigger>
            <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
            <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
          </TabsList>

          <TabsContent value="policies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Healthcare Policies</CardTitle>
                <CardDescription>
                  Comprehensive overview of all healthcare policies and their implementation status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {policies.map((policy) => (
                    <div key={policy.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{policy.title}</h3>
                          <Badge className={getStatusColor(policy.status)}>{policy.status}</Badge>
                          <Badge className={getPriorityColor(policy.priority)}>{policy.priority} Priority</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{policy.category}</div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Compliance</p>
                          <p className="font-semibold text-lg text-green-600">{policy.compliance}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">States Implemented</p>
                          <p className="font-semibold text-lg">{policy.statesImplemented}/28</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Budget</p>
                          <p className="font-semibold text-lg">₹{(policy.budget / 10000000000).toFixed(1)}K Cr</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Implementation</p>
                          <p className="font-semibold">{new Date(policy.implementationDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Next Review</p>
                          <p className="font-semibold">{new Date(policy.nextReview).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Compliance Report
                        </Button>
                        <Button size="sm">Edit Policy</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Policy Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators for policy effectiveness</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {policyMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{metric.metric}</h4>
                          <p className="text-sm text-muted-foreground">{metric.change} from last period</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">{metric.value}</p>
                          <div className="flex items-center gap-1">
                            <TrendingUp
                              className={`h-4 w-4 ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`}
                            />
                            <span className={`text-sm ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                              {metric.change}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Implementation Timeline</CardTitle>
                  <CardDescription>Policy rollout progress across states</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>National Vaccination Policy</span>
                        <span>26/28 states</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "93%" }}></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Disease Surveillance Framework</span>
                        <span>18/28 states</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "64%" }}></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Emergency Response Guidelines</span>
                        <span>28/28 states</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stakeholders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Policy Stakeholders</CardTitle>
                <CardDescription>Key stakeholders involved in policy development and implementation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stakeholders.map((stakeholder, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{stakeholder.name}</h3>
                          <Badge className={getEngagementColor(stakeholder.engagement)}>
                            {stakeholder.engagement} Engagement
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Last Contact: {new Date(stakeholder.lastContact).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Role</p>
                          <p className="font-semibold">{stakeholder.role}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Contact
                          </Button>
                          <Button variant="outline" size="sm">
                            Schedule Meeting
                          </Button>
                          <Button size="sm">View History</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
