// /models/Appointment.ts
import mongoose, { Schema, Document, Types } from 'mongoose'

// Interface for the Appointment document
export interface IAppointment extends Document {
  patientId: Types.ObjectId
  doctorId: Types.ObjectId
  appointmentDate: Date
  appointmentTime: string
  appointmentType: string
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

// Mongoose Schema for the Appointment model
const AppointmentSchema = new Schema<IAppointment>({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming your patient user is in the User collection
    required: true,
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  appointmentTime: {
    type: String,
    required: true,
  },
  appointmentType: {
    type: String,
    enum: ['Consultation', 'Follow-up', 'Emergency'],
    default: 'Consultation',
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled'],
    default: 'scheduled',
  },
}, {
  timestamps: true,
})

// Index for efficient querying by patient and date
AppointmentSchema.index({ patientId: 1, appointmentDate: 1 })

export const Appointment = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema)


