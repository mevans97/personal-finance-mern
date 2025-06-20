// routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');           // Used to hash passwords securely
const jwt = require('jsonwebtoken');          // Used to generate login tokens
const User = require('../models/User');       // Our User model

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

    // Create and save the user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Create a JWT token for the user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send the token back so frontend can store it
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route: POST /api/auth/login
// Purpose: Log in an existing user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    // Create a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
