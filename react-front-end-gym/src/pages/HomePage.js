import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: '📋',
    title: 'Membership Tracking',
    desc: 'Keep track of member status, join dates, and visit history in one place.',
  },
  {
    icon: '👤',
    title: 'User Profiles',
    desc: 'Each member gets their own profile with personal info and membership details.',
  },
  {
    icon: '🛡️',
    title: 'Admin Controls',
    desc: 'Admins can activate, edit, or remove memberships with full control.',
  },
  {
    icon: '🔒',
    title: 'Secure Access',
    desc: 'Role-based access ensures members only see what they need to see.',
  },
];

export default function HomePage() {
  const logoPath = "/images/logop.png";
  const { currentUser } = useAuth();

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        {/* Hero */}
        <section className="hero">
          <div className="container">
            <span className="hero__eyebrow">Gym Management — Track your Progress</span>
            <div className="my-div">
              <img src={logoPath} className="logo-img" alt="FitTrack logo" />
              <h1 className="hero__title">
                Manage your gym membership <span>easily</span>
              </h1>
              <p className="hero__desc">
                A simple platform for gym members and administrators to track memberships, manage accounts, and stay organized.
              </p>
            </div>
            <div className="hero__cta">
              {currentUser ? (
                <Link to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}>
                  <button className="btn btn--primary btn--lg">Go to Dashboard</button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <button className="btn btn--primary btn--lg">Login</button>
                  </Link>
                  <Link to="/register">
                    <button className="btn btn--secondary btn--lg">Create Account</button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        <br />

        {/* Features */}
        <section className="features-section">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <span className="hero__eyebrow">Features</span>
            </div>
            <h2 style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 700, color: 'white' }}>
              Everything you need in one place
            </h2>
            <div className="features-grid">
              {features.map((f) => (
                <div className="feature-card" key={f.title}>
                  <div className="feature-card__icon">{f.icon}</div>
                  <div className="feature-card__title">{f.title}</div>
                  <div className="feature-card__desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}