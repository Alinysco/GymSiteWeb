import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const logoPath = "/images/logop.png";

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <div className="navbar__logo-icon"><img src={logoPath} alt="FitTrack logo" /></div>
          FitTrack
        </Link>

        <ul className="navbar__links">
          <li><Link to="/" className={isActive('/')}>Home</Link></li>
          {!currentUser && (
            <>
              <li><Link to="/login" className={isActive('/login')}>Login</Link></li>
              <li>
                <Link to="/register" className={isActive('/register')}>
                  <button className="btn btn--primary btn--sm" style={{ cursor: 'pointer' }}>
                    Register
                  </button>
                </Link>
              </li>
            </>
          )}
          {currentUser && (
            <>
              <li>
                <Link
                  to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
                  className={isActive(currentUser.role === 'admin' ? '/admin' : '/dashboard')}
                >
                  Dashboard
                </Link>
              </li>
              <div className="navbar__user">
                <span className="navbar__username">{currentUser.name}</span>
                <button className="btn btn--secondary btn--sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}