"use client"

import { motion } from "framer-motion"
import { Heart, Activity, Calendar, MapPin, MessageSquare, AlertTriangle, TrendingUp, Clock, Plus, X, Save, User, Star, Video, Phone, Shield, Pill, Stethoscope, CheckCircle, AlertCircle } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { PredictionCard } from "@/components/common/prediction-card"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useState, useEffect, useMemo } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Extended User type for this component
interface ExtendedUser {
  id: string
  name?: string
  email: string
  age?: number
  gender?: string
  token?: string
}

interface RiskAssessment {
  riskScore: number
  factors: Array<{
    factor: string
    score: number
    description: string
  }>
  recommendations: string[]
  riskLevel: {
    level: string
    color: string
    description: string
  }
}

interface RecommendedDoctor {
  id: string
  name: string
  specialty: string
  experience: number
  rating: number
  profileImage?: string
  hospital: string
  availableSlots: number
  consultationFee: number
  isOnline: boolean
}

interface Appointment {
  id: string
  doctor: string
  specialty: string
  date: string
  time: string
  type: string
  status?: string
}

interface VaccineRecommendation {
  name: string
  description: string
  ageRange: string
  priority: 'High' | 'Medium' | 'Low'
  schedule?: string
  isCompleted?: boolean
}

interface HealthcareMeasure {
  category: string
  measures: string[]
  priority: 'High' | 'Medium' | 'Low'
}

interface MedicationAdvice {
  category: string
  advice: string[]
  priority: 'High' | 'Medium' | 'Low'
}

interface AgeGroupData {
  group: string
  vaccines: VaccineRecommendation[]
  healthcareMeasures: HealthcareMeasure[]
  medicationAdvice: MedicationAdvice[]
}

