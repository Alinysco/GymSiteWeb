import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '../components/AppLayout';
import { api } from '../services/api';

// ─── Edit Modal ──────────────────────────────────────────────────────────────
function EditModal({ user, onSave, onClose }) {
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSave = async () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await onSave({ name: form.name.trim(), email: form.email.trim() });
    } catch (err) {
      if (err.errors) {
        const mapped = {};
        Object.entries(err.errors).forEach(([field, msgs]) => {
          mapped[field] = Array.isArray(msgs) ? msgs[0] : msgs;
        });
        setErrors(mapped);
      } else {
        setErrors({ name: err.message || 'Failed to save changes.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
    }}>
      <div className="card" style={{ width: 400, boxShadow: 'var(--shadow-lg)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Edit Member</h3>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            name="name"
            className={`form-input ${errors.name ? 'error' : ''}`}
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            name="email"
            type="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
          <button className="btn btn--secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn--primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchUsers = useCallback(() => {
    return api.getUsers()
      .then(data => setUsers((data.users || []).filter(u => u.role === 'user')))
      .catch(err => setErrorMsg(err.message || 'Failed to load users.'));
  }, []);

  useEffect(() => {
    fetchUsers().finally(() => setLoading(false));
  }, [fetchUsers]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 4000);
  };

  const handleActivate = async (user) => {
    try {
      const data = await api.activateUser(user.id);
      setUsers(prev => prev.map(u => u.id === user.id ? data.user : u));
      showSuccess(`${user.name}'s membership has been activated.`);
    } catch (err) {
      showError(err.message || 'Failed to activate membership.');
    }
  };

  const handleDeactivate = async (user) => {
    try {
      const data = await api.deactivateUser(user.id);
      setUsers(prev => prev.map(u => u.id === user.id ? data.user : u));
      showSuccess(`${user.name}'s membership has been deactivated.`);
    } catch (err) {
      showError(err.message || 'Failed to deactivate membership.');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name}'s account? This cannot be undone.`)) return;
    try {
      await api.deleteUser(user.id);
      setUsers(prev => prev.filter(u => u.id !== user.id));
      showSuccess(`${user.name} has been removed.`);
    } catch (err) {
      showError(err.message || 'Failed to delete user.');
    }
  };

  // Throws on API error so EditModal can catch and show field errors
  const handleSaveEdit = async (formData) => {
    const data = await api.updateUser(editingUser.id, formData);
    setUsers(prev => prev.map(u => u.id === editingUser.id ? data.user : u));
    setEditingUser(null);
    showSuccess('Member information updated.');
  };

  return (
    <AppLayout title="Manage Users">
      <div className="dashboard">
        <div className="dashboard__header">
          <h1 className="dashboard__title">Manage Members</h1>
          <p className="dashboard__subtitle">Activate, edit, or remove gym member accounts.</p>
        </div>

        {successMsg && (
          <div className="alert alert--success" style={{ marginBottom: 20 }}>
            <span>✅</span> {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="alert alert--error" style={{ marginBottom: 20 }}>
            <span>✕</span> {errorMsg}
          </div>
        )}

        {loading ? (
          <p className="text-muted text-sm">Loading members...</p>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">👥</div>
            <div className="empty-state__title">No members yet</div>
            <p className="text-sm text-muted">New members will appear here after they register.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Registered</th>
                  <th>Membership End</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: 600, color: 'white' }}>{user.name}</td>
                    <td className="text-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                      {user.email}
                    </td>
                    <td className="text-muted">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }} className="text-muted">
                      {user.membership?.end_date
                        ? new Date(user.membership.end_date).toLocaleDateString()
                        : '—'}
                    </td>
                    <td>
                      {user.membership_status === 'active'
                        ? <span className="badge badge--active badge--dot">Active</span>
                        : <span className="badge badge--inactive badge--dot">Inactive</span>
                      }
                    </td>
                    <td>
                      <div className="table__actions">
                        {user.membership_status === 'active' ? (
                          <button
                            className="btn btn--sm btn--secondary"
                            onClick={() => handleDeactivate(user)}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            className="btn btn--sm btn--success"
                            onClick={() => handleActivate(user)}
                          >
                            Activate
                          </button>
                        )}
                        <button
                          className="btn btn--sm btn--secondary"
                          onClick={() => setEditingUser(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn--sm btn--danger"
                          onClick={() => handleDelete(user)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingUser && (
        <EditModal
          user={editingUser}
          onSave={handleSaveEdit}
          onClose={() => setEditingUser(null)}
        />
      )}
    </AppLayout>
  );
}