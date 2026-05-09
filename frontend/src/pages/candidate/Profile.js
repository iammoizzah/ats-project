import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    password: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await API.post('/upload/document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updateData = {
        name: form.name,
        phone: form.phone
      };

      if (form.password) {
        updateData.password = form.password;
      }

      if (resumeFile) {
        setUploading(true);
        toast.info('Uploading resume...');
        updateData.resumeUrl = await uploadFile(resumeFile);
        setUploading(false);
      }

      if (coverFile) {
        setUploading(true);
        toast.info('Uploading cover letter...');
        updateData.coverLetterUrl = await uploadFile(coverFile);
        setUploading(false);
      }

      const { data } = await API.put('/auth/profile', updateData);

      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Profile updated successfully!');
      setForm({ ...form, password: '' });
      setResumeFile(null);
      setCoverFile(null);

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Profile</h1>
        <p style={styles.subtitle}>Update your personal information and documents</p>
      </div>

      <div style={styles.grid}>
        {/* Profile Info Card */}
        <div style={styles.card}>
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={styles.userName}>{user?.name}</h2>
              <p style={styles.userEmail}>{user?.email}</p>
              <span style={styles.roleBadge}>{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>Edit Information</h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                style={styles.input}
                placeholder="Your full name"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Phone Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                style={styles.input}
                placeholder="+92 300 1234567"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>New Password (leave blank to keep current)</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
                placeholder="••••••••"
              />
            </div>

            <div style={styles.divider} />

            <div style={styles.field}>
              <label style={styles.label}>Upload Resume (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={e => setResumeFile(e.target.files[0])}
                style={styles.fileInput}
              />
              {resumeFile && (
                <p style={styles.fileName}> {resumeFile.name}</p>
              )}
              {user?.resumeUrl && !resumeFile && (
                <a
                  href={user.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.existingFile}
                >
                   View current resume
                </a>
              )}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Upload Cover Letter (PDF/DOCX)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={e => setCoverFile(e.target.files[0])}
                style={styles.fileInput}
              />
              {coverFile && (
                <p style={styles.fileName}> {coverFile.name}</p>
              )}
              {user?.coverLetterUrl && !coverFile && (
                <a
                  href={user.coverLetterUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.existingFile}
                >
                   View current cover letter
                </a>
              )}
            </div>

            <button
              type="submit"
              style={styles.saveBtn}
              disabled={saving || uploading}
            >
              {uploading ? 'Uploading files...' : saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  header: { marginBottom: '2rem' },
  title: { fontSize: '2rem', color: '#1a1a2e', margin: '0 0 0.3rem' },
  subtitle: { color: '#666' },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '1.5rem'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    height: 'fit-content'
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1rem'
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#1a1a2e',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 'bold'
  },
  userName: { fontSize: '1.2rem', color: '#1a1a2e', margin: '0 0 0.3rem' },
  userEmail: { color: '#666', fontSize: '0.9rem', margin: '0 0 0.5rem' },
  roleBadge: {
    backgroundColor: '#e3f2fd',
    color: '#1565c0',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.82rem',
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  formTitle: { color: '#1a1a2e', marginBottom: '1.5rem' },
  field: { marginBottom: '1.2rem' },
  label: {
    display: 'block',
    marginBottom: '0.4rem',
    color: '#333',
    fontWeight: '500',
    fontSize: '0.9rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    outline: 'none'
  },
  fileInput: { width: '100%', padding: '0.5rem 0' },
  fileName: { color: '#2e7d32', fontSize: '0.85rem', marginTop: '0.3rem' },
  existingFile: {
    color: '#1565c0',
    fontSize: '0.85rem',
    textDecoration: 'none',
    display: 'block',
    marginTop: '0.3rem'
  },
  divider: {
    height: '1px',
    backgroundColor: '#f0f2f5',
    margin: '1.5rem 0'
  },
  saveBtn: {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    padding: '0.85rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%'
  }
};

export default Profile;