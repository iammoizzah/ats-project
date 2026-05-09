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

const STEPS = [
  'Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected'
];

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await API.get('/applications/my');
      setApplications(data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.center}>Loading applications...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Applications</h1>
        <p style={styles.subtitle}>
          {applications.length} application{applications.length !== 1 ? 's' : ''} submitted
        </p>
      </div>

      {applications.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyText}> No applications yet.</p>
          <a href="/jobs" style={styles.browseLink}>Browse Jobs →</a>
        </div>
      ) : (
        <div style={styles.list}>
          {applications.map(app => {
            const statusStyle = statusColors[app.status] || {};
            const currentIndex = STEPS.indexOf(app.status);
            const isRejected = app.status === 'Rejected';

            return (
              <div key={app._id} style={styles.card}>

                {/* Top Row */}
                <div style={styles.cardTop}>
                  <div>
                    <h2 style={styles.jobTitle}>
                      {app.job?.title || 'Job Removed'}
                    </h2>
                    <p style={styles.department}>{app.job?.department}</p>
                    <p style={styles.branch}>
                       {app.job?.branch?.name || 'N/A'} • Applied{' '}
                      {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: statusStyle.bg,
                    color: statusStyle.color
                  }}>
                    {app.status}
                  </span>
                </div>

                {/* Status Timeline */}
                <div style={styles.timeline}>
                  {STEPS.map((step, i) => {
                    const isDone = !isRejected && i <= currentIndex;
                    return (
                      <div key={i} style={styles.timelineStep}>
                        <div style={{
                          ...styles.timelineDot,
                          backgroundColor: isDone ? '#2e7d32' : '#ddd'
                        }} />
                        <span style={{
                          ...styles.timelineLabel,
                          color: isDone ? '#2e7d32' : '#aaa',
                          fontWeight: isDone ? '600' : '400'
                        }}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* File Links */}
                <div style={styles.cardFooter}>
                  {app.resumeUrl && (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.fileLink}
                    >
                       View Resume
                    </a>
                  )}
                  {app.coverLetterUrl && (
                    <a
                      href={app.coverLetterUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.fileLink}
                    >
                       Cover Letter
                    </a>
                  )}
                </div>

                {/* HR Notes */}
                {app.hrNotes && (
                  <div style={styles.hrNotes}>
                    <strong>HR Note:</strong> {app.hrNotes}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  header: { marginBottom: '2rem' },
  title: { fontSize: '2rem', color: '#1a1a2e', margin: '0 0 0.3rem' },
  subtitle: { color: '#666' },
  center: {
    textAlign: 'center', padding: '4rem', color: '#666', fontSize: '1.1rem'
  },
  empty: {
    textAlign: 'center', padding: '4rem',
    backgroundColor: 'white', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  emptyText: { fontSize: '1.2rem', color: '#666', marginBottom: '1rem' },
  browseLink: {
    color: '#e94560', fontWeight: '600', fontSize: '1rem', textDecoration: 'none'
  },
  list: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  card: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    borderLeft: '4px solid #e94560'
  },
  cardTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', flexWrap: 'wrap',
    gap: '1rem', marginBottom: '1.2rem'
  },
  jobTitle: { fontSize: '1.2rem', color: '#1a1a2e', margin: '0 0 0.2rem' },
  department: { color: '#e94560', fontSize: '0.9rem', margin: '0 0 0.3rem' },
  branch: { color: '#888', fontSize: '0.85rem', margin: 0 },
  statusBadge: {
    padding: '0.4rem 1rem', borderRadius: '20px',
    fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap'
  },
  timeline: {
    display: 'flex', overflowX: 'auto',
    paddingBottom: '0.5rem', marginBottom: '1rem'
  },
  timelineStep: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', flex: 1, minWidth: '90px'
  },
  timelineDot: {
    width: '14px', height: '14px',
    borderRadius: '50%', marginBottom: '0.4rem'
  },
  timelineLabel: { fontSize: '0.72rem', textAlign: 'center', lineHeight: 1.3 },
  cardFooter: {
    display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem'
  },
  fileLink: {
    color: '#1565c0', fontSize: '0.9rem',
    textDecoration: 'none', fontWeight: '500'
  },
  hrNotes: {
    marginTop: '1rem', padding: '0.75rem 1rem',
    backgroundColor: '#fff8e1', borderRadius: '8px',
    fontSize: '0.9rem', color: '#555',
    borderLeft: '3px solid #f57f17'
  }
};

export default MyApplications;