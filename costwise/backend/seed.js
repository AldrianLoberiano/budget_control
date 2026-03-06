/**
 * CostWise – Database Seeder
 * Usage: node seed.js
 * Run from the backend folder.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ── Inline schemas (avoids importing models with hooks) ──────────────────────
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
  },
  { timestamps: true }
);
const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: String,
    category: String,
    amount: Number,
    description: String,
    date: Date,
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

// ── Seed data ────────────────────────────────────────────────────────────────
const seedUsers = [
  {
    name: 'Aldrian Loberiano',
    email: 'aldrian@costwise.com',
    password: 'password123',
  },
  {
    name: 'Jane Smith',
    email: 'jane@costwise.com',
    password: 'password123',
  },
];

const generateTransactions = (userId) => {
  const now = new Date('2026-03-06');
  const d = (daysAgo) => new Date(now - daysAgo * 86400000);

  return [
    // ── Income ───────────────────────────────────────────────────────────
    { user: userId, type: 'income', category: 'Salary',     amount: 5000,  description: 'Monthly salary – March',    date: d(5)  },
    { user: userId, type: 'income', category: 'Salary',     amount: 5000,  description: 'Monthly salary – February', date: d(35) },
    { user: userId, type: 'income', category: 'Salary',     amount: 5000,  description: 'Monthly salary – January',  date: d(65) },
    { user: userId, type: 'income', category: 'Freelance',  amount: 800,   description: 'Web design project',        date: d(10) },
    { user: userId, type: 'income', category: 'Freelance',  amount: 1200,  description: 'Logo design project',       date: d(40) },
    { user: userId, type: 'income', category: 'Investment', amount: 350,   description: 'Dividend payout',           date: d(15) },
    { user: userId, type: 'income', category: 'Investment', amount: 200,   description: 'Stock portfolio gain',      date: d(45) },
    { user: userId, type: 'income', category: 'Business',   amount: 600,   description: 'Online store sales',        date: d(20) },
    { user: userId, type: 'income', category: 'Other Income', amount: 150, description: 'Birthday gift',             date: d(25) },

    // ── Expenses – March ─────────────────────────────────────────────────
    { user: userId, type: 'expense', category: 'Food & Dining',    amount: 120,  description: 'Groceries – SM Supermarket',   date: d(1)  },
    { user: userId, type: 'expense', category: 'Food & Dining',    amount: 45,   description: 'Restaurant – dinner with family', date: d(3)  },
    { user: userId, type: 'expense', category: 'Food & Dining',    amount: 28,   description: 'Coffee shop',                  date: d(4)  },
    { user: userId, type: 'expense', category: 'Transportation',   amount: 60,   description: 'Grab rides – weekly',          date: d(2)  },
    { user: userId, type: 'expense', category: 'Transportation',   amount: 40,   description: 'Gas refill',                   date: d(5)  },
    { user: userId, type: 'expense', category: 'Housing',          amount: 1200, description: 'Monthly rent',                 date: d(1)  },
    { user: userId, type: 'expense', category: 'Utilities',        amount: 85,   description: 'Electricity bill',             date: d(3)  },
    { user: userId, type: 'expense', category: 'Utilities',        amount: 35,   description: 'Internet bill',                date: d(3)  },
    { user: userId, type: 'expense', category: 'Utilities',        amount: 20,   description: 'Water bill',                   date: d(4)  },
    { user: userId, type: 'expense', category: 'Entertainment',    amount: 15,   description: 'Netflix subscription',         date: d(2)  },
    { user: userId, type: 'expense', category: 'Entertainment',    amount: 25,   description: 'Movie tickets',                date: d(6)  },
    { user: userId, type: 'expense', category: 'Shopping',         amount: 150,  description: 'Clothing – online order',      date: d(7)  },
    { user: userId, type: 'expense', category: 'Healthcare',       amount: 200,  description: 'Doctor consultation + meds',   date: d(8)  },
    { user: userId, type: 'expense', category: 'Education',        amount: 80,   description: 'Online course subscription',   date: d(5)  },
    { user: userId, type: 'expense', category: 'Personal Care',    amount: 50,   description: 'Haircut + toiletries',         date: d(9)  },

    // ── Expenses – February ──────────────────────────────────────────────
    { user: userId, type: 'expense', category: 'Food & Dining',    amount: 130,  description: 'Groceries',                    date: d(30) },
    { user: userId, type: 'expense', category: 'Food & Dining',    amount: 60,   description: 'Valentine\'s dinner',          date: d(22) },
    { user: userId, type: 'expense', category: 'Transportation',   amount: 55,   description: 'Grab rides – weekly',          date: d(28) },
    { user: userId, type: 'expense', category: 'Housing',          amount: 1200, description: 'Monthly rent',                 date: d(30) },
    { user: userId, type: 'expense', category: 'Utilities',        amount: 90,   description: 'Electricity bill',             date: d(30) },
    { user: userId, type: 'expense', category: 'Shopping',         amount: 220,  description: 'Electronics – earphones',      date: d(25) },
    { user: userId, type: 'expense', category: 'Entertainment',    amount: 15,   description: 'Netflix subscription',         date: d(30) },
    { user: userId, type: 'expense', category: 'Insurance',        amount: 300,  description: 'Health insurance premium',     date: d(35) },
    { user: userId, type: 'expense', category: 'Savings',          amount: 500,  description: 'Emergency fund transfer',      date: d(32) },
    { user: userId, type: 'expense', category: 'Travel',           amount: 400,  description: 'Weekend trip – Tagaytay',      date: d(23) },

    // ── Expenses – January ───────────────────────────────────────────────
    { user: userId, type: 'expense', category: 'Food & Dining',    amount: 110,  description: 'Groceries',                    date: d(60) },
    { user: userId, type: 'expense', category: 'Transportation',   amount: 65,   description: 'Gas + Grab rides',             date: d(58) },
    { user: userId, type: 'expense', category: 'Housing',          amount: 1200, description: 'Monthly rent',                 date: d(60) },
    { user: userId, type: 'expense', category: 'Utilities',        amount: 95,   description: 'Electricity + internet',       date: d(60) },
    { user: userId, type: 'expense', category: 'Shopping',         amount: 180,  description: 'New Year sale – clothes',      date: d(65) },
    { user: userId, type: 'expense', category: 'Education',        amount: 200,  description: 'Books + study materials',      date: d(62) },
    { user: userId, type: 'expense', category: 'Entertainment',    amount: 15,   description: 'Netflix subscription',         date: d(60) },
    { user: userId, type: 'expense', category: 'Personal Care',    amount: 40,   description: 'Gym membership',               date: d(63) },
    { user: userId, type: 'expense', category: 'Savings',          amount: 500,  description: 'Emergency fund transfer',      date: d(62) },
  ];
};

// ── Main ─────────────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      family: 4,
    });
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});
    console.log('✓ Cleared existing users and transactions');

    // Create users with hashed passwords
    const createdUsers = [];
    for (const u of seedUsers) {
      const salt = await bcrypt.genSalt(12);
      const hashed = await bcrypt.hash(u.password, salt);
      const user = await User.create({ name: u.name, email: u.email, password: hashed });
      createdUsers.push(user);
      console.log(`✓ Created user: ${user.email}`);
    }

    // Create transactions for the first user (Aldrian Loberiano)
    const txns = generateTransactions(createdUsers[0]._id);
    await Transaction.insertMany(txns);
    console.log(`✓ Inserted ${txns.length} transactions for ${createdUsers[0].name}`);

    console.log('\n═══════════════════════════════════════════');
    console.log('  Seed complete! Login credentials:');
    console.log('  Email   : aldrian@costwise.com');
    console.log('  Password: password123');
    console.log('═══════════════════════════════════════════\n');

    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
