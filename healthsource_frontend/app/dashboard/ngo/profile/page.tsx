"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Mail, Phone, Users, Calendar, Award, Edit, Save, X } from "lucide-react"

export default function NGOProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("organization")

  const organizationData = {
    name: "Community Health Initiative",
    description:
      "Dedicated to improving community health through education, prevention, and accessible healthcare services.",
    email: "info@communityhealth.org",
    phone: "+1 (555) 123-4567",
    website: "www.communityhealth.org",
    address: "123 Health Street, Medical District, City, State 12345",
    founded: "2015",
    registrationNumber: "NGO-2015-CHI-001",
    taxId: "12-3456789",
    logo: "/placeholder.svg?height=100&width=100",
  }

  const teamMembers = [
    {
      id: 1,
      name: "Dr. Anita Menon",
      role: "Executive Director",
      email: "maria@communityhealth.org",
      phone: "+1 (555) 123-4568",
      avatar: "/placeholder.svg?height=40&width=40",
      joinDate: "2015-03-01",
    },
    {
      id: 2,
      name: "James Wilson",
      role: "Program Manager",
      email: "james@communityhealth.org",
      phone: "+1 (555) 123-4569",
      avatar: "/placeholder.svg?height=40&width=40",
      joinDate: "2016-07-15",
    },
    {
      id: 3,
      name: "Sarah Chen",
      role: "Community Outreach Coordinator",
      email: "sarah@communityhealth.org",
      phone: "+1 (555) 123-4570",
      avatar: "/placeholder.svg?height=40&width=40",
      joinDate: "2017-01-20",
    },
  ]

  const achievements = [
    {
      id: 1,
      title: "Community Health Excellence Award",
      organization: "State Health Department",
      year: "2023",
      description: "Recognized for outstanding contribution to community health improvement",
    },
    {
      id: 2,
      title: "Volunteer Organization of the Year",
      organization: "City Council",
      year: "2022",
      description: "Awarded for exceptional volunteer coordination and community impact",
    },
    {
      id: 3,
      title: "Healthcare Innovation Grant",
      organization: "National Health Foundation",
      year: "2021",
      description: "Received $50,000 grant for innovative health education programs",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">NGO Profile</h1>
            <p className="text-muted-foreground">Manage your organization profile and settings</p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
            className="flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="organization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Information</CardTitle>
                <CardDescription>Basic information about your NGO</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={organizationData.logo || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">CHI</AvatarFallback>
                  </Avatar>
                  {isEditing && <Button variant="outline">Change Logo</Button>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input id="orgName" defaultValue={organizationData.name} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="founded">Founded</Label>
                    <Input id="founded" defaultValue={organizationData.founded} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={organizationData.email} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue={organizationData.phone} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue={organizationData.website} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regNumber">Registration Number</Label>
                    <Input id="regNumber" defaultValue={organizationData.registrationNumber} disabled={!isEditing} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    defaultValue={organizationData.description}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" defaultValue={organizationData.address} disabled={!isEditing} rows={3} />
                </div>

                {isEditing && (
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsEditing(false)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage your organization's team</CardDescription>
                  </div>
                  <Button className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {member.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {member.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          Joined {new Date(member.joinDate).getFullYear()}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Achievements & Awards</CardTitle>
                    <CardDescription>Recognition and accomplishments</CardDescription>
                  </div>
                  <Button className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Add Achievement
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <Award className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{achievement.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {achievement.organization} • {achievement.year}
                            </p>
                            <p className="text-sm mt-2">{achievement.description}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch id="emailNotifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="campaignUpdates">Campaign Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified about campaign progress</p>
                  </div>
                  <Switch id="campaignUpdates" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="volunteerAlerts">Volunteer Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notifications about volunteer activities</p>
                  </div>
                  <Switch id="volunteerAlerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="resourceAlerts">Resource Alerts</Label>
                    <p className="text-sm text-muted-foreground">Low stock and resource notifications</p>
                  </div>
                  <Switch id="resourceAlerts" defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your organization's privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="publicProfile">Public Profile</Label>
                    <p className="text-sm text-muted-foreground">Make your organization profile public</p>
                  </div>
                  <Switch id="publicProfile" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showContact">Show Contact Information</Label>
                    <p className="text-sm text-muted-foreground">Display contact details publicly</p>
                  </div>
                  <Switch id="showContact" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showTeam">Show Team Members</Label>
                    <p className="text-sm text-muted-foreground">Display team information publicly</p>
                  </div>
                  <Switch id="showTeam" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
