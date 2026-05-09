import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';

const MyInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const { data } = await API.get('/interviews/my');
      setInterviews(data);
    } catch (error) {
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.center}>Loading interviews...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Interviews</h1>
        <p style={styles.subtitle}>
          {interviews.length} interview{interviews.length !== 1 ? 's' : ''} scheduled
        </p>
      </div>

      {interviews.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyIcon}></p>
          <p style={styles.emptyText}>No interviews scheduled yet.</p>
          <p style={styles.emptyHint}>
            Keep applying! Interviews will appear here once scheduled by HR.
          </p>
        </div>
      ) : (
        <div style={styles.list}>
          {interviews.map(interview => {
            const date = new Date(interview.scheduledAt);
            const isPast = date < new Date();

            return (
              <div key={interview._id} style={styles.card}>
                <div style={styles.cardLeft}>
                  <div style={styles.dateBox}>
                    <span style={styles.dateDay}>
                      {date.getDate()}
                    </span>
                    <span style={styles.dateMonth}>
                      {date.toLocaleString('default', { month: 'short' })}
                    </span>
                    <span style={styles.dateYear}>
                      {date.getFullYear()}
                    </span>
                  </div>
                </div>

                <div style={styles.cardContent}>
                  <h2 style={styles.jobTitle}>
                    {interview.job?.title || 'Position'}
                  </h2>
                  <p style={styles.department}>
                    {interview.job?.department}
                  </p>

                  <div style={styles.infoRow}>
                    <span style={styles.infoItem}>
                       {date.toLocaleTimeString([], {
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: isPast ? '#f5f5f5' : '#e8f5e9',
                      color: isPast ? '#888' : '#2e7d32'
                    }}>
                      {isPast ? 'Completed' : '🟢 Upcoming'}
                    </span>
                  </div>

                  {interview.message && (
                    <div style={styles.message}>
                      <strong>Message from HR:</strong>
                      <p style={styles.messageText}>{interview.message}</p>
                    </div>
                  )}
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
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  header: { marginBottom: '2rem' },
  title: { fontSize: '2rem', color: '#1a1a2e', margin: '0 0 0.3rem' },
  subtitle: { color: '#666' },
  center: {
    textAlign: 'center', padding: '4rem', color: '#666', fontSize: '1.1rem'
  },
  empty: {
    textAlign: 'center',
    padding: '4rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  emptyIcon: { fontSize: '3rem', marginBottom: '1rem' },
  emptyText: { fontSize: '1.2rem', color: '#444', marginBottom: '0.5rem' },
  emptyHint: { color: '#888', fontSize: '0.9rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'flex-start',
    borderLeft: '4px solid #533483'
  },
  cardLeft: { flexShrink: 0 },
  dateBox: {
    backgroundColor: '#f3e5f5',
    borderRadius: '12px',
    padding: '0.8rem 1rem',
    textAlign: 'center',
    minWidth: '70px'
  },
  dateDay: {
    display: 'block',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#6a1b9a',
    lineHeight: 1
  },
  dateMonth: {
    display: 'block',
    fontSize: '0.85rem',
    color: '#6a1b9a',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  dateYear: {
    display: 'block',
    fontSize: '0.8rem',
    color: '#888',
    marginTop: '0.2rem'
  },
  cardContent: { flex: 1 },
  jobTitle: { fontSize: '1.2rem', color: '#1a1a2e', margin: '0 0 0.2rem' },
  department: { color: '#e94560', fontSize: '0.9rem', margin: '0 0 0.8rem' },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '0.8rem'
  },
  infoItem: { color: '#555', fontSize: '0.9rem' },
  statusBadge: {
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.82rem',
    fontWeight: '600'
  },
  message: {
    backgroundColor: '#f3e5f5',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    fontSize: '0.9rem',
    color: '#555',
    borderLeft: '3px solid #6a1b9a'
  },
  messageText: { margin: '0.3rem 0 0', lineHeight: 1.5 }
};

export default MyInterviews;