// Indian Healthcare Data based on age groups
const getHealthcareRecommendations = (age: number, gender: string): AgeGroupData => {
  let group = ''
  let vaccines: VaccineRecommendation[] = []
  let healthcareMeasures: HealthcareMeasure[] = []
  let medicationAdvice: MedicationAdvice[] = []

  if (age < 2) {
    group = 'Infant (0-2 years)'
    vaccines = [
      { name: 'BCG', description: 'Tuberculosis vaccine', ageRange: 'At birth', priority: 'High', schedule: 'Single dose' },
      { name: 'Hepatitis B', description: 'Hepatitis B vaccine', ageRange: 'At birth, 6 weeks, 10-14 weeks', priority: 'High', schedule: '3 doses' },
      { name: 'OPV/IPV', description: 'Polio vaccine', ageRange: '6, 10, 14 weeks', priority: 'High', schedule: '3 doses' },
      { name: 'DPT', description: 'Diphtheria, Pertussis, Tetanus', ageRange: '6, 10, 14 weeks', priority: 'High', schedule: '3 doses' },
      { name: 'Hib', description: 'Haemophilus influenzae type b', ageRange: '6, 10, 14 weeks', priority: 'High', schedule: '3 doses' },
      { name: 'Rotavirus', description: 'Rotavirus vaccine', ageRange: '6, 10, 14 weeks', priority: 'High', schedule: '3 doses' },
      { name: 'PCV', description: 'Pneumococcal conjugate vaccine', ageRange: '6, 10, 14 weeks', priority: 'High', schedule: '3 doses' },
      { name: 'MMR', description: 'Measles, Mumps, Rubella', ageRange: '9-12 months', priority: 'High', schedule: '1st dose' },
    ]
    healthcareMeasures = [
      { category: 'Nutrition', measures: ['Exclusive breastfeeding for 6 months', 'Iron and Vitamin D supplements as prescribed'], priority: 'High' },
      { category: 'Growth Monitoring', measures: ['Monthly weight checks', 'Growth chart plotting', 'Developmental milestones tracking'], priority: 'High' },
      { category: 'Hygiene', measures: ['Hand hygiene for caregivers', 'Clean feeding equipment', 'Safe water use'], priority: 'High' },
    ]
    medicationAdvice = [
      { category: 'Supplements', advice: ['Vitamin D drops (400 IU daily)', 'Iron supplements as prescribed by doctor'], priority: 'High' },
      { category: 'Safety', advice: ['Avoid honey before 12 months', 'No cow milk before 12 months', 'Paracetamol only as prescribed'], priority: 'High' },
    ]
  } else if (age < 12) {
    group = 'Child (2-12 years)'
    vaccines = [
      { name: 'DPT Booster', description: 'Diphtheria, Pertussis, Tetanus booster', ageRange: '16-24 months, 4-6 years', priority: 'High', schedule: 'Booster doses' },
      { name: 'OPV Booster', description: 'Polio vaccine booster', ageRange: '16-24 months, 4-6 years', priority: 'High', schedule: 'Booster doses' },
      { name: 'MMR 2nd dose', description: 'Measles, Mumps, Rubella 2nd dose', ageRange: '16-24 months', priority: 'High', schedule: '2nd dose' },
      { name: 'Typhoid', description: 'Typhoid vaccine', ageRange: '2+ years', priority: 'Medium', schedule: 'Every 3 years' },
      { name: 'Hepatitis A', description: 'Hepatitis A vaccine', ageRange: '2+ years', priority: 'Medium', schedule: '2 doses' },
      { name: 'Varicella', description: 'Chickenpox vaccine', ageRange: '12+ months', priority: 'Medium', schedule: '2 doses' },
    ]
    healthcareMeasures = [
      { category: 'Nutrition', measures: ['Balanced diet with fruits and vegetables', 'Adequate protein intake', 'Limit junk food'], priority: 'High' },
      { category: 'Physical Activity', measures: ['At least 1 hour daily physical activity', 'Outdoor play time', 'Limit screen time to 2 hours'], priority: 'High' },
      { category: 'Dental Health', measures: ['Brush teeth twice daily', 'Regular dental checkups', 'Fluoride toothpaste'], priority: 'High' },
      { category: 'Sleep', measures: ['10-11 hours of sleep daily', 'Regular sleep schedule', 'Screen-free bedroom'], priority: 'Medium' },
    ]
    medicationAdvice = [
      { category: 'Supplements', advice: ['Vitamin D as recommended', 'Multivitamins if diet is inadequate'], priority: 'Medium' },
      { category: 'Medicine Safety', advice: ['Use child-proof medicine containers', 'Age-appropriate dosages only', 'Complete antibiotic courses'], priority: 'High' },
    ]
  } else if (age < 18) {
    group = 'Adolescent (12-18 years)'
    vaccines = [
      { name: 'Tdap', description: 'Tetanus, Diphtheria, Pertussis booster', ageRange: '11-12 years', priority: 'High', schedule: '1 dose' },
      { name: 'HPV', description: 'Human Papillomavirus vaccine', ageRange: '9-26 years', priority: 'High', schedule: '2-3 doses', isCompleted: false },
      { name: 'Meningococcal', description: 'Meningococcal conjugate vaccine', ageRange: '11-12 years', priority: 'Medium', schedule: '1-2 doses' },
      { name: 'Annual Flu', description: 'Seasonal influenza vaccine', ageRange: 'Yearly', priority: 'Medium', schedule: 'Annual' },
    ]
    
    // Gender-specific measures for adolescents
    if (gender === 'female') {
      healthcareMeasures = [
        { category: 'Reproductive Health', measures: ['Menstrual hygiene education', 'Iron supplementation during menstruation', 'Annual gynecological consultation'], priority: 'High' },
        { category: 'Nutrition', measures: ['Iron-rich foods', 'Calcium supplementation', 'Folic acid rich foods'], priority: 'High' },
        { category: 'Mental Health', measures: ['Body image counseling', 'Stress management techniques', 'Open communication about changes'], priority: 'Medium' },
        { category: 'Physical Activity', measures: ['Regular exercise (30 mins daily)', 'Sports participation', 'Strength training'], priority: 'Medium' },
      ]
    } else {
      healthcareMeasures = [
        { category: 'Physical Development', measures: ['Regular health checkups', 'Height and weight monitoring', 'Puberty counseling'], priority: 'High' },
        { category: 'Nutrition', measures: ['High protein diet', 'Calcium and Vitamin D', 'Avoid excessive junk food'], priority: 'High' },
        { category: 'Mental Health', measures: ['Stress management', 'Social skills development', 'Academic pressure counseling'], priority: 'Medium' },
        { category: 'Physical Activity', measures: ['Daily sports/exercise', 'Strength building activities', 'Outdoor activities'], priority: 'Medium' },
      ]
    }
    
    medicationAdvice = [
      { category: 'Supplements', advice: ['Iron supplements if anemic', 'Vitamin D3 (1000-2000 IU daily)', 'Calcium supplements'], priority: 'Medium' },
      { category: 'Mental Health', advice: ['Avoid substance abuse', 'Seek help for depression/anxiety', 'Maintain sleep hygiene'], priority: 'High' },
    ]
  } else if (age < 40) {
    group = 'Young Adult (18-40 years)'
    vaccines = [
      { name: 'Annual Flu', description: 'Seasonal influenza vaccine', ageRange: 'Yearly', priority: 'Medium', schedule: 'Annual' },
      { name: 'Tdap', description: 'Tetanus, Diphtheria, Pertussis booster', ageRange: 'Every 10 years', priority: 'High', schedule: 'Every 10 years' },
      { name: 'HPV', description: 'Human Papillomavirus vaccine (if not received)', ageRange: 'Up to 26 years', priority: 'High', schedule: '2-3 doses' },
      { name: 'Hepatitis B', description: 'Hepatitis B vaccine (if not immune)', ageRange: 'Any age', priority: 'Medium', schedule: '3 doses' },
      { name: 'MMR', description: 'Measles, Mumps, Rubella (if not immune)', ageRange: 'Any age', priority: 'Medium', schedule: '1-2 doses' },
    ]

    // Gender-specific measures for young adults
    if (gender === 'female') {
      healthcareMeasures = [
        { category: 'Reproductive Health', measures: ['Annual Pap smear (21+ years)', 'Breast self-examination', 'Contraception counseling', 'Preconception care if planning pregnancy'], priority: 'High' },
        { category: 'Preventive Screening', measures: ['Blood pressure check yearly', 'Cholesterol screening', 'Diabetes screening if risk factors'], priority: 'High' },
        { category: 'Lifestyle', measures: ['Regular exercise (150 mins/week)', 'Healthy diet', 'Stress management', 'Avoid smoking/alcohol'], priority: 'Medium' },
      ]
    } else {
      healthcareMeasures = [
        { category: 'Preventive Screening', measures: ['Blood pressure check yearly', 'Cholesterol screening every 5 years', 'Diabetes screening if risk factors'], priority: 'High' },
        { category: 'Men\'s Health', measures: ['Testicular self-examination', 'Prostate awareness', 'Mental health screening'], priority: 'High' },
        { category: 'Lifestyle', measures: ['Regular exercise (150 mins/week)', 'Healthy diet', 'Stress management', 'Limit alcohol consumption'], priority: 'Medium' },
      ]
    }

    medicationAdvice = [
      { category: 'Supplements', advice: ['Vitamin D3 if deficient', 'Multivitamin if diet inadequate', 'Omega-3 supplements'], priority: 'Low' },
      { category: 'Preventive Care', advice: ['Regular health checkups', 'Maintain healthy weight', 'Monitor blood pressure'], priority: 'High' },
    ]
  } else if (age < 65) {
    group = 'Middle-aged Adult (40-65 years)'
    vaccines = [
      { name: 'Annual Flu', description: 'Seasonal influenza vaccine', ageRange: 'Yearly', priority: 'High', schedule: 'Annual' },
      { name: 'Tdap', description: 'Tetanus, Diphtheria, Pertussis booster', ageRange: 'Every 10 years', priority: 'High', schedule: 'Every 10 years' },
      { name: 'Zoster (Shingles)', description: 'Herpes Zoster vaccine', ageRange: '50+ years', priority: 'Medium', schedule: '1-2 doses' },
      { name: 'Pneumococcal', description: 'Pneumococcal vaccine', ageRange: '50+ years with risk factors', priority: 'Medium', schedule: '1-2 doses' },
    ]

    // Gender-specific measures for middle-aged adults
    if (gender === 'female') {
      healthcareMeasures = [
        { category: 'Women\'s Health', measures: ['Annual mammography (40+ years)', 'Pap smear every 3 years', 'Bone density screening (65+ or risk factors)', 'Menopause management'], priority: 'High' },
        { category: 'Chronic Disease Prevention', measures: ['Blood pressure monitoring', 'Cholesterol screening', 'Diabetes screening', 'Thyroid function tests'], priority: 'High' },
        { category: 'Lifestyle', measures: ['Weight management', 'Regular exercise', 'Stress reduction', 'Adequate sleep'], priority: 'Medium' },
      ]
    } else {
      healthcareMeasures = [
        { category: 'Men\'s Health', measures: ['Prostate screening (50+ years)', 'Colonoscopy (45+ years)', 'Cardiovascular risk assessment'], priority: 'High' },
        { category: 'Chronic Disease Prevention', measures: ['Blood pressure monitoring', 'Cholesterol screening', 'Diabetes screening', 'Kidney function tests'], priority: 'High' },
        { category: 'Lifestyle', measures: ['Weight management', 'Regular exercise', 'Smoking cessation', 'Limit alcohol'], priority: 'Medium' },
      ]
    }

    medicationAdvice = [
      { category: 'Chronic Conditions', advice: ['Take prescribed medications regularly', 'Monitor blood pressure', 'Diabetes management if applicable'], priority: 'High' },
      { category: 'Supplements', advice: ['Calcium and Vitamin D', 'Omega-3 fatty acids', 'Multivitamin with B12'], priority: 'Medium' },
    ]
  } else {
    group = 'Elderly (65+ years)'
    vaccines = [
      { name: 'Annual Flu', description: 'High-dose influenza vaccine', ageRange: 'Yearly', priority: 'High', schedule: 'Annual' },
      { name: 'Pneumococcal', description: 'Pneumococcal vaccines (PCV13 & PPSV23)', ageRange: '65+ years', priority: 'High', schedule: 'Both vaccines' },
      { name: 'Zoster (Shingles)', description: 'Herpes Zoster vaccine', ageRange: '65+ years', priority: 'High', schedule: '2 doses' },
      { name: 'Tdap', description: 'Tetanus, Diphtheria, Pertussis booster', ageRange: 'Every 10 years', priority: 'High', schedule: 'Every 10 years' },
      { name: 'COVID-19', description: 'COVID-19 vaccine and boosters', ageRange: 'As recommended', priority: 'High', schedule: 'As per guidelines' },
    ]

    healthcareMeasures = [
      { category: 'Chronic Disease Management', measures: ['Regular medication review', 'Blood pressure monitoring', 'Diabetes management', 'Heart health monitoring'], priority: 'High' },
      { category: 'Fall Prevention', measures: ['Balance exercises', 'Home safety assessment', 'Vision and hearing checks', 'Medication review for side effects'], priority: 'High' },
      { category: 'Cognitive Health', measures: ['Memory screening', 'Social engagement', 'Mental stimulation', 'Depression screening'], priority: 'High' },
      { category: 'Nutrition', measures: ['Adequate protein intake', 'Hydration monitoring', 'Vitamin B12 and D supplementation', 'Regular meals'], priority: 'Medium' },
    ]

    medicationAdvice = [
      { category: 'Medication Management', advice: ['Use pill organizers', 'Regular medication reviews', 'Monitor for drug interactions', 'Keep updated medication list'], priority: 'High' },
      { category: 'Essential Supplements', advice: ['Vitamin D3 (800-1000 IU daily)', 'Vitamin B12 supplements', 'Calcium supplements', 'Omega-3 fatty acids'], priority: 'High' },
      { category: 'Safety', advice: ['Regular eye exams', 'Blood pressure monitoring', 'Fall risk assessment', 'Emergency contact information'], priority: 'High' },
    ]
  }

  return { group, vaccines, healthcareMeasures, medicationAdvice }
}

