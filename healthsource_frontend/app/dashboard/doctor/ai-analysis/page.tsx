"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, ImageIcon, Eye, Download, Zap, TrendingUp, AlertCircle } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PredictionCard } from "@/components/common/prediction-card"
import { LoadingSkeleton } from "@/components/common/loading-skeleton"

interface AnalysisResult {
  id: string
  fileName: string
  fileType: string
  uploadTime: string
  status: "processing" | "completed" | "error"
  ocrText?: string
  predictions?: {
    condition: string
    riskScore: number
    confidence: number
    contributors: Array<{ factor: string; impact: number }>
    recommendations: string[]
  }
  keyFindings?: string[]
}

const mockAnalysisResults: AnalysisResult[] = [
  {
    id: "analysis_001",
    fileName: "blood_test_rajesh_kumar.pdf",
    fileType: "pdf",
    uploadTime: "15 Jan 2024, 10:30 AM",
    status: "completed",
    ocrText:
      "COMPREHENSIVE METABOLIC PANEL\nPatient: Rajesh Kumar\nDOB: 15-05-1980\nAge: 44 years\nGlucose (Fasting): 165 mg/dL (HIGH)\nHbA1c: 7.2% (HIGH)\nTotal Cholesterol: 240 mg/dL (HIGH)\nHDL: 35 mg/dL (LOW)\nLDL: 160 mg/dL (HIGH)\nTriglicerides: 220 mg/dL (HIGH)\nCreatinine: 1.1 mg/dL (NORMAL)\nUrea: 45 mg/dL (NORMAL)",
    predictions: {
      condition: "Type 2 Diabetes Mellitus with Dyslipidemia",
      riskScore: 78,
      confidence: 0.91,
      contributors: [
        { factor: "Elevated Fasting Glucose (165 mg/dL)", impact: 0.35 },
        { factor: "Poor Glycemic Control - HbA1c (7.2%)", impact: 0.3 },
        { factor: "High LDL Cholesterol (160 mg/dL)", impact: 0.2 },
        { factor: "Low HDL Cholesterol (35 mg/dL)", impact: 0.15 },
      ],
      recommendations: [
        "Initiate/optimize anti-diabetic medication as per Indian guidelines",
        "Refer to cardiology for cardiovascular risk assessment",
        "Dietary counseling focusing on Indian diabetic diet plan",
        "Consider Atorvastatin 20mg for lipid management",
        "Regular monitoring of glucose levels - suggest glucometer",
      ],
    },
    keyFindings: [
      "Fasting glucose significantly elevated - diabetes poorly controlled",
      "HbA1c indicates average blood sugar >180 mg/dL over 3 months",
      "Dyslipidemia pattern typical of metabolic syndrome",
      "Kidney function parameters within normal limits",
    ],
  },
  {
    id: "analysis_002",
    fileName: "chest_xray_priya_sharma.jpg",
    fileType: "image",
    uploadTime: "15 Jan 2024, 09:15 AM",
    status: "completed",
    predictions: {
      condition: "Lower Respiratory Tract Infection (Pneumonia suspected)",
      riskScore: 65,
      confidence: 0.82,
      contributors: [
        { factor: "Right lower lobe opacity/consolidation", impact: 0.45 },
        { factor: "Increased bronchovascular markings", impact: 0.3 },
        { factor: "Clinical symptoms correlation", impact: 0.25 },
      ],
      recommendations: [
        "Start empirical antibiotic therapy - Amoxicillin-Clavulanate",
        "Follow-up chest X-ray after 48-72 hours",
        "Monitor temperature, oxygen saturation regularly",
        "Steam inhalation and adequate fluid intake",
        "Consider sputum culture if no improvement in 48 hours",
      ],
    },
    keyFindings: [
      "Right lower lobe consolidation consistent with pneumonia", 
      "No evidence of pleural effusion or pneumothorax", 
      "Cardiac silhouette appears normal",
      "Costophrenic angles clear bilaterally"
    ],
  },
  {
    id: "analysis_003",
    fileName: "ecg_report_amit_patel.pdf",
    fileType: "pdf",
    uploadTime: "14 Jan 2024, 02:45 PM",
    status: "completed",
    ocrText:
      "12-LEAD ELECTROCARDIOGRAM\nPatient: Amit Patel\nAge: 56 years\nHeart Rate: 92 bpm\nPR Interval: 160 ms\nQRS Duration: 100 ms\nQT/QTc: 420/445 ms\nAxis: Normal\nRhythm: Sinus Rhythm\nFindings: ST depression in leads V4-V6\nMinor T wave abnormalities in inferior leads",
    predictions: {
      condition: "Possible Ischemic Heart Disease - Early Changes",
      riskScore: 55,
      confidence: 0.76,
      contributors: [
        { factor: "ST depression in lateral leads (V4-V6)", impact: 0.4 },
        { factor: "T wave abnormalities in inferior leads", impact: 0.3 },
        { factor: "Patient age and risk factors", impact: 0.3 },
      ],
      recommendations: [
        "Urgent cardiology consultation required",
        "Consider stress testing or cardiac catheterization",
        "Start dual antiplatelet therapy if not contraindicated",
        "Lipid profile and cardiac enzymes (Troponin-I)",
        "Lifestyle modification counseling - Indian heart-healthy diet",
      ],
    },
    keyFindings: [
      "Lateral ST depression suggests possible LAD territory ischemia",
      "Normal QRS duration rules out major conduction defects",
      "Heart rate slightly elevated but within acceptable range",
      "No acute ST elevation - rules out STEMI",
    ],
  },
  {
    id: "analysis_004",
    fileName: "ultrasound_abdomen_sunita_devi.pdf",
    fileType: "pdf",
    uploadTime: "13 Jan 2024, 04:20 PM",
    status: "completed",
    ocrText:
      "ABDOMINAL ULTRASOUND REPORT\nPatient: Sunita Devi\nAge: 42 years\nLiver: Normal size, echogenicity increased\nGallbladder: Multiple echogenic foci with acoustic shadowing\nPancreas: Normal\nKidneys: Both kidneys normal size and echogenicity\nSpleen: Normal\nImpression: Cholelithiasis (Multiple gallstones)",
    predictions: {
      condition: "Cholelithiasis (Gallstone Disease)",
      riskScore: 40,
      confidence: 0.89,
      contributors: [
        { factor: "Multiple gallstones with acoustic shadowing", impact: 0.5 },
        { factor: "Increased liver echogenicity", impact: 0.25 },
        { factor: "Patient demographics (female, age)", impact: 0.25 },
      ],
      recommendations: [
        "Dietary modification - low fat, high fiber Indian diet",
        "Weight management if overweight",
        "Surgical consultation if symptomatic episodes",
        "Avoid fatty foods, fried items, and rich gravies",
        "Monitor for complications - cholecystitis, pancreatitis",
      ],
    },
    keyFindings: [
      "Multiple gallstones clearly visible on ultrasound",
      "Liver shows fatty infiltration (mild hepatic steatosis)",
      "No evidence of acute cholecystitis",
      "Other abdominal organs appear normal",
    ],
  },
];

