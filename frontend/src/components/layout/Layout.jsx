import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import useAuthStore from '../../store/authStore';

const pageTitles = {
  '/seeker/dashboard': 'Dashboard',
  '/seeker/applications': 'My Applications',
  '/seeker/saved-jobs': 'Saved Jobs',
  '/seeker/profile': 'My Profile',
  '/employer/dashboard': 'Dashboard',
  '/employer/post-job': 'Post a Job',
  '/employer/manage-jobs': 'Manage Jobs',
  '/employer/company': 'Company Profile',
  '/jobs': 'Browse Jobs',
};

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'HireNova';

  return (
    <div className="flex h-screen overflow-hidden"
      style={{ backgroundColor: '#0f172a' }}>
      {isAuthenticated && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden"
        style={{ backgroundColor: '#0f172a' }}>
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
        />
        <main
          className="flex-1 overflow-y-auto p-4 lg:p-6 animate-fade-in"
          style={{ backgroundColor: '#0f172a' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;