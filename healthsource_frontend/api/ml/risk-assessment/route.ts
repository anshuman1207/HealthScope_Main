// /api/ml/risk-assessment/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
// Corrected import path and explicit import of the IRiskAssessment interface
import { RiskAssessment, IRiskAssessment } from '@/models/RiskAssesment' 
import { verifyToken } from '@/lib/auth'
// Explicitly importing the HealthMetrics interface from the risk-calculator file
import { calculateHealthRisk, HealthMetrics } from '@/lib/ml/risk-calculator' 

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    // Verify the token to ensure the user is authenticated
    const decoded = verifyToken(token)
    const userId = decoded.userId
    
    const { 
      heartRate, 
      systolicBP, 
      diastolicBP, 
      bmi, 
      age, 
      gender 
    }: HealthMetrics = await request.json()

    // Validate that the required health metrics are present
    if (!heartRate || !systolicBP || !diastolicBP || !bmi || !age || !gender) {
      return NextResponse.json(
        { error: 'Missing required health metrics for risk assessment.' },
        { status: 400 }
      )
    }

    // Calculate risk using ML model
    const riskData = await calculateHealthRisk({
      heartRate,
      systolicBP,
      diastolicBP,
      bmi,
      age,
      gender
    })

    // Save risk assessment to database
    // Ensure you use the imported IRiskAssessment type for safety
    const riskAssessment: IRiskAssessment = new RiskAssessment({
      userId,
      riskScore: riskData.riskScore,
      factors: riskData.factors,
      recommendations: riskData.recommendations,
      riskLevel: riskData.riskLevel,
      inputData: {
        heartRate,
        systolicBP,
        diastolicBP,
        bmi,
        age,
        gender
      }
    })

    await riskAssessment.save()

    return NextResponse.json({
      success: true,
      assessment: {
        riskScore: riskData.riskScore,
        factors: riskData.factors,
        recommendations: riskData.recommendations,
        riskLevel: riskData.riskLevel
      }
    })

  } catch (error) {
    console.error('Error calculating risk assessment:', error)
    return NextResponse.json(
      { error: 'Failed to calculate risk assessment' }, 
      { status: 500 }
    )
  }
}
