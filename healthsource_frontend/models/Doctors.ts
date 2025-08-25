// /models/Doctor.ts
import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

// Interface for the Doctor document
export interface IDoctor extends Document {
  name: string
  email: string
  passwordHash: string
  specialty: string
  experience: number
  rating: number
  hospital: string
  availableSlots: number
  consultationFee: number
  isOnline: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  // Methods for password comparison
  comparePassword(password: string): Promise<boolean>
}

const DoctorSchema = new Schema<IDoctor>({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address.'],
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required.'],
  },
  specialty: {
    type: String,
    required: [true, 'Specialty is required.'],
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required.'],
    min: 0,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  hospital: {
    type: String,
    required: [true, 'Hospital is required.'],
  },
  availableSlots: {
    type: Number,
    default: 0,
    min: 0,
  },
  consultationFee: {
    type: Number,
    default: 0,
    min: 0,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

// Pre-save hook to hash the password before saving
DoctorSchema.pre('save', async function(next) {
  if (this.isModified('passwordHash')) {
    const salt = await bcrypt.genSalt(10)
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt)
  }
  next()
})

// Method to compare passwords
DoctorSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash)
}

export const Doctor = mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema)