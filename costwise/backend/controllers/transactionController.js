const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');

// @desc    Get all transactions for authenticated user
// @route   GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, limit = 50, page = 1 } = req.query;

    const filter = { user: req.user._id };

    if (type && ['income', 'expense'].includes(type)) {
      filter.type = type;
    }
    if (category) {
      filter.category = category;
    }
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limitNum),
      Transaction.countDocuments(filter),
    ]);

    res.json({
      transactions,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a transaction
// @route   POST /api/transactions
const addTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { type, category, amount, description, date } = req.body;

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      category,
      amount,
      description,
      date: date || Date.now(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { type, category, amount, description, date } = req.body;

    if (type) transaction.type = type;
    if (category) transaction.category = category;
    if (amount) transaction.amount = amount;
    if (description !== undefined) transaction.description = description;
    if (date) transaction.date = date;

    const updated = await transaction.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get financial summary for authenticated user
// @route   GET /api/transactions/summary
const getSummary = async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const categoryBreakdown = await Transaction.aggregate([
      { $match: { user: req.user._id, type: 'expense' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const monthlyTrend = await Transaction.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 24 },
    ]);

    const income = summary.find((s) => s._id === 'income') || { total: 0, count: 0 };
    const expense = summary.find((s) => s._id === 'expense') || { total: 0, count: 0 };

    res.json({
      totalIncome: income.total,
      totalExpenses: expense.total,
      balance: income.total - expense.total,
      incomeCount: income.count,
      expenseCount: expense.count,
      categoryBreakdown,
      monthlyTrend,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
};
