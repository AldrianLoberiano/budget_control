import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  MdDashboard,
  MdReceipt,
  MdBarChart,
  MdLogout,
  MdMenu,
  MdClose,
  MdSavings,
  MdDarkMode,
  MdLightMode,
  MdChevronLeft,
  MdChevronRight,
} from 'react-icons/md';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
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
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="hamburger" onClick={toggleTheme} title="Toggle theme">
            {dark ? <MdLightMode /> : <MdDarkMode />}
          </button>
          <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>
      </div>

      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={closeSidebar} />

      <aside className={`sidebar ${isOpen ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-logo">
            {collapsed ? 'C' : <>Cost<span>Wise</span></>}
          </div>
          <button
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <MdChevronRight /> : <MdChevronLeft />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={closeSidebar}
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link" onClick={toggleTheme} title={collapsed ? (dark ? 'Light Mode' : 'Dark Mode') : undefined}>
            {dark ? <MdLightMode /> : <MdDarkMode />}
            {!collapsed && <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          {user && !collapsed && (
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
          {user && collapsed && (
            <div className="sidebar-user" style={{ justifyContent: 'center' }}>
              <div className="sidebar-user-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          <button className="sidebar-link" onClick={handleLogout} title={collapsed ? 'Logout' : undefined} style={{ marginTop: 8 }}>
            <MdLogout />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
