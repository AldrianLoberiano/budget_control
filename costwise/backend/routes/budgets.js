const express = require('express');
const { body } = require('express-validator');
const { getBudgets, upsertBudget, deleteBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

const budgetValidation = [
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('limit').isFloat({ min: 0.01 }).withMessage('Limit must be greater than 0'),
  body('period').optional().isIn(['monthly', 'weekly']).withMessage('Period must be monthly or weekly'),
];

router.route('/').get(getBudgets).post(budgetValidation, upsertBudget);
router.route('/:id').delete(deleteBudget);

module.exports = router;
