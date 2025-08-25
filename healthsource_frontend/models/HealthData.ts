// /models/HealthData.ts
import mongoose, { Schema, Document } from 'mongoose'

// Interface for HealthData document
export interface IHealthData extends Document {
  userId: mongoose.Types.ObjectId
  heartRate?: number
  bloodPressure?: string
  weight?: number
  height?: number
  bmi?: number
  heartRateHistory: Array<{
    value: number
    recordedAt: Date
  }>
  bloodPressureHistory: Array<{
    systolic: number
    diastolic: number
    recordedAt: Date
  }>
  weightHistory: Array<{
    weight: number
    bmi: number
    recordedAt: Date
  }>
  createdAt: Date
  updatedAt: Date
}

// Mongoose Schema for HealthData
const HealthDataSchema = new Schema<IHealthData>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  heartRate: {
    type: Number,
    min: 30,
    max: 200,
  },
  bloodPressure: {
    type: String,
    match: /^\d{2,3}\/\d{2,3}$/, // Regex to validate format like '120/80'
  },
  weight: {
    type: Number,
    min: 20,
    max: 300,
  },
  height: {
    type: Number,
    min: 100,
    max: 250,
  },
  bmi: {
    type: Number,
    min: 10,
    max: 60,
  },
  heartRateHistory: [{
    value: {
      type: Number,
      required: true,
    },
    recordedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  bloodPressureHistory: [{
    systolic: {
      type: Number,
      required: true,
    },
    diastolic: {
      type: Number,
      required: true,
    },
    recordedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  weightHistory: [{
    weight: {
      type: Number,
      required: true,
    },
    bmi: {
      type: Number,
      required: true,
    },
    recordedAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
})

// Indexes for faster lookups
HealthDataSchema.index({ userId: 1 })
HealthDataSchema.index({ updatedAt: -1 })

export const HealthData = mongoose.models.HealthData || mongoose.model<IHealthData>('HealthData', HealthDataSchema)
