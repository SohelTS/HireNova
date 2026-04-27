import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// Layout
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Landing from './pages/Landing';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Seeker Pages
import SeekerDashboard from './pages/seeker/SeekerDashboard';
import SeekerApplications from './pages/seeker/Applications';
import SavedJobs from './pages/seeker/SavedJobs';
import SeekerProfile from './pages/seeker/Profile';

// Employer Pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import PostJob from './pages/employer/PostJob';
import ManageJobs from './pages/employer/ManageJobs';
import Applicants from './pages/employer/Applicants';
import CompanyProfile from './pages/employer/CompanyProfile';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/jobs" element={<Layout><Jobs /></Layout>} />
        <Route path="/jobs/:id" element={<Layout><JobDetail /></Layout>} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={user?.role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard'} />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to={user?.role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard'} />} />

        {/* Seeker Routes */}
        <Route path="/seeker/dashboard" element={
          <ProtectedRoute role="jobseeker">
            <Layout><SeekerDashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/seeker/applications" element={
          <ProtectedRoute role="jobseeker">
            <Layout><SeekerApplications /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/seeker/saved-jobs" element={
          <ProtectedRoute role="jobseeker">
            <Layout><SavedJobs /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/seeker/profile" element={
          <ProtectedRoute role="jobseeker">
            <Layout><SeekerProfile /></Layout>
          </ProtectedRoute>
        } />

        {/* Employer Routes */}
        <Route path="/employer/dashboard" element={
          <ProtectedRoute role="employer">
            <Layout><EmployerDashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/employer/post-job" element={
          <ProtectedRoute role="employer">
            <Layout><PostJob /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/employer/manage-jobs" element={
          <ProtectedRoute role="employer">
            <Layout><ManageJobs /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/employer/applicants/:jobId" element={
          <ProtectedRoute role="employer">
            <Layout><Applicants /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/employer/company" element={
          <ProtectedRoute role="employer">
            <Layout><CompanyProfile /></Layout>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;