import React, { useEffect, useRef } from 'react';
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

const stats = [
  { value: 100, suffix: '%', label: 'Secure & Private' },
  { value: 99.9, suffix: '%', label: 'Uptime' },
  { value: 24, suffix: '/7', label: 'Access Control' },
  { value: 1, suffix: '-click', label: 'Admin Actions' },
];

export default function HomePage() {
  const logoPath = "/images/logop.png";
  const { currentUser } = useAuth();

  const statsRefs = useRef([]);

  useEffect(() => {
    const animateCount = (el, target, suffix = '', duration = 1500) => {
      let start = 0;
      const startTime = performance.now();

      const update = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const current = target * progress;

        el.innerText =
          (Number.isInteger(target)
            ? Math.floor(current)
            : current.toFixed(1)
          ) + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.innerText = target + suffix;
        }
      };

      requestAnimationFrame(update);
    };

    statsRefs.current.forEach((el, i) => {
      if (!el) return;

      const { value, suffix } = stats[i];

      setTimeout(() => {
        animateCount(el, value, suffix, 1400);
      }, i * 250); // stagger effect
    });
  }, []);

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">

        {/* Hero */}
        <section className="hero">
          <div className="hero__bg-grid" aria-hidden="true" />
          <div className="hero__bg-glow" aria-hidden="true" />

          <div className="container hero__inner">
            <div className="hero__content">
              <span className="hero__eyebrow">
                <span className="hero__eyebrow-dot" />
                Gym Management — Track your Progress
              </span>

              <h1 className="hero__title">
                Manage your gym membership{' '}
                <span className="hero__title-accent">easily</span>
              </h1>

              <p className="hero__desc">
                A simple platform for gym members and administrators to track memberships, manage accounts, and stay organized.
              </p>

              <div className="hero__cta">
                {currentUser ? (
                  <Link to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}>
                    <button className="btn btn--primary btn--lg">
                      Go to Dashboard <span className="btn-arrow">→</span>
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login">
                      <button className="btn btn--primary btn--lg">
                        Login <span className="btn-arrow">→</span>
                      </button>
                    </Link>
                    <Link to="/register">
                      <button className="btn btn--secondary btn--lg">Create Account</button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="hero__visual">
              <div className="hero__logo-frame">
                <div className="hero__logo-glow" aria-hidden="true" />
                <img src={logoPath} className="hero__logo-img" alt="FitTrack logo" />
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="container">
            <div className="stats-strip">
              {stats.map((s, i) => (
                <div className="stats-strip__item" key={s.label}>
                  <span
                    className="stats-strip__value"
                    ref={(el) => (statsRefs.current[i] = el)}
                  >
                    0
                  </span>
                  <span className="stats-strip__label">{s.label}</span>
                </div>
              ))}
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