import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { MdAdd, MdTrendingUp, MdTrendingDown, MdAccountBalanceWallet } from 'react-icons/md';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const { user } = useAuth();
  const {
    transactions,
    summary,
    loading,
    fetchTransactions,
    fetchSummary,
    addTransaction,
    deleteTransaction,
  } = useTransactions();

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTransactions({ limit: 5 });
    fetchSummary();
  }, [fetchTransactions, fetchSummary]);

  const handleAdd = async (data) => {
    try {
      await addTransaction(data);
      await fetchSummary();
      setShowForm(false);
      toast.success('Transaction added!');
    } catch (error) {
      toast.error('Failed to add transaction');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this transaction?')) {
      try {
        await deleteTransaction(id);
        await fetchSummary();
        toast.success('Transaction deleted');
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

  // Doughnut chart data for category breakdown
  const categoryColors = [
    '#dc2626', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
    '#14b8a6', '#e11d48', '#a855f7',
  ];

  const doughnutData = {
    labels: summary?.categoryBreakdown?.map((c) => c._id) || [],
    datasets: [
      {
        data: summary?.categoryBreakdown?.map((c) => c.total) || [],
        backgroundColor: categoryColors,
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // Bar chart data for monthly trend
  const monthlyData = summary?.monthlyTrend || [];
  const months = [...new Set(monthlyData.map((m) => `${m._id.year}-${String(m._id.month).padStart(2, '0')}`))].sort();
  const barData = {
    labels: months.map((m) => {
      const [year, month] = m.split('-');
      return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }),
    datasets: [
      {
        label: 'Income',
        data: months.map((m) => {
          const [year, month] = m.split('-');
          const found = monthlyData.find(
            (d) => d._id.year === parseInt(year) && d._id.month === parseInt(month) && d._id.type === 'income'
          );
          return found?.total || 0;
        }),
        backgroundColor: '#10b981',
        borderRadius: 4,
      },
      {
        label: 'Expenses',
        data: months.map((m) => {
          const [year, month] = m.split('-');
          const found = monthlyData.find(
            (d) => d._id.year === parseInt(year) && d._id.month === parseInt(month) && d._id.type === 'expense'
          );
          return found?.total || 0;
        }),
        backgroundColor: '#ef4444',
        borderRadius: 4,
      },
    ],
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Welcome, {user?.name?.split(' ')[0]}!</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <MdAdd /> Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-card-icon income">
            <MdTrendingUp />
          </div>
          <div className="summary-card-info">
            <h3>Total Income</h3>
            <p>{formatCurrency(summary?.totalIncome)}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-card-icon expense">
            <MdTrendingDown />
          </div>
          <div className="summary-card-info">
            <h3>Total Expenses</h3>
            <p>{formatCurrency(summary?.totalExpenses)}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-card-icon balance">
            <MdAccountBalanceWallet />
          </div>
          <div className="summary-card-info">
            <h3>Balance</h3>
            <p>{formatCurrency(summary?.balance)}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      {summary && (summary.categoryBreakdown?.length > 0 || monthlyData.length > 0) && (
        <div className="charts-grid">
          {summary.categoryBreakdown?.length > 0 && (
            <div className="chart-card">
              <h3>Expense Categories</h3>
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  plugins: { legend: { position: 'bottom', labels: { padding: 16 } } },
                }}
              />
            </div>
          )}
          {months.length > 0 && (
            <div className="chart-card">
              <h3>Monthly Trend</h3>
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
          )}
        </div>
      )}

      {/* Recent Transactions */}
      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Recent Transactions</h3>
        {loading ? (
          <div className="spinner" />
        ) : (
          <TransactionList
            transactions={transactions}
            onEdit={() => {}}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Add Transaction Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Transaction</h2>
            <TransactionForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
