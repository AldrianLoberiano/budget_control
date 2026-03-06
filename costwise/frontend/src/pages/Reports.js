import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import { useTransactions } from '../context/TransactionContext';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Filler
);

const Reports = () => {
  const { summary, fetchSummary } = useTransactions();

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

  if (!summary) {
    return (
      <Layout>
        <div className="spinner" />
      </Layout>
    );
  }

  const categoryColors = [
    '#dc2626', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
    '#14b8a6', '#e11d48', '#a855f7',
  ];

  // Category Doughnut
  const categoryData = {
    labels: summary.categoryBreakdown?.map((c) => c._id) || [],
    datasets: [
      {
        data: summary.categoryBreakdown?.map((c) => c.total) || [],
        backgroundColor: categoryColors,
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // Monthly Trend
  const monthlyData = summary.monthlyTrend || [];
  const months = [...new Set(monthlyData.map((m) => `${m._id.year}-${String(m._id.month).padStart(2, '0')}`))].sort();
  const monthLabels = months.map((m) => {
    const [year, month] = m.split('-');
    return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  });

  const getMonthlyValues = (type) =>
    months.map((m) => {
      const [year, month] = m.split('-');
      const found = monthlyData.find(
        (d) => d._id.year === parseInt(year) && d._id.month === parseInt(month) && d._id.type === type
      );
      return found?.total || 0;
    });

  const barData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Income',
        data: getMonthlyValues('income'),
        backgroundColor: '#10b981',
        borderRadius: 4,
      },
      {
        label: 'Expenses',
        data: getMonthlyValues('expense'),
        backgroundColor: '#ef4444',
        borderRadius: 4,
      },
    ],
  };

  // Net savings line chart
  const incomeVals = getMonthlyValues('income');
  const expenseVals = getMonthlyValues('expense');
  const netSavings = incomeVals.map((inc, i) => inc - expenseVals[i]);

  const lineData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Net Savings',
        data: netSavings,
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#dc2626',
      },
    ],
  };

  // Income vs Expense Doughnut
  const overviewData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [summary.totalIncome || 0, summary.totalExpenses || 0],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Financial Reports</h1>
      </div>

      {/* Summary Stats */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-card-info">
            <h3>Total Income</h3>
            <p style={{ color: '#10b981' }}>{formatCurrency(summary.totalIncome)}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-card-info">
            <h3>Total Expenses</h3>
            <p style={{ color: '#ef4444' }}>{formatCurrency(summary.totalExpenses)}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-card-info">
            <h3>Net Balance</h3>
            <p style={{ color: summary.balance >= 0 ? '#10b981' : '#ef4444' }}>
              {formatCurrency(summary.balance)}
            </p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-card-info">
            <h3>Total Transactions</h3>
            <p>{(summary.incomeCount || 0) + (summary.expenseCount || 0)}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Income vs Expenses</h3>
          <Doughnut
            data={overviewData}
            options={{
              responsive: true,
              plugins: { legend: { position: 'bottom' } },
            }}
          />
        </div>

        {summary.categoryBreakdown?.length > 0 && (
          <div className="chart-card">
            <h3>Expense by Category</h3>
            <Doughnut
              data={categoryData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'bottom', labels: { padding: 12 } } },
              }}
            />
          </div>
        )}
      </div>

      {months.length > 0 && (
        <div className="charts-grid" style={{ marginTop: 0 }}>
          <div className="chart-card">
            <h3>Monthly Income vs Expenses</h3>
            <Bar
              data={barData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'bottom' } },
                scales: {
                  y: { beginAtZero: true, ticks: { callback: (v) => '$' + v } },
                },
              }}
            />
          </div>

          <div className="chart-card">
            <h3>Net Savings Trend</h3>
            <Line
              data={lineData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'bottom' } },
                scales: {
                  y: { ticks: { callback: (v) => '$' + v } },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Category Table */}
      {summary.categoryBreakdown?.length > 0 && (
        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Expense Breakdown by Category</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6b7280', fontSize: '0.85rem' }}>
                  Category
                </th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: '#6b7280', fontSize: '0.85rem' }}>
                  Amount
                </th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: '#6b7280', fontSize: '0.85rem' }}>
                  Transactions
                </th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: '#6b7280', fontSize: '0.85rem' }}>
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody>
              {summary.categoryBreakdown.map((cat, idx) => (
                <tr key={cat._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: categoryColors[idx % categoryColors.length],
                        display: 'inline-block',
                      }}
                    />
                    {cat._id}
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 600 }}>
                    {formatCurrency(cat.total)}
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px 12px', color: '#6b7280' }}>
                    {cat.count}
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px 12px', color: '#6b7280' }}>
                    {summary.totalExpenses
                      ? ((cat.total / summary.totalExpenses) * 100).toFixed(1)
                      : 0}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default Reports;
