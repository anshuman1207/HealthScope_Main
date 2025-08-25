"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Search, Filter, Plus, UserCheck, UserX, Mail, Phone, Calendar, MapPin, Edit, Eye } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const users = [
  {
    id: "user_001",
    name: "Dr. Priya Sharma",
    email: "p.sharma@healthscope.com",
    role: "doctor",
    status: "active",
    lastLogin: "2025-08-20 14:30",
    joinDate: "2023-06-15",
    location: "Kolkata, CCU",
    phone: "+91 9823456712",
    avatar: "/placeholder.svg?height=40&width=40",
    verified: true,
    patientsCount: 234,
    specialty: "Cardiology",
  },
  {
    id: "user_002",
    name: "City General Hospital",
    email: "admin@citygeneral.com",
    role: "hospital",
    status: "active",
    lastLogin: "2025-08-20 16:45",
    joinDate: "2023-03-10",
    location: "Delhi, DEL",
    phone: "+91 9812233445",
    avatar: "/placeholder.svg?height=40&width=40",
    verified: true,
    bedsCount: 450,
    departments: 12,
  },
  {
    id: "user_003",
    name: "Rahul Verma",
    email: "rahul.verma@email.com",
    role: "patient",
    status: "active",
    lastLogin: "2025-08-20 09:15",
    joinDate: "2023-11-22",
    location: "Mumbai, BOM",
    phone: "+91 9811456789",
    avatar: "/placeholder.svg?height=40&width=40",
    verified: true,
    appointmentsCount: 8,
    age: 34,
  },
  {
    id: "user_004",
    name: "Health for All NGO",
    email: "contact@healthforall.org",
    role: "ngo",
    status: "pending",
    lastLogin: "2025-08-19 11:20",
    joinDate: "2025-08-15",
    location: "Bengaluru, BLR",
    phone: "+91 9867001234",
    avatar: "/placeholder.svg?height=40&width=40",
    verified: false,
    campaignsCount: 3,
    volunteersCount: 45,
  },
]

const roleStats = [
  { role: "Patient", count: 18234, percentage: 73.4, color: "bg-blue-500" },
  { role: "Doctor", count: 3421, percentage: 13.8, color: "bg-green-500" },
  { role: "NGO", count: 2156, percentage: 8.7, color: "bg-purple-500" },
  { role: "Hospital", count: 1036, percentage: 4.1, color: "bg-orange-500" },
]

export default function AdminUserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50 border-green-200"
      case "pending":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "suspended":
        return "text-red-600 bg-red-50 border-red-200"
      case "inactive":
        return "text-gray-600 bg-gray-50 border-gray-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "doctor":
        return "text-green-600 bg-green-50"
      case "patient":
        return "text-blue-600 bg-blue-50"
      case "hospital":
        return "text-orange-600 bg-orange-50"
      case "ngo":
        return "text-purple-600 bg-purple-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <DashboardLayout
      title="User Management"
      breadcrumbs={[{ label: "Admin Dashboard", href: "/dashboard/admin" }, { label: "User Management" }]}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
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
          <div className="flex gap-2">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Role Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {roleStats.map((stat, index) => (
                <motion.div
                  key={stat.role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold mb-2">{stat.count.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground mb-2">{stat.role}s</div>
                  <div className="text-xs text-muted-foreground">{stat.percentage}% of total</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <motion.div
                      className={`h-2 rounded-full ${stat.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Users</CardTitle>
              <Tabs defaultValue="all" className="w-auto">
                <TabsList>
                  <TabsTrigger value="all">All Users</TabsTrigger>
                  <TabsTrigger value="pending">Pending Approval</TabsTrigger>
                  <TabsTrigger value="recent">Recently Added</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{user.name}</h3>
                            {user.verified && <UserCheck className="h-4 w-4 text-green-600" />}
                          </div>
                          <p className="text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{user.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Joined {user.joinDate}</span>
                        </div>
                      </div>

                      {/* Role-specific info */}
                      <div className="mb-4 text-sm text-muted-foreground">
                        {user.role === "doctor" && (
                          <div className="flex items-center gap-4">
                            <span>Specialty: {user.specialty}</span>
                            <span>Patients: {user.patientsCount}</span>
                          </div>
                        )}
                        {user.role === "hospital" && (
                          <div className="flex items-center gap-4">
                            <span>Beds: {user.bedsCount}</span>
                            <span>Departments: {user.departments}</span>
                          </div>
                        )}
                        {user.role === "patient" && (
                          <div className="flex items-center gap-4">
                            <span>Age: {user.age}</span>
                            <span>Appointments: {user.appointmentsCount}</span>
                          </div>
                        )}
                        {user.role === "ngo" && (
                          <div className="flex items-center gap-4">
                            <span>Campaigns: {user.campaignsCount}</span>
                            <span>Volunteers: {user.volunteersCount}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">Last login: {user.lastLogin}</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          {user.status === "pending" && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <UserCheck className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Suspend
                          </Button>
                        </div>
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