export default function AIAnalysis() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>(mockAnalysisResults)
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
  }, [])

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    setUploadedFiles((prev) => [...prev, ...files])
  }, [])

  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0) return

    setIsAnalyzing(true)

    // Simulate analysis process
    for (const file of uploadedFiles) {
      const newResult: AnalysisResult = {
        id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fileName: file.name,
        fileType: file.type.includes("image") ? "image" : "pdf",
        uploadTime: new Date().toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        status: "processing",
      }

      setAnalysisResults((prev) => [newResult, ...prev])

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Update with completed analysis
      setAnalysisResults((prev) =>
        prev.map((result) =>
          result.id === newResult.id
            ? {
                ...result,
                status: "completed" as const,
                predictions: {
                  condition: "Sample Analysis Result",
                  riskScore: Math.floor(Math.random() * 40) + 30,
                  confidence: 0.75 + Math.random() * 0.2,
                  contributors: [
                    { factor: "Primary clinical finding", impact: 0.4 },
                    { factor: "Secondary supporting evidence", impact: 0.3 },
                    { factor: "Patient history correlation", impact: 0.3 },
                  ],
                  recommendations: [
                    "Follow standard Indian medical guidelines",
                    "Monitor patient parameters closely",
                    "Consider additional investigations as needed",
                    "Lifestyle modifications as per Indian context",
                  ],
                },
                keyFindings: [
                  "Primary finding identified", 
                  "Supporting evidence documented", 
                  "Clinical correlation established"
                ],
              }
            : result,
        ),
      )
    }

    setUploadedFiles([])
    setIsAnalyzing(false)
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("image")) return <ImageIcon className="h-5 w-5" />
    return <FileText className="h-5 w-5" />
  }

  return (
    <DashboardLayout title="AI Medical Analysis" breadcrumbs={[{ label: "AI Analysis" }]}>
      <div className="space-y-6">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload & Analyze</TabsTrigger>
            <TabsTrigger value="results">Analysis Results</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Medical Reports & Diagnostic Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Upload Files for AI-Powered Medical Analysis</h3>
                  <p className="text-muted-foreground mb-4">
                    Drag and drop medical files here, or click to select files
                    <br />
                    Supports: Lab reports (PDF), X-rays, CT scans, MRI (JPEG/PNG), ECG reports, Ultrasound images
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.dcm"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer bg-transparent">
                      Select Medical Files
                    </Button>
                  </label>
                </div>

                {/* Uploaded Files Preview */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Files Ready for AI Analysis</h4>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {getFileIcon(file.type)}
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== index))}
                          >
                            Remove
                          </Button>
                        </motion.div>
                      ))}
                    </div>

                    <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full mt-4" size="lg">
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          AI Analysis in Progress...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Start AI Medical Analysis
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Real-time Analysis Progress */}
            {isAnalyzing && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                      AI Medical Analysis in Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Processing medical files...</span>
                        <span>Step 1 of 4</span>
                      </div>
                      <Progress value={25} className="h-2" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-green-500 rounded-full" />
                          OCR Text Extraction & Hindi Translation
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" />
                          Medical Entity Recognition (Indian Context)
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-gray-300 rounded-full" />
                          Risk Assessment & Scoring
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-gray-300 rounded-full" />
                          Treatment Recommendations (Indian Guidelines)
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {/* Analysis Results */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Results List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis History</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysisResults.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedResult?.id === result.id ? "bg-accent" : "hover:bg-accent/50"
                        }`}
                        onClick={() => setSelectedResult(result)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getFileIcon(result.fileType)}
                            <div>
                              <p className="font-medium text-sm truncate">{result.fileName}</p>
                              <p className="text-xs text-muted-foreground">{result.uploadTime}</p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              result.status === "completed"
                                ? "secondary"
                                : result.status === "processing"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {result.status === "completed" ? "Complete" : 
                             result.status === "processing" ? "Processing" : "Error"}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Results */}
              <div className="lg:col-span-2">
                {selectedResult ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedResult.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {selectedResult.status === "processing" ? (
                        <LoadingSkeleton type="card" />
                      ) : selectedResult.status === "completed" && selectedResult.predictions ? (
                        <>
                          <PredictionCard
                            condition={selectedResult.predictions.condition}
                            riskScore={selectedResult.predictions.riskScore}
                            confidence={selectedResult.predictions.confidence}
                            contributors={selectedResult.predictions.contributors}
                            recommendations={selectedResult.predictions.recommendations}
                          />

                          {/* OCR Results */}
                          {selectedResult.ocrText && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <Eye className="h-5 w-5" />
                                  Extracted Medical Data (OCR)
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="bg-muted p-4 rounded-lg font-mono text-sm whitespace-pre-line">
                                  {selectedResult.ocrText}
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Key Medical Findings */}
                          {selectedResult.keyFindings && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <TrendingUp className="h-5 w-5" />
                                  Key Clinical Findings
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2">
                                  {selectedResult.keyFindings.map((finding, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                      <span className="text-sm">{finding}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          )}

                          {/* Actions */}
                          <Card>
                            <CardContent className="p-6">
                              <div className="flex gap-3 flex-wrap">
                                <Button>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download Medical Report
                                </Button>
                                <Button variant="outline">Share with Patient</Button>
                                <Button variant="outline">Add to Medical Records</Button>
                                <Button variant="outline">Print Prescription</Button>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      ) : (
                        <Card>
                          <CardContent className="p-12 text-center">
                            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mb-2">Analysis Error</h3>
                            <p className="text-muted-foreground">
                              There was an error processing this medical file. Please verify file format and try uploading again.
                            </p>
                            <Button className="mt-4" variant="outline">
                              Retry Analysis
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">Select an Analysis Report</h3>
                      <p className="text-muted-foreground">
                        Choose an analysis from the list to view detailed AI insights, clinical findings, and treatment recommendations.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}