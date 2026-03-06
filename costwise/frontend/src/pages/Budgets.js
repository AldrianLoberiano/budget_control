import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../components/Layout';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { MdAdd, MdDelete, MdSavings } from 'react-icons/md';

const categories = [
  'Food', 'Transport', 'Entertainment', 'Shopping', 'Bills',
  'Health', 'Education', 'Travel', 'Salary', 'Freelance',
  'Investment', 'Other',
];

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: '', limit: '', period: 'monthly' });

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/budgets');
      setBudgets(data);
    } catch {
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.limit) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await API.post('/budgets', {
        category: form.category,
        limit: parseFloat(form.limit),
        period: form.period,
      });
      toast.success('Budget goal saved!');
      setForm({ category: '', limit: '', period: 'monthly' });
      setShowForm(false);
      fetchBudgets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save budget');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this budget goal?')) return;
    try {
      await API.delete(`/budgets/${id}`);
      toast.success('Budget goal removed');
      fetchBudgets();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const getBarColor = (pct) => {
    if (pct >= 100) return '#dc2626';
    if (pct >= 75) return '#f59e0b';
    return '#22c55e';
  };

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + (b.spent || 0), 0);

  return (
    <Layout>
      <div className="page-header">
        <h1>Budget Goals</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <MdAdd /> Set Budget
        </button>
      </div>

      {/* Summary Cards */}
      <div className="budget-summary">
        <div className="card budget-summary-card">
          <span className="budget-summary-label">Total Budget</span>
          <span className="budget-summary-value">${totalLimit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="card budget-summary-card">
          <span className="budget-summary-label">Total Spent</span>
          <span className="budget-summary-value" style={{ color: totalSpent > totalLimit ? '#dc2626' : undefined }}>
            ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="card budget-summary-card">
          <span className="budget-summary-label">Remaining</span>
          <span className="budget-summary-value" style={{ color: totalLimit - totalSpent < 0 ? '#dc2626' : '#22c55e' }}>
            ${(totalLimit - totalSpent).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Budget List */}
      <div className="card">
        {loading ? (
          <div className="spinner" />
        ) : budgets.length === 0 ? (
          <div className="budget-empty">
            <MdSavings size={48} color="#d1d5db" />
            <p>No budget goals yet. Set one to start tracking your spending!</p>
          </div>
        ) : (
          <div className="budget-list">
            {budgets.map((b) => {
              const pct = Math.min(Math.round(b.percentage || 0), 100);
              const over = (b.spent || 0) > b.limit;
              return (
                <div key={b._id} className={`budget-item ${over ? 'over' : ''}`}>
                  <div className="budget-item-header">
                    <div>
                      <span className="budget-category">{b.category}</span>
                      <span className="budget-period">{b.period}</span>
                    </div>
                    <button className="btn-icon" onClick={() => handleDelete(b._id)} title="Delete">
                      <MdDelete />
                    </button>
                  </div>
                  <div className="budget-progress-row">
                    <div className="budget-progress-bar">
                      <div
                        className="budget-progress-fill"
                        style={{ width: `${pct}%`, background: getBarColor(b.percentage || 0) }}
                      />
                    </div>
                    <span className="budget-pct">{Math.round(b.percentage || 0)}%</span>
                  </div>
                  <div className="budget-item-footer">
                    <span>${(b.spent || 0).toFixed(2)} spent</span>
                    <span>${b.limit.toFixed(2)} limit</span>
                    <span style={{ color: over ? '#dc2626' : '#22c55e', fontWeight: 600 }}>
                      ${(b.remaining ?? b.limit).toFixed(2)} left
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Set Budget Goal</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Spending Limit ($)</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.limit}
                  onChange={(e) => setForm((f) => ({ ...f, limit: e.target.value }))}
                  placeholder="e.g. 500"
                  required
                />
              </div>
              <div className="form-group">
                <label>Period</label>
                <select
                  value={form.period}
                  onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Budgets;
