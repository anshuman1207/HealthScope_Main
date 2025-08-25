"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Eye, Calendar, X, FileText } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const mockPatients = [
  {
    id: "PAT001",
    name: "Arjun Mehta",
    age: 45,
    gender: "Male",
    avatar: "/patient-male.png",
    condition: "Type 2 Diabetes",
    riskLevel: "high",
    lastVisit: "2025-08-15",
    nextAppointment: "2025-08-22",
    status: "active",
    vitals: {
      bloodPressure: "145/90",
      heartRate: 78,
      temperature: "98.6°F",
    },
    recentTests: ["Blood Glucose", "HbA1c", "Lipid Panel"],
    medications: ["Metformin", "Lisinopril"],
    medicalRecord: {
      allergies: ["Penicillin", "Shellfish"],
      chronicConditions: ["Type 2 Diabetes Mellitus", "Hypertension", "Hyperlipidemia"],
      pastSurgeries: ["Appendectomy (2018)", "Gallbladder removal (2020)"],
      familyHistory: ["Father - Diabetes", "Mother - Hypertension", "Sister - Thyroid disorder"],
      socialHistory: "Non-smoker, Occasional alcohol consumption, Sedentary lifestyle",
      recentVisits: [
        { date: "2025-08-15", reason: "Routine follow-up", notes: "Blood sugar levels improving, continue current medication" },
        { date: "2025-07-20", reason: "Lab results review", notes: "HbA1c: 7.2%, needs dietary counseling" },
        { date: "2025-06-15", reason: "Quarterly check-up", notes: "Blood pressure elevated, added Lisinopril" }
      ],
      labResults: [
        { test: "HbA1c", value: "7.2%", date: "2025-07-18", normal: "< 5.7%" },
        { test: "Fasting Glucose", value: "142 mg/dL", date: "2025-07-18", normal: "70-100 mg/dL" },
        { test: "Total Cholesterol", value: "220 mg/dL", date: "2025-07-18", normal: "< 200 mg/dL" }
      ]
    }
  },
  {
    id: "PAT002",
    name: "Maria Garcia",
    age: 38,
    gender: "Female",
    avatar: "/patient-female.png",
    condition: "Hypertension",
    riskLevel: "medium",
    lastVisit: "2025-08-12",
    nextAppointment: "2025-08-25",
    status: "active",
    vitals: {
      bloodPressure: "135/85",
      heartRate: 72,
      temperature: "98.4°F",
    },
    recentTests: ["CBC", "Basic Metabolic Panel"],
    medications: ["Amlodipine", "Hydrochlorothiazide"],
    medicalRecord: {
      allergies: ["Latex", "Iodine"],
      chronicConditions: ["Essential Hypertension", "Mild Anxiety"],
      pastSurgeries: ["C-section (2015)", "Wisdom teeth extraction (2012)"],
      familyHistory: ["Mother - Hypertension", "Father - Heart disease", "Grandmother - Stroke"],
      socialHistory: "Non-smoker, Social drinker, Regular exercise routine",
      recentVisits: [
        { date: "2025-08-12", reason: "Blood pressure check", notes: "BP well controlled with current medications" },
        { date: "2025-07-15", reason: "Routine physical", notes: "Overall health good, continue medications" },
        { date: "2025-06-10", reason: "Follow-up", notes: "Stress management techniques discussed" }
      ],
      labResults: [
        { test: "Sodium", value: "142 mEq/L", date: "2025-07-12", normal: "135-145 mEq/L" },
        { test: "Potassium", value: "4.1 mEq/L", date: "2025-07-12", normal: "3.5-5.0 mEq/L" },
        { test: "Creatinine", value: "0.9 mg/dL", date: "2025-07-12", normal: "0.6-1.2 mg/dL" }
      ]
    }
  },
  {
    id: "PAT003",
    name: "Robert Chen",
    age: 62,
    gender: "Male",
    avatar: "/patient-male-2.png",
    condition: "Cardiac Arrhythmia",
    riskLevel: "high",
    lastVisit: "2025-08-10",
    nextAppointment: "2025-08-20",
    status: "monitoring",
    vitals: {
      bloodPressure: "120/80",
      heartRate: 65,
      temperature: "98.2°F",
    },
    recentTests: ["ECG", "Echocardiogram", "Holter Monitor"],
    medications: ["Warfarin", "Metoprolol"],
    medicalRecord: {
      allergies: ["Aspirin", "Codeine"],
      chronicConditions: ["Atrial Fibrillation", "Coronary Artery Disease", "Mild Heart Failure"],
      pastSurgeries: ["Cardiac catheterization (2023)", "Stent placement (2023)", "Hernia repair (2019)"],
      familyHistory: ["Father - Heart attack", "Mother - Stroke", "Brother - High cholesterol"],
      socialHistory: "Former smoker (quit 2020), No alcohol, Light exercise as tolerated",
      recentVisits: [
        { date: "2025-08-10", reason: "Cardiology follow-up", notes: "Rhythm stable, continue anticoagulation" },
        { date: "2025-07-25", reason: "INR check", notes: "INR: 2.3 (therapeutic), no bleeding concerns" },
        { date: "2025-07-05", reason: "Echo results", notes: "EF: 45%, mild improvement from last study" }
      ],
      labResults: [
        { test: "INR", value: "2.3", date: "2025-07-25", normal: "2.0-3.0" },
        { test: "BNP", value: "180 pg/mL", date: "2025-07-05", normal: "< 100 pg/mL" },
        { test: "Troponin", value: "< 0.01", date: "2025-07-05", normal: "< 0.04 ng/mL" }
      ]
    }
  },
  {
    id: "PAT004",
    name: "Priya Sharma",
    age: 29,
    gender: "Female",
    avatar: "/patient-female-2.png",
    condition: "Asthma",
    riskLevel: "low",
    lastVisit: "2025-08-08",
    nextAppointment: "2025-09-05",
    status: "stable",
    vitals: {
      bloodPressure: "110/70",
      heartRate: 68,
      temperature: "98.1°F",
    },
    recentTests: ["Pulmonary Function Test", "Chest X-ray"],
    medications: ["Albuterol", "Fluticasone"],
    medicalRecord: {
      allergies: ["Peanuts", "Dust mites", "Pet dander"],
      chronicConditions: ["Mild Persistent Asthma", "Allergic Rhinitis"],
      pastSurgeries: ["None"],
      familyHistory: ["Mother - Asthma", "Father - Allergies", "Sister - Eczema"],
      socialHistory: "Non-smoker, Occasional wine, Regular yoga and swimming",
      recentVisits: [
        { date: "2025-08-08", reason: "Asthma control assessment", notes: "Well controlled, continue current regimen" },
        { date: "2025-06-15", reason: "Allergy season check", notes: "Seasonal symptoms managed well" },
        { date: "2025-04-20", reason: "Routine follow-up", notes: "PFTs stable, good technique with inhaler" }
      ],
      labResults: [
        { test: "Total IgE", value: "180 IU/mL", date: "2025-06-10", normal: "< 100 IU/mL" },
        { test: "Specific IgE (Peanut)", value: "15.2 kU/L", date: "2025-06-10", normal: "< 0.35 kU/L" },
        { test: "Eosinophil Count", value: "8%", date: "2025-06-10", normal: "1-4%" }
      ]
    }
  },
];

