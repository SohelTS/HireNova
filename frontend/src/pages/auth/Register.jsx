import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineBriefcase,
} from 'react-icons/hi';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function Register() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: searchParams.get('role') || 'jobseeker',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }
    const res = await register(formData);
    if (res.success) {
      toast.success('Account created!');
      navigate(formData.role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard');
    } else {
      toast.error(res.error || 'Registration failed!');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl" />
      </div>

      {/* Left Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-navy-900 font-bold">H</span>
              </div>
              <span className="text-xl font-display font-bold text-white">HireNova</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Create Account</h1>
            <p className="text-navy-400">Join HireNova and start your journey today.</p>
          </div>

          <div className="card space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-navy-300 mb-3">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'jobseeker', label: 'Job Seeker', icon: HiOutlineUser },
                  { value: 'employer', label: 'Employer', icon: HiOutlineBriefcase },
                ].map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.value })}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all font-semibold text-sm ${
                      formData.role === role.value
                        ? 'border-teal-500 bg-teal-500/10 text-teal-400'
                        : 'border-white/10 text-navy-400 hover:border-white/20'
                    }`}
                  >
                    <role.icon className="w-5 h-5" />
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-navy-300 mb-2">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-navy-300 mb-2">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
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
                  Creating account...
                </div>
              ) : 'Create Account'}
            </button>

            <p className="text-center text-sm text-navy-500">
              Already have an account?{' '}
              <Link to="/login" className="text-teal-400 font-semibold hover:text-teal-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-navy-900 to-navy-950 border-l border-white/5 flex-col items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-8">
            {formData.role === 'employer' ? '🏢' : '🚀'}
          </div>
          <h2 className="text-4xl font-display font-bold text-white mb-4">
            {formData.role === 'employer' ? (
              <>Find the <span className="gradient-text">Best Talent</span></>
            ) : (
              <>Land Your <span className="gradient-text">Dream Job</span></>
            )}
          </h2>
          <p className="text-navy-400 leading-relaxed mb-8">
            {formData.role === 'employer'
              ? 'Post jobs, review applications, and hire top candidates all in one place.'
              : 'Browse thousands of jobs, apply with one click, and track your applications.'}
          </p>
          <div className="space-y-3">
            {(formData.role === 'employer' ? [
              'Post unlimited job listings',
              'Review and manage applicants',
              'Build your company profile',
              'Download resumes instantly',
            ] : [
              'Access 10,000+ job listings',
              'One-click applications',
              'Track application status',
              'Save jobs for later',
            ]).map((item) => (
              <div key={item} className="flex items-center gap-3 text-left bg-white/5 rounded-xl px-4 py-3">
                <div className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0" />
                <span className="text-navy-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}