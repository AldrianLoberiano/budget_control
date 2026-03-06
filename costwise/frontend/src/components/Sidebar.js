import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdDashboard,
  MdReceipt,
  MdBarChart,
  MdLogout,
  MdMenu,
  MdClose,
  MdSavings,
} from 'react-icons/md';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
    { path: '/transactions', label: 'Transactions', icon: <MdReceipt /> },
    { path: '/budgets', label: 'Budget Goals', icon: <MdSavings /> },
    { path: '/reports', label: 'Reports', icon: <MdBarChart /> },
  ];

  const handleLogout = () => {
    logout();
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <div className="mobile-header">
        <div className="sidebar-logo">
          Cost<span>Wise</span>
        </div>
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <MdClose /> : <MdMenu />}
        </button>
      </div>

      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={closeSidebar} />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          Cost<span>Wise</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="sidebar-user-info">
                <p>{user.name}</p>
                <span>{user.email}</span>
              </div>
            </div>
          )}
          <button className="sidebar-link" onClick={handleLogout} style={{ marginTop: 8 }}>
            <MdLogout />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
