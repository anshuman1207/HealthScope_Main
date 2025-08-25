// /api/user/vitals/[type]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
import { HealthData, IHealthData } from '@/models/HealthData' // Corrected import and added IHealthData type
import { verifyToken } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    await connectDB()
    
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const userId = decoded.userId
    
    const vitalType = params.type
    const data = await request.json()

    // Find or create health data record
    let healthData: IHealthData | null = await HealthData.findOne({ userId })
    if (!healthData) {
      healthData = new HealthData({ userId })
    }

    // Update specific vital sign with validation
    switch (vitalType) {
      case 'heart-rate':
        if (!data.heartRate || typeof data.heartRate !== 'number') {
            return NextResponse.json({ error: 'Invalid heart rate provided' }, { status: 400 })
        }
        healthData!.heartRate = data.heartRate
        healthData!.heartRateHistory.push({
          value: data.heartRate,
          recordedAt: new Date()
        })
        break
        
      case 'blood-pressure':
        if (!data.systolic || !data.diastolic || typeof data.systolic !== 'number' || typeof data.diastolic !== 'number') {
            return NextResponse.json({ error: 'Invalid blood pressure values provided' }, { status: 400 })
        }
        healthData!.bloodPressure = `${data.systolic}/${data.diastolic}`
        healthData!.bloodPressureHistory.push({
          systolic: data.systolic,
          diastolic: data.diastolic,
          recordedAt: new Date()
        })
        break
        
      case 'bmi':
        if (!data.weight || !data.height || !data.bmi || typeof data.weight !== 'number' || typeof data.height !== 'number' || typeof data.bmi !== 'number') {
            return NextResponse.json({ error: 'Invalid BMI data provided' }, { status: 400 })
        }
        healthData!.weight = data.weight
        healthData!.bmi = data.bmi
        if (data.height) {
          healthData!.height = data.height
        }
        healthData!.weightHistory.push({
          weight: data.weight,
          bmi: data.bmi,
          recordedAt: new Date()
        })
        break
        
      default:
        return NextResponse.json({ error: 'Invalid vital type' }, { status: 400 })
    }

    healthData!.updatedAt = new Date()
    await healthData!.save()

    return NextResponse.json({ 
      success: true, 
      message: 'Vital data saved successfully' 
    })

  } catch (error: any) {
    console.error('Error saving vital data:', error)
    return NextResponse.json(
      { error: `Failed to save vital data: ${error.message}` }, 
      { status: 500 }
    )
  }
}
