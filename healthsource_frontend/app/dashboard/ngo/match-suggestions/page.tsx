"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, MapPin, Clock, Star, Heart, CheckCircle, X } from "lucide-react"
import { useState } from "react"

const matchSuggestions = [
  {
    id: "1",
    volunteer: {
      name: "Priya Sharma",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["Medical Care", "Emergency Response", "First Aid"],
      rating: 4.9,
      location: "Salt Lake",
      availability: "Weekends",
      experience: "5 years",
    },
    case: {
      id: "CASE001",
      title: "Elderly Care Support",
      location: "Salt Lake Community Center",
      urgency: "medium",
      requiredSkills: ["Medical Care", "Patient Support"],
      description: "Need volunteer to assist with elderly care program",
    },
    matchScore: 95,
    reasons: ["Perfect skill match", "Same location", "Available time slots"],
  },
  {
    id: "2",
    volunteer: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["Teaching", "Child Care", "Community Outreach"],
      rating: 4.7,
      location: "Eastside",
      availability: "Evenings",
      experience: "3 years",
    },
    case: {
      id: "CASE002",
      title: "Children's Education Program",
      location: "Eastside School",
      urgency: "low",
      requiredSkills: ["Teaching", "Child Care"],
      description: "Volunteer needed for after-school tutoring program",
    },
    matchScore: 88,
    reasons: ["Strong skill alignment", "Location proximity", "Experience level"],
  },
  {
    id: "3",
    volunteer: {
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["Food Distribution", "Event Planning", "Logistics"],
      rating: 4.8,
      location: "Westside",
      availability: "Flexible",
      experience: "2 years",
    },
    case: {
      id: "CASE003",
      title: "Food Bank Operations",
      location: "Westside Food Bank",
      urgency: "high",
      requiredSkills: ["Food Distribution", "Logistics"],
      description: "Urgent need for food distribution volunteers",
    },
    matchScore: 92,
    reasons: ["Excellent logistics skills", "Flexible schedule", "High urgency match"],
  },
]

const urgencyColors = {
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
}

export default function MatchSuggestionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [skillFilter, setSkillFilter] = useState("all")
  const [urgencyFilter, setUrgencyFilter] = useState("all")

  const filteredSuggestions = matchSuggestions.filter((suggestion) => {
    const matchesSearch =
      suggestion.volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suggestion.case.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSkill =
      skillFilter === "all" ||
      suggestion.volunteer.skills.some((skill) => skill.toLowerCase().includes(skillFilter.toLowerCase()))
    const matchesUrgency = urgencyFilter === "all" || suggestion.case.urgency === urgencyFilter

    return matchesSearch && matchesSkill && matchesUrgency
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Match Suggestions</h1>
            <p className="text-muted-foreground">AI-powered volunteer matching for optimal case assignments</p>
          </div>
          <Button>
            <Users className="mr-2 h-4 w-4" />
            View All Matches
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Suggestions</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+6 new today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Match Score</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">90%+ compatibility</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted Matches</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Match Score</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search volunteers or cases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  <SelectItem value="medical">Medical Care</SelectItem>
                  <SelectItem value="teaching">Teaching</SelectItem>
                  <SelectItem value="food">Food Distribution</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                </SelectContent>
              </Select>
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Match Suggestions */}
        <div className="space-y-6">
          {filteredSuggestions.map((suggestion) => (
            <Card key={suggestion.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Match Suggestion</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-lg font-bold">
                      {suggestion.matchScore}% Match
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Volunteer Info */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={suggestion.volunteer.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {suggestion.volunteer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{suggestion.volunteer.name}</h3>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{suggestion.volunteer.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{suggestion.volunteer.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{suggestion.volunteer.availability}</span>
                      </div>
                      <div>
                        <span className="font-medium">Experience:</span> {suggestion.volunteer.experience}
                      </div>
                      <div>
                        <span className="font-medium">Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {suggestion.volunteer.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Case Info */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{suggestion.case.title}</h3>
                      <Badge className={urgencyColors[suggestion.case.urgency as keyof typeof urgencyColors]}>
                        {suggestion.case.urgency} urgency
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{suggestion.case.location}</span>
                      </div>
                      <div>
                        <span className="font-medium">Required Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {suggestion.case.requiredSkills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Description:</span>
                        <p className="text-muted-foreground mt-1">{suggestion.case.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Reasons */}
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Why this is a good match:</h4>
                  <ul className="text-sm space-y-1">
                    {suggestion.reasons.map((reason, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    <X className="mr-2 h-4 w-4" />
                    Dismiss
                  </Button>
                  <Button size="sm">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Create Match
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
