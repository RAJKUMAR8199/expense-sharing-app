const mongoose = require('mongoose');
const ExpenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  payer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  splitType: { type: String, enum: ['EQUAL', 'EXACT', 'PERCENT'], required: true },
  splits: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amountOwed: Number
  }]
});
module.exports = mongoose.model('Expense', ExpenseSchema);