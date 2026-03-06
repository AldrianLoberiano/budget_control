const express = require('express');
const { body } = require('express-validator');
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

const transactionValidation = [
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('description').optional().trim().isLength({ max: 200 }),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
];

const updateValidation = [
  body('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('description').optional().trim().isLength({ max: 200 }),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
];

router.get('/summary', getSummary);
router.route('/').get(getTransactions).post(transactionValidation, addTransaction);
router.route('/:id').put(updateValidation, updateTransaction).delete(deleteTransaction);

module.exports = router;
