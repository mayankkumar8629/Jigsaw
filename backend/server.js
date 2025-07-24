import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';

dotenv.config(); // Load environment variables

connectDB(); // Connect to MongoDB

const app=express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});