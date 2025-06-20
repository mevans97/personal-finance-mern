// routes/expenses.js

const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// GET all expenses for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create a new expense
router.post('/', auth, async (req, res) => {
  const { amount, category, note, date } = req.body;

  try {
    const expense = new Expense({
      user: req.user.id,
      amount,
      category,
      note,
      date
    });

    const saved = await expense.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update an expense
router.put('/:id', auth, async (req, res) => {
  const { amount, category, note, date } = req.body;

  try {
    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { amount, category, note, date },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Expense not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE an expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!deleted) return res.status(404).json({ message: 'Expense not found' });

    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
