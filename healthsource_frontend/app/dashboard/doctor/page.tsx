
"use client"

import { motion } from "framer-motion";
import { Users, AlertTriangle, Activity, Clock, UserCheck, Send, Eye, ChevronDown, ChevronUp, Heart, Thermometer, Zap, Calendar } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"

const mockDoctorData = {
  stats: {
    totalPatients: 127,
    urgentCases: 8,
    todayAppointments: 12,
    pendingReviews: 5,
  },
  urgentCases: [
    {
      id: "UC001",
      patient: {
        name: "Arjun Mehta",
        age: 45,
        avatar: "/patient-male.png",
        phone: "+91 98765 43210",
        email: "arjun.mehta@email.com",
        bloodGroup: "O+",
        allergies: ["Penicillin", "Shellfish"],
      },
      condition: "Severe Hypertension",
      riskScore: 92,
      lastUpdate: "2 hours ago",
      aiFlags: ["Critical BP readings", "Medication non-compliance"],
      vitals: {
        bloodPressure: "180/110 mmHg",
        heartRate: "88 bpm",
        temperature: "98.6°F",
        oxygenSaturation: "96%",
      },
      medications: [
        { name: "Lisinopril 10mg", frequency: "Once daily", compliance: "Poor" },
        { name: "Amlodipine 5mg", frequency: "Once daily", compliance: "Good" },
      ],
      recentTests: [
        { test: "Blood Pressure Monitor", date: "Today", result: "180/110 mmHg", status: "Critical" },
        { test: "ECG", date: "Yesterday", result: "Normal rhythm", status: "Normal" },
        { test: "Cholesterol Panel", date: "3 days ago", result: "LDL: 160 mg/dL", status: "High" },
      ],
      nextAppointment: "Tomorrow, 10:30 AM",
    },
    {
      id: "UC002",
      patient: {
        name: "Maria Garcia",
        age: 38,
        avatar: "/patient-female.png",
        phone: "+91 87654 32109",
        email: "maria.garcia@email.com",
        bloodGroup: "A+",
        allergies: ["Sulfa drugs"],
      },
      condition: "Diabetic Ketoacidosis Risk",
      riskScore: 88,
      lastUpdate: "4 hours ago",
      aiFlags: ["High glucose levels", "Ketone presence"],
      vitals: {
        bloodPressure: "130/85 mmHg",
        heartRate: "95 bpm",
        temperature: "99.2°F",
        oxygenSaturation: "98%",
      },
      medications: [
        { name: "Metformin 500mg", frequency: "Twice daily", compliance: "Good" },
        { name: "Insulin Glargine", frequency: "Once daily", compliance: "Fair" },
      ],
      recentTests: [
        { test: "Blood Glucose", date: "Today", result: "285 mg/dL", status: "Critical" },
        { test: "Ketones (Urine)", date: "Today", result: "Moderate", status: "High" },
        { test: "HbA1c", date: "1 week ago", result: "9.2%", status: "High" },
      ],
      nextAppointment: "Today, 3:00 PM",
    },
    {
      id: "UC003",
      patient: {
        name: "Robert Chen",
        age: 62,
        avatar: "/patient-male-2.png",
        phone: "+91 76543 21098",
        email: "robert.chen@email.com",
        bloodGroup: "B+",
        allergies: ["None known"],
      },
      condition: "Cardiac Arrhythmia",
      riskScore: 85,
      lastUpdate: "6 hours ago",
      aiFlags: ["Irregular heartbeat", "Chest pain episodes"],
      vitals: {
        bloodPressure: "145/90 mmHg",
        heartRate: "105 bpm (irregular)",
        temperature: "98.4°F",
        oxygenSaturation: "94%",
      },
      medications: [
        { name: "Warfarin 5mg", frequency: "Once daily", compliance: "Good" },
        { name: "Metoprolol 25mg", frequency: "Twice daily", compliance: "Good" },
      ],
      recentTests: [
        { test: "ECG", date: "Today", result: "Atrial Fibrillation", status: "Abnormal" },
        { test: "Holter Monitor", date: "2 days ago", result: "Frequent PVCs", status: "Abnormal" },
        { test: "Echocardiogram", date: "1 week ago", result: "EF: 45%", status: "Low Normal" },
      ],
      nextAppointment: "Friday, 2:00 PM",
    },
  ],
  aiFlaggedCases: [
    {
      id: "AF001",
      patient: "Priya Sharma",
      condition: "Type 2 Diabetes Risk",
      confidence: 0.89,
      contributors: [
        { factor: "Fasting Glucose (165 mg/dL)", impact: 0.4 },
        { factor: "HbA1c (7.2%)", impact: 0.35 },
        { factor: "BMI (32.1)", impact: 0.25 },
      ],
      recommendation: "Immediate endocrinology referral recommended",
    },
    {
      id: "AF002",
      patient: "Michael Brown",
      condition: "Cardiovascular Disease Risk",
      confidence: 0.82,
      contributors: [
        { factor: "Cholesterol (280 mg/dL)", impact: 0.45 },
        { factor: "Blood Pressure (160/95)", impact: 0.35 },
        { factor: "Family History", impact: 0.2 },
      ],
      recommendation: "Cardiology consultation within 2 weeks",
    },
  ],
  recentActivity: [
    { time: "10:30 AM", action: "Reviewed lab results for Patient #127", type: "review" },
    { time: "9:45 AM", action: "AI flagged high-risk case: Maria Garcia", type: "ai-alert" },
    { time: "9:15 AM", action: "Completed appointment with Rahul Verma", type: "appointment" },
    { time: "8:30 AM", action: "Referred patient to cardiology", type: "referral" },
  ],
}

