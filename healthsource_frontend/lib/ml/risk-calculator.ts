// /lib/ml/risk-calculator.ts
export interface HealthMetrics {
  heartRate: number
  systolicBP: number
  diastolicBP: number
  bmi: number
  age: number
  gender: string
}

export interface RiskFactor {
  factor: string
  score: number
  description: string
}

export interface RiskLevel {
  level: string
  color: string
  description: string
}

export interface RiskAssessmentResult {
  riskScore: number
  factors: RiskFactor[]
  recommendations: string[]
  riskLevel: RiskLevel
}

export async function calculateHealthRisk(metrics: HealthMetrics): Promise<RiskAssessmentResult> {
  const factors: RiskFactor[] = []
  let totalRiskScore = 0

  // Age risk factor
  const ageRisk = calculateAgeRisk(metrics.age)
  factors.push(ageRisk)
  totalRiskScore += ageRisk.score

  // Heart rate risk factor
  const heartRateRisk = calculateHeartRateRisk(metrics.heartRate)
  factors.push(heartRateRisk)
  totalRiskScore += heartRateRisk.score

  // Blood pressure risk factor
  const bpRisk = calculateBloodPressureRisk(metrics.systolicBP, metrics.diastolicBP)
  factors.push(bpRisk)
  totalRiskScore += bpRisk.score

  // BMI risk factor
  const bmiRisk = calculateBMIRisk(metrics.bmi)
  factors.push(bmiRisk)
  totalRiskScore += bmiRisk.score

  // Gender risk factor
  const genderRisk = calculateGenderRisk(metrics.gender, metrics.age)
  factors.push(genderRisk)
  totalRiskScore += genderRisk.score

  // Combined risk factors
  const combinedRisk = calculateCombinedRisk(metrics)
  factors.push(combinedRisk)
  totalRiskScore += combinedRisk.score

  // Normalize score to 0-100 scale
  const normalizedScore = Math.min(Math.max(Math.round(totalRiskScore), 0), 100)

  return {
    riskScore: normalizedScore,
    factors,
    recommendations: generateRecommendations(factors, metrics),
    riskLevel: determineRiskLevel(normalizedScore)
  }
}

function calculateAgeRisk(age: number): RiskFactor {
  let score = 0
  let description = ''

  if (age < 30) {
    score = 5
    description = 'Young age - lower cardiovascular risk'
  } else if (age < 40) {
    score = 10
    description = 'Moderate age - some risk factors may emerge'
  } else if (age < 50) {
    score = 15
    description = 'Middle age - increased risk awareness needed'
  } else if (age < 60) {
    score = 20
    description = 'Higher age - regular monitoring recommended'
  } else if (age < 70) {
    score = 25
    description = 'Senior age - increased cardiovascular risk'
  } else {
    score = 30
    description = 'Advanced age - comprehensive care needed'
  }

  return {
    factor: 'Age Risk',
    score,
    description
  }
}

function calculateHeartRateRisk(heartRate: number): RiskFactor {
  let score = 0
  let description = ''

  if (heartRate < 50) {
    score = 15
    description = 'Bradycardia - unusually low heart rate'
  } else if (heartRate < 60) {
    score = 8
    description = 'Lower resting heart rate - may indicate good fitness'
  } else if (heartRate <= 100) {
    score = 0
    description = 'Normal resting heart rate range'
  } else if (heartRate <= 120) {
    score = 12
    description = 'Elevated heart rate - may indicate stress or poor fitness'
  } else if (heartRate <= 150) {
    score = 20
    description = 'High heart rate - medical evaluation recommended'
  } else {
    score = 25
    description = 'Very high heart rate - immediate medical attention needed'
  }

  return {
    factor: 'Heart Rate',
    score,
    description
  }
}

