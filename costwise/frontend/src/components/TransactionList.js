import React from 'react';
import { MdTrendingUp, MdTrendingDown, MdEdit, MdDelete, MdReceipt } from 'react-icons/md';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="empty-state">
        <MdReceipt />
        <h3>No transactions found</h3>
        <p>Start by adding your first transaction</p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="transaction-list">
      {transactions.map((transaction) => (
        <div key={transaction._id} className="transaction-item">
          <div className="transaction-left">
            <div className={`transaction-icon ${transaction.type}`}>
              {transaction.type === 'income' ? <MdTrendingUp /> : <MdTrendingDown />}
            </div>
            <div className="transaction-details">
              <h4>{transaction.category}</h4>
              <p>
                {transaction.description
                  ? `${transaction.description} · `
                  : ''}
                {formatDate(transaction.date)}
              </p>
            </div>
          </div>

          <div className="transaction-right">
            <span className={`transaction-amount ${transaction.type}`}>
              {transaction.type === 'income' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </span>
            <div className="transaction-actions">
              <button
                className="btn-icon"
                onClick={() => onEdit(transaction)}
                title="Edit"
              >
                <MdEdit />
              </button>
              <button
                className="btn-icon"
                onClick={() => onDelete(transaction._id)}
                title="Delete"
              >
                <MdDelete />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
