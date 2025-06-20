/**
 * Route File: auth.js
 * -------------------
 * This file handles user authentication routes including user registration and login.
 * It interacts with the User model, hashes passwords securely using bcrypt, and generates
 * JWT tokens for client-side authentication.
 * 
 * Routes:
 * - POST /api/auth/register → Create a new user account and return a token.
 * - POST /api/auth/login    → Log in an existing user and return a token.
 */

const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');           // Used to hash passwords securely
const jwt = require('jsonwebtoken');          // Used to generate login tokens
const User = require('../models/User');       // Mongoose model for users

// Route: POST /api/auth/register
// Purpose: Register a new user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save(); // Save user to database

    // Generate a JWT token with the user's ID
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // Send token back to client for authentication
    res.json({ token });
  } catch (err) {
    // Catch server or database errors
    res.status(500).json({ error: err.message });
  }
});

// Route: POST /api/auth/login
// Purpose: Log in an existing user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if a user with the given email exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Compare the plain password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    // Generate a JWT token using user ID
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return token to frontend
    res.json({ token });
  } catch (err) {
    // Handle any server error
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
