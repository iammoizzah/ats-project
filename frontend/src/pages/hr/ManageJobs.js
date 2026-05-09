import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', department: '', description: '',
    requirements: '', seats: 1, branch: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, branchesRes] = await Promise.all([
        API.get('/jobs/all'),
        API.get('/branches')
      ]);
      setJobs(jobsRes.data);
      setBranches(branchesRes.data);
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
      if (editingJob) {
        await API.put(`/jobs/${editingJob._id}`, form);
        toast.success('Job updated!');
      } else {
        await API.post('/jobs', form);
        toast.success('Job created!');
      }
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setForm({
      title: job.title,
      department: job.department,
      description: job.description,
      requirements: job.requirements,
      seats: job.seats,
      branch: job.branch?._id || ''
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await API.delete(`/jobs/${id}`);
      toast.success('Job deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const handleToggleActive = async (job) => {
    try {
      await API.put(`/jobs/${job._id}`, { isActive: !job.isActive });
      toast.success(`Job ${job.isActive ? 'deactivated' : 'activated'}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update job');
    }
  };

  const resetForm = () => {
    setForm({
      title: '', department: '', description: '',
      requirements: '', seats: 1, branch: ''
    });
    setShowForm(false);
    setEditingJob(null);
  };

  if (loading) return <div style={styles.center}>Loading jobs...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div>
          <h1 style={styles.title}>Manage Jobs</h1>
          <p style={styles.subtitle}>{jobs.length} job{jobs.length !== 1 ? 's' : ''} total</p>
        </div>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Post New Job'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>
            {editingJob ? 'Edit Job' : 'Post New Job'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Job Title *</label>
                <input
                  style={styles.input}
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. React Developer"
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Department *</label>
                <input
                  style={styles.input}
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  placeholder="e.g. Engineering"
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Branch *</label>
                <select
                  style={styles.input}
                  value={form.branch}
                  onChange={e => setForm({ ...form, branch: e.target.value })}
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map(b => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Available Seats *</label>
                <input
                  style={styles.input}
                  type="number"
                  min="1"
                  value={form.seats}
                  onChange={e => setForm({ ...form, seats: e.target.value })}
                  required
                />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Job Description *</label>
              <textarea
                style={styles.textarea}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the role and responsibilities..."
                rows={4}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Requirements *</label>
              <textarea
                style={styles.textarea}
                value={form.requirements}
                onChange={e => setForm({ ...form, requirements: e.target.value })}
                placeholder="List the required skills and experience..."
                rows={4}
                required
              />
            </div>
            <div style={styles.formBtns}>
              <button type="submit" style={styles.saveBtn} disabled={saving}>
                {saving ? 'Saving...' : editingJob ? 'Update Job' : 'Post Job'}
              </button>
              <button type="button" style={styles.cancelBtn} onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div style={styles.empty}>No jobs posted yet.</div>
      ) : (
        <div style={styles.list}>
          {jobs.map(job => (
            <div key={job._id} style={{
              ...styles.jobCard,
              opacity: job.isActive ? 1 : 0.6
            }}>
              <div style={styles.jobTop}>
                <div>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <p style={styles.jobMeta}>
                    {job.department} • 🏢 {job.branch?.name} • 💺 {job.seats} seats
                  </p>
                </div>
                <div style={styles.jobBadges}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: job.isActive ? '#e8f5e9' : '#f5f5f5',
                    color: job.isActive ? '#2e7d32' : '#888'
                  }}>
                    {job.isActive ? '🟢 Active' : '⚫ Inactive'}
                  </span>
                </div>
              </div>
              <p style={styles.jobDesc}>
                {job.description.substring(0, 100)}...
              </p>
              <div style={styles.jobBtns}>
                <button
                  style={styles.editBtn}
                  onClick={() => handleEdit(job)}
                >
                   Edit
                </button>
                <button
                  style={styles.toggleBtn}
                  onClick={() => handleToggleActive(job)}
                >
                  {job.isActive ? '⏸ Deactivate' : '▶ Activate'}
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(job._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
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
    backgroundColor: '#e94560', color: 'white', border: 'none',
    padding: '0.75rem 1.5rem', borderRadius: '8px',
    fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer'
  },
  formCard: {
    backgroundColor: 'white', borderRadius: '12px', padding: '2rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    marginBottom: '2rem', borderTop: '4px solid #e94560'
  },
  formTitle: { color: '#1a1a2e', marginBottom: '1.5rem' },
  formGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'
  },
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
  formBtns: { display: 'flex', gap: '1rem', marginTop: '0.5rem' },
  saveBtn: {
    backgroundColor: '#e94560', color: 'white', border: 'none',
    padding: '0.75rem 1.5rem', borderRadius: '8px',
    fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer'
  },
  cancelBtn: {
    backgroundColor: 'transparent', color: '#666',
    border: '1px solid #ddd', padding: '0.75rem 1.5rem',
    borderRadius: '8px', fontSize: '0.95rem', cursor: 'pointer'
  },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  jobCard: {
    backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', borderLeft: '4px solid #e94560'
  },
  jobTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem'
  },
  jobTitle: { fontSize: '1.1rem', color: '#1a1a2e', margin: '0 0 0.3rem' },
  jobMeta: { color: '#666', fontSize: '0.9rem', margin: 0 },
  jobBadges: { display: 'flex', gap: '0.5rem' },
  badge: {
    padding: '0.3rem 0.8rem', borderRadius: '20px',
    fontSize: '0.82rem', fontWeight: '600'
  },
  jobDesc: { color: '#777', fontSize: '0.9rem', marginBottom: '1rem' },
  jobBtns: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  editBtn: {
    backgroundColor: '#e3f2fd', color: '#1565c0', border: 'none',
    padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem'
  },
  toggleBtn: {
    backgroundColor: '#fff8e1', color: '#f57f17', border: 'none',
    padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem'
  },
  deleteBtn: {
    backgroundColor: '#ffebee', color: '#c62828', border: 'none',
    padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem'
  },
  empty: {
    textAlign: 'center', padding: '3rem', color: '#666',
    backgroundColor: 'white', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  center: { textAlign: 'center', padding: '4rem', color: '#666' }
};

export default ManageJobs;