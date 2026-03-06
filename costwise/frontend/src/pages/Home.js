import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  MdChevronLeft,
  MdChevronRight,
  MdStar,
  MdStarHalf,
  MdKeyboardArrowDown,
  MdTrackChanges,
  MdInsights,
  MdShield,
  MdAccountBalanceWallet,
  MdShowChart,
  MdPayment,
} from 'react-icons/md';

const features = [
  { icon: <MdTrendingUp />, title: 'Income Tracking', desc: 'Monitor all your income sources in one organized view with categories and trends.' },
  { icon: <MdReceipt />, title: 'Expense Management', desc: 'Log every expense, categorize spending, and stay on top of your budget.' },
  { icon: <MdPieChart />, title: 'Visual Reports', desc: 'Beautiful charts and graphs that make understanding your finances effortless.' },
  { icon: <MdBarChart />, title: 'Monthly Trends', desc: 'See how your spending evolves month-to-month with detailed trend analysis.' },
  { icon: <MdSavings />, title: 'Budget Goals', desc: 'Set spending limits per category and track progress with visual indicators.' },
  { icon: <MdFileDownload />, title: 'Export to CSV', desc: 'Download your transaction data as CSV for offline analysis or record-keeping.' },
  { icon: <MdSearch />, title: 'Smart Search', desc: 'Quickly find any transaction with powerful search and date range filters.' },
  { icon: <MdFilterList />, title: 'Advanced Filters', desc: 'Filter by type, category, and date range to see exactly what you need.' },
  { icon: <MdDarkMode />, title: 'Dark Mode', desc: 'Easy on the eyes with a beautiful dark theme you can toggle anytime.' },
  { icon: <MdSecurity />, title: 'Secure & Private', desc: 'Your data is encrypted and protected with industry-standard JWT authentication.' },
  { icon: <MdDevices />, title: 'Works Everywhere', desc: 'Responsive design that works seamlessly on desktop, tablet, and mobile.' },
];

const CARDS_PER_VIEW = 4;

const reviews = [
  { name: 'Maria Santos', role: 'Freelancer', rating: 5, text: 'CostWise completely changed how I manage my freelance income. The visual reports make it so easy to see where my money goes each month!' },
  { name: 'Carlos Reyes', role: 'Small Business Owner', rating: 5, text: 'Finally, a budget tracker that actually works for me. The budget goals feature keeps me on track, and the CSV export is a lifesaver for tax season.' },
  { name: 'Angela Cruz', role: 'College Student', rating: 4.5, text: 'As a student on a tight budget, CostWise helps me track every peso. The dark mode is a nice touch for late-night budgeting!' },
  { name: 'James Dela Cruz', role: 'Software Engineer', rating: 5, text: 'Clean interface, fast performance, and all the features I need. The monthly trends chart really opened my eyes to my spending habits.' },
  { name: 'Patricia Lim', role: 'Teacher', rating: 4.5, text: 'I love how simple and intuitive CostWise is. Setting budget goals per category has helped me save more than I ever thought possible.' },
  { name: 'Rico Mendoza', role: 'Marketing Manager', rating: 5, text: 'The search and filter features are incredibly powerful. I can find any transaction in seconds. Highly recommend to anyone serious about budgeting!' },
];

const faqs = [
  { q: 'Is CostWise really free to use?', a: 'Yes! CostWise is 100% free. All features including budget goals, reports, CSV export, and dark mode are available at no cost.' },
  { q: 'How secure is my financial data?', a: 'Your data is protected with industry-standard JWT authentication and encrypted passwords. We never share your information with third parties.' },
  { q: 'Can I use CostWise on my phone?', a: 'Absolutely! CostWise is fully responsive and works beautifully on desktop, tablet, and mobile devices.' },
  { q: 'How do I set budget goals?', a: 'Navigate to the Budget Goals page from the sidebar, click "Add Budget", select a category, set your spending limit, and CostWise will track your progress automatically.' },
  { q: 'Can I export my transaction data?', a: 'Yes! You can export all your transactions as a CSV file from the Transactions page. Perfect for record-keeping or further analysis in spreadsheet software.' },
  { q: 'Does CostWise support Philippine Peso?', a: 'Yes! CostWise is designed with Philippine Peso (₱) as the default currency throughout all pages, reports, and exports.' },
];

