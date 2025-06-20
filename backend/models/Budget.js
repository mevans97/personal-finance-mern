const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      name: String,
      amount: Number,
      category: String
      //This schema is for each individual user budget item in the list
    }
  ],
});

module.exports = mongoose.model('Budget', BudgetSchema);
