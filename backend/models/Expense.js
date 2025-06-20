/**
 * Model: Expense.js
 * -----------------
 * This Mongoose schema defines the structure for tracking individual expense records.
 * Each expense is linked to a user and includes an amount, category, optional note, and timestamp.
 * 
 * This schema is used in the personal finance app to store and retrieve spending data,
 * allowing users to track their monthly expenses over time.
 */

const mongoose = require('mongoose'); // Import Mongoose to define schema and model

// Define schema for individual expense entries
const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Link to the user who owns this expense
    ref: 'User',                          // Reference to the User model
    required: true                        // Expense must belong to a user
  },
  amount: {
    type: Number,     // The dollar amount of the expense
    required: true    // Every expense must have a value
  },
  category: {
    type: String,     // Category label (e.g., "Food", "Transportation", "Housing")
    required: true    // Category is required for grouping and analytics
  },
  note: {
    type: String,     // Optional description of the expense (e.g., "Uber ride to airport")
    default: ''       // Defaults to empty string if no note is provided
  },
  date: {
    type: Date,       // Timestamp of when the expense was recorded
    default: Date.now // Automatically uses the current date/time if not specified
  }
});

// Export the model for use in routes and controllers
module.exports = mongoose.model('Expense', expenseSchema);
