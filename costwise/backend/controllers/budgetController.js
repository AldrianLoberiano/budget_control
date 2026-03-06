const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');

// @desc    Get all budgets for authenticated user, with actual spending
// @route   GET /api/budgets
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id }).sort({ category: 1 });

    // Calculate current month's spending per category
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const spending = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense',
          date: { $gte: startOfMonth },
        },
      },
      { $group: { _id: '$category', spent: { $sum: '$amount' } } },
    ]);

    const spendingMap = {};
    spending.forEach((s) => { spendingMap[s._id] = s.spent; });

    const result = budgets.map((b) => ({
      _id: b._id,
      category: b.category,
      limit: b.limit,
      period: b.period,
      spent: spendingMap[b.category] || 0,
      remaining: Math.max(0, b.limit - (spendingMap[b.category] || 0)),
      percentage: Math.min(100, Math.round(((spendingMap[b.category] || 0) / b.limit) * 100)),
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create or update a budget
// @route   POST /api/budgets
const upsertBudget = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { category, limit, period } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category },
      { user: req.user._id, category, limit, period: period || 'monthly' },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: 'Budget removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getBudgets, upsertBudget, deleteBudget };
