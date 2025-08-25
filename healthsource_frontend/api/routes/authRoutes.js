import express from 'express';
import User from '../../../healthsource_frontend/models/User.js';
import jwt from 'jsonwebtoken';
import auth from '../../middleware/authMiddleware.js';

const router = express.Router();

// A secret key for signing the JWT. Store this in your .env file in a real app.
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; 

// @route POST /api/auth/register
// @desc Register a new user and get a token
router.post('/register', async (req, res) => {
    const { name, email, password, role, city } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ name, email, password, role, city });
        await user.save();

        // Create the JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        // Sign the token and send it back
        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route POST /api/auth/login
// @desc Authenticate user and get a token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/auth/me
// @desc    Get user data by token (protected route)
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        // Find the user by the ID stored in the token's payload
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;