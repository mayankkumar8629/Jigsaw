import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import sessionRoutes from './routes/sessionRoute.js';

dotenv.config(); // Load environment variables

connectDB(); // Connect to MongoDB

const app=express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});