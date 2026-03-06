# CostWise - Budget & Expense Tracker

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=flat-square&logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens)
![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?style=flat-square&logo=chart.js)
![React Router](https://img.shields.io/badge/React_Router-6.x-CA4245?style=flat-square&logo=react-router)


A full-stack MERN (MongoDB, Express.js, React, Node.js) web application for tracking personal income and expenses, managing budgets, and visualizing financial data through dashboards and reports.

## Features

- **User Authentication** — Secure registration & login with JWT tokens and bcrypt password hashing
- **Transaction Management** — Add, edit, and delete income/expense transactions
- **Budget Management** — Create and monitor category budgets with progress indicators
- **Categorization** — Organize transactions with predefined categories for income and expenses
- **Dashboard** — View total income, total expenses, and current balance at a glance
- **Data Visualization** — Interactive charts (Doughnut, Bar, Line) showing spending patterns and monthly trends
- **Reports** — Detailed financial reports with category breakdowns, net savings trends, and percentage analysis
- **Transaction History** — Paginated list of all transactions with type, category, and date range filters
- **Smart Search** — Instantly search transactions by description or category
- **CSV Export** — Download filtered transaction data as a CSV file for offline analysis or record-keeping
- **Live API Status Bar** — Real-time overlay showing API request method, URL, status code, and response time
- **Theme Support** — Light and dark mode toggle with preference saved to localStorage
- **Responsive Design** — Works on desktop, tablet, and mobile

## Tech Stack

| Layer    | Technology                                          |
| -------- | --------------------------------------------------- |
| Frontend | React 18, React Router v6, Chart.js, React Toastify |
| Backend  | Node.js, Express.js, express-validator              |
| Database | MongoDB with Mongoose ODM                           |
| Auth     | JWT + bcryptjs                                      |
| Styling  | Custom CSS (no framework)                           |

## Architecture

CostWise follows a classic **3-tier MERN architecture** with a clear separation between the presentation layer, business logic, and data storage.

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  React 18 Application                    │  │
│  │                                                          │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │  │
│  │  │   Context   │  │    Pages     │  │  Components   │  │  │
│  │  │ AuthContext │  │  Dashboard   │  │  Sidebar      │  │  │
│  │  │ ThemeContext│  │  Transactions│  │  AppHeader    │  │  │
│  │  │ Transaction │  │  Budgets     │  │  TransactionForm  │  │
│  │  │ Context     │  │  Reports     │  │  ApiStatusBar │  │  │
│  │  └──────┬──────┘  └──────────────┘  └───────────────┘  │  │
│  │         │                                                  │  │
│  │  ┌──────▼──────────────────────────────────────────────┐  │  │
│  │  │         Axios Instance  (utils/api.js)              │  │  │
│  │  │  • Attaches JWT Bearer token on every request       │  │  │
│  │  │  • Measures response time & fires api-status events │  │  │
│  │  │  • Auto-redirects to /login on 401 responses        │  │  │
│  │  └──────────────────────┬──────────────────────────────┘  │  │
│  └─────────────────────────│──────────────────────────────────┘  │
└────────────────────────────│────────────────────────────────────┘
                             │  HTTP / JSON  (port 3000 → 5000)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS API SERVER (port 5000)               │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     Middleware Layer                     │  │
│  │   CORS  │  express.json()  │  Request Logger             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                   │
│  ┌──────────────────────────▼──────────────────────────────┐   │
│  │                       Routes                            │   │
│  │   /api/auth          /api/transactions    /api/budgets  │   │
│  └──────┬───────────────────────┬──────────────────┬───────┘   │
│         │                       │                  │            │
│  ┌──────▼──────┐  ┌─────────────▼────┐  ┌─────────▼────────┐  │
│  │    Auth     │  │   Transaction    │  │     Budget       │  │
│  │ Controller  │  │   Controller     │  │   Controller     │  │
│  │  register   │  │  CRUD + summary  │  │  CRUD + progress │  │
│  │  login      │  │  aggregation     │  │  tracking        │  │
│  │  getMe      │  │  CSV export      │  └──────────────────┘  │
│  └──────┬──────┘  └──────────────────┘                        │
│         │                                                       │
│  ┌──────▼──────────────────────────────────────────────────┐   │
│  │               JWT Auth Middleware (auth.js)             │   │
│  │   Verifies Bearer token → attaches req.user             │   │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Mongoose Models                       │  │
│  │    User.js   │   Transaction.js   │   Budget.js          │  │
│  └──────────────────────────┬───────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
                              │  Mongoose ODM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MongoDB                                 │
│                                                                 │
│   ┌──────────────┐   ┌───────────────────┐   ┌──────────────┐  │
│   │  users       │   │   transactions    │   │   budgets    │  │
│   │  collection  │   │   collection      │   │  collection  │  │
│   └──────────────┘   └───────────────────┘   └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Auth flow** — User submits credentials → Express validates → bcryptjs compares hashed password → JWT signed with `JWT_SECRET` → token stored in `localStorage` → attached as `Authorization: Bearer <token>` on every subsequent request.
2. **Protected request flow** — Axios attaches JWT → Express `auth` middleware verifies token → `req.user` populated → controller executes business logic → Mongoose queries MongoDB → JSON response returned.
3. **State management** — `AuthContext` holds user session, `TransactionContext` holds fetched transactions and summary, `ThemeContext` persists light/dark preference in `localStorage`.
4. **Real-time API feedback** — Axios interceptors emit a `CustomEvent` (`api-status`) after every request; `ApiStatusBar` listens and renders the last 8 calls with method, URL, status code, and duration.

## Project Structure

```
costwise/
├── .gitignore                              # Root-level git ignore rules
├── README.md
├── backend/
│   ├── config/
│   │   └── db.js                          # MongoDB connection with retry logic
│   ├── controllers/
│   │   ├── authController.js              # Register, login, get profile
│   │   ├── budgetController.js            # Budget CRUD + progress tracking
│   │   └── transactionController.js       # Transaction CRUD, summary aggregation, CSV export
│   ├── data/
│   │   ├── transactions.json              # Seed transaction data
│   │   └── users.json                     # Seed user data
│   ├── middleware/
│   │   └── auth.js                        # JWT Bearer token verification
│   ├── models/
│   │   ├── Budget.js                      # Budget schema (category, limit, period)
│   │   ├── Transaction.js                 # Transaction schema with indexing
│   │   └── User.js                        # User schema with bcrypt password hashing
│   ├── routes/
│   │   ├── auth.js                        # POST /register, POST /login, GET /me
│   │   ├── budgets.js                     # CRUD /api/budgets
│   │   └── transactions.js                # CRUD /api/transactions + /summary + /export
│   ├── seed.js                            # Database seeding script
│   ├── server.js                          # Express app entry point
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example                       # Environment variable template (safe to commit)
└── frontend/
    ├── public/
    │   └── index.html                     # HTML entry point
    ├── src/
    │   ├── components/
    │   │   ├── ApiStatusBar.js            # Live API request log overlay
    │   │   ├── AppHeader.js               # Top navigation bar with theme toggle
    │   │   ├── Layout.js                  # App shell wrapping Sidebar + AppHeader
    │   │   ├── PrivateRoute.js            # Auth guard — redirects to /login if unauthenticated
    │   │   ├── Sidebar.js                 # Navigation sidebar with route links
    │   │   ├── TransactionForm.js         # Add / Edit transaction form
    │   │   └── TransactionList.js         # Paginated, sortable transaction table
    │   ├── context/
    │   │   ├── AuthContext.js             # User session state + login/logout helpers
    │   │   ├── ThemeContext.js            # Light/dark theme state persisted in localStorage
    │   │   └── TransactionContext.js      # Transactions, summary, pagination state
    │   ├── pages/
    │   │   ├── Budgets.js                 # Budget goals — create, track progress, delete
    │   │   ├── Dashboard.js               # Summary cards + Doughnut & Bar charts
    │   │   ├── Home.js                    # Public landing page with features & reviews
    │   │   ├── Login.js                   # Login page
    │   │   ├── Register.js                # Registration page
    │   │   ├── Reports.js                 # Category Doughnut, Bar, and Line trend charts
    │   │   └── Transactions.js            # Full transaction list with search, filter & CSV export
    │   ├── utils/
    │   │   └── api.js                     # Axios instance — JWT injection, status events, 401 redirect
    │   ├── App.js                         # Root component with React Router routes
    │   ├── index.js                       # React DOM entry point
    │   └── index.css                      # Global CSS variables and base styles
    ├── package.json
    ├── package-lock.json
    └── .env.example                       # Frontend environment variable template (safe to commit)
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

Edit `.env` with your actual values (never commit this file):

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/costwise
JWT_SECRET=your_secure_random_secret_here
```

> **Security:** Generate a strong `JWT_SECRET` using `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`.

Install dependencies and start:

```bash
npm install
npm run dev
```

The API server starts on `http://localhost:5000`.

### 2. Setup Frontend

```bash
cd costwise/frontend
cp .env.example .env
```

Edit `.env` with your values (optional — defaults work for local dev):

```
REACT_APP_API_URL=http://localhost:5000
```

Install dependencies and start:

```bash
npm install
npm start
```

The React app starts on `http://localhost:3000` and proxies API requests to the backend.

### 3. Seed Demo Data (Optional)

```bash
cd costwise/backend
node seed.js
```

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

### Budgets (Protected)

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| GET    | /api/budgets     | Get all budgets |
| POST   | /api/budgets     | Create budget   |
| PUT    | /api/budgets/:id | Update budget   |
| DELETE | /api/budgets/:id | Delete budget   |

### System

| Method | Endpoint    | Description  |
| ------ | ----------- | ------------ |
| GET    | /api/health | Health check |

## Expense Categories

**Income:** Salary, Freelance, Business, Investment, Rental, Other Income

**Expense:** Food & Dining, Transportation, Housing, Utilities, Healthcare, Entertainment, Shopping, Education, Travel, Personal Care, Insurance, Savings, Other

## Security

- All `.env` files are listed in `.gitignore` and must **never** be committed
- Use `.env.example` files as templates — they contain placeholder values only
- The `JWT_SECRET` must be a long, cryptographically random string in production
- Passwords are hashed with bcryptjs before storage; plain-text passwords are never saved
- All transaction and budget routes require a valid JWT Bearer token

## Demo Login Credentials

After running the seed script (`node seed.js`), use these accounts to log in:

| Name              | Email                | Password    | Role                                                   |
| ----------------- | -------------------- | ----------- | ------------------------------------------------------ |
| Aldrian Loberiano | aldrian@costwise.com | password123 | Demo user with full transaction history (Jan–Mar 2026) |

> **Note:** You can also register a brand new account from the Sign Up page. The seed data is only for demo/testing purposes.

## License

MIT License

Copyright (c) 2026 Aldrian Loberiano

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
