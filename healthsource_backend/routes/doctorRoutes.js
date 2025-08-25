import express from 'express';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import auth from '../middleware/authMiddleware.js';
import Report from '../models/Report.js'
const router = express.Router();

// @route GET /api/doctors/me
// @desc Get the profile of the logged-in doctor
// @access Private (only for doctors)
router.get('/me', auth, async (req, res) => {
    try {
        // Find the doctor's profile using the user ID from the token
        const doctor = await Doctor.findOne({ user: req.user.id }).populate('user', ['name', 'email', 'city']);

        if (!doctor) {
            return res.status(404).json({ msg: 'Doctor profile not found' });
        }

        res.json(doctor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route POST /api/doctors/register-profile
// @desc Create or update a doctor's profile
// @access Private (for doctor role)
router.post('/register-profile', auth, async (req, res) => {
    const { specialization, qualifications, bio } = req.body;

    // Check if user is a doctor
    if (req.user.role !== 'doctor') {
        return res.status(403).json({ msg: 'Access denied. Only doctors can create profiles' });
    }

    try {
        let doctor = await Doctor.findOne({ user: req.user.id });

        if (doctor) {
            // Update existing profile
            doctor.specialization = specialization || doctor.specialization;
            doctor.qualifications = qualifications || doctor.qualifications;
            doctor.bio = bio || doctor.bio;
        } else {
            // Create a new profile
            doctor = new Doctor({
                user: req.user.id,
                specialization,
                qualifications,
                bio
            });
        }

        await doctor.save();
        res.status(200).json(doctor);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route GET /api/doctors/appointments
// @desc Get all appointments for the logged-in doctor
// @access Private (for doctor role)
router.get('/appointments', auth, async (req, res) => {
    try {
        // Step 1: Find the Doctor document using the user ID from the token
        const doctorProfile = await Doctor.findOne({ user: req.user.id });

        if (!doctorProfile) {
            return res.status(404).json({ msg: 'Doctor profile not found.' });
        }

        // Step 2: Use the Doctor document's ID to find appointments
        const appointments = await Appointment.find({ doctor: doctorProfile._id }).populate('patient', ['name', 'email']);

        res.json(appointments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// Inside routes/doctorRoutes.js

// @route GET /api/doctors
// @desc Get a list of all doctors (public access)
router.get('/', async (req, res) => {
    try {
        const { specialization, city } = req.query;
        let query = {};

        if (specialization) {
            query.specialization = specialization;
        }
        if (city) {
            query.city = city;
        }

        const doctors = await Doctor.find(query).populate('user', ['name', 'city']);
        res.json(doctors);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// @route GET /api/doctors/urgent-cases
// @desc Get urgent cases assigned to the logged-in doctor
// @access Private (for doctors)
router.get('/urgent-cases', auth, async (req, res) => {
    try {
        // Ensure the authenticated user has the 'doctor' role
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ msg: 'Authorization denied' });
        }

        // Find reports assigned to the doctor, sorted by priority and limited
        const urgentCases = await Report.find({ doctor: req.user.id })
                                    .sort({ priority: -1, createdAt: 1 })
                                    .limit(10) // Limit to a manageable number of cases
                                    .populate('reporter', ['name', 'city']); // Populate reporter info

        res.json(urgentCases);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
export default router;