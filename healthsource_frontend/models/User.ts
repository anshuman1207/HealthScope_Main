// /models/User.ts
import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

// Interface for the User document
export interface IUser extends Document {
  name: string
  email: string
  passwordHash: string
  age?: number
  gender?: 'male' | 'female' | 'other'
  profile: {
    height?: number
  }
  role: 'patient' | 'doctor' | 'admin'
  createdAt: Date
  updatedAt: Date
  // Virtual property for password handling (not stored in DB)
  password?: string
  // Methods for password comparison and full name
  comparePassword(password: string): Promise<boolean>
  fullName: string
}

const UserSchema = new Schema<IUser>({
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
  age: {
    type: Number,
    min: 1,
    max: 120,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    lowercase: true,
  },
  profile: {
    height: {
      type: Number,
      min: 100,
      max: 250,
    },
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient',
  },
}, {
  timestamps: true,
})

// Pre-save hook to hash the password before saving
UserSchema.pre('save', async function(next) {
  if (this.isModified('passwordHash')) {
    const salt = await bcrypt.genSalt(10)
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt)
  }
  next()
})

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash)
}

// Virtual for getting the full name (if needed)
UserSchema.virtual('fullName').get(function() {
  return this.name
})

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)



