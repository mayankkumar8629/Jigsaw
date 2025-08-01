import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import sessionRoutes from './routes/sessionRoute.js';
import cookieParser from 'cookie-parser';

dotenv.config(); // Load environment variables

connectDB(); // Connect to MongoDB

const app=express();
const PORT = 3003;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: ['https://jigsaw-pi.vercel.app', 'http://localhost:5173'], // Your frontend URLs
  credentials: true // Required for cookies
}));


            

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server is running on port 3003');
});