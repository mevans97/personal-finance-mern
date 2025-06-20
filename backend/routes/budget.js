const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

// Check if user's budget exists
router.get('/', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.user.id });
    if (budget) {
      res.json({ exists: true, budget });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

//Saves Budget Items In Database, Prevents Duplicate Budgets
router.post('/', auth, async (req, res) => {
  try {
    const existing = await Budget.findOne({ userId: req.user.id });
    if (existing) return res.status(400).json({ message: 'Budget already exists' });

    const newBudget = new Budget({
      userId: req.user.id,
      items: req.body.items, // expecting array of { name, amount, category }
    });

    await newBudget.save();
    res.json({ message: 'Budget created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

//Edit Budget Items In Database
router.put('/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, amount, category } = req.body;

    const budget = await Budget.findOne({ userId: req.user.id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    const item = budget.items.id(itemId); // Get the specific item
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Update fields
    item.name = name;
    item.amount = amount;
    item.category = category;

    await budget.save();
    res.json({ message: 'Item updated', item });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

//Delete Budget Items In Database
router.delete('/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log("🗑️ Delete request for itemId:", itemId);

    const budget = await Budget.findOne({ userId: req.user.id });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Find the index of the item to remove
    const index = budget.items.findIndex((item) => item._id.toString() === itemId);
    if (index === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    budget.items.splice(index, 1); //  remove the item manually
    await budget.save();          //  save the updated budget

    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error("🔥 DELETE error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new item to the user's budget. Different than the previous post function as this one is for the route '/item'
router.post('/item', auth, async (req, res) => {
  try {
    const { name, amount, category } = req.body;

    // Find the logged-in user's budget
    const budget = await Budget.findOne({ userId: req.user.id });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Add the new item to the existing budget
    budget.items.push({ name, amount, category });
    await budget.save(); // Save updated budget to the database

    res.json({ message: 'Item added', item: budget.items[budget.items.length - 1] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;
