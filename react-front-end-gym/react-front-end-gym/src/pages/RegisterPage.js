import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const logoPath = "/images/logop.png";
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 400));

      const result = await register(
        form.name.trim(),
        form.email.trim(),
        form.password,
        form.confirmPassword
      );

      setLoading(false);

      if (result && (result.id || result.email)) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const errorMessage =
          result?.data?.message ||
          result?.message ||
          'Registration failed.';

        setServerError(errorMessage);
      }

    } catch (error) {
      setLoading(false);

      // 🔥 FIX: handle Laravel validation properly (422)
      const data = error.response?.data;
      const status = error.response?.status;

      if (status === 422 && data?.errors) {
        setErrors(data.errors);
      } else {
        setServerError(
          data?.message || 'An unexpected server error occurred.'
        );
      }

      console.error("Registration endpoint crash:", error);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>Account created!</h2>
          <p className="text-muted text-sm">Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__logo"><img src={logoPath} alt="FitTrack logo" /></div>
          <h1 className="auth-card__title">Create an account</h1>
          <p className="auth-card__subtitle">Join FitTrack to manage your membership</p>
        </div>

        {serverError && (
          <div className="alert alert--error" style={{ marginBottom: 16 }}>
            <span>✕</span> {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="At least 8 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span className="form-error">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="auth-card__footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}