import React from 'react';
import Sidebar from './Sidebar';
import AppHeader from './AppHeader';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <AppHeader />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