export default function DoctorDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null)

  const handleViewPatient = (patientId: string) => {
    setExpandedPatient(expandedPatient === patientId ? null : patientId)
  }

  const handleReferPatient = (patientId: string) => {
    // In real app, this would open referral dialog
    alert(`Referral initiated for patient ${patientId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20'
      case 'abnormal':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'normal':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getComplianceColor = (compliance: string) => {
    switch (compliance.toLowerCase()) {
      case 'poor':
        return 'text-red-600'
      case 'fair':
        return 'text-orange-600'
      case 'good':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const quickActions = [
    {
      title: "AI Analysis",
      description: "Upload and analyze reports",
      icon: Activity,
      href: "/dashboard/doctor/ai-analysis",
      color: "bg-blue-500",
    },
    {
      title: "My Patients",
      description: "View patient list",
      icon: Users,
      href: "/dashboard/doctor/my-patients",
      color: "bg-green-500",
    },
    {
      title: "Appointments",
      description: "Today's schedule",
      icon: Clock,
      href: "/dashboard/doctor/appointments",
      color: "bg-purple-500",
    },
    // {
      // title: "Referrals",
      // description: "Manage referrals",
      // icon: Send,
      // href: "/dashboard/doctor/referrals",
      // color: "bg-orange-500",
    // },
  ]

  return (
    <DashboardLayout title="Doctor Dashboard">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                    <p className="text-2xl font-bold">{mockDoctorData.stats.totalPatients}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Active under care</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Urgent Cases</p>
                    <p className="text-2xl font-bold text-red-600">{mockDoctorData.stats.urgentCases}</p>
                  </div>
                  <div className="h-12 w-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Require immediate attention</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Today's Appointments</p>
                    <p className="text-2xl font-bold">{mockDoctorData.stats.todayAppointments}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Scheduled for today</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
                    <p className="text-2xl font-bold">{mockDoctorData.stats.pendingReviews}</p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Awaiting your review</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Urgent Cases */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Urgent Cases Requiring Attention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockDoctorData.urgentCases.map((case_, index) => (
                  <motion.div
                    key={case_.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-4 border rounded-lg bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={case_.patient.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {case_.patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{case_.patient.name}</h4>
                          <p className="text-sm text-muted-foreground">Age: {case_.patient.age}</p>
                          <p className="text-sm font-medium text-red-700 dark:text-red-300">{case_.condition}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-muted-foreground">Risk Score:</span>
                          <Badge variant="destructive">{case_.riskScore}/100</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{case_.lastUpdate}</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">AI Flags:</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {case_.aiFlags.map((flag, flagIndex) => (
                          <Badge key={flagIndex} variant="outline" className="text-xs">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 mb-3">
                      <Button size="sm" onClick={() => handleViewPatient(case_.id)}>
                        {expandedPatient === case_.id ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleReferPatient(case_.id)}>
                        <Send className="h-4 w-4 mr-1" />
                        Refer
                      </Button>
                    </div>

                    {/* Expanded Details */}
                    {expandedPatient === case_.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t pt-4 space-y-4"
                      >
                        {/* Patient Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h5 className="font-semibold text-sm">Contact Information</h5>
                            <div className="text-sm space-y-1">
                              <p><span className="text-muted-foreground">Phone:</span> {case_.patient.phone}</p>
                              <p><span className="text-muted-foreground">Email:</span> {case_.patient.email}</p>
                              <p><span className="text-muted-foreground">Blood Group:</span> {case_.patient.bloodGroup}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h5 className="font-semibold text-sm">Allergies</h5>
                            <div className="flex flex-wrap gap-1">
                              {case_.patient.allergies.map((allergy, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-yellow-50 dark:bg-yellow-900/20">
                                  {allergy}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Current Vitals */}
                        <div>
                          <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            Current Vitals
                          </h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="p-2 bg-white dark:bg-gray-800 rounded border">
                              <p className="text-xs text-muted-foreground">Blood Pressure</p>
                              <p className="text-sm font-medium">{case_.vitals.bloodPressure}</p>
                            </div>
                            <div className="p-2 bg-white dark:bg-gray-800 rounded border">
                              <p className="text-xs text-muted-foreground">Heart Rate</p>
                              <p className="text-sm font-medium">{case_.vitals.heartRate}</p>
                            </div>
                            <div className="p-2 bg-white dark:bg-gray-800 rounded border">
                              <p className="text-xs text-muted-foreground">Temperature</p>
                              <p className="text-sm font-medium">{case_.vitals.temperature}</p>
                            </div>
                            <div className="p-2 bg-white dark:bg-gray-800 rounded border">
                              <p className="text-xs text-muted-foreground">O2 Saturation</p>
                              <p className="text-sm font-medium">{case_.vitals.oxygenSaturation}</p>
                            </div>
                          </div>
                        </div>

                        {/* Current Medications */}
                        <div>
                          <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Current Medications
                          </h5>
                          <div className="space-y-2">
                            {case_.medications.map((med, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
                                <div>
                                  <p className="text-sm font-medium">{med.name}</p>
                                  <p className="text-xs text-muted-foreground">{med.frequency}</p>
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getComplianceColor(med.compliance)}`}
                                >
                                  {med.compliance}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recent Test Results */}
                        <div>
                          <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Recent Test Results
                          </h5>
                          <div className="space-y-2">
                            {case_.recentTests.map((test, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{test.test}</p>
                                  <p className="text-xs text-muted-foreground">{test.date}</p>
                                </div>
                                <div className="text-right flex-1">
                                  <p className="text-sm">{test.result}</p>
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ml-2 ${getStatusColor(test.status)}`}
                                >
                                  {test.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Next Appointment */}
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                              Next Appointment: {case_.nextAppointment}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-auto p-3"
                        onClick={() => router.push(action.href)}
                      >
                        <div className={`h-8 w-8 rounded-lg ${action.color} flex items-center justify-center mr-3`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{action.title}</p>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </div>
                      </Button>
                    </motion.div>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Flagged Cases */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  AI Flagged Cases
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockDoctorData.aiFlaggedCases.map((flaggedCase, index) => (
                  <motion.div
                    key={flaggedCase.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{flaggedCase.patient}</h4>
                        <p className="text-sm text-muted-foreground">{flaggedCase.condition}</p>
                      </div>
                      <Badge variant="secondary">AI: {Math.round(flaggedCase.confidence * 100)}%</Badge>
                    </div>

                    <div className="space-y-2 mb-3">
                      <p className="text-sm font-medium">Contributing Factors:</p>
                      {flaggedCase.contributors.map((contributor, contribIndex) => (
                        <div key={contribIndex} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{contributor.factor}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${contributor.impact * 100}%` }}
                              />
                            </div>
                            <span className="text-xs w-8">{Math.round(contributor.impact * 100)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-3">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">AI Recommendation:</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">{flaggedCase.recommendation}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Accept
                      </Button>
                      <Button size="sm" variant="ghost">
                        Review Later
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockDoctorData.recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {activity.type}
                    </Badge>
                  </motion.div>
                ))}
                <Button variant="outline" className="w-full bg-transparent">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}