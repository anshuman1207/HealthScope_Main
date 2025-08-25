// /api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
import { User, IUser } from '@/models/User' // Corrected import and added IUser type
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    // IMPORTANT: Verify the token to ensure the user is authenticated and authorized.
    const decoded = verifyToken(token)
    const userId = decoded.userId
    
    const { age, gender, height } = await request.json()

    // You can add validation here to ensure the data is in the correct format before updating.
    if (!age || !gender) {
      return NextResponse.json({ error: 'Age and gender are required' }, { status: 400 })
    }

    await User.findByIdAndUpdate(userId, {
      age,
      gender,
      'profile.height': height,
      updatedAt: new Date()
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully' 
    })

  } catch (error: any) { // Explicitly typing error as 'any'
    console.error('Error updating profile:', error)
    return NextResponse.json(
      // The updated message will now include the specific error details.
      { error: `Failed to update profile: ${error.message}` }, 
      { status: 500 }
    )
  }
}
