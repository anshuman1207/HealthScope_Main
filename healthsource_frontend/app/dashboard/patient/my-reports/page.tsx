"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Eye, Calendar, Search } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PredictionCard } from "@/components/common/prediction-card"

const mockReports = [
  {
    id: "RPT001",
    title: "Blood Test - Comprehensive Metabolic Panel",
    date: "2025-08-15",
    type: "Lab Test",
    status: "completed",
    doctor: "Dr. Priya Sharma",
    aiAnalysis: {
      condition: "Pre-diabetes Risk",
      riskScore: 68,
      confidence: 0.85,
      contributors: [
        { factor: "Fasting Glucose (110 mg/dL)", impact: 0.35 },
        { factor: "BMI (28.5)", impact: 0.28 },
        { factor: "Family History", impact: 0.22 },
        { factor: "Age (42 years)", impact: 0.15 },
      ],
      recommendations: [
        "Schedule follow-up glucose test in 3 months",
        "Increase physical activity to 150 minutes/week",
        "Consider dietary consultation",
      ],
    },
  },
  {
    id: "RPT002",
    title: "Chest X-Ray",
    date: "2025-08-10",
    type: "Imaging",
    status: "completed",
    doctor: "Dr. Michael Chen",
    aiAnalysis: null,
  },
  {
    id: "RPT003",
    title: "ECG - Electrocardiogram",
    date: "2025-08-05",
    type: "Diagnostic",
    status: "completed",
    doctor: "Dr. Michael Chen",
    aiAnalysis: {
      condition: "Normal Heart Rhythm",
      riskScore: 15,
      confidence: 0.95,
      contributors: [
        { factor: "Regular rhythm", impact: 0.4 },
        { factor: "Normal rate (72 bpm)", impact: 0.3 },
        { factor: "No abnormalities", impact: 0.3 },
      ],
      recommendations: ["Continue regular exercise", "Maintain healthy diet", "Annual cardiac screening"],
    },
  },
  {
    id: "RPT004",
    title: "Lipid Panel",
    date: "2023-12-20",
    type: "Lab Test",
    status: "completed",
    doctor: "Dr. Priya Sharma",
    aiAnalysis: null,
  },
]

export default function MyReports() {
  const [selectedReport, setSelectedReport] = useState<(typeof mockReports)[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || report.type.toLowerCase() === filterType.toLowerCase()
    const matchesStatus = filterStatus === "all" || report.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <DashboardLayout title="My Reports" breadcrumbs={[{ label: "My Reports" }]}>
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="lab test">Lab Test</SelectItem>
                  <SelectItem value="imaging">Imaging</SelectItem>
                  <SelectItem value="diagnostic">Diagnostic</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>Health Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>AI Analysis</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report, index) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{report.title}</p>
                          <p className="text-sm text-muted-foreground">ID: {report.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {report.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.type}</Badge>
                    </TableCell>
                    <TableCell>{report.doctor}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {report.aiAnalysis ? (
                        <Badge variant="secondary">Available</Badge>
                      ) : (
                        <Badge variant="outline">Not Available</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedReport(report)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Selected Report Details */}
        {selectedReport && selectedReport.aiAnalysis && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <PredictionCard
              condition={selectedReport.aiAnalysis.condition}
              riskScore={selectedReport.aiAnalysis.riskScore}
              confidence={selectedReport.aiAnalysis.confidence}
              contributors={selectedReport.aiAnalysis.contributors}
              recommendations={selectedReport.aiAnalysis.recommendations}
            />
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}