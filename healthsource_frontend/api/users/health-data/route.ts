// /api/user/health-data/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
// Explicitly import each model and its interface from its dedicated file
import { User, IUser } from '@/models/User'
import { HealthData, IHealthData } from '@/models/HealthData'
import { RiskAssessment, IRiskAssessment } from '@/models/RiskAssesment'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const userId = decoded.userId

    // Get user profile with explicit typing
    const user: IUser | null = await User.findById(userId).select('age gender profile')
    
    // Get latest health data with explicit typing
    const healthData: IHealthData | null = await HealthData.findOne({ userId })
      .sort({ updatedAt: -1 })
    
    // Get latest risk assessment with explicit typing
    const riskAssessment: IRiskAssessment | null = await RiskAssessment.findOne({ userId })
      .sort({ createdAt: -1 })

    return NextResponse.json({
      profile: {
        age: user?.age,
        gender: user?.gender,
        height: user?.profile?.height
      },
      vitalStats: {
        heartRate: healthData?.heartRate || null,
        bloodPressure: healthData?.bloodPressure || null,
        weight: healthData?.weight || null,
        bmi: healthData?.bmi || null
      },
      riskAssessment: riskAssessment ? {
        riskScore: riskAssessment.riskScore,
        factors: riskAssessment.factors,
        recommendations: riskAssessment.recommendations,
        riskLevel: riskAssessment.riskLevel,
        createdAt: riskAssessment.createdAt
      } : null
    })

  } catch (error) {
    console.error('Error fetching health data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch health data' }, 
      { status: 500 }
    )
  }
}
