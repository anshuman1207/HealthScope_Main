import mongoose from 'mongoose';
const { Schema } = mongoose;

const ReportSchema = new Schema({
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: Number, default: 1 },
    status: { type: String, enum: ['pending', 'diagnosed', 'discarded'], default: 'pending' },
    
    // New fields to match the frontend
    riskScore: { type: Number, required: true, min: 0, max: 100 },
    flags: { type: [String], default: [] }, // An array of strings for AI flags
    
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Report', ReportSchema);