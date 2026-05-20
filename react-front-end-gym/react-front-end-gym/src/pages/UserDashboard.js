import React from 'react';
import AppLayout from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';

export default function UserDashboard() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const membership = currentUser.membership;
  const isActive = currentUser.membership_status === 'active';

  // Non-member (inactive) view
  if (!isActive) {
    return (
      <AppLayout title="Dashboard">
        <div className="dashboard">
          <div className="dashboard__header">
            <h1 className="dashboard__title">Hello, {currentUser.name.split(' ')[0]} 👋</h1>
            <p className="dashboard__subtitle">Welcome to FitTrack</p>
          </div>

          <div className="alert alert--warning" style={{ maxWidth: 560 }}>
            <span>⚠️</span>
            <div>
              <strong>Membership not activated</strong>
              <p style={{ marginTop: 6, fontWeight: 400, lineHeight: 1.6 }}>
                Your membership is not yet activated. Please visit the gym in person to complete payment and activate your account.
              </p>
            </div>
          </div>

          <div className="card" style={{ maxWidth: 400, marginTop: 24 }}>
            <p className="card__title">Account Status</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
              <span className="badge badge--inactive badge--dot">Not Active</span>
              <span className="text-sm text-muted">Pending activation</span>
            </div>
            <div className="divider"></div>
            <p className="text-sm text-muted">
              Registered on: <strong>{currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString() : '—'}</strong>
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Active member view
  const stats = [
    {
      label: 'Member Since',
      value: currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString() : '—',
      icon: '📆',
      sub: 'Registration date',
      isDate: true,
    },
    {
      label: 'Membership Start',
      value: membership?.start_date ? new Date(membership.start_date).toLocaleDateString() : '—',
      icon: '✅',
      sub: 'Activation date',
      isDate: true,
    },
    {
      label: 'Membership Expires',
      value: membership?.end_date ? new Date(membership.end_date).toLocaleDateString() : '—',
      icon: '📅',
      sub: 'Expiry date',
      isDate: true,
    },
    {
      label: 'Status',
      value: 'Active',
      icon: '🏋️',
      sub: 'Membership status',
      isStatus: true,
    },
  ];

  return (
    <AppLayout title="Dashboard">
      <div className="dashboard">
        <div className="dashboard__header">
          <h1 className="dashboard__title">Hello, {currentUser.name.split(' ')[0]} 👋</h1>
          <p className="dashboard__subtitle">Here's an overview of your membership.</p>
        </div>

        <div className="alert alert--success" style={{ maxWidth: 500, marginBottom: 24 }}>
          <span>✅</span>
          <div>
            <strong>Membership Active</strong> — You have full gym access. Enjoy your workout!
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((s) => (
            <div className="card" key={s.label}>
              <p className="card__title">{s.label}</p>
              <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{s.icon}</div>
              {s.isStatus ? (
                <span className="badge badge--active badge--dot">Active</span>
              ) : (
                <p style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>{s.value}</p>
              )}
              <p className="card__sub">{s.sub}</p>
            </div>
          ))}
        </div>

        {membership && (
          <>
            <div className="section-title">Membership Details</div>
            <div className="card" style={{ maxWidth: 480 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Status</span>
                  <span className="badge badge--active badge--dot">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Start date</span>
                  <span className="text-sm font-bold">
                    {membership.start_date ? new Date(membership.start_date).toLocaleDateString() : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">End date</span>
                  <span className="text-sm font-bold">
                    {membership.end_date ? new Date(membership.end_date).toLocaleDateString() : '—'}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}