import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  HiOutlineMenu,
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineChevronDown,
  HiOutlineUser,
  HiOutlineLogout,
} from 'react-icons/hi';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const Header = ({ onMenuClick, title }) => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out!');
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/jobs?keyword=${searchQuery}`);
  };

  return (
    <header className="bg-navy-900/80 backdrop-blur-xl border-b border-white/5 px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors text-navy-300"
        >
          <HiOutlineMenu className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-display font-bold text-white hidden sm:block">{title}</h2>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 hidden md:flex">
        <div className="relative w-full">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search jobs, companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500/50 transition-all"
          />
        </div>
      </form>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <button className="relative p-2 rounded-xl hover:bg-white/10 transition-colors">
              <HiOutlineBell className="w-5 h-5 text-navy-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full" />
            </button>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center overflow-hidden shadow-glow">
                  {user?.avatar ? (
                    <img src={`http://localhost:5000${user.avatar}`} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-navy-900 font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-white hidden sm:block">
                  {user?.name?.split(' ')[0]}
                </span>
                <HiOutlineChevronDown className="w-4 h-4 text-navy-400 hidden sm:block" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-navy-800/95 backdrop-blur-xl rounded-2xl shadow-glass border border-white/10 py-2 animate-fade-in z-50">
                  <Link
                    to={user?.role === 'employer' ? '/employer/company' : '/seeker/profile'}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-navy-300 hover:text-teal-400 hover:bg-white/5 transition-colors"
                  >
                    <HiOutlineUser className="w-4 h-4" />
                    My Profile
                  </Link>
                  <hr className="my-1 border-white/10" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full"
                  >
                    <HiOutlineLogout className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-secondary py-2 px-4">Login</Link>
            <Link to="/register" className="btn-primary py-2 px-4">Get Started</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;