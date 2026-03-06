import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { useTransactions } from '../context/TransactionContext';
import { toast } from 'react-toastify';
import { MdAdd } from 'react-icons/md';

const Transactions = () => {
  const {
    transactions,
    pagination,
    loading,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    fetchSummary,
  } = useTransactions();

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({ type: '', category: '', page: 1 });

  useEffect(() => {
    const params = { limit: 20, page: filters.page };
    if (filters.type) params.type = filters.type;
    if (filters.category) params.category = filters.category;
    fetchTransactions(params);
  }, [filters, fetchTransactions]);

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

  const handleUpdate = async (data) => {
    try {
      await updateTransaction(editingTransaction._id, data);
      await fetchSummary();
      setEditingTransaction(null);
      toast.success('Transaction updated!');
    } catch (error) {
      toast.error('Failed to update transaction');
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

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Transactions</h1>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditingTransaction(null); }}>
          <MdAdd /> Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Transaction List */}
      <div className="card">
        {loading ? (
          <div className="spinner" />
        ) : (
          <>
            <TransactionList
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={filters.page <= 1}
                  onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
                >
                  Previous
                </button>
                <span style={{ padding: '6px 12px', fontSize: '0.9rem', color: '#6b7280' }}>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={filters.page >= pagination.totalPages}
                  onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Transaction</h2>
            <TransactionForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTransaction && (
        <div className="modal-overlay" onClick={() => setEditingTransaction(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Transaction</h2>
            <TransactionForm
              onSubmit={handleUpdate}
              onCancel={() => setEditingTransaction(null)}
              initialData={editingTransaction}
            />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Transactions;