export default function MyPatients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState<(typeof mockPatients)[0] | null>(null);
  const [medicalRecordPatient, setMedicalRecordPatient] = useState<(typeof mockPatients)[0] | null>(null);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [appointmentPatient, setAppointmentPatient] = useState<(typeof mockPatients)[0] | null>(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const router = useRouter();

  // Get current date and time for validation
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  
  // Minimum date should be today
  const minDate = today;

  const filteredPatients = mockPatients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === "all" || patient.riskLevel === filterRisk;
    const matchesStatus = filterStatus === "all" || patient.status === filterStatus;

    return matchesSearch && matchesRisk && matchesStatus;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "monitoring":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "stable":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handlePatientAction = (patientId: string, action: string) => {
    const patient = mockPatients.find((p) => p.id === patientId);
    switch (action) {
      case "view":
        setSelectedPatient(patient || null);
        break;
      case "appointment":
        setAppointmentPatient(patient || null);
        setAppointmentDialogOpen(true);
        break;
      case "medical-record":
        setMedicalRecordPatient(patient || null);
        break;
      default:
        break;
    }
  };

  const isValidAppointmentTime = (date: string, time: string) => {
    if (date === today) {
      // If appointment is today, time must be after current time
      return time > currentTime;
    }
    // If appointment is in the future, any time is valid
    return date > today;
  };

  const handleScheduleAppointment = () => {
    if (appointmentPatient && appointmentDate && appointmentTime) {
      if (!isValidAppointmentTime(appointmentDate, appointmentTime)) {
        alert("Please select a future date and time for the appointment.");
        return;
      }
      
      // In a real app, this would make an API call
      alert(`Appointment scheduled for ${appointmentPatient.name} on ${appointmentDate} at ${appointmentTime}`);
      setAppointmentDialogOpen(false);
      setAppointmentDate("");
      setAppointmentTime("");
      setAppointmentPatient(null);
    }
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
    "12:00", "12:30", "14:00", "14:30", "15:00", "15:30", 
    "16:00", "16:30", "17:00", "17:30"
  ];

  // Filter time slots based on selected date
  const getAvailableTimeSlots = () => {
    if (appointmentDate === today) {
      // Only show future time slots for today
      return timeSlots.filter(time => time > currentTime);
    }
    return timeSlots;
  };

  return (
    <DashboardLayout title="My Patients" breadcrumbs={[{ label: "My Patients" }]}>
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Patients Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Patient List ({filteredPatients.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Next Appointment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient, index) => (
                  <motion.tr
                    key={patient.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {patient.age} years, {patient.gender}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{patient.condition}</p>
                        <p className="text-sm text-muted-foreground">{patient.medications.slice(0, 2).join(", ")}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRiskColor(patient.riskLevel)}>{patient.riskLevel}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                    </TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell>{patient.nextAppointment}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handlePatientAction(patient.id, "view")}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePatientAction(patient.id, "appointment")}
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Appointment Scheduling Dialog */}
        <Dialog open={appointmentDialogOpen} onOpenChange={setAppointmentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {appointmentPatient && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={appointmentPatient.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {appointmentPatient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{appointmentPatient.name}</p>
                    <p className="text-sm text-muted-foreground">{appointmentPatient.condition}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="appointment-date">Select Date</Label>
                <Input
                  id="appointment-date"
                  type="date"
                  min={minDate}
                  value={appointmentDate}
                  onChange={(e) => {
                    setAppointmentDate(e.target.value);
                    setAppointmentTime(""); // Reset time when date changes
                  }}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointment-time">Select Time</Label>
                <Select 
                  value={appointmentTime} 
                  onValueChange={setAppointmentTime}
                  disabled={!appointmentDate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableTimeSlots().map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {appointmentDate === today && (
                  <p className="text-xs text-muted-foreground">
                    Only future time slots are available for today
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setAppointmentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleScheduleAppointment}
                  disabled={!appointmentDate || !appointmentTime}
                >
                  Schedule Appointment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Medical Records Dialog */}
        <Dialog open={!!medicalRecordPatient} onOpenChange={(open) => !open && setMedicalRecordPatient(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="flex items-center gap-3">
                <FileText className="h-5 w-5" />
                Medical Records
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMedicalRecordPatient(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            
            {medicalRecordPatient && (
              <div className="space-y-6">
                {/* Patient Header */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={medicalRecordPatient.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {medicalRecordPatient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{medicalRecordPatient.name}</h3>
                    <p className="text-muted-foreground">
                      Patient ID: {medicalRecordPatient.id} | {medicalRecordPatient.age} years, {medicalRecordPatient.gender}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge className={getRiskColor(medicalRecordPatient.riskLevel)}>{medicalRecordPatient.riskLevel} risk</Badge>
                      <Badge className={getStatusColor(medicalRecordPatient.status)}>{medicalRecordPatient.status}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Allergies */}
                    <div>
                      <h4 className="font-semibold text-red-600 dark:text-red-400 mb-3">⚠️ Allergies</h4>
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        <ul className="space-y-1">
                          {medicalRecordPatient.medicalRecord.allergies.map((allergy, index) => (
                            <li key={index} className="text-sm font-medium text-red-800 dark:text-red-200">
                              • {allergy}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Chronic Conditions */}
                    <div>
                      <h4 className="font-semibold mb-3">Chronic Conditions</h4>
                      <ul className="space-y-2">
                        {medicalRecordPatient.medicalRecord.chronicConditions.map((condition, index) => (
                          <li key={index} className="text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Past Surgeries */}
                    <div>
                      <h4 className="font-semibold mb-3">Surgical History</h4>
                      <div className="space-y-2">
                        {medicalRecordPatient.medicalRecord.pastSurgeries.length > 0 ? (
                          medicalRecordPatient.medicalRecord.pastSurgeries.map((surgery, index) => (
                            <div key={index} className="text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">
                              {surgery}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No surgical history</p>
                        )}
                      </div>
                    </div>

                    {/* Social History */}
                    <div>
                      <h4 className="font-semibold mb-3">Social History</h4>
                      <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
                        {medicalRecordPatient.medicalRecord.socialHistory}
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Family History */}
                    <div>
                      <h4 className="font-semibold mb-3">Family History</h4>
                      <ul className="space-y-2">
                        {medicalRecordPatient.medicalRecord.familyHistory.map((history, index) => (
                          <li key={index} className="text-sm bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                            {history}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recent Lab Results */}
                    <div>
                      <h4 className="font-semibold mb-3">Recent Lab Results</h4>
                      <div className="space-y-3">
                        {medicalRecordPatient.medicalRecord.labResults.map((result, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium">{result.test}</span>
                              <span className="text-xs text-muted-foreground">{result.date}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-lg">{result.value}</span>
                              <span className="text-xs text-muted-foreground">Normal: {result.normal}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Recent Visits */}
                <div>
                  <h4 className="font-semibold mb-3">Recent Visit Notes</h4>
                  <div className="space-y-3">
                    {medicalRecordPatient.medicalRecord.recentVisits.map((visit, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{visit.date}</span>
                          <Badge variant="outline">{visit.reason}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{visit.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Patient Details Modal/Panel */}
        {selectedPatient && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedPatient.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {selectedPatient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedPatient.name}</h3>
                      <p className="text-muted-foreground">
                        {selectedPatient.age} years, {selectedPatient.gender}
                      </p>
                    </div>
                  </CardTitle>
                  <Button variant="outline" onClick={() => setSelectedPatient(null)}>
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Patient Info */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Primary Condition</h4>
                      <p className="text-muted-foreground">{selectedPatient.condition}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Risk Level</h4>
                      <Badge className={getRiskColor(selectedPatient.riskLevel)}>{selectedPatient.riskLevel}</Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Status</h4>
                      <Badge className={getStatusColor(selectedPatient.status)}>{selectedPatient.status}</Badge>
                    </div>
                  </div>

                  {/* Vitals */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Latest Vitals</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Blood Pressure:</span>
                        <span>{selectedPatient.vitals.bloodPressure}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Heart Rate:</span>
                        <span>{selectedPatient.vitals.heartRate} BPM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Temperature:</span>
                        <span>{selectedPatient.vitals.temperature}</span>
                      </div>
                    </div>
                  </div>

                  {/* Medications & Tests */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Current Medications</h4>
                      <ul className="space-y-1">
                        {selectedPatient.medications.map((med, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            • {med}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Recent Tests</h4>
                      <ul className="space-y-1">
                        {selectedPatient.recentTests.map((test, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            • {test}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => {
                      setAppointmentPatient(selectedPatient);
                      setAppointmentDialogOpen(true);
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handlePatientAction(selectedPatient.id, "medical-record")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Full Medical Record
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}