import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { api } from '../services/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getUsers()
      .then(data => setUsers(data.users || []))
      .catch(err => setError(err.message || 'Failed to load users.'))
      .finally(() => setLoading(false));
  }, []);

  const members = users.filter(u => u.role === 'user');
  const totalUsers = members.length;
  const activeMembers = members.filter(u => u.membership_status === 'active').length;
  const inactiveMembers = members.filter(u => u.membership_status === 'not_active').length;

  const stats = [
    { label: 'Total Members', value: totalUsers, icon: '👥', sub: 'Registered users' },
    { label: 'Active Memberships', value: activeMembers, icon: '✅', sub: 'Active members' },
    { label: 'Inactive', value: inactiveMembers, icon: '⏸', sub: 'Pending activation' },
  ];

  return (
    <AppLayout title="Admin Overview">
      <div className="dashboard">
        <div className="dashboard__header">
          <h1 className="dashboard__title">Admin Overview</h1>
          <p className="dashboard__subtitle">Gym summary and statistics at a glance.</p>
        </div>

        {error && (
          <div className="alert alert--error" style={{ marginBottom: 20 }}>
            <span>✕</span> {error}
          </div>
        )}

        {loading ? (
          <p className="text-muted text-sm">Loading stats...</p>
        ) : (
          <>
            <div className="stats-grid">
              {stats.map((s) => (
                <div className="card" key={s.label}>
                  <p className="card__title">{s.label}</p>
                  <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{s.icon}</div>
                  <p className="card__value">{s.value}</p>
                  <p className="card__sub">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="section-title">Recent Members</div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Registered</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {members.slice(0, 5).map(user => (
                    <tr key={user.id}>
                      <td style={{ fontWeight: 600, color: 'white' }}>{user.name}</td>
                      <td className="text-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                        {user.email}
                      </td>
                      <td className="text-muted">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        {user.membership_status === 'active'
                          ? <span className="badge badge--active badge--dot">Active</span>
                          : <span className="badge badge--inactive badge--dot">Inactive</span>
                        }
                      </td>
                    </tr>
                  ))}
                  {members.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-muted text-sm" style={{ textAlign: 'center', padding: '20px 0' }}>
                        No members yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted mt-4">
              Go to <strong>Manage Users</strong> for full member controls.
            </p>
          </>
        )}
      </div>
    </AppLayout>
  );
}