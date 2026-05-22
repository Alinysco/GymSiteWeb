import React from 'react';
import Sidebar from './Sidebar';

export default function AppLayout({ title, children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <div className="app-topbar">
          <span className="app-topbar__title">{title}</span>
        </div>
        <div className="app-content">
          {children}
        </div>
      </div>
    </div>
  );
}