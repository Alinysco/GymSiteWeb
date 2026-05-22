import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '../components/AppLayout';
import { api } from '../services/api';

// ─── Add Modal ────────────────────────────────────────────────────────────────
function CourseModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    name: '',
    instructor: '',
    description: '',
    date: '',
    start_time: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Course name is required.';
    if (!form.instructor.trim()) errs.instructor = 'Instructor name is required.';
    if (!form.date) errs.date = 'Date is required.';
    if (!form.start_time) errs.start_time = 'Start time is required.';
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await onSave({
        name: form.name.trim(),
        instructor: form.instructor.trim(),
        description: form.description.trim(),
        date: form.date,
        start_time: form.start_time,
      });
    } catch (err) {
      if (err.errors) {
        const mapped = {};
        Object.entries(err.errors).forEach(([field, msgs]) => {
          mapped[field] = Array.isArray(msgs) ? msgs[0] : msgs;
        });
        setErrors(mapped);
      } else {
        setErrors({ name: err.message || 'Failed to save course.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
    }}>
      <div className="card" style={{ width: 480, boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 20, color: '#e5e7eb' }}>Add New Course</h3>

        <div className="form-group">
          <label className="form-label">Course Name</label>
          <input
            name="name"
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="e.g. Morning Yoga"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Instructor</label>
          <input
            name="instructor"
            className={`form-input ${errors.instructor ? 'error' : ''}`}
            placeholder="e.g. Jane Smith"
            value={form.instructor}
            onChange={handleChange}
          />
          {errors.instructor && <span className="form-error">{errors.instructor}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Description <span style={{ color: 'var(--gray-500)', fontWeight: 400 }}>(optional)</span></label>
          <textarea
            name="description"
            className={`form-input ${errors.description ? 'error' : ''}`}
            placeholder="Brief description of the course..."
            value={form.description}
            onChange={handleChange}
            rows={3}
            style={{ resize: 'vertical', minHeight: 80 }}
          />
          {errors.description && <span className="form-error">{errors.description}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              name="date"
              type="date"
              className={`form-input ${errors.date ? 'error' : ''}`}
              value={form.date}
              onChange={handleChange}
            />
            {errors.date && <span className="form-error">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Start Time</label>
            <input
              name="start_time"
              type="time"
              className={`form-input ${errors.start_time ? 'error' : ''}`}
              value={form.start_time}
              onChange={handleChange}
            />
            {errors.start_time && <span className="form-error">{errors.start_time}</span>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
          <button className="btn btn--secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn--primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Add Course'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CoursesAdmin() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCourses = useCallback(() => {
    return api.getCourses()
      .then(data => setCourses(data.cours || []))
      .catch(err => setErrorMsg(err.message || 'Failed to load courses.'));
  }, []);

  useEffect(() => {
    fetchCourses().finally(() => setLoading(false));
  }, [fetchCourses]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 4000);
  };

  const handleAdd = async (formData) => {
    const data = await api.addCourse(formData);
    setCourses(prev => [...prev, data.cours]);
    setShowModal(false);
    showSuccess('Course added successfully.');
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete "${course.name}"? This cannot be undone.`)) return;
    try {
      await api.deleteCourse(course.id);
      setCourses(prev => prev.filter(c => c.id !== course.id));
      showSuccess(`"${course.name}" has been deleted.`);
    } catch (err) {
      showError(err.message || 'Failed to delete course.');
    }
  };

  const formatTime = (time) => {
    if (!time) return '—';
    const [h, m] = time.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  return (
    <AppLayout title="Manage Courses">
      <div className="dashboard">
        <div className="dashboard__header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="dashboard__title">Manage Courses</h1>
            <p className="dashboard__subtitle">Create, view, and remove gym classes and sessions.</p>
          </div>
          <button className="btn btn--primary" onClick={() => setShowModal(true)}>
            + Add Course
          </button>
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
          <p className="text-muted text-sm">Loading courses...</p>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">⌘</div>
            <div className="empty-state__title">No courses yet</div>
            <p className="text-sm text-muted">Add your first course to get started.</p>
            <button className="btn btn--primary" style={{ marginTop: 16 }} onClick={() => setShowModal(true)}>
              + Add Course
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Instructor</th>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id}>
                    <td style={{ fontWeight: 600, color: 'white' }}>{course.name}</td>
                    <td className="text-muted">{course.instructor || '—'}</td>
                    <td className="text-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                      {course.date ? new Date(course.date).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }} className="text-muted">
                      {formatTime(course.start_time)}
                    </td>
                    <td className="text-muted" style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {course.description || <span style={{ opacity: 0.4 }}>—</span>}
                    </td>
                    <td>
                      <div className="table__actions">
                        <button
                          className="btn btn--sm btn--danger"
                          onClick={() => handleDelete(course)}
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

      {showModal && (
        <CourseModal
          onSave={handleAdd}
          onClose={() => setShowModal(false)}
        />
      )}
    </AppLayout>
  );
}