function calculateBloodPressureRisk(systolic: number, diastolic: number): RiskFactor {
  let score = 0
  let description = ''

  // Classify blood pressure according to AHA guidelines
  if (systolic < 90 || diastolic < 60) {
    score = 10
    description = 'Low blood pressure - may cause dizziness'
  } else if (systolic < 120 && diastolic < 80) {
    score = 0
    description = 'Normal blood pressure - excellent'
  } else if (systolic < 130 && diastolic < 80) {
    score = 5
    description = 'Elevated blood pressure - lifestyle changes recommended'
  } else if (systolic < 140 || diastolic < 90) {
    score = 15
    description = 'Stage 1 Hypertension - medical consultation advised'
  } else if (systolic < 180 || diastolic < 120) {
    score = 25
    description = 'Stage 2 Hypertension - medical treatment likely needed'
  } else {
    score = 35
    description = 'Hypertensive Crisis - immediate medical attention required'
  }

  return {
    factor: 'Blood Pressure',
    score,
    description
  }
}

function calculateBMIRisk(bmi: number): RiskFactor {
  let score = 0
  let description = ''

  if (bmi < 18.5) {
    score = 10
    description = 'Underweight - may indicate malnutrition'
  } else if (bmi < 25) {
    score = 0
    description = 'Normal weight - healthy BMI range'
  } else if (bmi < 30) {
    score = 10
    description = 'Overweight - increased health risks'
  } else if (bmi < 35) {
    score = 20
    description = 'Obesity Class I - significant health risks'
  } else if (bmi < 40) {
    score = 25
    description = 'Obesity Class II - severe health risks'
  } else {
    score = 30
    description = 'Obesity Class III - extreme health risks'
  }

  return {
    factor: 'BMI',
    score,
    description
  }
}

function calculateGenderRisk(gender: string, age: number): RiskFactor {
  let score = 0
  let description = ''

  if (gender === 'male') {
    if (age >= 45) {
      score = 8
      description = 'Male over 45 - increased cardiovascular risk'
    } else {
      score = 5
      description = 'Male - slightly higher cardiovascular risk than females'
    }
  } else if (gender === 'female') {
    if (age >= 55) {
      score = 8
      description = 'Post-menopausal female - increased cardiovascular risk'
    } else {
      score = 2
      description = 'Pre-menopausal female - lower cardiovascular risk'
    }
  } else {
    score = 5
    description = 'Gender risk assessment based on population averages'
  }

  return {
    factor: 'Gender & Age',
    score,
    description
  }
}

function calculateCombinedRisk(metrics: HealthMetrics): RiskFactor {
  let score = 0
  let description = ''

  // Multiple risk factors compound
  const isHighBP = metrics.systolicBP >= 140 || metrics.diastolicBP >= 90
  const isObese = metrics.bmi >= 30
  const isOlder = metrics.age >= 55
  const isTachycardic = metrics.heartRate > 100

  const riskFactorsCount = [isHighBP, isObese, isOlder, isTachycardic].filter(Boolean).length

  if (riskFactorsCount >= 3) {
    score = 15
    description = 'Multiple risk factors present - comprehensive care needed'
  } else if (riskFactorsCount === 2) {
    score = 8
    description = 'Two risk factors present - increased monitoring recommended'
  } else if (riskFactorsCount === 1) {
    score = 3
    description = 'One risk factor present - lifestyle modifications beneficial'
  } else {
    score = 0
    description = 'No major risk factors - maintain healthy lifestyle'
  }

  return {
    factor: 'Combined Risk Factors',
    score,
    description
  }
}

