import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { currentUser, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email.';
    if (form.password && form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (form.password && form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try{
    if (form.password==''){
        const result = await updateProfile(form.name.trim(), form.email.trim());
      } else if (form.password) {
        const result = await updateProfile(form.name.trim(), form.email.trim(), form.password, form.confirmPassword);
      }
    } catch (err) {
      setErrors({ general: 'An error occurred while saving your settings.' });
      return;
    }
    setSuccess('Your settings have been saved successfully.');
    setForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
  };

  return (
    <AppLayout title="Settings">
      <div className="dashboard">
        <div className="dashboard__header">
          <div className="dashboard__header" style={{ textAlign: 'center' }}>
  <h1 className="dashboard__title">Account Settings</h1>
  <p className="dashboard__subtitle">
    Update your name, email, or password.
  </p>
</div>
        </div>

        <div className="card" style={{ maxWidth: 700 ,margin: '0 auto' }}>
          {success && (
            <div className="alert alert--success" style={{ marginBottom: 20 }}>
              <span>✅</span> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="section-title" style={{ marginBottom: 16 }}>Personal Information</div>

            <div className="form-group">
              <label className="form-label" htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                value={form.name}
                onChange={handleChange}
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
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="divider"></div>
            <div className="section-title" style={{ marginBottom: 16 }}>Change Password</div>
            <p className="text-sm text-muted" style={{ marginBottom: 14 }}>
              Leave blank if you don't want to change your password.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="password">New password</label>
              <input
                id="password"
                name="password"
                type="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="New password (optional)"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm new password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Repeat new password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>

            <div style={{ marginTop: 8 }}>
              <button type="submit" className="btn btn--primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="card" style={{ maxWidth: 700, margin: '20px auto 0'  }}>
          <div className="section-title" style={{ marginBottom: 12 }}>Account Info</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Account role</span>
              <span className="badge badge--inactive">{currentUser?.role === 'admin' ? 'Administrator' : 'Member'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Member since</span>
              <span className="text-sm font-bold">{currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString() : '—'}</span>
            </div>
            {currentUser?.role === 'user' && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Membership status</span>
                {currentUser?.membership_status === 'active'
                  ? <span className="badge badge--active badge--dot">Active</span>
                  : <span className="badge badge--inactive badge--dot">Inactive</span>
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
