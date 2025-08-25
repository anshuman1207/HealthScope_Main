"use client"

import { useState } from "react"
import { Camera, Save, Edit3, Shield, Award, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useToast } from "@/hooks/use-toast"

export default function HospitalProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Hospital profile has been successfully updated.",
    })
  }

  return (
    <DashboardLayout
      title="Hospital Profile"
      breadcrumbs={[{ label: "Hospital Dashboard", href: "/dashboard/hospital" }, { label: "Profile" }]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                  NYC
                </div>
                <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Kolkata Medical Center</h2>
                    <p className="text-muted-foreground">Tertiary Care Hospital</p>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                    disabled={loading}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? "Saving..." : "Save Changes"}
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    <Shield className="w-3 h-3 mr-1" />
                    JCI Accredited
                  </Badge>
                  <Badge variant="outline">
                    <Award className="w-3 h-3 mr-1" />
                    500 Beds
                  </Badge>
                  <Badge variant="outline">
                    <MapPin className="w-3 h-3 mr-1" />
                    Manhattan, NY
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="accreditation">Accreditation</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hospital Information</CardTitle>
                <CardDescription>Update hospital details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hospitalName">Hospital Name</Label>
                    <Input id="hospitalName" defaultValue="Kolkata Medical Center" disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hospitalType">Hospital Type</Label>
                    <Input id="hospitalType" defaultValue="Tertiary Care Hospital" disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="info@nycmedical.com" disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue="+1 (212) 555-0100" disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue="https://www.nycmedical.com" disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="beds">Total Beds</Label>
                    <Input id="beds" defaultValue="500" disabled={!isEditing} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    defaultValue="1234 Medical Plaza, Manhattan, Kolkata, CCU 10001"
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Hospital Description</Label>
                  <Textarea
                    id="description"
                    defaultValue="Kolkata Medical Center is a leading tertiary care hospital providing comprehensive medical services with state-of-the-art facilities and expert medical professionals."
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hospital Departments</CardTitle>
                <CardDescription>Manage hospital departments and specialties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Cardiology", head: "Dr. Michael Chen", beds: 45, staff: 28 },
                    { name: "Orthopedics", head: "Dr. Priya Sharma", beds: 38, staff: 22 },
                    { name: "Neurology", head: "Dr. David Kim", beds: 32, staff: 18 },
                    { name: "Pediatrics", head: "Dr. Emily Rodriguez", beds: 55, staff: 35 },
                    { name: "Emergency", head: "Dr. Lisa Wang", beds: 25, staff: 42 },
                    { name: "Surgery", head: "Dr. Robert Brown", beds: 40, staff: 30 },
                  ].map((dept) => (
                    <Card key={dept.name} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{dept.name}</h4>
                        <Badge variant="outline">{dept.beds} beds</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Head: {dept.head}</p>
                      <p className="text-sm text-muted-foreground">Staff: {dept.staff} members</p>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hospital Settings</CardTitle>
                <CardDescription>Configure hospital operational settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Emergency Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive emergency notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Patient Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications to patients</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Staff Scheduling Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify staff of schedule changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Inventory Alerts</Label>
                    <p className="text-sm text-muted-foreground">Low inventory notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accreditation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Accreditation & Certifications</CardTitle>
                <CardDescription>Hospital accreditations and quality certifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: "Joint Commission International (JCI)",
                      status: "Active",
                      expiry: "2025-12-31",
                      level: "Gold Standard",
                    },
                    {
                      name: "ISO 9001:2015 Quality Management",
                      status: "Active",
                      expiry: "2025-08-15",
                      level: "Certified",
                    },
                    {
                      name: "HIMSS Stage 7 Digital Health",
                      status: "Active",
                      expiry: "2024-06-30",
                      level: "Advanced",
                    },
                    {
                      name: "Magnet Recognition Program",
                      status: "Active",
                      expiry: "2026-03-20",
                      level: "Excellence",
                    },
                  ].map((cert) => (
                    <Card key={cert.name} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{cert.name}</h4>
                        <Badge variant={cert.status === "Active" ? "default" : "secondary"}>{cert.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Level: {cert.level}</p>
                      <p className="text-sm text-muted-foreground">Expires: {cert.expiry}</p>
                    </Card>
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
