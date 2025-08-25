// /models/RiskAssessment.ts
import mongoose, { Schema, Document } from 'mongoose'

// Interface for RiskAssessment document
export interface IRiskAssessment extends Document {
  userId: mongoose.Types.ObjectId
  riskScore: number
  factors: Array<{
    factor: string
    score: number
    description: string
  }>
  recommendations: string[]
  riskLevel: {
    level: string
    color: string
    description: string
  }
  inputData: {
    heartRate: number
    systolicBP: number
    diastolicBP: number
    bmi: number
    age: number
    gender: string
  }
  createdAt: Date
}

// Mongoose Schema for RiskAssessment
const RiskAssessmentSchema = new Schema<IRiskAssessment>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  factors: [{
    factor: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  }],
  recommendations: [{
    type: String,
    required: true,
  }],
  riskLevel: {
    level: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  inputData: {
    heartRate: { type: Number, required: true },
    systolicBP: { type: Number, required: true },
    diastolicBP: { type: Number, required: true },
    bmi: { type: Number, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for faster retrieval of latest assessment
RiskAssessmentSchema.index({ userId: 1, createdAt: -1 })

export const RiskAssessment = mongoose.models.RiskAssessment || mongoose.model<IRiskAssessment>('RiskAssessment', RiskAssessmentSchema)
