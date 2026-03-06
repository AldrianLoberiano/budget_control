import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  MdTrendingUp,
  MdPieChart,
  MdSecurity,
  MdDevices,
  MdReceipt,
  MdBarChart,
  MdSavings,
  MdFileDownload,
  MdDarkMode,
  MdLightMode,
  MdSearch,
  MdFilterList,
} from 'react-icons/md';

const Home = () => {
  const { user } = useAuth();
  const { dark, toggleTheme } = useTheme();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="home-nav">
        <div className="home-nav-inner">
          <div className="home-logo">
            Cost<span>Wise</span>
          </div>
          <div className="home-nav-links">
            <button className="btn btn-icon-round" onClick={toggleTheme} title="Toggle theme">
              {dark ? <MdLightMode /> : <MdDarkMode />}
            </button>
            <Link to="/login" className="btn btn-outline">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-content">
          <h1>Take Control of Your <span>Finances</span></h1>
          <p>
            Track income, manage expenses, and visualize your spending habits
            with powerful charts and reports — all in one place.
          </p>
          <div className="home-hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Free
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Sign In
            </Link>
          </div>
          <div className="home-hero-stats">
            <div className="home-stat">
              <strong>100%</strong>
              <span>Free to Use</span>
            </div>
            <div className="home-stat-divider" />
            <div className="home-stat">
              <strong>Real-time</strong>
              <span>Dashboard</span>
            </div>
            <div className="home-stat-divider" />
            <div className="home-stat">
              <strong>Secure</strong>
              <span>Encryption</span>
            </div>
          </div>
        </div>
        <div className="home-hero-visual">
          <div className="home-preview-card">
            <div className="home-preview-header">
              <div className="home-preview-dot red" />
              <div className="home-preview-dot yellow" />
              <div className="home-preview-dot green" />
            </div>
            <div className="home-preview-body">
              <div className="home-preview-row">
                <div className="home-preview-label">Total Balance</div>
                <div className="home-preview-value">₱12,450.00</div>
              </div>
              <div className="home-preview-bars">
                <div className="home-preview-bar income" style={{ width: '75%' }}>Income</div>
                <div className="home-preview-bar expense" style={{ width: '45%' }}>Expenses</div>
                <div className="home-preview-bar savings" style={{ width: '30%' }}>Savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="home-features" id="features">
        <h2>Everything you need to manage your money</h2>
        <p className="home-features-subtitle">
          Simple, powerful tools to help you reach your financial goals.
        </p>
        <div className="home-features-grid">
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <MdTrendingUp />
            </div>
            <h3>Income Tracking</h3>
            <p>Monitor all your income sources in one organized view with categories and trends.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <MdReceipt />
            </div>
            <h3>Expense Management</h3>
            <p>Log every expense, categorize spending, and stay on top of your budget.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <MdPieChart />
            </div>
            <h3>Visual Reports</h3>
            <p>Beautiful charts and graphs that make understanding your finances effortless.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <MdBarChart />
            </div>
            <h3>Monthly Trends</h3>
            <p>See how your spending evolves month-to-month with detailed trend analysis.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <MdSavings />
            </div>
            <h3>Budget Goals</h3>
            <p>Set spending limits per category and track progress with visual indicators.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <MdFileDownload />
            </div>
            <h3>Export to CSV</h3>
            <p>Download your transaction data as CSV for offline analysis or record-keeping.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <MdSearch />
            </div>
            <h3>Smart Search</h3>
            <p>Quickly find any transaction with powerful search and date range filters.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <MdFilterList />
            </div>
            <h3>Advanced Filters</h3>
            <p>Filter by type, category, and date range to see exactly what you need.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <MdDarkMode />
            </div>
            <h3>Dark Mode</h3>
            <p>Easy on the eyes with a beautiful dark theme you can toggle anytime.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <MdSecurity />
            </div>
            <h3>Secure & Private</h3>
            <p>Your data is encrypted and protected with industry-standard JWT authentication.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <MdDevices />
            </div>
            <h3>Works Everywhere</h3>
            <p>Responsive design that works seamlessly on desktop, tablet, and mobile.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <h2>Ready to take control?</h2>
        <p>Join CostWise today and start making smarter financial decisions.</p>
        <Link to="/register" className="btn btn-primary btn-lg">
          Create Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-inner">
          <div className="home-logo">Cost<span>Wise</span></div>
          <p>&copy; {new Date().getFullYear()} CostWise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
