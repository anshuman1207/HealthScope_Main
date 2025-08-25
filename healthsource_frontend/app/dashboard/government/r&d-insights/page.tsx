"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Microscope, FlaskConical, TrendingUp, Users, Search, Filter, Download, Lightbulb } from "lucide-react"

export default function RDInsightsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const researchProjects = [
    {
      id: 1,
      title: "Next-Generation COVID-19 Vaccine Development",
      institution: "AIIMS Delhi",
      category: "Vaccine Development",
      status: "Phase III",
      funding: 45000000,
      startDate: "2023-06-15",
      expectedCompletion: "2024-12-31",
      participants: 15000,
      efficacy: 94.2,
      priority: "High",
    },
    {
      id: 2,
      title: "Dengue Vector Control Innovation",
      institution: "ICMR Pune",
      category: "Disease Prevention",
      status: "Phase II",
      funding: 28000000,
      startDate: "2023-03-20",
      expectedCompletion: "2024-08-15",
      participants: 8500,
      efficacy: 78.6,
      priority: "High",
    },
    {
      id: 3,
      title: "AI-Powered Diagnostic Tool for TB",
      institution: "IIT Bombay",
      category: "Diagnostics",
      status: "Phase I",
      funding: 15000000,
      startDate: "2023-09-10",
      expectedCompletion: "2025-03-30",
      participants: 2500,
      efficacy: 89.1,
      priority: "Medium",
    },
    {
      id: 4,
      title: "Malaria Elimination Strategy",
      institution: "NIMR Delhi",
      category: "Disease Prevention",
      status: "Completed",
      funding: 35000000,
      startDate: "2022-01-15",
      expectedCompletion: "2023-12-31",
      participants: 12000,
      efficacy: 92.4,
      priority: "High",
    },
  ]

  const collaborations = [
    {
      name: "WHO Global Health Initiative",
      type: "International",
      projects: 8,
      funding: 125000000,
      status: "Active",
    },
    {
      name: "Gates Foundation Partnership",
      type: "Private",
      projects: 5,
      funding: 89000000,
      status: "Active",
    },
    {
      name: "EU Health Research Consortium",
      type: "International",
      projects: 3,
      funding: 67000000,
      status: "Active",
    },
    {
      name: "BRICS Health Alliance",
      type: "Multilateral",
      projects: 6,
      funding: 45000000,
      status: "Planning",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Phase III":
        return "bg-green-100 text-green-800 border-green-200"
      case "Phase II":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Phase I":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Completed":
        return "bg-purple-100 text-purple-800 border-purple-200"
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">R&D Insights</h1>
            <p className="text-muted-foreground">Research coordination and clinical trial management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Microscope className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">+5 new this quarter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹2,847Cr</div>
              <p className="text-xs text-muted-foreground">Allocated this year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156K</div>
              <p className="text-xs text-muted-foreground">Across all trials</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <FlaskConical className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87.3%</div>
              <p className="text-xs text-muted-foreground">Phase III completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Research Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects or institutions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Research Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="vaccine">Vaccine Development</SelectItem>
                  <SelectItem value="prevention">Disease Prevention</SelectItem>
                  <SelectItem value="diagnostics">Diagnostics</SelectItem>
                  <SelectItem value="treatment">Treatment</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Project Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="phase1">Phase I</SelectItem>
                  <SelectItem value="phase2">Phase II</SelectItem>
                  <SelectItem value="phase3">Phase III</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList>
            <TabsTrigger value="projects">Research Projects</TabsTrigger>
            <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
            <TabsTrigger value="insights">Key Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Research Projects</CardTitle>
                <CardDescription>Comprehensive overview of ongoing R&D initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {researchProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{project.title}</h3>
                          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                          <Badge className={getPriorityColor(project.priority)}>{project.priority} Priority</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{project.institution}</div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Funding</p>
                          <p className="font-semibold text-lg">₹{(project.funding / 10000000).toFixed(1)}Cr</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Participants</p>
                          <p className="font-semibold text-lg">{project.participants.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Efficacy</p>
                          <p className="font-semibold text-lg text-green-600">{project.efficacy}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Start Date</p>
                          <p className="font-semibold">{new Date(project.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Expected Completion</p>
                          <p className="font-semibold">{new Date(project.expectedCompletion).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Progress Report
                        </Button>
                        <Button size="sm">Manage Project</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collaborations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>International Collaborations</CardTitle>
                <CardDescription>Strategic partnerships and joint research initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collaborations.map((collab, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{collab.name}</h3>
                          <Badge variant="outline">{collab.type}</Badge>
                          <Badge
                            className={
                              collab.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {collab.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Active Projects</p>
                          <p className="font-semibold text-lg">{collab.projects}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Funding</p>
                          <p className="font-semibold text-lg">₹{(collab.funding / 10000000).toFixed(0)}Cr</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Partnership Type</p>
                          <p className="font-semibold text-lg">{collab.type}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Key Research Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">Vaccine Development Acceleration</h4>
                    <p className="text-sm text-muted-foreground">
                      AI-assisted drug discovery has reduced development time by 40% for new vaccines.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold">Vector Control Innovation</h4>
                    <p className="text-sm text-muted-foreground">
                      Novel genetic approaches show 85% effectiveness in mosquito population control.
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold">Diagnostic Breakthrough</h4>
                    <p className="text-sm text-muted-foreground">
                      Point-of-care testing accuracy improved to 96% with new biosensor technology.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Research Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Priority Areas for 2024</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Antimicrobial resistance solutions</li>
                      <li>• Climate-adaptive vaccine storage</li>
                      <li>• AI-powered epidemic prediction</li>
                      <li>• Personalized medicine approaches</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Funding Allocation</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• 35% - Vaccine development</li>
                      <li>• 25% - Diagnostic tools</li>
                      <li>• 20% - Disease prevention</li>
                      <li>• 20% - Treatment research</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
