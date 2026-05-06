import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterBranch, setFilterBranch] = useState('');

  useEffect(() => {
    fetchJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBranch]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterBranch) params.branch = filterBranch;
      const { data } = await API.get('/jobs', { params });
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{padding:'2rem',maxWidth:'1100px',margin:'0 auto'}}>
      <h1 style={{fontSize:'2rem',color:'#1a1a2e',margin:'0 0 0.3rem'}}>Open Positions</h1>
      <p style={{color:'#666',marginBottom:'2rem'}}>{filtered.length} jobs available</p>

      <div style={{display:'flex',gap:'1rem',marginBottom:'2rem',flexWrap:'wrap'}}>
        <input
          type="text"
          placeholder="Search by title or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{flex:1,minWidth:'200px',padding:'0.75rem 1rem',border:'1px solid #ddd',borderRadius:'8px',fontSize:'1rem',outline:'none'}}
        />
        <select
          value={filterBranch}
          onChange={(e) => setFilterBranch(e.target.value)}
          style={{padding:'0.75rem 1rem',border:'1px solid #ddd',borderRadius:'8px',fontSize:'1rem',outline:'none',backgroundColor:'white',minWidth:'160px'}}
        >
          <option value="">All Branches</option>
          <option value="Islamabad">Islamabad</option>
          <option value="Lahore">Lahore</option>
          <option value="Karachi">Karachi</option>
          <option value="Remote">Remote</option>
        </select>
      </div>

      {loading ? (
        <div style={{textAlign:'center',padding:'3rem',color:'#666'}}>Loading jobs...</div>
      ) : filtered.length === 0 ? (
        <div style={{textAlign:'center',padding:'3rem',color:'#666'}}>No jobs found.</div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:'1.5rem'}}>
          {filtered.map(job => (
            <div key={job._id} style={{backgroundColor:'white',borderRadius:'12px',padding:'1.5rem',boxShadow:'0 2px 12px rgba(0,0,0,0.08)',borderLeft:'4px solid #e94560',display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                  <h2 style={{fontSize:'1.1rem',color:'#1a1a2e',margin:'0 0 0.3rem'}}>{job.title}</h2>
                  <p style={{color:'#e94560',fontSize:'0.85rem',margin:0}}>{job.department}</p>
                </div>
                <span style={{backgroundColor:'#e8f5e9',color:'#2e7d32',padding:'0.3rem 0.7rem',borderRadius:'20px',fontSize:'0.8rem',fontWeight:'500',whiteSpace:'nowrap'}}>
                  {job.seats} seats
                </span>
              </div>
              <p style={{color:'#555',fontSize:'0.9rem',lineHeight:1.6,margin:0}}>
                {job.description.substring(0, 120)}...
              </p>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'0.5rem'}}>
                <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
                  <span style={{backgroundColor:'#f0f2f5',padding:'0.3rem 0.7rem',borderRadius:'20px',fontSize:'0.8rem',color:'#555'}}>🏢 {job.branch?.name}</span>
                  <span style={{backgroundColor:'#f0f2f5',padding:'0.3rem 0.7rem',borderRadius:'20px',fontSize:'0.8rem',color:'#555'}}>📍 {job.branch?.location}</span>
                </div>
                <Link to={`/jobs/${job._id}`} style={{color:'#e94560',fontWeight:'600',fontSize:'0.9rem',textDecoration:'none'}}>
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
