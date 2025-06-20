/**
 * Server Entry Point: Express API Backend
 * ---------------------------------------
 * This file sets up and starts the backend server using Express.
 * It connects to a MongoDB database using Mongoose, enables CORS for frontend-backend communication,
 * and registers route handlers for authentication, budget management, and expense tracking.
 * 
 * Features:
 * - Environment configuration via .env file
 * - MongoDB connection
 * - Middleware for JSON parsing and CORS
 * - Routes for:
 *   - /api/auth → handles user registration and login
 *   - /api/budget → handles user budget operations
 *   - /api/expenses → handles tracking and managing expenses
 */

const express = require('express');           // Import Express framework to build the API
const mongoose = require('mongoose');         // Mongoose provides MongoDB interaction
const cors = require('cors');                 // Allows frontend apps (like React Native) to make API calls
require('dotenv').config();                   // Load environment variables from .env file

const app = express();                        // Create an instance of Express app
const PORT = process.env.PORT || 5000;        // Use environment port or fallback to 5000

// ----------------------
// Middleware
// ----------------------
app.use(cors());               // Enables Cross-Origin Resource Sharing
app.use(express.json());       // Automatically parses incoming JSON in request bodies

// ----------------------
// Database Connection
// ----------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,       // Use new URL parser (MongoDB driver option)
  useUnifiedTopology: true     // Use new Server Discovery and Monitoring engine
})
.then(() => console.log("MongoDB Connected")) // Connection successful
.catch(err => console.error("MongoDB Error:", err)); // Handle DB connection errors

// ----------------------
// Route Registrations
// ----------------------
const budgetRoutes = require('./routes/budget');   // Budget management endpoints
app.use('/api/budget', budgetRoutes);              // Mount budget routes under /api/budget

const authRoutes = require('./routes/auth');       // Auth routes (login, register)
app.use('/api/auth', authRoutes);                  // Mount under /api/auth

const expenseRoutes = require('./routes/expenses'); // Expense tracking routes
app.use('/api/expenses', expenseRoutes);            // Mount under /api/expenses

// ----------------------
// Start Express Server
// ----------------------
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
