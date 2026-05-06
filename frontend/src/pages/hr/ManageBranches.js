import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';

const ManageBranches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [form, setForm] = useState({ name: '', location: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchBranches(); }, []);

  const fetchBranches = async () => {
    try {
      const { data } = await API.get('/branches');
      setBranches(data);
    } catch (error) {
      toast.error('Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingBranch) {
        await API.put(`/branches/${editingBranch._id}`, form);
        toast.success('Branch updated!');
      } else {
        await API.post('/branches', form);
        toast.success('Branch created!');
      }
      setForm({ name: '', location: '', description: '' });
      setShowForm(false);
      setEditingBranch(null);
      fetchBranches();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save branch');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setForm({
      name: branch.name,
      location: branch.location,
      description: branch.description
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this branch?')) return;
    try {
      await API.delete(`/branches/${id}`);
      toast.success('Branch deleted');
      fetchBranches();
    } catch (error) {
      toast.error('Failed to delete branch');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBranch(null);
    setForm({ name: '', location: '', description: '' });
  };

  if (loading) return <div style={styles.center}>Loading branches...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div>
          <h1 style={styles.title}>Manage Branches</h1>
          <p style={styles.subtitle}>{branches.length} branch{branches.length !== 1 ? 'es' : ''}</p>
        </div>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Branch'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>
            {editingBranch ? 'Edit Branch' : 'Add New Branch'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Branch Name *</label>
                <input
                  style={styles.input}
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Islamabad"
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Location *</label>
                <input
                  style={styles.input}
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Islamabad, Pakistan"
                  required
                />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea
                style={styles.textarea}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of this branch..."
                rows={3}
              />
            </div>
            <div style={styles.formBtns}>
              <button type="submit" style={styles.saveBtn} disabled={saving}>
                {saving ? 'Saving...' : editingBranch ? 'Update Branch' : 'Create Branch'}
              </button>
              <button type="button" style={styles.cancelBtn} onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Branches Grid */}
      {branches.length === 0 ? (
        <div style={styles.empty}>No branches yet. Add your first branch!</div>
      ) : (
        <div style={styles.grid}>
          {branches.map(branch => (
            <div key={branch._id} style={styles.card}>
              <div style={styles.cardIcon}>🏢</div>
              <h3 style={styles.branchName}>{branch.name}</h3>
              <p style={styles.branchLocation}>📍 {branch.location}</p>
              {branch.description && (
                <p style={styles.branchDesc}>{branch.description}</p>
              )}
              <div style={styles.cardBtns}>
                <button
                  style={styles.editBtn}
                  onClick={() => handleEdit(branch)}
                >
                  ✏️ Edit
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(branch._id)}
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
    backgroundColor: '#1a1a2e', color: 'white', border: 'none',
    padding: '0.75rem 1.5rem', borderRadius: '8px',
    fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer'
  },
  formCard: {
    backgroundColor: 'white', borderRadius: '12px', padding: '2rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    marginBottom: '2rem', borderTop: '4px solid #1a1a2e'
  },
  formTitle: { color: '#1a1a2e', marginBottom: '1.5rem' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  field: { marginBottom: '1rem' },
  label: {
    display: 'block', marginBottom: '0.4rem',
    color: '#333', fontWeight: '500', fontSize: '0.9rem'
  },
  input: {
    width: '100%', padding: '0.75rem 1rem', border: '1px solid #ddd',
    borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box', outline: 'none'
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1.5rem'
  },
  card: {
    backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', textAlign: 'center'
  },
  cardIcon: { fontSize: '2.5rem', marginBottom: '0.8rem' },
  branchName: { fontSize: '1.2rem', color: '#1a1a2e', margin: '0 0 0.4rem' },
  branchLocation: { color: '#666', fontSize: '0.9rem', margin: '0 0 0.5rem' },
  branchDesc: { color: '#888', fontSize: '0.85rem', margin: '0 0 1rem' },
  cardBtns: { display: 'flex', gap: '0.5rem', justifyContent: 'center' },
  editBtn: {
    backgroundColor: '#e3f2fd', color: '#1565c0', border: 'none',
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

export default ManageBranches;