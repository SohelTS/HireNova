import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(formData);
    if (res.success) {
      toast.success('Welcome back!');
      const user = useAuthStore.getState().user;
      navigate(user?.role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard');
    } else {
      toast.error(res.error || 'Login failed!');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl" />
      </div>

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-navy-900 to-navy-950 border-r border-white/5 flex-col items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl flex items-center justify-center shadow-glow mx-auto mb-8">
            <span className="text-navy-900 font-display font-bold text-4xl">H</span>
          </div>
          <h2 className="text-4xl font-display font-bold text-white mb-4">
            Welcome to <span className="gradient-text">HireNova</span>
          </h2>
          <p className="text-navy-400 leading-relaxed mb-8">
            Your gateway to thousands of career opportunities. Connect with top employers and land your dream job.
          </p>
          <div className="space-y-4">
            {[
              '10,000+ active job listings',
              '5,000+ verified companies',
              'Real-time application tracking',
              'Smart job recommendations',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-left">
                <div className="w-6 h-6 bg-teal-500/20 border border-teal-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-teal-400 rounded-full" />
                </div>
                <span className="text-navy-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile Logo */}
          <div className="text-center mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-navy-900 font-bold">H</span>
              </div>
              <span className="text-xl font-display font-bold text-white">HireNova</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Sign In</h1>
            <p className="text-navy-400">Welcome back! Enter your credentials to continue.</p>
          </div>

          <div className="card space-y-5">
            <div>
              <label className="block text-sm font-semibold text-navy-300 mb-2">Email Address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy-300 mb-2">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input-field pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-500 hover:text-teal-400 transition-colors"
                >
                  {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : 'Sign In'}
            </button>

            <p className="text-center text-sm text-navy-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-teal-400 font-semibold hover:text-teal-300 transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}