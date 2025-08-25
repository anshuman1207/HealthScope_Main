"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, AlertTriangle, CheckCircle, Clock, Send, Activity, Brain } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { PredictionCard } from "@/components/common/prediction-card"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

// TypeScript interfaces
interface Contributor {
  factor: string
  impact: number
}

interface AnalysisResult {
  success: boolean
  predicted_disorder?: string
  condition?: string
  risk_score: number
  confidence: number
  contributors: Contributor[]
  recommendations: string[]
  error?: string
}

interface SymptomQuestion {
  id: number
  question: string
  type: "textarea" | "radio" | "checkbox"
  placeholder?: string
  options?: string[]
  key: string
}

interface RiskLevelInfo {
  level: string
  color: string
  bgColor: string
  textColor: string
  borderColor: string
  icon: React.ComponentType<any>
  description: string
}

const symptomQuestions: SymptomQuestion[] = [
  {
    id: 1,
    question: "What is your primary concern today?",
    type: "textarea",
    placeholder: "Describe your main symptoms or concerns in detail...",
    key: "primary_concern"
  },
  {
    id: 2,
    question: "How long have you been experiencing these symptoms?",
    type: "radio",
    options: ["Less than 24 hours", "1-3 days", "4-7 days", "1-2 weeks", "More than 2 weeks"],
    key: "duration"
  },
  {
    id: 3,
    question: "Rate your pain level (if applicable)",
    type: "radio",
    options: [
      "No pain (0/10)",
      "Mild pain (1-3/10)",
      "Moderate pain (4-6/10)",
      "Severe pain (7-8/10)",
      "Extreme pain (9-10/10)",
    ],
    key: "pain_level"
  },
  {
    id: 4,
    question: "Select any additional symptoms you're experiencing:",
    type: "checkbox",
    options: [
      "Fever",
      "Headache",
      "Nausea",
      "Fatigue",
      "Dizziness",
      "Shortness of breath",
      "Chest pain",
      "Abdominal pain",
    ],
    key: "additional_symptoms"
  },
  {
    id: 5,
    question: "Have you taken any medications for these symptoms?",
    type: "radio",
    options: [
      "No medications",
      "Over-the-counter pain relievers",
      "Prescription medications",
      "Home remedies only",
      "Multiple medications",
    ],
    key: "medication"
  },
]

const getRiskLevelInfo = (riskScore: number): RiskLevelInfo => {
  if (riskScore >= 80) {
    return {
      level: "CRITICAL",
      color: "red",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-800 dark:text-red-200",
      borderColor: "border-red-200 dark:border-red-800",
      icon: AlertTriangle,
      description: "Immediate medical attention required"
    }
  } else if (riskScore >= 60) {
    return {
      level: "HIGH",
      color: "orange",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-800 dark:text-orange-200",
      borderColor: "border-orange-200 dark:border-orange-800",
      icon: AlertTriangle,
      description: "Seek medical care within 24 hours"
    }
  } else if (riskScore >= 40) {
    return {
      level: "MODERATE",
      color: "yellow",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      textColor: "text-yellow-800 dark:text-yellow-200",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      icon: Clock,
      description: "Schedule appointment within few days"
    }
  } else {
    return {
      level: "LOW",
      color: "green",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-800 dark:text-green-200",
      borderColor: "border-green-200 dark:border-green-800",
      icon: CheckCircle,
      description: "Monitor symptoms, routine follow-up"
    }
  }
}

// Helper function to create mock analysis result for fallback/demo purposes
const createMockAnalysisResult = (): AnalysisResult => ({
  success: true,
  predicted_disorder: 'Upper Respiratory Infection',
  risk_score: 45,
  confidence: 0.78,
  contributors: [
    { factor: "Persistent cough", impact: 0.35 },
    { factor: "Mild fever", impact: 0.25 },
    { factor: "Fatigue", impact: 0.2 },
    { factor: "Duration (3 days)", impact: 0.2 },
  ],
  recommendations: [
    'Rest and stay hydrated',
    'Monitor symptoms for 48 hours', 
    'Consider seeing a doctor if symptoms worsen',
    'Use throat lozenges for comfort',
    'Avoid strenuous activities'
  ]
})

