/**
 * Model: Budget.js
 * ----------------
 * This Mongoose schema defines the structure for storing budget documents in MongoDB.
 * Each document represents a budget associated with a specific user (via `userId`)
 * and includes an array of budget items, where each item has a name, amount, and category.
 * 
 * This schema supports tracking and organizing multiple user-created budget items for use
 * in personal finance applications.
 */

const mongoose = require('mongoose'); // Import Mongoose for schema and model creation

// Define the schema for a user's budget
const BudgetSchema = new mongoose.Schema({
  // Link each budget to a specific user by storing the user's MongoDB ObjectId
  userId: {
    type: mongoose.Schema.Types.ObjectId, // References the User model's ID
    ref: 'User',                          // Creates a reference to the User collection
    required: true                        // Ensures that every budget is tied to a user
  },

  // Array of budget items associated with this budget
  items: [
    {
      name: String,       // Name/label of the budget item (e.g., "Rent", "Groceries")
      amount: Number,     // Dollar amount for this budget item
      category: String    // Category to group the item (e.g., "Housing", "Food")

      // This schema structure defines each individual budget entry the user adds
    }
  ]
});

// Export the model to use in routes and controllers
module.exports = mongoose.model('Budget', BudgetSchema);
