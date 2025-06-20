/**
 * Route File: expenses.js
 * -----------------------
 * This file handles all routes related to expense management for authenticated users.
 * It allows users to:
 * - View all their recorded expenses
 * - Create new expenses
 * - Update specific expenses
 * - Delete specific expenses
 * 
 * All routes are protected using JWT-based authentication middleware (`auth`).
 */

const express = require('express');
const router = express.Router();

const Expense = require('../models/Expense');  // Mongoose model for expenses
const auth = require('../middleware/auth');    // JWT authentication middleware

// Route: GET /api/expenses
// Purpose: Retrieve all expenses for the logged-in user, sorted by newest first
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });  // Sort by date descending
    res.json(expenses);  // Return array of user's expenses
  } catch (err) {
    res.status(500).json({ message: 'Server error' });  // Handle database/server errors
  }
});

// Route: POST /api/expenses
// Purpose: Create a new expense entry
router.post('/', auth, async (req, res) => {
  const { amount, category, note, date } = req.body;

  try {
    const expense = new Expense({
      user: req.user.id,  // Link expense to the authenticated user
      amount,
      category,
      note,
      date
    });

    const saved = await expense.save();  // Save to database
    res.json(saved);  // Return saved document
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route: PUT /api/expenses/:id
// Purpose: Update an existing expense by ID
router.put('/:id', auth, async (req, res) => {
  const { amount, category, note, date } = req.body;

  try {
    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },  // Find by ID and verify ownership
      { amount, category, note, date },            // Fields to update
      { new: true }                                // Return the updated document
    );

    if (!updated) return res.status(404).json({ message: 'Expense not found' });  // If no matching expense

    res.json(updated);  // Return updated expense
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route: DELETE /api/expenses/:id
// Purpose: Delete an expense by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id  // Make sure expense belongs to the logged-in user
    });

    if (!deleted) return res.status(404).json({ message: 'Expense not found' });

    res.json({ message: 'Expense deleted' });  // Confirm deletion
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
