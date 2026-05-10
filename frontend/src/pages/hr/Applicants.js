import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';

const statusColors = {
  'Submitted':           { bg: '#e3f2fd', color: '#1565c0' },
  'Under Review':        { bg: '#fff8e1', color: '#f57f17' },
  'Shortlisted':         { bg: '#e8f5e9', color: '#2e7d32' },
  'Interview Scheduled': { bg: '#f3e5f5', color: '#6a1b9a' },
  'Rejected':            { bg: '#ffebee', color: '#c62828' },
  'Selected':            { bg: '#e8f5e9', color: '#1b5e20' }
};

const STATUS_OPTIONS = [
  'Submitted', 'Under Review', 'Shortlisted',
  'Interview Scheduled', 'Rejected', 'Selected'
];

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [noteMap, setNoteMap] = useState({});

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await API.get('/applications/all');
      setApplications(data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await API.put(`/applications/${appId}/status`, {
        status: newStatus,
        hrNotes: noteMap[appId] || ''
      });
      toast.success(`Status updated to "${newStatus}"`);
      fetchApplications();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleEmail = async (type, appId, candidate) => {
    const confirmMsg = `Send ${type} email to ${candidate?.name}?`;
    if (!window.confirm(confirmMsg)) return;
    try {
      if (type === 'custom') {
        const message = window.prompt('Enter your message:');
        if (!message) return;
        await API.post(`/email/custom/${candidate._id}`, {
          subject: 'Message from HR',
          message
        });
        toast.success('Custom email sent!');
        return;
      }
      if (type === 'shortlist') await API.post(`/email/shortlist/${appId}`);
      if (type === 'reject')    await API.post(`/email/reject/${appId}`);
      toast.success(`${type} email sent to ${candidate?.email}`);
      fetchApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send email');
    }
  };

  const filtered = filterStatus
    ? applications.filter(a => a.status === filterStatus)
    : applications;

  if (loading) return <div style={styles.center}>Loading applicants...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div>
          <h1 style={styles.title}>All Applicants</h1>
          <p style={styles.subtitle}>
            {filtered.length} application{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <select
          style={styles.filterSelect}
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={styles.empty}>No applications found.</div>
      ) : (
        <div style={styles.list}>
          {filtered.map(app => {
            const sc = statusColors[app.status] || {};
            return (
              <div key={app._id} style={styles.card}>

                {/* Top Row */}
                <div style={styles.cardTop}>
                  <div style={styles.candidateInfo}>
                    <div style={styles.avatar}>
                      {app.candidate?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={styles.candidateName}>{app.candidate?.name}</h3>
                      <p style={styles.candidateEmail}>{app.candidate?.email}</p>
                      {app.candidate?.phone && (
                        <p style={styles.candidatePhone}>📞 {app.candidate.phone}</p>
                      )}
                    </div>
                  </div>

                  <div style={styles.jobInfo}>
                    <p style={styles.jobTitle}>{app.job?.title}</p>
                    <p style={styles.jobDept}>{app.job?.department}</p>
                    <p style={styles.appliedDate}>
                      Applied {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: sc.bg,
                    color: sc.color
                  }}>
                    {app.status}
                  </span>
                </div>

                {/* ✅ FIXED: File Links — href attribute properly placed inside <a> tag */}
                <div style={styles.fileRow}>
                  {app.resumeUrl && (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.fileLink}
                    >
                      📄 View Resume
                    </a>
                  )}
                  {app.coverLetterUrl && (
                    <a
                      href={app.coverLetterUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.fileLink}
                    >
                      📝 Cover Letter
                    </a>
                  )}
                </div>

                {/* HR Note Input */}
                <div style={styles.noteRow}>
                  <input
                    style={styles.noteInput}
                    placeholder="Add HR note (optional)..."
                    value={noteMap[app._id] || app.hrNotes || ''}
                    onChange={e => setNoteMap({
                      ...noteMap, [app._id]: e.target.value
                    })}
                  />
                </div>

                {/* Status Action Buttons */}
                <div style={styles.actionRow}>
                  {STATUS_OPTIONS.map(status =>
                    status !== app.status && (
                      <button
                        key={status}
                        style={{
                          ...styles.actionBtn,
                          backgroundColor: statusColors[status]?.bg || '#f5f5f5',
                          color: statusColors[status]?.color || '#333'
                        }}
                        onClick={() => handleStatusChange(app._id, status)}
                        disabled={updatingId === app._id}
                      >
                        {updatingId === app._id ? '...' : `→ ${status}`}
                      </button>
                    )
                  )}
                </div>

                {/* Email Action Buttons */}
                <div style={styles.emailRow}>
                  <span style={styles.emailLabel}>✉️ Send Email:</span>
                  <button
                    style={styles.emailBtn}
                    onClick={() => handleEmail('shortlist', app._id, app.candidate)}
                  >
                    Shortlist Email
                  </button>
                  <button
                    style={{ ...styles.emailBtn, backgroundColor: '#ffebee', color: '#c62828' }}
                    onClick={() => handleEmail('reject', app._id, app.candidate)}
                  >
                    Rejection Email
                  </button>
                  <button
                    style={{ ...styles.emailBtn, backgroundColor: '#f3e5f5', color: '#6a1b9a' }}
                    onClick={() => handleEmail('custom', app._id, app.candidate)}
                  >
                    Custom Email
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
  filterSelect: {
    padding: '0.75rem 1rem', border: '1px solid #ddd',
    borderRadius: '8px', fontSize: '0.95rem',
    outline: 'none', backgroundColor: 'white'
  },
  list: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  card: {
    backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', borderLeft: '4px solid #0f3460'
  },
  cardTop: {
    display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
    alignItems: 'flex-start', marginBottom: '1rem'
  },
  candidateInfo: {
    display: 'flex', gap: '1rem', alignItems: 'center', flex: 1
  },
  avatar: {
    width: '48px', height: '48px', borderRadius: '50%',
    backgroundColor: '#1a1a2e', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.3rem', fontWeight: 'bold', flexShrink: 0
  },
  candidateName: { fontSize: '1rem', color: '#1a1a2e', margin: '0 0 0.2rem' },
  candidateEmail: { color: '#666', fontSize: '0.85rem', margin: '0 0 0.2rem' },
  candidatePhone: { color: '#888', fontSize: '0.82rem', margin: 0 },
  jobInfo: { flex: 1 },
  jobTitle: {
    fontSize: '1rem', color: '#1a1a2e',
    fontWeight: '600', margin: '0 0 0.2rem'
  },
  jobDept: { color: '#e94560', fontSize: '0.85rem', margin: '0 0 0.2rem' },
  appliedDate: { color: '#888', fontSize: '0.82rem', margin: 0 },
  statusBadge: {
    padding: '0.4rem 1rem', borderRadius: '20px',
    fontSize: '0.82rem', fontWeight: '600',
    whiteSpace: 'nowrap', alignSelf: 'flex-start'
  },
  fileRow: {
    display: 'flex', gap: '1rem',
    marginBottom: '0.8rem', flexWrap: 'wrap'
  },
  fileLink: {
    color: '#1565c0', fontSize: '0.9rem',
    textDecoration: 'none', fontWeight: '500'
  },
  noteRow: { marginBottom: '0.8rem' },
  noteInput: {
    width: '100%', padding: '0.6rem 1rem',
    border: '1px solid #ddd', borderRadius: '8px',
    fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none'
  },
  actionRow: {
    display: 'flex', gap: '0.5rem',
    flexWrap: 'wrap', marginBottom: '0.5rem'
  },
  actionBtn: {
    border: 'none', padding: '0.4rem 0.9rem',
    borderRadius: '6px', fontSize: '0.8rem',
    fontWeight: '600', cursor: 'pointer'
  },
  emailRow: {
    display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
    alignItems: 'center', marginTop: '0.8rem',
    paddingTop: '0.8rem', borderTop: '1px solid #f0f2f5'
  },
  emailLabel: { color: '#888', fontSize: '0.85rem', marginRight: '0.3rem' },
  emailBtn: {
    backgroundColor: '#e8f5e9', color: '#2e7d32', border: 'none',
    padding: '0.35rem 0.8rem', borderRadius: '6px',
    fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer'
  },
  empty: {
    textAlign: 'center', padding: '3rem', color: '#666',
    backgroundColor: 'white', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  center: { textAlign: 'center', padding: '4rem', color: '#666' }
};

export default Applicants;