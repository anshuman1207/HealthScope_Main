import mongoose from 'mongoose';
const { Schema } = mongoose;

const DoctorSchema = new Schema({
    // Link to the User model
    user: { 
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    specialization: { 
        type: String, 
        required: true, 
        trim: true 
    },
    qualifications: { 
        type: [String], // An array of strings for degrees and certifications
        default: [] 
    },
    bio: { 
        type: String, 
        trim: true 
    },
    // Optional: Add a field for the doctor's profile picture URL
    profilePic: {
        type: String
    },
    // This will track a doctor's patients and appointments
    patients: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    // This will reference an appointments collection
    appointments: [{
        type: Schema.Types.ObjectId,
        ref: 'Appointment'
    }]
}, { timestamps: true });

export default mongoose.model('Doctor', DoctorSchema);