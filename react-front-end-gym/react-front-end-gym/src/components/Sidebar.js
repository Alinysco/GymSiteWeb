import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const USER_LINKS = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/settings', icon: '⚙', label: 'Settings' },
];

const ADMIN_LINKS = [
  { to: '/admin', icon: '⊞', label: 'Overview' },
  { to: '/admin/users', icon: '👥', label: 'Manage Users' },
  { to: '/settings', icon: '⚙', label: 'Settings' },
];

export default function Sidebar() {
  const logoPath = "/images/logop.png";
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links = currentUser?.role === 'admin' ? ADMIN_LINKS : USER_LINKS;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar__brand">
        <div className="sidebar__logo-icon"><img src={logoPath} alt="FitTrack logo" /></div>
        FitTrack
      </Link>

      <nav className="sidebar__nav">
        <div className="sidebar__section-label">Menu</div>
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`sidebar__link ${location.pathname === link.to ? 'active' : ''}`}
          >
            <span className="sidebar__link-icon">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user-info">
          <div className="sidebar__avatar">{initials}</div>
          <div>
            <div className="sidebar__username">{currentUser?.name}</div>
            <div className="sidebar__role">{currentUser?.role === 'admin' ? 'Administrator' : 'Member'}</div>
          </div>
        </div>
        <button className="sidebar__link" onClick={handleLogout} style={{ color: '#dc2626' }}>
          <span className="sidebar__link-icon">↩</span>
          Logout
        </button>
      </div>
    </aside>
  );
}