// /api/patient/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
// Correctly importing the Appointment model and its interface from its new file
import { Appointment, IAppointment } from '@/models/Appointment' 
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

    // Get upcoming appointments
    const upcomingAppointments = await Appointment.find({
      patientId: userId,
      appointmentDate: { $gte: new Date() },
      status: { $in: ['confirmed', 'scheduled'] }
    })
    .populate('doctorId', 'name specialty')
    .sort({ appointmentDate: 1 })
    .limit(5)

    return NextResponse.json({
      success: true,
      // Now using the IAppointment interface for type safety
      appointments: upcomingAppointments.map((apt: IAppointment) => ({ 
        id: apt._id,
        // The populate call places the Doctor document into apt.doctorId.
        // We need to cast it to ensure TypeScript knows the structure.
        doctor: (apt.doctorId as any)?.name,
        specialty: (apt.doctorId as any)?.specialty,
        date: apt.appointmentDate.toISOString().split('T')[0],
        time: apt.appointmentTime,
        type: apt.appointmentType || 'Consultation',
        status: apt.status
      }))
    })

  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' }, 
      { status: 500 }
    )
  }
}
