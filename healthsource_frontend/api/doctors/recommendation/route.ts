// /api/doctors/recommendations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
// Corrected import path from 'models/Doctor' to 'models/Doctors' to match your file structure.
// Note: This also applies to other models like User.ts, which you may have named Users.ts.
import { Doctor, IDoctor } from '@/models/Doctors' 
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    // Use verifyToken to validate the token and get the user ID.
    // This is a crucial security step.
    const decodedToken = verifyToken(token)
    // The decodedToken can be used for logging or further authorization checks if needed.

    const { riskScore, factors } = await request.json()

    // Determine required specialties based on risk factors
    const requiredSpecialties: string[] = []
    
    factors.forEach((factor: { factor: string; score: number }) => {
      if (factor.factor.includes('Blood Pressure') && factor.score > 10) {
        requiredSpecialties.push('Cardiologist', 'Internal Medicine')
      }
      if (factor.factor.includes('Heart Rate') && factor.score > 10) {
        requiredSpecialties.push('Cardiac Electrophysiologist', 'Cardiologist')
      }
      if (factor.factor.includes('BMI') && factor.score > 10) {
        requiredSpecialties.push('Endocrinologist', 'Nutritionist')
      }
    })

    // Always include a general physician
    requiredSpecialties.push('General Physician')
    
    // If high risk, add internal medicine
    if (riskScore > 50) {
      requiredSpecialties.push('Internal Medicine')
    }

    // Get recommended doctors
    const doctors = await Doctor.find({
      specialty: { $in: [...new Set(requiredSpecialties)] },
      isActive: true,
      isOnline: true // It's better to show only online doctors for immediate consultation
    })
    .limit(4)
    .sort({ rating: -1, experience: -1 })

    return NextResponse.json({
      success: true,
      doctors: doctors.map((doctor: IDoctor) => ({ // Explicitly typed 'doctor'
        id: doctor._id,
        name: doctor.name,
        specialty: doctor.specialty,
        experience: doctor.experience,
        rating: doctor.rating,
        hospital: doctor.hospital,
        availableSlots: doctor.availableSlots || 0,
        consultationFee: doctor.consultationFee,
        isOnline: doctor.isOnline || false
      }))
    })

  } catch (error) {
    console.error('Error fetching recommended doctors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' }, 
      { status: 500 }
    )
  }
}
