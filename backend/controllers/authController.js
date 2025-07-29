import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;


    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, email and password are required' 
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        error: 'Password must contain:\n- Minimum 8 characters\n- At least 1 uppercase letter\n- At least 1 number\n- At least 1 special character'
      });
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email already in use'
      });
    }
    
    const hashedPassword = await bcrypt.hash(password,10);


    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();


    return res.status(201).json({
      success: true,
      message: 'User created successfully. Please check your email for verification.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    //create the acceess token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // '15m'
    );
    //creating the refresh token
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // '7d'
    );

    
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: 'lax', 
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log('Login successful');
    res.json({ accessToken });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  try {
    
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    //
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

   
    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // '15m'
    );

    res.json({ accessToken: newAccessToken });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

export const logout = async (req, res) => {
  console.log('Logout request received');
  const refreshToken = req.cookies.refreshToken; // Fix typo: 'refreshToken' (was 'refreshToken')

  if (!refreshToken) {
    return res.sendStatus(204); // No content - valid for missing token
  }

  try {
    // (1) Verify and decode token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // (2) Clear refreshToken from DB
    await User.findByIdAndUpdate(
      decoded.userId, // Fix typo: 'decoded' (was 'decoded')
      { $set: { refreshToken: null } }, // Explicit $set operator
      { new: true }
    );

    // (3) Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Enable in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/'
    });

    return res.sendStatus(204); // Explicit return

  } catch (error) {
    console.error('Logout error:', error);
    
    // Handle specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    return res.status(500).json({ error: 'Server error during logout' });
  }
};