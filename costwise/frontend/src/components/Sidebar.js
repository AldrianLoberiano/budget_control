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
  MdChevronLeft,
  MdChevronRight,
} from 'react-icons/md';

const Sidebar = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });
  const location = useLocation();

  const toggleCollapse = () => {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem('sidebar-collapsed', String(next));
      document.documentElement.setAttribute('data-sidebar', next ? 'collapsed' : 'expanded');
      return next;
    });
  };

  // Set initial sidebar state on mount
  React.useEffect(() => {
    document.documentElement.setAttribute('data-sidebar', collapsed ? 'collapsed' : 'expanded');
  }, [collapsed]);

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
            onClick={toggleCollapse}
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
          <button className="sidebar-link" onClick={handleLogout} title={collapsed ? 'Logout' : undefined}>
            <MdLogout />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
