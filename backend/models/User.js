/**
 * Model: User.js
 * --------------
 * This Mongoose schema defines how user accounts are structured and stored in the MongoDB database.
 * It includes fields for user email and password, both of which are required.
 * 
 * This model is central to user authentication and account management in the personal finance app.
 */

const mongoose = require('mongoose'); // Import Mongoose to define the schema and model

// Define schema for storing user account information
const UserSchema = new mongoose.Schema({
  email: {
    type: String,     // The user's email address
    required: true,   // Email is mandatory for login and identification
    unique: true      // Ensures that no two users can have the same email
  },
  password: {
    type: String,     // Hashed password used for authentication
    required: true    // Password is mandatory for security
  }
});

// Export the model so it can be used in routes, middleware, etc.
module.exports = mongoose.model('User', UserSchema);
