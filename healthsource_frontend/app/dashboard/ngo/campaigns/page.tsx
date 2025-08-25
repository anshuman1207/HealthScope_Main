"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, MapPin, Users, Calendar, TrendingUp, Edit, Eye, MoreHorizontal, AlertCircle } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"

interface Campaign {
  id: string
  name: string
  description: string
  location: string
  startDate: string
  endDate: string
  status: "planning" | "active" | "completed" | "paused"
  priority: "low" | "medium" | "high" | "critical"
  progress: number
  volunteers: number
  peopleReached: number
  budget: number
  budgetUsed: number
  category: "vaccination" | "screening" | "education" | "emergency" | "awareness"
  coordinator: string
}

const campaigns: Campaign[] = [
  {
    id: "camp_001",
    name: "Diabetes Awareness Drive",
    description: "Community-wide diabetes screening and education program targeting high-risk populations.",
    location: "Salt Lake Community Center",
    startDate: "2025-08-20",
    endDate: "2025-08-25",
    status: "active",
    priority: "high",
    progress: 75,
    volunteers: 24,
    peopleReached: 1200,
    budget: 15000,
    budgetUsed: 11250,
    category: "awareness",
    coordinator: "Dr. Priya Sharma",
  },
  {
    id: "camp_002",
    name: "Child Vaccination Program",
    description: "Comprehensive vaccination drive for children under 5 in rural communities.",
    location: "Rural Health Clinics",
    startDate: "2025-08-15",
    endDate: "2024-02-15",
    status: "active",
    priority: "critical",
    progress: 45,
    volunteers: 18,
    peopleReached: 850,
    budget: 25000,
    budgetUsed: 12500,
    category: "vaccination",
    coordinator: "Dr. Michael Chen",
  },
  {
    id: "camp_003",
    name: "Mental Health Support Groups",
    description: "Weekly support group sessions for community mental health awareness and support.",
    location: "Multiple Locations",
    startDate: "2025-08-10",
    endDate: "2024-03-10",
    status: "active",
    priority: "medium",
    progress: 30,
    volunteers: 12,
    peopleReached: 320,
    budget: 8000,
    budgetUsed: 2400,
    category: "education",
    coordinator: "Dr. Lisa Rodriguez",
  },
  {
    id: "camp_004",
    name: "Emergency Response Training",
    description: "Training community volunteers in basic emergency response and first aid.",
    location: "NGO Training Center",
    startDate: "2024-02-01",
    endDate: "2024-02-05",
    status: "planning",
    priority: "high",
    progress: 10,
    volunteers: 8,
    peopleReached: 0,
    budget: 5000,
    budgetUsed: 500,
    category: "emergency",
    coordinator: "John Martinez",
  },
]

export default function CampaignManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
    const matchesPriority = priorityFilter === "all" || campaign.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "medium":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "low":
        return "text-gray-600 bg-gray-50 border-gray-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50"
      case "planning":
        return "text-blue-600 bg-blue-50"
      case "completed":
        return "text-gray-600 bg-gray-50"
      case "paused":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "vaccination":
        return "💉"
      case "screening":
        return "🔍"
      case "education":
        return "📚"
      case "emergency":
        return "🚨"
      case "awareness":
        return "📢"
      default:
        return "📋"
    }
  }

  return (
    <DashboardLayout
      title="Campaign Management"
      breadcrumbs={[{ label: "NGO Dashboard", href: "/dashboard/ngo" }, { label: "Campaigns" }]}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search campaigns..."
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
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input id="name" placeholder="Enter campaign name" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Campaign description" />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Campaign location" />
                </div>
                <div>
                  <Label htmlFor="coordinator">Coordinator</Label>
                  <Input id="coordinator" placeholder="Campaign coordinator" />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <DatePicker />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <DatePicker />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vaccination">Vaccination</SelectItem>
                      <SelectItem value="screening">Health Screening</SelectItem>
                      <SelectItem value="education">Health Education</SelectItem>
                      <SelectItem value="emergency">Emergency Response</SelectItem>
                      <SelectItem value="awareness">Awareness Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input id="budget" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="volunteers">Expected Volunteers</Label>
                  <Input id="volunteers" type="number" placeholder="0" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Create Campaign</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Campaign Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCampaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(campaign.category)}</span>
                        <div>
                          <CardTitle className="text-lg">{campaign.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{campaign.coordinator}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(campaign.priority)}>{campaign.priority}</Badge>
                        <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {campaign.location}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{campaign.progress}%</span>
                      </div>
                      <Progress value={campaign.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span>{campaign.volunteers} volunteers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <span>{campaign.peopleReached} reached</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Budget</span>
                        <span>
                          ${campaign.budgetUsed.toLocaleString()} / ${campaign.budget.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={(campaign.budgetUsed / campaign.budget) * 100} className="h-1" />
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {campaign.startDate} - {campaign.endDate}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Eye className="h-3 w-3 mr-1" />
                        View
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

        {filteredCampaigns.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
              <p className="text-muted-foreground mb-4">
                No campaigns match your current filters. Try adjusting your search criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setPriorityFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
