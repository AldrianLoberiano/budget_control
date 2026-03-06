import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MdDarkMode, MdLightMode, MdLogout, MdPerson, MdKeyboardArrowDown } from 'react-icons/md';

const AppHeader = () => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      <div className="app-header-left">
        <h2 className="app-header-greeting">
          Welcome back, <span>{user?.name?.split(' ')[0] || 'User'}</span>
        </h2>
      </div>
      <div className="app-header-right">
        <button
          className="app-header-theme-btn"
          onClick={toggleTheme}
          title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {dark ? <MdLightMode /> : <MdDarkMode />}
        </button>

        <div className="app-header-user" ref={dropdownRef}>
          <button
            className="app-header-user-btn"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <div className="app-header-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="app-header-user-info">
              <span className="app-header-user-name">{user?.name}</span>
              <span className="app-header-user-email">{user?.email}</span>
            </div>
            <MdKeyboardArrowDown className={`app-header-chevron ${dropdownOpen ? 'open' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="app-header-dropdown">
              <div className="app-header-dropdown-header">
                <div className="app-header-avatar lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="app-header-dropdown-name">{user?.name}</p>
                  <p className="app-header-dropdown-email">{user?.email}</p>
                </div>
              </div>
              <div className="app-header-dropdown-divider" />
              <button className="app-header-dropdown-item" onClick={() => { setDropdownOpen(false); }}>
                <MdPerson />
                <span>Profile</span>
              </button>
              <button className="app-header-dropdown-item" onClick={toggleTheme}>
                {dark ? <MdLightMode /> : <MdDarkMode />}
                <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <div className="app-header-dropdown-divider" />
              <button className="app-header-dropdown-item danger" onClick={() => { logout(); setDropdownOpen(false); }}>
                <MdLogout />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
