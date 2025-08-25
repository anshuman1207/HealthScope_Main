// routes/reportRoutes.js
// routes/reportRoutes.js
import express from 'express';
import Report from '../models/Report.js';
import User from '../models/User.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// @route POST /api/reports
// @desc Create a new report and assign it to a doctor in the same city
router.post('/', async (req, res) => {
    try {
        const { reporterId, title, description, city, priority } = req.body;

        // Find a doctor in the same city as the reporter
        const doctorsInCity = await User.find({ role: 'doctor', city: city });

        let assignedDoctor = null;

        // A simple way to assign a doctor (e.g., the first one found)
        if (doctorsInCity.length > 0) {
            assignedDoctor = doctorsInCity[0]._id;
        } else {
            // Handle cases where no doctor is available in the city
            // You might assign to a central hub, or leave it unassigned.
            // For this example, we'll leave it null.
            console.log(`No doctor found in ${city}. Report will be unassigned.`);
        }

        // Create the new report
        const newReport = new Report({
            reporter: reporterId,
            doctor: assignedDoctor, // Assign to a doctor in the city or null
            title,
            description,
            priority
        });

        const report = await newReport.save();
        res.status(201).json(report);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// @route PUT /api/reports/:id
// @desc Update a report's status (e.g., diagnose or discard)
// This is now a protected route
router.put('/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ msg: 'Report not found' });
        }

        // Optional: Add authorization check here
        // For example, only the assigned doctor or an admin can update the report.
        if (req.user.role !== 'doctor' || report.doctor.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Authorization denied' });
        }

        report.status = status;
        await report.save();
        res.json(report);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/doctor', auth, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ msg: 'Authorization denied' });
        }
        const reports = await Report.find({ doctor: req.user.id }).populate('reporter', ['name', 'city']);
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;