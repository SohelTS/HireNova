import { NavLink, useNavigate } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineDocumentText,
  HiOutlineBookmark,
  HiOutlineUser,
  HiOutlineOfficeBuilding,
  HiOutlinePlusCircle,
  HiOutlineClipboardList,
  HiOutlineLogout,
  HiOutlineChartBar,
} from 'react-icons/hi';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const seekerLinks = [
    { to: '/seeker/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { to: '/jobs', icon: HiOutlineBriefcase, label: 'Browse Jobs' },
    { to: '/seeker/applications', icon: HiOutlineDocumentText, label: 'Applications' },
    { to: '/seeker/saved-jobs', icon: HiOutlineBookmark, label: 'Saved Jobs' },
    { to: '/seeker/profile', icon: HiOutlineUser, label: 'My Profile' },
  ];

  const employerLinks = [
    { to: '/employer/dashboard', icon: HiOutlineChartBar, label: 'Dashboard' },
    { to: '/employer/post-job', icon: HiOutlinePlusCircle, label: 'Post a Job' },
    { to: '/employer/manage-jobs', icon: HiOutlineClipboardList, label: 'Manage Jobs' },
    { to: '/jobs', icon: HiOutlineBriefcase, label: 'Browse Jobs' },
    { to: '/employer/company', icon: HiOutlineOfficeBuilding, label: 'Company Profile' },
  ];

  const links = user?.role === 'employer' ? employerLinks : seekerLinks;

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully!');
    navigate('/');
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 z-30
        bg-navy-950/95 backdrop-blur-xl border-r border-white/5
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-glow flex-shrink-0">
              <span className="text-navy-900 font-display font-bold text-lg">H</span>
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-white">HireNova</h1>
              <p className="text-xs text-navy-400 capitalize">{user?.role} Portal</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-teal-500/10 to-amber-500/10 border border-teal-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-glow">
                {user?.avatar ? (
                  <img src={`http://localhost:5000${user.avatar}`} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-navy-900 font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{user?.name}</p>
                <p className="text-xs text-navy-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-widest px-4 mb-3">
            Navigation
          </p>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <HiOutlineLogout className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;