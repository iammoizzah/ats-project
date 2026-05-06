import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    applicationId: '', scheduledAt: '', message: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [intRes, appRes] = await Promise.all([
        API.get('/interviews'),
        API.get('/applications/all')
      ]);
      setInterviews(intRes.data);
      // Only show shortlisted applications
      setApplications(
        appRes.data.filter(a =>
          a.status === 'Shortlisted' || a.status === 'Under Review'
        )
      );
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const interview = await API.post('/interviews', form);

      // Send interview email
      try {
        await API.post(`/email/interview/${interview.data._id}`);
        toast.success('Interview scheduled and email sent!');
      } catch {
        toast.success('Interview scheduled! (Email failed)');
      }

      setForm({ applicationId: '', scheduledAt: '', message: '' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={styles.center}>Loading interviews...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div>
          <h1 style={styles.title}>Interview Management</h1>
          <p style={styles.subtitle}>
            {interviews.length} interview{interviews.length !== 1 ? 's' : ''} scheduled
          </p>
        </div>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Schedule Interview'}
        </button>
      </div>

      {/* Schedule Form */}
      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>Schedule New Interview</h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Select Application *</label>
              <select
                style={styles.input}
                value={form.applicationId}
                onChange={e => setForm({ ...form, applicationId: e.target.value })}
                required
              >
                <option value="">Choose a candidate...</option>
                {applications.map(app => (
                  <option key={app._id} value={app._id}>
                    {app.candidate?.name} — {app.job?.title} ({app.status})
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Interview Date & Time *</label>
              <input
                style={styles.input}
                type="datetime-local"
                value={form.scheduledAt}
                onChange={e => setForm({ ...form, scheduledAt: e.target.value })}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Message to Candidate (optional)</label>
              <textarea
                style={styles.textarea}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="e.g. Please bring your portfolio. Interview will be via Google Meet."
                rows={3}
              />
            </div>

            <button type="submit" style={styles.saveBtn} disabled={saving}>
              {saving ? 'Scheduling...' : 'Schedule & Send Email'}
            </button>
          </form>
        </div>
      )}

      {/* Interviews List */}
      {interviews.length === 0 ? (
        <div style={styles.empty}>No interviews scheduled yet.</div>
      ) : (
        <div style={styles.list}>
          {interviews.map(interview => {
            const date = new Date(interview.scheduledAt);
            const isPast = date < new Date();
            return (
              <div key={interview._id} style={styles.card}>
                <div style={styles.cardLeft}>
                  <div style={styles.dateBox}>
                    <span style={styles.dateDay}>{date.getDate()}</span>
                    <span style={styles.dateMonth}>
                      {date.toLocaleString('default', { month: 'short' })}
                    </span>
                  </div>
                </div>

                <div style={styles.cardContent}>
                  <div style={styles.cardTop}>
                    <div>
                      <h3 style={styles.candidateName}>
                        {interview.candidate?.name}
                      </h3>
                      <p style={styles.candidateEmail}>
                        {interview.candidate?.email}
                      </p>
                    </div>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: isPast ? '#f5f5f5' : '#e8f5e9',
                      color: isPast ? '#888' : '#2e7d32'
                    }}>
                      {isPast ? 'Completed' : '🟢 Upcoming'}
                    </span>
                  </div>

                  <p style={styles.jobTitle}>
                    💼 {interview.job?.title} — {interview.job?.department}
                  </p>

                  <p style={styles.timeText}>
                    🕐 {date.toLocaleString('en-PK', {
                      weekday: 'short', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>

                  {interview.message && (
                    <p style={styles.message}>
                      💬 {interview.message}
                    </p>
                  )}

                  <button
                    style={styles.resendBtn}
                    onClick={async () => {
                      try {
                        await API.post(`/email/interview/${interview._id}`);
                        toast.success('Interview email resent!');
                      } catch {
                        toast.error('Failed to resend email');
                      }
                    }}
                  >
                    📧 Resend Email
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1100px', margin: '0 auto' },
  topBar: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem'
  },
  title: { fontSize: '2rem', color: '#1a1a2e', margin: '0 0 0.3rem' },
  subtitle: { color: '#666' },
  addBtn: {
    backgroundColor: '#533483', color: 'white', border: 'none',
    padding: '0.75rem 1.5rem', borderRadius: '8px',
    fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer'
  },
  formCard: {
    backgroundColor: 'white', borderRadius: '12px', padding: '2rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    marginBottom: '2rem', borderTop: '4px solid #533483'
  },
  formTitle: { color: '#1a1a2e', marginBottom: '1.5rem' },
  field: { marginBottom: '1rem' },
  label: {
    display: 'block', marginBottom: '0.4rem',
    color: '#333', fontWeight: '500', fontSize: '0.9rem'
  },
  input: {
    width: '100%', padding: '0.75rem 1rem', border: '1px solid #ddd',
    borderRadius: '8px', fontSize: '1rem',
    boxSizing: 'border-box', outline: 'none', backgroundColor: 'white'
  },
  textarea: {
    width: '100%', padding: '0.75rem 1rem', border: '1px solid #ddd',
    borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box',
    outline: 'none', resize: 'vertical'
  },
  saveBtn: {
    backgroundColor: '#533483', color: 'white', border: 'none',
    padding: '0.75rem 1.5rem', borderRadius: '8px',
    fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer'
  },
  list: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  card: {
    backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    display: 'flex', gap: '1.5rem', borderLeft: '4px solid #533483'
  },
  cardLeft: { flexShrink: 0 },
  dateBox: {
    backgroundColor: '#f3e5f5', borderRadius: '12px',
    padding: '0.8rem 1rem', textAlign: 'center', minWidth: '60px'
  },
  dateDay: {
    display: 'block', fontSize: '1.8rem',
    fontWeight: 'bold', color: '#6a1b9a', lineHeight: 1
  },
  dateMonth: {
    display: 'block', fontSize: '0.8rem',
    color: '#6a1b9a', fontWeight: '600', textTransform: 'uppercase'
  },
  cardContent: { flex: 1 },
  cardTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem'
  },
  candidateName: { fontSize: '1.1rem', color: '#1a1a2e', margin: '0 0 0.2rem' },
  candidateEmail: { color: '#666', fontSize: '0.85rem', margin: 0 },
  statusBadge: {
    padding: '0.3rem 0.8rem', borderRadius: '20px',
    fontSize: '0.82rem', fontWeight: '600'
  },
  jobTitle: { color: '#e94560', fontSize: '0.9rem', margin: '0.3rem 0' },
  timeText: { color: '#555', fontSize: '0.9rem', margin: '0.3rem 0' },
  message: {
    color: '#555', fontSize: '0.85rem',
    backgroundColor: '#f3e5f5', padding: '0.5rem 0.8rem',
    borderRadius: '6px', margin: '0.5rem 0'
  },
  resendBtn: {
    backgroundColor: '#e3f2fd', color: '#1565c0', border: 'none',
    padding: '0.35rem 0.8rem', borderRadius: '6px',
    fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem'
  },
  empty: {
    textAlign: 'center', padding: '3rem', color: '#666',
    backgroundColor: 'white', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  center: { textAlign: 'center', padding: '4rem', color: '#666' }
};

export default Interviews;