export default function SymptomChecker() {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [showResults, setShowResults] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAnswer = (key: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [key]: answer }))
  }

  const handleNext = () => {
    if (currentStep < symptomQuestions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Prepare the payload for the API
      const payload = {
        primary_concern: answers.primary_concern || "",
        duration: answers.duration || "1-3 days",
        pain_level: answers.pain_level || "No pain (0/10)",
        additional_symptoms: answers.additional_symptoms || [],
        medication: answers.medication || "No medications"
      }

      console.log('Sending payload:', payload)

      // Call the Python API
      const response = await fetch('http://localhost:5000/api/analyze-symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: AnalysisResult = await response.json()
      console.log('API Response:', result)

      if (result.success) {
        // Ensure we have all the required fields for the PredictionCard component
        const enhancedResult: AnalysisResult = {
          ...result,
          contributors: result.contributors || [
            { factor: "Primary symptoms", impact: 0.4 },
            { factor: "Duration", impact: 0.3 },
            { factor: "Additional symptoms", impact: 0.2 },
            { factor: "Pain level", impact: 0.1 },
          ]
        }
        setAnalysisResult(enhancedResult)
        setShowResults(true)
      } else {
        throw new Error(result.error || 'Analysis failed')
      }

    } catch (err) {
      console.error('API Error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze symptoms. Please try again.'
      setError(errorMessage)
      
      // Fallback to mock data for demonstration
      setAnalysisResult(createMockAnalysisResult())
      setShowResults(true)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestDoctorReview = () => {
    alert("Doctor review requested! You'll be notified when a doctor reviews your case.")
    router.push("/dashboard/patient")
  }

  const currentQuestion = symptomQuestions[currentStep]
  const progress = ((currentStep + 1) / symptomQuestions.length) * 100
  
  const isCurrentAnswerValid = () => {
    const answer = answers[currentQuestion.key]
    if (!answer) return false
    if (currentQuestion.type === "textarea") return answer.trim().length > 0
    if (currentQuestion.type === "checkbox") return Array.isArray(answer) && answer.length > 0
    return true
  }

  if (loading) {
    return (
      <DashboardLayout title="Symptom Checker" breadcrumbs={[{ label: "Symptom Checker" }]}>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="inline-block mb-4"
              >
                <Brain className="h-12 w-12 text-primary" />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">AI Medical Analysis in Progress</h3>
              <p className="text-muted-foreground mb-6">Our advanced medical AI is analyzing your symptoms...</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">Processing symptom data</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">Comparing with medical database</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">Running diagnostic algorithms</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Activity className="h-4 w-4 text-primary" />
                  </motion.div>
                  <span className="text-muted-foreground">Generating recommendations</span>
                </div>
              </div>

              {error && (
                <Alert className="mt-6 text-left">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {error} Using fallback analysis...
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (showResults && analysisResult) {
    const riskInfo = getRiskLevelInfo(analysisResult.risk_score)
    
    return (
      <DashboardLayout
        title="Symptom Analysis Results"
        breadcrumbs={[{ label: "Symptom Checker" }, { label: "Results" }]}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Use the original PredictionCard component */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <PredictionCard
              condition={analysisResult.predicted_disorder || analysisResult.condition || "Unknown Condition"}
              riskScore={analysisResult.risk_score}
              confidence={analysisResult.confidence}
              contributors={analysisResult.contributors || []}
              recommendations={analysisResult.recommendations || []}
            />
          </motion.div>

          {/* Enhanced Next Steps Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">Important Medical Disclaimer</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      This AI analysis is for informational purposes only and should not replace professional medical
                      advice. Please consult with a healthcare provider for proper diagnosis and treatment.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleRequestDoctorReview} className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Request Doctor Review
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/dashboard/patient/appointments")}>
                    Book Appointment
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setCurrentStep(0)
                    setAnswers({})
                    setShowResults(false)
                    setAnalysisResult(null)
                    setError(null)
                  }}
                >
                  Start New Assessment
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional API Status Card if there was an error */}
          {error && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                    <AlertTriangle className="h-5 w-5" />
                    API Status Notice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    The AI analysis service encountered an issue: <strong>{error}</strong>
                    <br />
                    Results shown are from the fallback system for demonstration purposes.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Symptom Checker" breadcrumbs={[{ label: "Symptom Checker" }]}>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Health Assessment
              </CardTitle>
              <Badge variant="outline">
                Step {currentStep + 1} of {symptomQuestions.length}
              </Badge>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>

                {currentQuestion.type === "textarea" && (
                  <Textarea
                    placeholder={currentQuestion.placeholder}
                    value={answers[currentQuestion.key] || ""}
                    onChange={(e) => handleAnswer(currentQuestion.key, e.target.value)}
                    className="min-h-[120px]"
                  />
                )}

                {currentQuestion.type === "radio" && (
                  <RadioGroup
                    value={answers[currentQuestion.key] || ""}
                    onValueChange={(value) => handleAnswer(currentQuestion.key, value)}
                  >
                    {currentQuestion.options?.map((option: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQuestion.type === "checkbox" && (
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option: string, index: number) => {
                      const currentAnswers: string[] = answers[currentQuestion.key] || []
                      return (
                        <div key={index} className="flex items-center space-x-2">
                          <Checkbox
                            id={`checkbox-${index}`}
                            checked={currentAnswers.includes(option)}
                            onCheckedChange={(checked: boolean) => {
                              const newAnswers = checked
                                ? [...currentAnswers, option]
                                : currentAnswers.filter((a: string) => a !== option)
                              handleAnswer(currentQuestion.key, newAnswers)
                            }}
                          />
                          <Label htmlFor={`checkbox-${index}`}>{option}</Label>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isCurrentAnswerValid()}
              >
                {currentStep === symptomQuestions.length - 1 ? (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze Symptoms
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}