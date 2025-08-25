// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import reportRoutes from './routes/reportRoutes.js';
import authRoutes from './routes/authRoutes.js'; 
import doctorRoutes from './routes/doctorRoutes.js'; 
import appointmentRoutes from './routes/appointmentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes); 

app.get('/', (req, res) => {
  res.send('Welcome to Healthsource!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use('/api/doctors', doctorRoutes); 
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/appointments',appointmentRoutes);
