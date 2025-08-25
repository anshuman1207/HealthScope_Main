"use client"

import { useState } from "react"
import { Camera, Save, Edit3, Shield, Award, Calendar, Upload, Lock, Smartphone } from "lucide-react"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function DoctorProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  // Simulate getting logged-in doctor's data (replace with actual user context/API call)
  const getLoggedInDoctorData = () => {
    // This would typically come from your auth context, API, or props
    // For now, simulating different doctors based on current user or random selection
    const currentUser = "Doctor"; // This would be from your auth context
    
    // Sample doctor profiles for Kolkata area
    const doctorProfiles = [
      {
        firstName: "Anshuman",
        lastName: "Jha",
        email: "anshuman.jha@healthscope.ai",
        specialty: "Internal Medicine & Cardiology",
        license: "WB-67890-MD",
        experience: "12",
        hospital: "Apollo Gleneagles Hospital, Kolkata",
        initials: "AJ"
      },
      {
        firstName: "Priya",
        lastName: "Sharma",
        email: "priya.sharma@healthscope.ai",
        specialty: "Pediatrics",
        license: "WB-78901-MD",
        experience: "8",
        hospital: "AMRI Hospital, Salt Lake",
        initials: "PS"
      },
      {
        firstName: "Rajesh",
        lastName: "Kumar",
        email: "rajesh.kumar@healthscope.ai",
        specialty: "Orthopedic Surgery",
        license: "WB-89012-MD",
        experience: "15",
        hospital: "Belle Vue Clinic, Kolkata",
        initials: "RK"
      },
      {
        firstName: "Sunita",
        lastName: "Das",
        email: "sunita.das@healthscope.ai",
        specialty: "Gynecology & Obstetrics",
        license: "WB-90123-MD",
        experience: "10",
        hospital: "Fortis Hospital, Kolkata",
        initials: "SD"
      }
    ];

    // For demo purposes, rotate through doctors or use first one
    // In real app, this would fetch the actual logged-in user's data
    const randomIndex = Math.floor(Math.random() * doctorProfiles.length);
    return doctorProfiles[0]; // Change to [randomIndex] for random doctor each time
  };

  const loggedInDoctor = getLoggedInDoctorData();
  
  const [profileData, setProfileData] = useState({
    firstName: loggedInDoctor.firstName,
    lastName: loggedInDoctor.lastName,
    email: loggedInDoctor.email,
    phone: "+91 98765 43210", // Indian format
    address: generateKolkataAddress(),
    specialty: loggedInDoctor.specialty,
    license: loggedInDoctor.license,
    experience: loggedInDoctor.experience,
    hospital: loggedInDoctor.hospital,
    bio: generateDoctorBio(loggedInDoctor.specialty, loggedInDoctor.experience)
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    patientMessages: true
  })
  
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false
  })
  
  const [profilePhoto, setProfilePhoto] = useState(loggedInDoctor.initials)

  // Helper function to generate Kolkata addresses
  function generateKolkataAddress() {
    const addresses = [
      "304, Ruby Apartment, Park Street, Kolkata, West Bengal 700016",
      "12A, Lake Gardens, Kolkata, West Bengal 700045",
      "56, Ballygunge Place, Kolkata, West Bengal 700019",
      "23, Camac Street, Kolkata, West Bengal 700016",
      "45, Salt Lake City, Sector V, Kolkata, West Bengal 700091",
      "78, Gariahat Road, Kolkata, West Bengal 700029",
      "91, Rashbehari Avenue, Kolkata, West Bengal 700029",
      "15, New Alipore, Kolkata, West Bengal 700053"
    ];
    return addresses[Math.floor(Math.random() * addresses.length)];
  }

  // Helper function to generate specialty-specific bio
  function generateDoctorBio(specialty: string, experience: string) {
    const bios = {
      "Internal Medicine & Cardiology": `Board-certified Internal Medicine physician with specialized training in Cardiology. Over ${experience} years of experience treating patients across Kolkata. Expert in preventive medicine, diabetes management, and cardiovascular health.`,
      "Pediatrics": `Dedicated pediatrician with ${experience} years of experience caring for children and adolescents in Kolkata. Specializes in childhood development, immunizations, and preventive care for young patients.`,
      "Orthopedic Surgery": `Experienced orthopedic surgeon with ${experience} years of practice in Kolkata. Specializes in joint replacement, sports medicine, and trauma surgery. Expert in minimally invasive surgical techniques.`,
      "Gynecology & Obstetrics": `Board-certified gynecologist and obstetrician with ${experience} years of experience. Provides comprehensive women's healthcare including prenatal care, delivery, and gynecological procedures in Kolkata area.`,
      "General Surgery": `Skilled general surgeon with ${experience} years of experience in Kolkata. Specializes in laparoscopic surgery, trauma care, and emergency procedures. Committed to providing excellent surgical care.`,
      "Dermatology": `Board-certified dermatologist with ${experience} years of experience treating skin conditions in Kolkata's climate. Specializes in medical dermatology, cosmetic procedures, and skin cancer prevention.`
    };
    
    return bios[specialty as keyof typeof bios] || `Experienced ${specialty} specialist with ${experience} years of practice in Kolkata. Committed to providing excellent patient care and staying current with medical advances.`;
  }
  const { toast } = useToast()

  const handleSave = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setLoading(false)
    setIsEditing(false)
    toast({
      title: "Profile updated successfully",
      description: "Your profile information has been saved.",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }))
    toast({
      title: "Notification settings updated",
      description: `${field} notifications ${value ? 'enabled' : 'disabled'}.`,
    })
  }

  const handleSecurityChange = (field: string, value: string | boolean) => {
    setSecurity(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePasswordChange = () => {
    if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all password fields.",
        variant: "destructive"
      })
      return
    }

    if (security.newPassword !== security.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation don't match.",
        variant: "destructive"
      })
      return
    }

    if (security.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      })
      return
    }

    // Simulate password change
    setSecurity({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      twoFactorAuth: security.twoFactorAuth
    })
    
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    })
  }

  const handlePhotoUpload = () => {
    toast({
      title: "Photo upload",
      description: "Profile photo upload feature would be implemented here.",
    })
  }

  const handleTwoFactorToggle = (enabled: boolean) => {
    setSecurity(prev => ({ ...prev, twoFactorAuth: enabled }))
    
    if (enabled) {
      toast({
        title: "Two-factor authentication enabled",
        description: "You'll receive an SMS code for verification on your next login.",
      })
    } else {
      toast({
        title: "Two-factor authentication disabled",
        description: "Your account is now using single-factor authentication.",
      })
    }
  }

  return (
    <DashboardLayout
      title="Doctor Profile"
      breadcrumbs={[{ label: "Doctor Dashboard", href: "/dashboard/doctor" }, { label: "Profile" }]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                  {profilePhoto}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full">
                      <Camera className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Profile Photo</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                        <div className="text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                        </div>
                      </div>
                      <Button onClick={handlePhotoUpload} className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Dr. {profileData.firstName} {profileData.lastName}</h2>
                    <p className="text-muted-foreground">{profileData.specialty}</p>
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
                    Verified Doctor
                  </Badge>
                  <Badge variant="outline">
                    <Award className="w-3 h-3 mr-1" />
                    {profileData.experience} Years Experience
                  </Badge>
                  <Badge variant="outline">
                    <Calendar className="w-3 h-3 mr-1" />
                    Available Today
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>Manage your medical credentials and specializations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Input 
                      id="specialty" 
                      value={profileData.specialty}
                      onChange={(e) => handleInputChange('specialty', e.target.value)}
                      disabled={!isEditing} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license">Medical License</Label>
                    <Input 
                      id="license" 
                      value={profileData.license}
                      onChange={(e) => handleInputChange('license', e.target.value)}
                      disabled={!isEditing} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input 
                      id="experience" 
                      value={profileData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      disabled={!isEditing} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hospital">Hospital Affiliation</Label>
                    <Input 
                      id="hospital" 
                      value={profileData.hospital}
                      onChange={(e) => handleInputChange('hospital', e.target.value)}
                      disabled={!isEditing} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                  />
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
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive urgent alerts via SMS</p>
                  </div>
                  <Switch 
                    checked={notifications.sms}
                    onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Patient Messages</Label>
                    <p className="text-sm text-muted-foreground">Get notified of new patient messages</p>
                  </div>
                  <Switch 
                    checked={notifications.patientMessages}
                    onCheckedChange={(checked) => handleNotificationChange('patientMessages', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    value={security.currentPassword}
                    onChange={(e) => handleSecurityChange('currentPassword', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    placeholder="Enter new password (min 8 characters)"
                    value={security.newPassword}
                    onChange={(e) => handleSecurityChange('newPassword', e.target.value)}
                    disabled={!isEditing} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={security.confirmPassword}
                    onChange={(e) => handleSecurityChange('confirmPassword', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                {isEditing && (security.currentPassword || security.newPassword || security.confirmPassword) && (
                  <Button 
                    variant="outline" 
                    onClick={handlePasswordChange}
                    className="w-full"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Update Password
                  </Button>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security via SMS</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    <Switch 
                      checked={security.twoFactorAuth}
                      onCheckedChange={handleTwoFactorToggle}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}