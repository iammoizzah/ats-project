import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
         ATS Portal
      </Link>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/jobs" style={styles.link}>Jobs</Link>

        {!user ? (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.btnLink}>Register</Link>
          </>
        ) : (
          <>
            {user.role === 'candidate' && (
              <Link to="/candidate/dashboard" style={styles.link}>
                Dashboard
              </Link>
            )}
            {(user.role === 'hr' || user.role === 'admin') && (
              <Link to="/hr/dashboard" style={styles.link}>
                HR Dashboard
              </Link>
            )}
            <span style={styles.userName}>👤 {user.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#1a1a2e',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
  },
  brand: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.4rem',
    fontWeight: 'bold'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  link: {
    color: '#ccc',
    textDecoration: 'none',
    fontSize: '0.95rem'
  },
  btnLink: {
    color: 'white',
    textDecoration: 'none',
    backgroundColor: '#e94560',
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem'
  },
  userName: {
    color: '#a8dadc',
    fontSize: '0.9rem'
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #e94560',
    color: '#e94560',
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  }
};

export default Navbar;