import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => { fetchJob(); }, [id]);

  const fetchJob = async () => {
    try {
      const { data } = await API.get(`/jobs/${id}`);
      setJob(data);
    } catch (error) {
      toast.error('Job not found');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await API.post('/upload/document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.url;
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }
    if (!resumeFile) {
      toast.error('Please upload your resume');
      return;
    }

    try {
      setUploading(true);
      toast.info('Uploading resume...');
      const resumeUrl = await uploadFile(resumeFile);

      let coverLetterUrl = '';
      if (coverFile) {
        toast.info('Uploading cover letter...');
        coverLetterUrl = await uploadFile(coverFile);
      }

      setUploading(false);
      setApplying(true);

      await API.post('/applications', {
        jobId: id,
        resumeUrl,
        coverLetterUrl
      });

      toast.success('Application submitted successfully! 🎉');
      setShowForm(false);
      navigate('/candidate/applications');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setUploading(false);
      setApplying(false);
    }
  };

  if (loading) return <div style={styles.center}>Loading job details...</div>;
  if (!job) return null;

  return (
    <div style={styles.container}>
      {/* Job Header */}
      <div style={styles.jobHeader}>
        <div>
          <h1 style={styles.title}>{job.title}</h1>
          <p style={styles.department}>{job.department}</p>
          <div style={styles.tags}>
            <span style={styles.tag}>🏢 {job.branch?.name}</span>
            <span style={styles.tag}>📍 {job.branch?.location}</span>
            <span style={styles.tag}>💺 {job.seats} seats available</span>
          </div>
        </div>

        {user?.role === 'candidate' && (
          <button
            style={styles.applyBtn}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '✉️ Apply Now'}
          </button>
        )}

        {!user && (
          <button
            style={styles.applyBtn}
            onClick={() => navigate('/login')}
          >
            Login to Apply
          </button>
        )}
      </div>

      {/* Apply Form */}
      {showForm && (
        <div style={styles.applyForm}>
          <h3 style={styles.formTitle}>Submit Your Application</h3>
          <form onSubmit={handleApply}>
            <div style={styles.field}>
              <label style={styles.label}>
                Resume (PDF only) *
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResumeFile(e.target.files[0])}
                style={styles.fileInput}
                required
              />
              {resumeFile && (
                <p style={styles.fileName}>✅ {resumeFile.name}</p>
              )}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Cover Letter (PDF/DOCX — optional)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCoverFile(e.target.files[0])}
                style={styles.fileInput}
              />
              {coverFile && (
                <p style={styles.fileName}>✅ {coverFile.name}</p>
              )}
            </div>

            <button
              type="submit"
              style={styles.submitBtn}
              disabled={uploading || applying}
            >
              {uploading
                ? 'Uploading files...'
                : applying
                ? 'Submitting...'
                : 'Submit Application'}
            </button>
          </form>
        </div>
      )}

      {/* Job Details */}
      <div style={styles.detailsGrid}>
        <div style={styles.detailCard}>
          <h3 style={styles.detailTitle}>Job Description</h3>
          <p style={styles.detailText}>{job.description}</p>
        </div>

        <div style={styles.detailCard}>
          <h3 style={styles.detailTitle}>Requirements</h3>
          <p style={styles.detailText}>{job.requirements}</p>
        </div>
      </div>

      {/* Posted by */}
      <div style={styles.postedBy}>
        <p style={styles.postedText}>
          Posted by: <strong>{job.postedBy?.name}</strong> •{' '}
          {new Date(job.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  center: {
    textAlign: 'center', padding: '4rem', color: '#666', fontSize: '1.1rem'
  },
  jobHeader: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1.5rem',
    borderTop: '4px solid #e94560'
  },
  title: { fontSize: '1.8rem', color: '#1a1a2e', margin: '0 0 0.3rem' },
  department: { color: '#e94560', margin: '0 0 1rem', fontWeight: '500' },
  tags: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  tag: {
    backgroundColor: '#f0f2f5',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    color: '#555'
  },
  applyBtn: {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    padding: '0.85rem 2rem',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  applyForm: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    marginBottom: '1.5rem',
    borderLeft: '4px solid #e94560'
  },
  formTitle: {
    color: '#1a1a2e', marginBottom: '1.5rem', fontSize: '1.2rem'
  },
  field: { marginBottom: '1.2rem' },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#333',
    fontWeight: '500',
    fontSize: '0.9rem'
  },
  fileInput: { width: '100%', padding: '0.5rem 0' },
  fileName: { color: '#2e7d32', fontSize: '0.85rem', marginTop: '0.3rem' },
  submitBtn: {
    backgroundColor: '#1a1a2e',
    color: 'white',
    border: 'none',
    padding: '0.85rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  detailCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  detailTitle: {
    color: '#1a1a2e', marginBottom: '1rem', fontSize: '1.1rem'
  },
  detailText: { color: '#555', lineHeight: 1.7, whiteSpace: 'pre-line' },
  postedBy: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1rem 1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  postedText: { color: '#666', fontSize: '0.9rem', margin: 0 }
};

export default JobDetail;