import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const HRDashboard = () => {
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>HR Dashboard </h1>
        <p style={styles.subtitle}>Welcome back, {user?.name}</p>
      </div>

      <div style={styles.grid}>
        {[
          {
            
            title: 'Manage Jobs',
            desc: 'Post, edit and delete job listings',
            link: '/hr/jobs',
            color: '#e94560'
          },
          {
            
            title: 'Manage Branches',
            desc: 'Add and update branch locations',
            link: '/hr/branches',
            color: '#1a1a2e'
          },
          {
           
            title: 'Applicants',
            desc: 'Review and manage all applicants',
            link: '/hr/applicants',
            color: '#0f3460'
          },
          {
            
            title: 'Interviews',
            desc: 'Schedule and manage interviews',
            link: '/hr/interviews',
            color: '#533483'
          }
        ].map((card, i) => (
          <Link to={card.link} key={i} style={styles.cardLink}>
            <div style={{ ...styles.card, borderTop: `4px solid ${card.color}` }}>
              <div style={styles.cardIcon}>{card.icon}</div>
              <h3 style={styles.cardTitle}>{card.title}</h3>
              <p style={styles.cardDesc}>{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1100px', margin: '0 auto' },
  header: { marginBottom: '2.5rem' },
  title: { fontSize: '2rem', color: '#1a1a2e', margin: '0 0 0.5rem' },
  subtitle: { color: '#666', fontSize: '1rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1.5rem'
  },
  cardLink: { textDecoration: 'none' },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    cursor: 'pointer'
  },
  cardIcon: { fontSize: '2.5rem', marginBottom: '1rem' },
  cardTitle: { color: '#1a1a2e', margin: '0 0 0.5rem', fontSize: '1.1rem' },
  cardDesc: { color: '#666', margin: 0, fontSize: '0.9rem' }
};

export default HRDashboard;