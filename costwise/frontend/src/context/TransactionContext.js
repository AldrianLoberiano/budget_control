import React, { createContext, useContext, useState, useCallback } from 'react';
import API from '../utils/api';

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await API.get('/transactions', { params });
      setTransactions(data.transactions);
      setPagination({ page: data.page, totalPages: data.totalPages, total: data.total });
    } catch (error) {
      console.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    try {
      const { data } = await API.get('/transactions/summary');
      setSummary(data);
    } catch (error) {
      console.error('Failed to fetch summary');
    }
  }, []);

  const addTransaction = async (transactionData) => {
    const { data } = await API.post('/transactions', transactionData);
    setTransactions((prev) => [data, ...prev]);
    return data;
  };

  const updateTransaction = async (id, transactionData) => {
    const { data } = await API.put(`/transactions/${id}`, transactionData);
    setTransactions((prev) => prev.map((t) => (t._id === id ? data : t)));
    return data;
  };

  const deleteTransaction = async (id) => {
    await API.delete(`/transactions/${id}`);
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        summary,
        pagination,
        loading,
        fetchTransactions,
        fetchSummary,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