const Home = () => {
  const { user } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const carouselRef = useRef(null);

  const totalSlides = Math.ceil(features.length / CARDS_PER_VIEW);
  const nextSlide = useCallback(() => setCarouselIndex((i) => (i + 1) % totalSlides), [totalSlides]);
  const prevSlide = () => setCarouselIndex((i) => (i - 1 + totalSlides) % totalSlides);

  // Auto-play carousel every 4 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) stars.push(<MdStar key={i} />);
      else if (i - 0.5 <= rating) stars.push(<MdStarHalf key={i} />);
    }
    return stars;
  };

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
        {/* Floating theme icons */}
        <div className="home-floating-icons" aria-hidden="true">
          <div className="floating-icon fi-1"><MdAccountBalanceWallet /></div>
          <div className="floating-icon fi-2"><MdShowChart /></div>
          <div className="floating-icon fi-3"><MdPieChart /></div>
          <div className="floating-icon fi-4"><MdSavings /></div>
          <div className="floating-icon fi-5"><MdPayment /></div>
          <div className="floating-icon fi-6"><MdTrendingUp /></div>
        </div>
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

      {/* Features Carousel */}
      <section className="home-features" id="features">
        <h2>Everything you need to manage your money</h2>
        <p className="home-features-subtitle">
          Simple, powerful tools to help you reach your financial goals.
        </p>
        <div className="carousel-container" ref={carouselRef}>
          <button className="carousel-btn prev" onClick={prevSlide} aria-label="Previous features">
            <MdChevronLeft />
          </button>
          <div className="carousel-track-wrapper">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIdx) => (
                <div className="carousel-slide" key={slideIdx}>
                  {features
                    .slice(slideIdx * CARDS_PER_VIEW, slideIdx * CARDS_PER_VIEW + CARDS_PER_VIEW)
                    .map((f, i) => (
                      <div className="home-feature-card" key={i}>
                        <div className="home-feature-icon">{f.icon}</div>
                        <h3>{f.title}</h3>
                        <p>{f.desc}</p>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
          <button className="carousel-btn next" onClick={nextSlide} aria-label="Next features">
            <MdChevronRight />
          </button>
        </div>
        <div className="carousel-dots">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === carouselIndex ? 'active' : ''}`}
              onClick={() => setCarouselIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* How CostWise Helps */}
      <section className="home-helps">
        <div className="home-helps-inner">
          <h2>How CostWise <span>Helps You</span></h2>
          <p className="home-helps-subtitle">
            More than just a tracker — CostWise is your personal finance companion.
          </p>
          <div className="home-helps-grid">
            <div className="home-helps-card">
              <div className="home-helps-icon">
                <MdTrackChanges />
              </div>
              <h3>Stay on Track</h3>
              <p>Set monthly budgets per category. Get visual progress bars that show you exactly how much you've spent and how much is left — no more guesswork.</p>
            </div>
            <div className="home-helps-card">
              <div className="home-helps-icon">
                <MdInsights />
              </div>
              <h3>Understand Your Habits</h3>
              <p>Beautiful charts break down your spending patterns by category and month. Spot trends, identify problem areas, and make data-driven financial decisions.</p>
            </div>
            <div className="home-helps-card">
              <div className="home-helps-icon">
                <MdShield />
              </div>
              <h3>Save With Confidence</h3>
              <p>See your net savings grow over time with real-time calculations. CostWise motivates you to save more by showing every peso you keep in your pocket.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews / Testimonials */}
      <section className="home-reviews">
        <div className="home-reviews-inner">
          <h2>What Our Users <span>Say</span></h2>
          <p className="home-reviews-subtitle">
            Thousands of Filipinos trust CostWise to manage their daily finances.
          </p>
          <div className="home-reviews-grid">
            {reviews.map((r, i) => (
              <div className="home-review-card" key={i}>
                <div className="home-review-stars">{renderStars(r.rating)}</div>
                <p className="home-review-text">"{r.text}"</p>
                <div className="home-review-author">
                  <div className="home-review-avatar">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="home-review-name">{r.name}</p>
                    <p className="home-review-role">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="home-faq">
        <div className="home-faq-inner">
          <h2>Frequently Asked <span>Questions</span></h2>
          <p className="home-faq-subtitle">
            Got questions? We've got answers.
          </p>
          <div className="home-faq-list">
            {faqs.map((faq, i) => (
              <div
                className={`home-faq-item ${openFaq === i ? 'open' : ''}`}
                key={i}
              >
                <button
                  className="home-faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <MdKeyboardArrowDown className="home-faq-arrow" />
                </button>
                <div className="home-faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
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
