import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

// ─── Course Detail Modal ──────────────────────────────────────────────────────
function CourseDetailModal({ course, onClose }) {
  const formatTime = (time) => {
    if (!time) return '—';
    const [h, m] = time.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
    }}>
      <div className="card" style={{ width: 440, boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontWeight: 700, color: '#e5e7eb', marginBottom: 4 }}>{course.name}</h3>
            <span className="badge badge--active badge--dot">Available</span>
          </div>
          <button
            className="btn btn--sm btn--secondary"
            onClick={onClose}
            style={{ flexShrink: 0, marginLeft: 12 }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,#00ff8720 0%,#00c85330 100%)',
              border: '1px solid #00c85325', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0
            }}>👤</span>
            <div>
              <div className="text-sm text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Instructor</div>
              <div style={{ color: '#e5e7eb', fontWeight: 600, fontSize: '0.9rem' }}>{course.instructor || '—'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,#00ff8720 0%,#00c85330 100%)',
              border: '1px solid #00c85325', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0
            }}>📅</span>
            <div>
              <div className="text-sm text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Date</div>
              <div style={{ color: '#e5e7eb', fontWeight: 600, fontSize: '0.9rem' }}>
                {course.date ? new Date(course.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,#00ff8720 0%,#00c85330 100%)',
              border: '1px solid #00c85325', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0
            }}>🕐</span>
            <div>
              <div className="text-sm text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Start Time</div>
              <div style={{ color: '#e5e7eb', fontWeight: 600, fontSize: '0.9rem' }}>{formatTime(course.start_time)}</div>
            </div>
          </div>

          {course.description && (
            <>
              <div className="divider" style={{ margin: '4px 0' }} />
              <div>
                <div className="text-sm text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>About this class</div>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.7 }}>{course.description}</p>
              </div>
            </>
          )}
        </div>

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn--secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── Course Card ──────────────────────────────────────────────────────────────
function CourseCard({ course, onClick }) {
  const formatTime = (time) => {
    if (!time) return '—';
    const [h, m] = time.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  return (
    <div
      className="card card--hoverable"
      style={{ cursor: 'pointer', transition: 'border-color 0.2s, box-shadow 0.2s' }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 8 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: 'linear-gradient(135deg,#00ff8720 0%,#00c85330 100%)',
          border: '1px solid #00c85325',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem', flexShrink: 0
        }}>⌘</div>
        <span className="badge badge--active badge--dot" style={{ marginTop: 2 }}>Available</span>
      </div>

      <h3 style={{ fontWeight: 700, color: '#e5e7eb', fontSize: '1rem', marginBottom: 4 }}>{course.name}</h3>
      <p className="text-muted" style={{ fontSize: '0.82rem', marginBottom: 14 }}>
        {course.description
          ? course.description.length > 80 ? course.description.slice(0, 80) + '…' : course.description
          : 'No description provided.'}
      </p>

      <div className="divider" style={{ margin: '0 0 12px' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="flex items-center justify-between">
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>👤 Instructor</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e5e7eb' }}>{course.instructor || '—'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>📅 Date</span>
          <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#9ca3af' }}>
            {course.date ? new Date(course.date).toLocaleDateString() : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>🕐 Time</span>
          <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#9ca3af' }}>
            {formatTime(course.start_time)}
          </span>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <span style={{
          fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 4
        }}>
          View details <span style={{ fontSize: '0.7rem' }}>→</span>
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CoursesPage() {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const isActive = currentUser?.membership_status === 'active';

  useEffect(() => {
    if (!isActive) {
      setLoading(false);
      return;
    }
    api.getCourses()
      .then(data => setCourses(data.cours || []))
      .catch(err => setError(err.message || 'Failed to load courses.'))
      .finally(() => setLoading(false));
  }, [isActive]);

  // Membership not active — show locked state
  if (!isActive) {
    return (
      <AppLayout title="Courses">
        <div className="dashboard">
          <div className="dashboard__header">
            <h1 className="dashboard__title">Courses</h1>
            <p className="dashboard__subtitle">Browse upcoming gym classes and sessions.</p>
          </div>

          <div className="alert alert--warning" style={{ maxWidth: 560 }}>
            <span>⚠️</span>
            <div>
              <strong>Membership not activated</strong>
              <p style={{ marginTop: 6, fontWeight: 400, lineHeight: 1.6 }}>
                You need an active membership to access courses. Please visit the gym in person to activate your account.
              </p>
            </div>
          </div>

          <div className="card" style={{ maxWidth: 400, marginTop: 24 }}>
            <p className="card__title">Access Restricted</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
              <span className="badge badge--inactive badge--dot">Not Active</span>
              <span className="text-sm text-muted">Activate membership to unlock</span>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Courses">
      <div className="dashboard">
        <div className="dashboard__header">
          <h1 className="dashboard__title">Available Courses</h1>
          <p className="dashboard__subtitle">Browse upcoming gym classes and sessions.</p>
        </div>

        {error && (
          <div className="alert alert--error" style={{ marginBottom: 20 }}>
            <span>✕</span> {error}
          </div>
        )}

        {loading ? (
          <p className="text-muted text-sm">Loading courses...</p>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🏋️</div>
            <div className="empty-state__title">No courses available</div>
            <p className="text-sm text-muted">Check back soon — new classes will appear here.</p>
          </div>
        ) : (
          <>
            <p className="text-muted text-sm" style={{ marginBottom: 20 }}>
              {courses.length} {courses.length === 1 ? 'class' : 'classes'} available — click any card to see details.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20,
            }}>
              {courses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => setSelectedCourse(course)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </AppLayout>
  );
}