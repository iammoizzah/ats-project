import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Find Your Dream Job 🚀
        </h1>
        <p style={styles.heroSubtitle}>
          Multi-branch recruitment platform connecting top talent
          with great opportunities across Pakistan
        </p>
        <div style={styles.heroButtons}>
          <Link to="/jobs" style={styles.primaryBtn}>
            Browse Jobs
          </Link>
          {!user && (
            <Link to="/register" style={styles.secondaryBtn}>
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div style={styles.stats}>
        {[
          { number: '50+', label: 'Job Openings' },
          { number: '4', label: 'Branch Locations' },
          { number: '200+', label: 'Candidates Hired' },
          { number: '10+', label: 'Departments' }
        ].map((stat, i) => (
          <div key={i} style={styles.statCard}>
            <h2 style={styles.statNumber}>{stat.number}</h2>
            <p style={styles.statLabel}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Branches Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Branch Locations</h2>
        <div style={styles.branchGrid}>
          {['Islamabad', 'Lahore', 'Karachi', 'Remote'].map((branch, i) => (
            <div key={i} style={styles.branchCard}>
              <div style={styles.branchIcon}>🏢</div>
              <h3 style={styles.branchName}>{branch}</h3>
              <Link
                to={`/jobs?branch=${branch}`}
                style={styles.branchLink}
              >
                View Jobs →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    color: 'white',
    padding: '5rem 2rem',
    textAlign: 'center'
  },
  heroTitle: {
    fontSize: '3rem',
    marginBottom: '1rem',
    fontWeight: 'bold'
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    color: '#ccc',
    maxWidth: '600px',
    margin: '0 auto 2.5rem'
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  primaryBtn: {
    backgroundColor: '#e94560',
    color: 'white',
    padding: '0.85rem 2rem',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1rem'
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    color: 'white',
    padding: '0.85rem 2rem',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    border: '2px solid white'
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    padding: '3rem 2rem',
    backgroundColor: '#f8f9fa',
    flexWrap: 'wrap'
  },
  statCard: {
    textAlign: 'center',
    padding: '1.5rem 2rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    minWidth: '140px'
  },
  statNumber: {
    fontSize: '2rem',
    color: '#e94560',
    margin: '0 0 0.3rem'
  },
  statLabel: {
    color: '#666',
    margin: 0,
    fontSize: '0.9rem'
  },
  section: {
    padding: '4rem 2rem',
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: '2rem',
    color: '#1a1a2e',
    marginBottom: '2.5rem'
  },
  branchGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap'
  },
  branchCard: {
    backgroundColor: 'white',
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '2rem',
    minWidth: '160px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
  },
  branchIcon: { fontSize: '2.5rem', marginBottom: '0.8rem' },
  branchName: {
    color: '#1a1a2e',
    margin: '0 0 1rem',
    fontSize: '1.1rem'
  },
  branchLink: {
    color: '#e94560',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.9rem'
  }
};

export default Home;