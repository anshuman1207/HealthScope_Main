import express from 'express';
import Appointment from '../../../healthsource_frontend/models/Appointment.js';
import Doctor from '../../models/Doctor.js';
import User from '../../../healthsource_frontend/models/User.js';
import auth from '../../middleware/authMiddleware.js';

const router = express.Router();

// @route POST /api/appointments
// @desc Book a new appointment
// @access Private (only for authenticated users)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role === 'doctor') {
            return res.status(403).json({ msg: 'Doctors cannot book appointments.' });
        }

        const { doctorId, date } = req.body;

        const doctor = await Doctor.findOne({ user: doctorId }); // Find the Doctor document
        if (!doctor) {
            return res.status(404).json({ msg: 'Doctor not found.' });
        }

        const newAppointment = new Appointment({
            doctor: doctor._id, // Assign to the Doctor document's ID
            patient: req.user.id,
            date,
            status: 'pending'
        });

        await newAppointment.save();

        // This is the crucial step you need to add or correct:
        // Update the doctor's appointments list by pushing the new appointment's ID
        doctor.appointments.push(newAppointment._id);
        await doctor.save();
        
        res.status(201).json({ msg: 'Appointment booked successfully.', appointment: newAppointment });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route PUT /api/appointments/:id
// @desc Update an appointment's status
router.put('/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        if (req.user.role !== 'doctor' || req.user.id.toString() !== appointment.doctor.toString()) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        appointment.status = status;
        await appointment.save();
        res.json(appointment);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route DELETE /api/appointments/:id
// @desc Delete an appointment
// @access Private (only for doctors)
router.delete('/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }
        
        // Authorization check: Ensure the logged-in user is the doctor for this appointment
        const doctorProfile = await Doctor.findOne({ user: req.user.id });
        if (!doctorProfile || appointment.doctor.toString() !== doctorProfile._id.toString()) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        await appointment.deleteOne();
        res.json({ msg: 'Appointment removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;