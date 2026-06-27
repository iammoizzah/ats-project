import Interviews from './pages/hr/Interviews';
import Profile from './pages/candidate/Profile';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Public
import Home from './pages/public/Home';
import Jobs from './pages/public/Jobs';
import JobDetail from './pages/public/JobDetail';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Candidate
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import MyApplications from './pages/candidate/MyApplications';
import MyInterviews from './pages/candidate/MyInterviews';

// HR
import HRDashboard from './pages/hr/HRDashboard';
import Applicants from './pages/hr/Applicants';
import ManageBranches from './pages/hr/ManageBranches';
import ManageJobs from './pages/hr/ManageJobs'; // ✅ ADDED
import { useEffect } from 'react';

function App() {
let count=0;

useEffect(() => {
  console.log('sf');
}, [count])

  function funct(params) {
    count++;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Candidate */}
          <Route path="/candidate/dashboard" element={
            <ProtectedRoute roles={['candidate']}>
              <CandidateDashboard />
            </ProtectedRoute>
          } />
          <Route path="/candidate/profile" element={
            <ProtectedRoute roles={['candidate']}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/candidate/applications" element={
            <ProtectedRoute roles={['candidate']}>
              <MyApplications />
            </ProtectedRoute>
          } />
          <Route path="/candidate/interviews" element={
            <ProtectedRoute roles={['candidate']}>
              <MyInterviews />
            </ProtectedRoute>
          } />

          {/* HR */}
          <Route path="/hr/dashboard" element={
            <ProtectedRoute roles={['hr', 'admin']}>
              <HRDashboard />
            </ProtectedRoute>
          } />
          <Route path="/hr/applicants" element={
            <ProtectedRoute roles={['hr', 'admin']}>
              <Applicants />
            </ProtectedRoute>
          } />
          <Route path="/hr/interviews" element={
            <ProtectedRoute roles={['hr', 'admin']}>
              <Interviews />
            </ProtectedRoute>
          } />
          <Route path="/hr/branches" element={
            <ProtectedRoute roles={['hr', 'admin']}>
              <ManageBranches />
            </ProtectedRoute>
          } />
          <Route path="/hr/jobs" element={
            <ProtectedRoute roles={['hr', 'admin']}>
              <ManageJobs />
            </ProtectedRoute>
          } />

        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App; 