export default function PatientDashboard() {
  const router = useRouter()
  const { user } = useAuth() as { user: ExtendedUser | null }
  
  // State management
  const [vitalStats, setVitalStats] = useState<{
    heartRate: number | null
    bloodPressure: string | null
    weight: number | null
    bmi: number | null
  }>({
    heartRate: null,
    bloodPressure: null,
    weight: null,
    bmi: null,
  })
  
  const [userProfile, setUserProfile] = useState<{
    age: number | null
    gender: string | null
    height: number | null
  }>({
    age: user?.age || null,
    gender: user?.gender || null,
    height: null,
  })
  
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null)
  const [recommendedDoctors, setRecommendedDoctors] = useState<RecommendedDoctor[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [currentVitalType, setCurrentVitalType] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCalculatingRisk, setIsCalculatingRisk] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  
  // Vaccine completion tracking
  const [completedVaccines, setCompletedVaccines] = useState<Set<string>>(new Set())
  
  // Form states for different vitals
  const [formData, setFormData] = useState({
    heartRate: '',
    systolic: '',
    diastolic: '',
    weight: '',
    height: '',
  })

  // Profile form state
  const [profileData, setProfileData] = useState({
    age: '',
    gender: '',
    height: '',
  })

  // Memoized healthcare recommendations
  const healthcareData = useMemo(() => {
    if (userProfile.age && userProfile.gender) {
      return getHealthcareRecommendations(userProfile.age, userProfile.gender)
    }
    return null
  }, [userProfile.age, userProfile.gender])

  // Dynamic health status helper functions
  const getHeartRateStatus = (heartRate: number | null): { text: string; color: string } => {
    if (heartRate === null) return { text: 'Click to add', color: 'text-muted-foreground' }
    
    if (heartRate < 50) return { text: 'Bradycardia (Low)', color: 'text-orange-600' }
    if (heartRate >= 50 && heartRate <= 100) return { text: 'Normal range', color: 'text-green-600' }
    if (heartRate > 100 && heartRate <= 120) return { text: 'Elevated', color: 'text-yellow-600' }
    if (heartRate > 120) return { text: 'Tachycardia (High)', color: 'text-red-600' }
    
    return { text: 'Normal range', color: 'text-green-600' }
  }

  const getBloodPressureStatus = (bloodPressure: string | null): { text: string; color: string } => {
    if (bloodPressure === null) return { text: 'Click to add', color: 'text-muted-foreground' }
    
    const [systolic, diastolic] = bloodPressure.split('/').map(Number)
    
    if (systolic < 90 || diastolic < 60) return { text: 'Low (Hypotension)', color: 'text-blue-600' }
    if (systolic < 120 && diastolic < 80) return { text: 'Optimal', color: 'text-green-600' }
    if (systolic < 130 && diastolic < 90) return { text: 'Normal', color: 'text-green-600' }
    if (systolic < 140 || diastolic < 100) return { text: 'Stage 1 High', color: 'text-yellow-600' }
    if (systolic < 180 || diastolic < 120) return { text: 'Stage 2 High', color: 'text-orange-600' }
    if (systolic >= 180 || diastolic >= 120) return { text: 'Crisis (Very High)', color: 'text-red-600' }
    
    return { text: 'Normal', color: 'text-green-600' }
  }

  const getBMIStatus = (bmi: number | null): { text: string; color: string } => {
    if (bmi === null) return { text: 'Click to add', color: 'text-muted-foreground' }
    
    if (bmi < 16) return { text: 'Severely Underweight', color: 'text-red-600' }
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-600' }
    if (bmi < 25) return { text: 'Normal', color: 'text-green-600' }
    if (bmi < 30) return { text: 'Overweight', color: 'text-yellow-600' }
    if (bmi < 35) return { text: 'Obese Class I', color: 'text-orange-600' }
    if (bmi < 40) return { text: 'Obese Class II', color: 'text-red-600' }
    if (bmi >= 40) return { text: 'Obese Class III', color: 'text-red-700' }
    
    return { text: 'Normal', color: 'text-green-600' }
  }

  // Fetch user health data on component mount
  useEffect(() => {
    if (user) {
      fetchUserHealthData()
      fetchUpcomingAppointments()
    }
  }, [user])

  // Update profileData when userProfile changes
  useEffect(() => {
    setProfileData({
      age: userProfile.age?.toString() || '',
      gender: userProfile.gender || '',
      height: userProfile.height?.toString() || '',
    })
    
    // Check if profile is incomplete and show modal after data is loaded
    if (isDataLoaded && (!userProfile.age || !userProfile.gender)) {
      setIsProfileModalOpen(true)
    }
  }, [userProfile, isDataLoaded])

  // Auto-calculate risk when all data is available
  useEffect(() => {
    if (
      isDataLoaded &&
      vitalStats.heartRate && 
      vitalStats.bloodPressure && 
      vitalStats.bmi && 
      userProfile.age && 
      userProfile.gender &&
      !riskAssessment && 
      !isCalculatingRisk
    ) {
      console.log('Auto-calculating risk score...')
      setTimeout(() => calculateRiskScore(), 1000)
    }
  }, [vitalStats, userProfile, isDataLoaded, riskAssessment, isCalculatingRisk])

  // Mock API functions for development (replace with actual API calls)
  const fetchUserHealthData = async () => {
    try {
      setIsDataLoaded(false)
      
      // Simulate API call - replace with actual endpoint
      // For development, using in-memory storage to persist data
      const savedVitals = JSON.parse(localStorage.getItem(`vitals_${user?.id}`) || '{}')
      const savedProfile = JSON.parse(localStorage.getItem(`profile_${user?.id}`) || '{}')
      const savedRisk = JSON.parse(localStorage.getItem(`risk_${user?.id}`) || 'null')
      const savedVaccines = JSON.parse(localStorage.getItem(`vaccines_${user?.id}`) || '[]')
      
      if (Object.keys(savedVitals).length > 0) {
        setVitalStats(savedVitals)
      }
      
      if (Object.keys(savedProfile).length > 0) {
        setUserProfile(prev => ({
          ...prev,
          ...savedProfile
        }))
      }
      
      if (savedRisk) {
        setRiskAssessment(savedRisk)
      }
      
      if (savedVaccines.length > 0) {
        setCompletedVaccines(new Set(savedVaccines))
      }
      
      setIsDataLoaded(true)
      
    } catch (error) {
      console.error('Error fetching health data:', error)
      setIsDataLoaded(true)
    }
  }

  const fetchUpcomingAppointments = async () => {
    try {
      // Mock appointments for development
      const mockAppointments: Appointment[] = [
        {
          id: "APT001",
          doctor: "Dr. Priya Sharma",
          specialty: "Endocrinology",
          date: "2025-08-22",
          time: "2:00 PM",
          type: "Follow-up",
          status: "confirmed"
        },
        {
          id: "APT002",
          doctor: "Dr. Michael Chen",
          specialty: "Cardiology",
          date: "2025-08-28",
          time: "10:30 AM",
          type: "Consultation",
          status: "scheduled"
        },
      ]
      
      setUpcomingAppointments(mockAppointments)
      
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  // Calculate BMI
  const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100
    return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10
  }

  // Mock ML risk calculation function
  const calculateHealthRisk = (metrics: {
    heartRate: number
    systolicBP: number
    diastolicBP: number
    bmi: number
    age: number
    gender: string
  }) => {
    let totalScore = 0
    const factors = []
    
    // Age risk
    let ageScore = 0
    if (metrics.age < 30) ageScore = 5
    else if (metrics.age < 40) ageScore = 10
    else if (metrics.age < 50) ageScore = 15
    else if (metrics.age < 60) ageScore = 20
    else if (metrics.age < 70) ageScore = 25
    else ageScore = 30
    
    factors.push({
      factor: 'Age Risk',
      score: ageScore,
      description: `Age ${metrics.age} - ${ageScore < 15 ? 'Low' : ageScore < 25 ? 'Moderate' : 'High'} age-related risk`
    })
    totalScore += ageScore

    // Heart rate risk
    let hrScore = 0
    if (metrics.heartRate < 50) hrScore = 15
    else if (metrics.heartRate < 60) hrScore = 8
    else if (metrics.heartRate <= 100) hrScore = 0
    else if (metrics.heartRate <= 120) hrScore = 12
    else hrScore = 25
    
    factors.push({
      factor: 'Heart Rate',
      score: hrScore,
      description: `${metrics.heartRate} BPM - ${hrScore === 0 ? 'Normal' : hrScore < 15 ? 'Mild concern' : 'Significant concern'}`
    })
    totalScore += hrScore

    // Blood pressure risk
    let bpScore = 0
    if (metrics.systolicBP < 120 && metrics.diastolicBP < 80) bpScore = 0
    else if (metrics.systolicBP < 130 && metrics.diastolicBP < 80) bpScore = 5
    else if (metrics.systolicBP < 140 || metrics.diastolicBP < 90) bpScore = 15
    else if (metrics.systolicBP < 180 || metrics.diastolicBP < 120) bpScore = 25
    else bpScore = 35
    
    factors.push({
      factor: 'Blood Pressure',
      score: bpScore,
      description: `${metrics.systolicBP}/${metrics.diastolicBP} mmHg - ${bpScore === 0 ? 'Normal' : bpScore < 10 ? 'Elevated' : bpScore < 20 ? 'High' : 'Very High'}`
    })
    totalScore += bpScore

    // BMI risk
    let bmiScore = 0
    if (metrics.bmi < 18.5) bmiScore = 10
    else if (metrics.bmi < 25) bmiScore = 0
    else if (metrics.bmi < 30) bmiScore = 10
    else if (metrics.bmi < 35) bmiScore = 20
    else bmiScore = 30
    
    factors.push({
      factor: 'BMI',
      score: bmiScore,
      description: `BMI ${metrics.bmi} - ${bmiScore === 0 ? 'Normal' : bmiScore < 15 ? 'Overweight' : 'Obese'}`
    })
    totalScore += bmiScore

    // Normalize score
    const normalizedScore = Math.min(Math.max(totalScore, 0), 100)

    // Determine risk level
    let riskLevel
    if (normalizedScore <= 20) {
      riskLevel = { level: 'Low Risk', color: 'green', description: 'Your health metrics indicate low risk' }
    } else if (normalizedScore <= 40) {
      riskLevel = { level: 'Moderate Risk', color: 'yellow', description: 'Some risk factors present' }
    } else if (normalizedScore <= 60) {
      riskLevel = { level: 'High Risk', color: 'orange', description: 'Multiple risk factors detected' }
    } else {
      riskLevel = { level: 'Very High Risk', color: 'red', description: 'Significant health risks identified' }
    }

    // Generate recommendations
    const recommendations = [
      'Monitor vital signs regularly',
      'Maintain a balanced diet',
      'Exercise regularly as appropriate for your condition',
      'Consider consulting with healthcare professionals',
      'Manage stress through relaxation techniques'
    ]

    return {
      riskScore: normalizedScore,
      factors,
      recommendations: recommendations.slice(0, 5),
      riskLevel
    }
  }

  // Calculate risk score
  const calculateRiskScore = async () => {
    if (!vitalStats.heartRate || !vitalStats.bloodPressure || !vitalStats.bmi || !userProfile.age) {
      console.log('Missing required data for risk calculation')
      return null
    }

    try {
      setIsCalculatingRisk(true)
      
      const [systolic, diastolic] = vitalStats.bloodPressure.split('/').map(Number)
      
      // Use mock ML calculation for development
      const riskData = calculateHealthRisk({
        heartRate: vitalStats.heartRate,
        systolicBP: systolic,
        diastolicBP: diastolic,
        bmi: vitalStats.bmi,
        age: userProfile.age,
        gender: userProfile.gender || 'other',
      })

      setRiskAssessment(riskData)
      
      // Save to localStorage for persistence
      localStorage.setItem(`risk_${user?.id}`, JSON.stringify(riskData))
      
      // Fetch recommended doctors
      setTimeout(() => {
        fetchRecommendedDoctors(riskData)
      }, 500)
      
      return riskData
    } catch (error) {
      console.error('Error calculating risk score:', error)
    } finally {
      setIsCalculatingRisk(false)
    }
    return null
  }

  // Fetch recommended doctors based on risk assessment
  const fetchRecommendedDoctors = async (assessment: RiskAssessment) => {
    try {
      // Mock recommended doctors based on risk factors
      const mockDoctors: RecommendedDoctor[] = []
      const highRiskFactors = assessment.factors.filter(f => f.score > 10)
      
      if (highRiskFactors.some(f => f.factor.includes('Blood Pressure'))) {
        mockDoctors.push({
          id: 'doc-001',
          name: 'Dr. Sarah Cardiovascular',
          specialty: 'Cardiologist',
          experience: 12,
          rating: 4.8,
          hospital: 'Heart Care Hospital',
          availableSlots: 3,
          consultationFee: 150,
          isOnline: true,
        })
      }

      if (highRiskFactors.some(f => f.factor.includes('Heart Rate'))) {
        mockDoctors.push({
          id: 'doc-002',
          name: 'Dr. Michael Rhythm',
          specialty: 'Cardiac Electrophysiologist',
          experience: 8,
          rating: 4.7,
          hospital: 'Advanced Cardiac Center',
          availableSlots: 2,
          consultationFee: 200,
          isOnline: false,
        })
      }

      if (highRiskFactors.some(f => f.factor.includes('BMI'))) {
        mockDoctors.push({
          id: 'doc-003',
          name: 'Dr. Lisa Nutrition',
          specialty: 'Endocrinologist',
          experience: 10,
          rating: 4.9,
          hospital: 'Wellness Medical Center',
          availableSlots: 5,
          consultationFee: 120,
          isOnline: true,
        })
      }

      // Always include a general physician
      mockDoctors.push({
        id: 'doc-004',
        name: 'Dr. James General',
        specialty: 'General Physician',
        experience: 15,
        rating: 4.6,
        hospital: 'City General Hospital',
        availableSlots: 8,
        consultationFee: 80,
        isOnline: true,
      })

      setRecommendedDoctors(mockDoctors.slice(0, 4))
    } catch (error) {
      console.error('Error fetching recommended doctors:', error)
    }
  }

  // Save vital data (mock implementation)
  const saveVitalData = async (vitalType: string, data: any) => {
    try {
      setIsLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save to localStorage for persistence
      const currentVitals = { ...vitalStats }
      
      if (vitalType === 'heart-rate') {
        currentVitals.heartRate = data.heartRate
      } else if (vitalType === 'blood-pressure') {
        currentVitals.bloodPressure = `${data.systolic}/${data.diastolic}`
      } else if (vitalType === 'bmi') {
        currentVitals.weight = data.weight
        currentVitals.bmi = data.bmi
      }
      
      localStorage.setItem(`vitals_${user?.id}`, JSON.stringify(currentVitals))
      
      return { success: true, message: 'Vital data saved successfully' }
      
    } catch (error) {
      console.error('Error saving vital data:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Save profile data (mock implementation)
  const saveProfileData = async (profileInfo: any) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Save to localStorage for persistence
      localStorage.setItem(`profile_${user?.id}`, JSON.stringify(profileInfo))
      
      return { success: true, message: 'Profile updated successfully' }
      
    } catch (error) {
      console.error('Error saving profile data:', error)
      throw error
    }
  }

  // Toggle vaccine completion
  const toggleVaccineCompletion = (vaccineName: string) => {
    const newCompleted = new Set(completedVaccines)
    if (newCompleted.has(vaccineName)) {
      newCompleted.delete(vaccineName)
    } else {
      newCompleted.add(vaccineName)
    }
    setCompletedVaccines(newCompleted)
    localStorage.setItem(`vaccines_${user?.id}`, JSON.stringify([...newCompleted]))
  }

  // Helper function to get recommendation reason for doctors
  const getRecommendationReason = (doctor: RecommendedDoctor, assessment: RiskAssessment): string => {
    const highRiskFactors = assessment.factors.filter(f => f.score > 10)
    
    if (doctor.specialty === 'Cardiologist' && highRiskFactors.some(f => f.factor.includes('Blood Pressure'))) {
      return 'Your blood pressure readings indicate potential cardiovascular risk'
    }
    
    if (doctor.specialty === 'Cardiac Electrophysiologist' && highRiskFactors.some(f => f.factor.includes('Heart Rate'))) {
      return 'Your heart rate patterns may require specialized cardiac evaluation'
    }
    
    if (doctor.specialty === 'Endocrinologist' && highRiskFactors.some(f => f.factor.includes('BMI'))) {
      return 'Your BMI suggests potential metabolic concerns that need attention'
    }
    
    if (doctor.specialty === 'General Physician') {
      return 'Recommended for overall health monitoring and preventive care'
    }
    
    return 'Matches your health profile and risk assessment'
  }

  const handleSOSClick = () => {
    alert("SOS Alert sent to emergency contacts and nearest healthcare facility!")
  }

  // Handle clicking on health cards
  const handleVitalCardClick = (vitalType: string): void => {
    setCurrentVitalType(vitalType)
    setIsModalOpen(true)
    
    // Pre-fill form with existing data
    if (vitalType === 'heart-rate' && vitalStats.heartRate !== null) {
      setFormData(prev => ({ ...prev, heartRate: vitalStats.heartRate!.toString() }))
    } else if (vitalType === 'blood-pressure' && vitalStats.bloodPressure !== null) {
      const [systolic, diastolic] = vitalStats.bloodPressure.split('/')
      setFormData(prev => ({ ...prev, systolic, diastolic }))
    } else if (vitalType === 'bmi') {
      setFormData(prev => ({ 
        ...prev, 
        weight: vitalStats.weight?.toString() || '',
        height: userProfile.height?.toString() || ''
      }))
    }
  }

  // Handle profile form submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!profileData.age.trim()) {
      alert('Please enter your age.')
      return
    }
    
    if (!profileData.gender) {
      alert('Please select your gender.')
      return
    }
    
    const age = parseInt(profileData.age)
    if (isNaN(age) || age <= 0 || age > 120) {
      alert('Please enter a valid age between 1 and 120.')
      return
    }
    
    try {
      setIsSavingProfile(true)
      
      const height = profileData.height ? parseFloat(profileData.height) : null
      
      const profileInfo = {
        age,
        gender: profileData.gender,
        height,
      }
      
      await saveProfileData(profileInfo)
      
      // Update local state
      setUserProfile({
        age,
        gender: profileData.gender,
        height,
      })
      
      setIsProfileModalOpen(false)
      alert('Profile saved successfully!')
      
    } catch (error) {
      console.error('Profile save error:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setIsSavingProfile(false)
    }
  }

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let updatedVitals = { ...vitalStats }
      
      if (currentVitalType === 'heart-rate') {
        const heartRate = parseInt(formData.heartRate)
        if (isNaN(heartRate) || heartRate < 40 || heartRate > 200) {
          alert('Please enter a valid heart rate between 40 and 200 BPM.')
          return
        }
        
        await saveVitalData('heart-rate', { heartRate })
        updatedVitals = { ...updatedVitals, heartRate }
        
      } else if (currentVitalType === 'blood-pressure') {
        const systolic = parseInt(formData.systolic)
        const diastolic = parseInt(formData.diastolic)
        
        if (isNaN(systolic) || isNaN(diastolic) || systolic < 70 || systolic > 250 || diastolic < 40 || diastolic > 150) {
          alert('Please enter valid blood pressure values.')
          return
        }
        
        const bloodPressure = `${systolic}/${diastolic}`
        await saveVitalData('blood-pressure', { systolic, diastolic })
        updatedVitals = { ...updatedVitals, bloodPressure }
        
      } else if (currentVitalType === 'bmi') {
        const weight = parseFloat(formData.weight)
        const height = parseFloat(formData.height)
        
        if (isNaN(weight) || isNaN(height) || weight < 20 || weight > 300 || height < 100 || height > 250) {
          alert('Please enter valid weight and height values.')
          return
        }
        
        const bmi = calculateBMI(weight, height)
        await saveVitalData('bmi', { weight, height, bmi })
        updatedVitals = { ...updatedVitals, weight, bmi }
        
        // Update user profile height if changed
        if (height !== userProfile.height) {
          setUserProfile(prev => ({ ...prev, height }))
          const updatedProfile = { ...userProfile, height }
          localStorage.setItem(`profile_${user?.id}`, JSON.stringify(updatedProfile))
        }
      }
      
      setVitalStats(updatedVitals)
      setIsModalOpen(false)
      setFormData({
        heartRate: '',
        systolic: '',
        diastolic: '',
        weight: '',
        height: '',
      })
      
      // Clear existing risk assessment to trigger recalculation
      setRiskAssessment(null)
      localStorage.removeItem(`risk_${user?.id}`)
      
    } catch (error) {
      console.error('Form submission error:', error)
      alert('Failed to save data. Please try again.')
    }
  }

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setFormData({
      heartRate: '',
      systolic: '',
      diastolic: '',
      weight: '',
      height: '',
    })
  }

  // Close profile modal
  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false)
    setProfileData({
      age: userProfile.age?.toString() || '',
      gender: userProfile.gender || '',
      height: userProfile.height?.toString() || '',
    })
  }

  const quickActions = [
    {
      title: "Symptom Checker",
      description: "Check your symptoms with AI",
      icon: Activity,
      href: "/dashboard/patient/symptom-checker",
      color: "bg-blue-500",
    },
    {
      title: "Book Appointment",
      description: "Schedule with a doctor",
      icon: Calendar,
      href: "/dashboard/patient/appointments",
      color: "bg-green-500",
    },
    {
      title: "Find Clinics",
      description: "Locate nearby healthcare",
      icon: MapPin,
      href: "/dashboard/patient/nearby-clinics",
      color: "bg-purple-500",
    },
    {
      title: "Chatbot",
      description: "Chat with your doctors",
      icon: MessageSquare,
      href: "/dashboard/patient/messages",
      color: "bg-orange-500",
    },
  ]

  // Helper functions
  const renderVitalValue = (value: number | string | null, unit: string = ''): string => {
    return value !== null ? `${value}${unit}` : 'N/A'
  }

  const getRiskLevel = (assessment: RiskAssessment | null): { text: string; color: string } => {
    if (!assessment) return { text: 'Not assessed', color: 'text-muted-foreground' }
    return { 
      text: assessment.riskLevel.level, 
      color: assessment.riskLevel.color === 'green' ? 'text-green-600' :
             assessment.riskLevel.color === 'yellow' ? 'text-yellow-600' :
             assessment.riskLevel.color === 'orange' ? 'text-orange-600' :
             assessment.riskLevel.color === 'red' ? 'text-red-600' : 'text-red-800'
    }
  }

  // Get dynamic statuses
  const heartRateStatus = getHeartRateStatus(vitalStats.heartRate)
  const bloodPressureStatus = getBloodPressureStatus(vitalStats.bloodPressure)
  const bmiStatus = getBMIStatus(vitalStats.bmi)
  const riskLevel = getRiskLevel(riskAssessment)

  // Modal content renderer
  const renderModalContent = () => {
    switch (currentVitalType) {
      case 'heart-rate':
        return (
          <>
            <Label htmlFor="heartRate">Heart Rate (BPM)</Label>
            <Input
              id="heartRate"
              type="number"
              placeholder="Enter your heart rate"
              value={formData.heartRate}
              onChange={(e) => setFormData(prev => ({ ...prev, heartRate: e.target.value }))}
              min="40"
              max="200"
              required
            />
            <p className="text-sm text-muted-foreground">Normal range: 60-100 BPM</p>
          </>
        )
      
      case 'blood-pressure':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="systolic">Systolic (mmHg)</Label>
                <Input
                  id="systolic"
                  type="number"
                  placeholder="120"
                  value={formData.systolic}
                  onChange={(e) => setFormData(prev => ({ ...prev, systolic: e.target.value }))}
                  min="70"
                  max="250"
                  required
                />
              </div>
              <div>
                <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
                <Input
                  id="diastolic"
                  type="number"
                  placeholder="80"
                  value={formData.diastolic}
                  onChange={(e) => setFormData(prev => ({ ...prev, diastolic: e.target.value }))}
                  min="40"
                  max="150"
                  required
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Normal range: Less than 120/80 mmHg</p>
          </>
        )
      
      case 'bmi':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.5"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  min="20"
                  max="300"
                  required
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  min="100"
                  max="250"
                  required
                />
              </div>
            </div>
            {formData.weight && formData.height && (
              <p className="text-sm text-muted-foreground">
                Calculated BMI: {calculateBMI(parseFloat(formData.weight), parseFloat(formData.height))}
              </p>
            )}
            <p className="text-sm text-muted-foreground">Normal BMI: 18.5-24.9</p>
          </>
        )
      
      default:
        return <p>Select a vital sign to update.</p>
    }
  }

  const getModalTitle = () => {
    switch (currentVitalType) {
      case 'heart-rate': return 'Update Heart Rate'
      case 'blood-pressure': return 'Update Blood Pressure'
      case 'bmi': return 'Update Weight & Height'
      default: return 'Update Vital Sign'
    }
  }

  const healthTimeline = [
    { date: "2025-08-15", event: "Blood Test Completed", type: "test" },
    { date: "2025-08-10", event: "Symptom Check: Fatigue", type: "symptom" },
    { date: "2025-08-05", event: "Appointment with Dr. Johnson", type: "appointment" },
    { date: "2025-07-20", event: "Annual Health Checkup", type: "checkup" },
  ]

  // Vaccine card component
  const VaccineCard = ({ vaccine }: { vaccine: VaccineRecommendation }) => {
    const isCompleted = completedVaccines.has(vaccine.name)
    return (
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className={`font-semibold ${isCompleted ? 'text-green-700' : 'text-gray-900'}`}>
                {vaccine.name}
              </h4>
              <Badge 
                variant={vaccine.priority === 'High' ? 'destructive' : vaccine.priority === 'Medium' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {vaccine.priority}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{vaccine.description}</p>
            <p className="text-xs text-blue-600 mt-1">Age: {vaccine.ageRange}</p>
            {vaccine.schedule && (
              <p className="text-xs text-gray-500">Schedule: {vaccine.schedule}</p>
            )}
          </div>
          <div className="ml-3">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={() => toggleVaccineCompletion(vaccine.name)}
              className="h-5 w-5"
            />
          </div>
        </div>
        {isCompleted && (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Completed</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <DashboardLayout title="Patient Dashboard">
      <div className="space-y-4 sm:space-y-6">
        {/* Profile Completion Banner */}
        {(!userProfile.age || !userProfile.gender) && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-orange-800 dark:text-orange-200">
                        Complete your profile
                      </p>
                      <p className="text-sm text-orange-600 dark:text-orange-300">
                        Add your age and gender for personalized healthcare recommendations
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setIsProfileModalOpen(true)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Complete Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Health Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Risk Score Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="col-span-2 lg:col-span-1"
          >
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                      Health Risk Score
                    </p>
                    <p className="text-xl sm:text-2xl font-bold">
                      {isCalculatingRisk ? 'Calculating...' : 
                       riskAssessment ? `${riskAssessment.riskScore}/100` : 'N/A'}
                    </p>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                    <AlertTriangle className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600" />
                  </div>
                </div>
                {riskAssessment && (
                  <Progress value={riskAssessment.riskScore} className="mt-3" />
                )}
                <p className={`text-xs text-muted-foreground mt-2 ${riskLevel.color}`}>
                  {riskLevel.text}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Heart Rate Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleVitalCardClick('heart-rate')}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                      Heart Rate
                    </p>
                    <p className="text-xl sm:text-2xl font-bold">
                      {renderVitalValue(vitalStats.heartRate, ' BPM')}
                    </p>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                    {vitalStats.heartRate !== null ? (
                      <Heart className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
                    ) : (
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                    )}
                  </div>
                </div>
                <p className={`text-xs mt-2 ${heartRateStatus.color}`}>
                  {heartRateStatus.text}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Blood Pressure Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleVitalCardClick('blood-pressure')}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                      Blood Pressure
                    </p>
                    <p className="text-lg sm:text-2xl font-bold">
                      {renderVitalValue(vitalStats.bloodPressure)}
                    </p>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                    {vitalStats.bloodPressure !== null ? (
                      <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                    ) : (
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    )}
                  </div>
                </div>
                <p className={`text-xs mt-2 ${bloodPressureStatus.color}`}>
                  {bloodPressureStatus.text}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* BMI Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleVitalCardClick('bmi')}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                      BMI
                    </p>
                    <p className="text-xl sm:text-2xl font-bold">
                      {renderVitalValue(vitalStats.bmi)}
                    </p>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                    {vitalStats.bmi !== null ? (
                      <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                    ) : (
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    )}
                  </div>
                </div>
                <p className={`text-xs mt-2 ${bmiStatus.color}`}>
                  {bmiStatus.text}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Profile Modal */}
        <Dialog open={isProfileModalOpen} onOpenChange={handleCloseProfileModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Your Profile</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={profileData.age}
                  onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
                  min="1"
                  max="120"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select 
                  value={profileData.gender} 
                  onValueChange={(value) => setProfileData(prev => ({ ...prev, gender: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="profileHeight">Height (cm) - Optional</Label>
                <Input
                  id="profileHeight"
                  type="number"
                  placeholder="Enter your height"
                  value={profileData.height}
                  onChange={(e) => setProfileData(prev => ({ ...prev, height: e.target.value }))}
                  min="100"
                  max="250"
                />
              </div>
              
              <DialogFooter className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCloseProfileModal}
                  disabled={isSavingProfile}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSavingProfile} className="flex-1">
                  {isSavingProfile ? 'Saving...' : 'Save Profile'}
                  <Save className="ml-2 h-4 w-4" />
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Vital Input Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{getModalTitle()}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {renderModalContent()}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save'}
                  <Save className="ml-2 h-4 w-4" />
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Healthcare Recommendations Section */}
        {healthcareData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Healthcare Recommendations for {healthcareData.group}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Personalized healthcare guidance based on your age and gender (India)
                </p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="vaccines" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="vaccines" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Vaccines
                    </TabsTrigger>
                    <TabsTrigger value="healthcare" className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      Healthcare
                    </TabsTrigger>
                    <TabsTrigger value="medication" className="flex items-center gap-2">
                      <Pill className="h-4 w-4" />
                      Medication
                    </TabsTrigger>
                  </TabsList>

                  {/* Vaccines Tab */}
                  <TabsContent value="vaccines" className="space-y-4 mt-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Recommended Vaccines</h3>
                      <div className="text-sm text-muted-foreground">
                        Completed: {completedVaccines.size}/{healthcareData.vaccines.length}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {healthcareData.vaccines.map((vaccine, index) => (
                        <motion.div
                          key={vaccine.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                        >
                          <VaccineCard vaccine={vaccine} />
                        </motion.div>
                      ))}
                    </div>
                    {healthcareData.vaccines.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p className="text-sm">No specific vaccines recommended for your age group</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Healthcare Measures Tab */}
                  <TabsContent value="healthcare" className="space-y-4 mt-6">
                    <h3 className="text-lg font-semibold">Healthcare Measures</h3>
                    <div className="space-y-4">
                      {healthcareData.healthcareMeasures.map((measure, index) => (
                        <motion.div
                          key={measure.category}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-blue-500" />
                              {measure.category}
                            </h4>
                            <Badge 
                              variant={measure.priority === 'High' ? 'destructive' : measure.priority === 'Medium' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {measure.priority} Priority
                            </Badge>
                          </div>
                          <ul className="space-y-2">
                            {measure.measures.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Medication Advice Tab */}
                  <TabsContent value="medication" className="space-y-4 mt-6">
                    <h3 className="text-lg font-semibold">Medication & Supplement Advice</h3>
                    <div className="space-y-4">
                      {healthcareData.medicationAdvice.map((advice, index) => (
                        <motion.div
                          key={advice.category}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold flex items-center gap-2">
                              <Pill className="h-4 w-4 text-purple-500" />
                              {advice.category}
                            </h4>
                            <Badge 
                              variant={advice.priority === 'High' ? 'destructive' : advice.priority === 'Medium' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {advice.priority} Priority
                            </Badge>
                          </div>
                          <ul className="space-y-2">
                            {advice.advice.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent AI Analysis - Show only if we have risk assessment */}
          {riskAssessment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="lg:col-span-2"
            >
              <PredictionCard
                condition="Health Risk Assessment"
                riskScore={riskAssessment.riskScore}
                confidence={0.87}
                contributors={riskAssessment.factors.map(factor => ({
                  factor: `${factor.factor} (${factor.description})`,
                  impact: factor.score / 100
                }))}
                recommendations={riskAssessment.recommendations}
              />
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                  Quick Actions
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleSOSClick}
                    className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm px-3 sm:px-4"
                  >
                    SOS
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 pt-0">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-auto p-2 sm:p-3 hover:bg-accent"
                        onClick={() => router.push(action.href)}
                      >
                        <div className={`h-6 w-6 sm:h-8 sm:w-8 rounded-lg ${action.color} flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0`}>
                          <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                        <div className="text-left min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base truncate">{action.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                        </div>
                      </Button>
                    </motion.div>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recommended Doctors Section */}
        {recommendedDoctors.length > 0 && riskAssessment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Recommended Doctors Based on Your Health Assessment
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Our AI has analyzed your health data and recommends these specialists
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedDoctors.map((doctor, index) => (
                    <motion.div
                      key={doctor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {doctor.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{doctor.name}</h3>
                            <p className="text-sm text-blue-600 font-medium">{doctor.specialty}</p>
                            <p className="text-xs text-muted-foreground">{doctor.hospital}</p>
                          </div>
                        </div>
                        {doctor.isOnline && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                            Online
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span>{doctor.rating}</span>
                        </div>
                        <div>
                          <span>{doctor.experience} years exp.</span>
                        </div>
                        <div>
                          <span>{doctor.availableSlots} slots available</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-medium">₹{doctor.consultationFee}</span>
                          <span className="text-muted-foreground"> / consultation</span>
                        </div>
                        
                        <div className="flex gap-2">
                          {doctor.isOnline && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => router.push(`/dashboard/patient/video-call/${doctor.id}`)}
                            >
                              <Video className="h-3 w-3" />
                              Video Call
                            </Button>
                          )}
                          <Button
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => router.push(`/dashboard/patient/book-appointment/${doctor.id}`)}
                          >
                            <Calendar className="h-3 w-3" />
                            Book
                          </Button>
                        </div>
                      </div>

                      {/* Why this doctor is recommended */}
                      <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                        <p className="text-blue-700 dark:text-blue-300">
                          <strong>Recommended because:</strong> {getRecommendationReason(doctor, riskAssessment)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/dashboard/patient/all-doctors")}
                  >
                    View All Available Doctors
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Upcoming Appointments */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3 + index * 0.1 }}
                      className="flex items-center justify-between p-2 sm:p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base truncate">{appointment.doctor}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{appointment.specialty}</p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.date} at {appointment.time}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs flex-shrink-0 ml-2">{appointment.type}</Badge>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-sm">No upcoming appointments</p>
                    <p className="text-xs">Book an appointment to see it here</p>
                  </div>
                )}
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-sm"
                  onClick={() => router.push("/dashboard/patient/appointments")}
                >
                  {upcomingAppointments.length > 0 ? 'View All Appointments' : 'Book Your First Appointment'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Health Timeline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Recent Health Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {healthTimeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 + index * 0.1 }}
                    className="flex items-center gap-2 sm:gap-3"
                  >
                    <div className="h-6 w-6 sm:h-8 sm:w-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.event}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                    <Badge variant="secondary" className="capitalize text-xs flex-shrink-0">
                      {item.type}
                    </Badge>
                  </motion.div>
                ))}
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-sm"
                  onClick={() => router.push("/dashboard/patient/my-reports")}
                >
                  View Full Timeline
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Instructions for adding vitals */}
        {!vitalStats.heartRate && !vitalStats.bloodPressure && !vitalStats.bmi && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          >
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200">
                      Start tracking your health
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Click on the vital cards above to add your health data and get AI-powered risk assessment
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}