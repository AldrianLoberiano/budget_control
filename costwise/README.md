# CostWise - Expense Tracker

A full-stack MERN (MongoDB, Express.js, React, Node.js) web application for tracking personal income and expenses with financial dashboards and reports.

## Features

- **User Authentication** — Secure registration & login with JWT tokens and bcrypt password hashing
- **Transaction Management** — Add, edit, and delete income/expense transactions
- **Categorization** — Organize transactions with predefined categories for income and expenses
- **Dashboard** — View total income, total expenses, and current balance at a glance
- **Data Visualization** — Interactive charts (Doughnut, Bar, Line) showing spending patterns and monthly trends
- **Reports** — Detailed financial reports with category breakdowns, net savings trends, and percentage analysis
- **Transaction History** — Paginated, filterable list of all transactions
- **Responsive Design** — Works on desktop, tablet, and mobile

## Tech Stack

| Layer    | Technology                       |
| -------- | -------------------------------- |
| Frontend | React 18, React Router, Chart.js |
| Backend  | Node.js, Express.js              |
| Database | MongoDB with Mongoose ODM        |
| Auth     | JWT + bcryptjs                   |
| Styling  | Custom CSS (no framework)        |

## Project Structure

```
costwise/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, login, profile
│   │   └── transactionController.js  # CRUD + summary aggregation
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── User.js               # User schema with password hashing
│   │   └── Transaction.js        # Transaction schema with indexing
│   ├── routes/
│   │   ├── auth.js               # Auth routes with validation
│   │   └── transactions.js       # Transaction routes with validation
│   ├── server.js                 # Express server entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js         # App shell with sidebar
│   │   │   ├── PrivateRoute.js   # Auth guard
│   │   │   ├── Sidebar.js        # Navigation sidebar
│   │   │   ├── TransactionForm.js    # Add/Edit transaction form
│   │   │   └── TransactionList.js    # Transaction display list
│   │   ├── context/
│   │   │   ├── AuthContext.js    # Authentication state management
│   │   │   └── TransactionContext.js # Transaction state management
│   │   ├── pages/
│   │   │   ├── Dashboard.js      # Main dashboard with summary & charts
│   │   │   ├── Login.js          # Login page
│   │   │   ├── Register.js       # Registration page
│   │   │   ├── Reports.js        # Detailed financial reports
│   │   │   └── Transactions.js   # Transaction management page
│   │   ├── utils/
│   │   │   └── api.js            # Axios instance with interceptors
│   │   ├── App.js                # Root component with routing
│   │   ├── index.js              # React entry point
│   │   └── index.css             # Global styles
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** running locally or a MongoDB Atlas connection string
- **npm** or **yarn**

### 1. Clone & Setup Backend

```bash
cd costwise/backend
cp .env.example .env
```

Edit `.env` with your values:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/costwise
JWT_SECRET=your_secure_random_secret_here
```

Install dependencies and start:

```bash
npm install
npm run dev
```

The API server starts on `http://localhost:5000`.

### 2. Setup Frontend

```bash
cd costwise/frontend
npm install
npm start
```

The React app starts on `http://localhost:3000` and proxies API requests to the backend.

## API Endpoints

### Authentication

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| POST   | /api/auth/register | Register new user |
| POST   | /api/auth/login    | Login user        |
| GET    | /api/auth/me       | Get user profile  |

### Transactions (Protected)

| Method | Endpoint                  | Description           |
| ------ | ------------------------- | --------------------- |
| GET    | /api/transactions         | Get all transactions  |
| POST   | /api/transactions         | Add transaction       |
| PUT    | /api/transactions/:id     | Update transaction    |
| DELETE | /api/transactions/:id     | Delete transaction    |
| GET    | /api/transactions/summary | Get financial summary |

## Expense Categories

**Income:** Salary, Freelance, Business, Investment, Rental, Other Income

**Expense:** Food & Dining, Transportation, Housing, Utilities, Healthcare, Entertainment, Shopping, Education, Travel, Personal Care, Insurance, Savings, Other
