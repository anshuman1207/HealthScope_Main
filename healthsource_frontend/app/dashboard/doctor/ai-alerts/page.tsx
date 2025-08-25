"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Brain, TrendingUp, Clock, CheckCircle, Eye, User } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

const aiAlerts = [
  {
    id: "AI001",
    patient: {
      name: "Arjun Mehta",
      age: 45,
      id: "P001",
      avatar: "/patient-male.png",
    },
    alertType: "Critical Risk",
    condition: "Acute Myocardial Infarction Risk",
    confidence: 94,
    severity: "critical",
    timestamp: "2025-08-20 15:30",
    aiModel: "CardioPredict v2.1",
    triggers: [
      "Elevated Troponin levels (0.8 ng/mL)",
      "ECG abnormalities detected",
      "Patient history of hypertension",
      "Recent chest pain episodes",
    ],
    recommendations: [
      "Immediate cardiology consultation",
      "Continuous cardiac monitoring",
      "Consider emergency catheterization",
      "Administer antiplatelet therapy",
    ],
    status: "new",
  },
  {
    id: "AI002",
    patient: {
      name: "Maria Garcia",
      age: 38,
      id: "P002",
      avatar: "/patient-female.png",
    },
    alertType: "Drug Interaction",
    condition: "Potential Adverse Drug Reaction",
    confidence: 87,
    severity: "high",
    timestamp: "2025-08-20 14:15",
    aiModel: "PharmaSafe AI v1.8",
    triggers: [
      "Warfarin + Aspirin combination",
      "Patient age and weight factors",
      "Recent INR levels trending high",
      "History of bleeding disorders",
    ],
    recommendations: [
      "Review current medication regimen",
      "Consider alternative anticoagulation",
      "Monitor INR more frequently",
      "Patient education on bleeding risks",
    ],
    status: "acknowledged",
  },
  {
    id: "AI003",
    patient: {
      name: "Robert Chen",
      age: 62,
      id: "P003",
      avatar: "/patient-male-2.png",
    },
    alertType: "Disease Progression",
    condition: "Diabetic Nephropathy Progression",
    confidence: 82,
    severity: "medium",
    timestamp: "2025-08-20 12:45",
    aiModel: "NephroWatch AI v3.0",
    triggers: [
      "Declining eGFR (45 mL/min/1.73m²)",
      "Increasing proteinuria",
      "Poor glycemic control (HbA1c 9.2%)",
      "Hypertension not at target",
    ],
    recommendations: [
      "Nephrology referral recommended",
      "Optimize diabetes management",
      "ACE inhibitor dose adjustment",
      "Dietary consultation for protein restriction",
    ],
    status: "reviewed",
  },
]

export default function AIAlertsPage() {
  const [filter, setFilter] = useState("all")

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "text-red-600 bg-red-50"
      case "acknowledged":
        return "text-orange-600 bg-orange-50"
      case "reviewed":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const handleAcknowledge = (id: string) => {
    alert(`Acknowledged alert: ${id}`)
  }

  const handleReview = (id: string) => {
    alert(`Marked as reviewed: ${id}`)
  }

  return (
    <DashboardLayout
      title="AI Alerts"
      breadcrumbs={[{ label: "Doctor Dashboard", href: "/dashboard/doctor" }, { label: "AI Alerts" }]}
    >
      <div className="space-y-6">
        {/* Alert Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
                <Brain className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-red-600">3</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Avg Confidence</p>
                  <p className="text-2xl font-bold">87.6%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI-Generated Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {aiAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 border rounded-lg ${alert.severity === "critical" ? "border-red-200 bg-red-50/50" : "hover:bg-accent/50"} transition-colors`}
              >
                {/* Alert Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={alert.patient.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {alert.patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{alert.patient.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Age: {alert.patient.age} • ID: {alert.patient.id}
                      </p>
                      <p className="text-sm font-medium text-red-700 dark:text-red-300 mt-1">{alert.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
                    <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
                  </div>
                </div>

                {/* AI Confidence & Model */}
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">AI Confidence:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={alert.confidence} className="w-20 h-2" />
                      <span className="text-sm font-bold">{alert.confidence}%</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Model: {alert.aiModel}</div>
                  <div className="text-sm text-muted-foreground">{alert.timestamp}</div>
                </div>

                {/* Triggers */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">AI-Detected Triggers:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {alert.triggers.map((trigger, triggerIndex) => (
                      <div key={triggerIndex} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                        <span>{trigger}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">AI Recommendations:</h4>
                  <div className="space-y-2">
                    {alert.recommendations.map((rec, recIndex) => (
                      <div key={recIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button size="sm" onClick={() => handleReview(alert.id)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View Patient
                  </Button>
                  {alert.status === "new" && (
                    <Button size="sm" variant="outline" onClick={() => handleAcknowledge(alert.id)}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Acknowledge
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <User className="h-4 w-4 mr-1" />
                    Contact Patient
                  </Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
