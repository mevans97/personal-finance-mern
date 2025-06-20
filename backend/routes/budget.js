/**
 * Route File: budget.js
 * ---------------------
 * This file handles budget-related operations for authenticated users, including:
 * - Checking for an existing budget
 * - Creating a new budget
 * - Adding, updating, and deleting individual budget items
 * 
 * It uses JWT authentication middleware (`auth`) to restrict access to routes,
 * and interacts with the MongoDB `Budget` model to store and manage budget data.
 */

const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');  // Import the Budget model
const auth = require('../middleware/auth');  // Middleware to verify JWT token

// Route: GET /api/budget
// Purpose: Check if the user already has a budget
router.get('/', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.user.id });  // Look for budget by user ID
    if (budget) {
      res.json({ exists: true, budget });  // Return budget if found
    } else {
      res.json({ exists: false });         // Return false if no budget exists
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });  // Catch unexpected errors
  }
});

// Route: POST /api/budget
// Purpose: Create a new budget for a user (only one budget allowed)
router.post('/', auth, async (req, res) => {
  try {
    const existing = await Budget.findOne({ userId: req.user.id });  // Check if budget already exists
    if (existing) return res.status(400).json({ message: 'Budget already exists' });

    const newBudget = new Budget({
      userId: req.user.id,
      items: req.body.items  // Expecting an array of items: [{ name, amount, category }]
    });

    await newBudget.save();  // Save the new budget to the database
    res.json({ message: 'Budget created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route: PUT /api/budget/:itemId
// Purpose: Update a single budget item by ID
router.put('/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, amount, category } = req.body;

    const budget = await Budget.findOne({ userId: req.user.id });  // Find user's budget
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    const item = budget.items.id(itemId);  // Locate the specific budget item
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Update item fields
    item.name = name;
    item.amount = amount;
    item.category = category;

    await budget.save();  // Save the updated budget
    res.json({ message: 'Item updated', item });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route: DELETE /api/budget/:itemId
// Purpose: Delete a budget item by ID
router.delete('/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log("🗑️ Delete request for itemId:", itemId);

    const budget = await Budget.findOne({ userId: req.user.id });  // Find user's budget
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Find the item index to delete
    const index = budget.items.findIndex((item) => item._id.toString() === itemId);
    if (index === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    budget.items.splice(index, 1);  // Remove item from array
    await budget.save();            // Save the updated budget

    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error("🔥 DELETE error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route: POST /api/budget/item
// Purpose: Add a new item to an existing budget
router.post('/item', auth, async (req, res) => {
  try {
    const { name, amount, category } = req.body;

    const budget = await Budget.findOne({ userId: req.user.id });  // Find user's existing budget
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Add the new item to the budget
    budget.items.push({ name, amount, category });
    await budget.save();  // Save changes to DB

    res.json({ message: 'Item added', item: budget.items[budget.items.length - 1] });  // Return the added item
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