function generateRecommendations(factors: RiskFactor[], metrics: HealthMetrics): string[] {
  const recommendations: string[] = []

  // Heart rate recommendations
  const heartRateFactor = factors.find(f => f.factor === 'Heart Rate')
  if (heartRateFactor && heartRateFactor.score > 10) {
    recommendations.push('Monitor heart rate regularly and consult a cardiologist')
    recommendations.push('Consider stress management techniques and regular exercise')
  }

  // Blood pressure recommendations
  const bpFactor = factors.find(f => f.factor === 'Blood Pressure')
  if (bpFactor && bpFactor.score > 10) {
    recommendations.push('Monitor blood pressure daily and limit sodium intake')
    recommendations.push('Maintain a healthy diet rich in fruits and vegetables')
    recommendations.push('Consult a healthcare provider about blood pressure management')
  }

  // BMI recommendations
  const bmiFactor = factors.find(f => f.factor === 'BMI')
  if (bmiFactor && bmiFactor.score > 10) {
    if (metrics.bmi >= 30) {
      recommendations.push('Consider a medically supervised weight loss program')
      recommendations.push('Increase physical activity gradually with professional guidance')
    } else if (metrics.bmi < 18.5) {
      recommendations.push('Consult a nutritionist for healthy weight gain strategies')
    } else {
      recommendations.push('Maintain current weight through balanced diet and exercise')
    }
  }

  // Age-related recommendations
  const ageFactor = factors.find(f => f.factor === 'Age Risk')
  if (ageFactor && ageFactor.score > 15) {
    recommendations.push('Schedule regular comprehensive health checkups')
    recommendations.push('Consider preventive screenings appropriate for your age')
  }

  // General recommendations
  recommendations.push('Maintain a regular sleep schedule of 7-9 hours per night')
  recommendations.push('Stay hydrated and limit alcohol consumption')
  recommendations.push('Practice stress reduction techniques like meditation or yoga')

  // High-risk specific recommendations
  const combinedFactor = factors.find(f => f.factor === 'Combined Risk Factors')
  if (combinedFactor && combinedFactor.score > 10) {
    recommendations.push('Consider comprehensive cardiovascular risk assessment')
    recommendations.push('Discuss preventive medications with your healthcare provider')
  }

  return recommendations.slice(0, 8) // Limit to 8 most relevant recommendations
}

function determineRiskLevel(score: number): RiskLevel {
  if (score <= 20) {
    return {
      level: 'Low Risk',
      color: 'green',
      description: 'Your health metrics indicate low cardiovascular risk. Continue maintaining healthy habits.'
    }
  } else if (score <= 40) {
    return {
      level: 'Moderate Risk',
      color: 'yellow',
      description: 'Some risk factors are present. Consider lifestyle modifications and regular monitoring.'
    }
  } else if (score <= 60) {
    return {
      level: 'High Risk',
      color: 'orange',
      description: 'Multiple risk factors detected. Medical consultation and intervention may be beneficial.'
    }
  } else if (score <= 80) {
    return {
      level: 'Very High Risk',
      color: 'red',
      description: 'Significant health risks identified. Immediate medical attention and lifestyle changes recommended.'
    }
  } else {
    return {
      level: 'Critical Risk',
      color: 'red',
      description: 'Critical health risk levels detected. Urgent medical evaluation and intervention required.'
    }
  }
}

// Alternative ML approach using a simple neural network-like calculation
export function calculateRiskWithWeights(metrics: HealthMetrics): number {
  // Weights derived from cardiovascular research
  const weights = {
    age: 0.25,
    systolic: 0.20,
    diastolic: 0.15,
    heartRate: 0.15,
    bmi: 0.15,
    gender: 0.10
  }

  // Normalize inputs to 0-1 scale
  const normalizedAge = Math.min(metrics.age / 100, 1)
  const normalizedSystolic = Math.min(metrics.systolicBP / 200, 1)
  const normalizedDiastolic = Math.min(metrics.diastolicBP / 120, 1)
  const normalizedHeartRate = Math.min(metrics.heartRate / 150, 1)
  const normalizedBMI = Math.min(metrics.bmi / 50, 1)
  const normalizedGender = metrics.gender === 'male' ? 0.6 : 0.4

  // Calculate weighted sum
  const weightedSum = 
    (normalizedAge * weights.age) +
    (normalizedSystolic * weights.systolic) +
    (normalizedDiastolic * weights.diastolic) +
    (normalizedHeartRate * weights.heartRate) +
    (normalizedBMI * weights.bmi) +
    (normalizedGender * weights.gender)

  // Apply sigmoid activation and scale to 0-100
  const sigmoid = 1 / (1 + Math.exp(-10 * (weightedSum - 0.5)))
  return Math.round(sigmoid * 100)
}
