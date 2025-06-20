// models/User.js

const mongoose = require('mongoose');

// This schema defines how user data will be stored in MongoDB
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true // No duplicate emails
  },
  password: {
    type: String,
    required: true
  }
});

// Export the model so we can use it in other files
module.exports = mongoose.model('User', UserSchema);
