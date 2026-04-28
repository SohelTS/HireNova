import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  HiOutlineSearch,
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlineUsers,
  HiOutlineOfficeBuilding,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineStar,
} from 'react-icons/hi';
import useJobStore from '../store/jobStore';
import useAuthStore from '../store/authStore';

const categories = [
  { name: 'Technology', icon: '💻', count: '1.2k+' },
  { name: 'Marketing', icon: '📢', count: '800+' },
  { name: 'Finance', icon: '💰', count: '600+' },
  { name: 'Healthcare', icon: '🏥', count: '900+' },
  { name: 'Design', icon: '🎨', count: '500+' },
  { name: 'Education', icon: '📚', count: '400+' },
  { name: 'Engineering', icon: '⚙️', count: '700+' },
  { name: 'Sales', icon: '📈', count: '650+' },
];

const stats = [
  { value: '10k+', label: 'Active Jobs', icon: HiOutlineBriefcase },
  { value: '5k+', label: 'Companies', icon: HiOutlineOfficeBuilding },
  { value: '50k+', label: 'Job Seekers', icon: HiOutlineUsers },
  { value: '95%', label: 'Success Rate', icon: HiOutlineStar },
];

const features = [
  { icon: HiOutlineLightningBolt, title: 'Instant Matching', desc: 'AI-powered job matching based on your skills and experience' },
  { icon: HiOutlineShieldCheck, title: 'Verified Companies', desc: 'All companies are verified for authenticity and credibility' },
  { icon: HiOutlineCheckCircle, title: 'Easy Apply', desc: 'One-click application with your saved resume and profile' },
];

export default function Landing() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const { jobs, getJobs } = useJobStore();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    getJobs({ limit: 6 });
  }, []);

  return (
    <div className="min-h-screen bg-navy-950 font-sans overflow-x-hidden">
      {/* Background mesh */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-teal-600/5 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-navy-900 font-display font-bold">H</span>
              </div>
              <span className="text-xl font-display font-bold text-white">HireNova</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Browse Jobs', 'Categories', 'Features'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-navy-400 hover:text-teal-400 font-medium text-sm transition-colors">
                  {item}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link to={user?.role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard'}
                  className="btn-primary">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-navy-400 hover:text-white font-medium text-sm transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 rounded-full px-4 py-2 text-teal-400 text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
            10,000+ new jobs posted this month
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1] mb-6 animate-slide-up">
            Find Your
            <span className="block gradient-text">Dream Career</span>
            with HireNova
          </h1>

          <p className="text-lg text-navy-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Connect with top employers, discover opportunities that match your skills,
            and take the next step in your career journey.
          </p>

          {/* Search */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 max-w-3xl mx-auto shadow-glass animate-slide-up">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2 flex-1 px-4 py-2.5 bg-white/5 rounded-xl">
                <HiOutlineSearch className="w-5 h-5 text-teal-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, keywords..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="flex-1 outline-none bg-transparent text-white placeholder-navy-500 text-sm"
                />
              </div>
              <div className="flex items-center gap-2 flex-1 px-4 py-2.5 bg-white/5 rounded-xl">
                <HiOutlineLocationMarker className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 outline-none bg-transparent text-white placeholder-navy-500 text-sm"
                />
              </div>
              <Link
                to={`/jobs?keyword=${keyword}&location=${location}`}
                className="btn-primary whitespace-nowrap rounded-xl px-6"
              >
                Search Jobs
              </Link>
            </div>
          </div>

          {/* Popular */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 animate-fade-in">
            <span className="text-navy-500 text-sm">Popular:</span>
            {['React Developer', 'UI Designer', 'Data Analyst', 'Product Manager'].map((term) => (
              <Link key={term} to={`/jobs?keyword=${term}`}
                className="text-sm text-navy-400 hover:text-teal-400 bg-white/5 hover:bg-teal-500/10 border border-white/10 hover:border-teal-500/30 px-3 py-1 rounded-full transition-all">
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/5 bg-white/2 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:shadow-glow transition-all">
                  <stat.icon className="w-6 h-6 text-teal-400" />
                </div>
                <div className="text-3xl font-display font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-navy-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Browse by <span className="gradient-text">Category</span>
            </h2>
            <p className="text-navy-400 max-w-xl mx-auto">
              Explore thousands of opportunities across different industries
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.name} to={`/jobs?category=${cat.name}`}>
                <div className="card card-hover text-center group">
                  <div className="text-3xl mb-3 group-hover:animate-float">{cat.icon}</div>
                  <h3 className="font-display font-semibold text-white group-hover:text-teal-400 transition-colors text-sm">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-navy-500 mt-1">{cat.count} jobs</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 px-4 bg-white/2">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-14">
            <div>
              <h2 className="text-4xl font-display font-bold text-white mb-2">
                Featured <span className="gradient-text">Jobs</span>
              </h2>
              <p className="text-navy-400">Handpicked opportunities from top companies</p>
            </div>
            <Link to="/jobs" className="btn-secondary hidden sm:flex items-center gap-2">
              View All <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.slice(0, 6).map((job) => (
              <Link key={job._id} to={`/jobs/${job._id}`}>
                <div className="card card-hover group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                      <span className="text-teal-400 font-display font-bold">
                        {job.company?.name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-navy-400">{job.company?.name}</p>
                      <h3 className="font-display font-bold text-white group-hover:text-teal-400 transition-colors text-sm">
                        {job.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="badge-teal">{job.jobType}</span>
                    <span className="badge-gray">{job.location}</span>
                  </div>
                  {job.salary?.min > 0 && (
                    <p className="text-amber-400 font-semibold text-sm">
                      ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                      <span className="text-navy-500 font-normal">/{job.salary.period}</span>
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Why Choose <span className="gradient-text">HireNova</span>
            </h2>
            <p className="text-navy-400 max-w-xl mx-auto">
              Everything you need to find your perfect job or hire the best talent
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card-glow group hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-teal-500/20 border border-teal-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-glow transition-all">
                  <feature.icon className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="font-display font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-navy-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="card-glow text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-amber-500/5" />
            <div className="relative z-10">
              <h2 className="text-4xl font-display font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-navy-400 mb-8">
                Join thousands of job seekers and employers who trust HireNova
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register?role=jobseeker" className="btn-primary py-3 px-8">
                  Find a Job
                </Link>
                <Link to="/register?role=employer" className="btn-amber py-3 px-8">
                  Hire Talent
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center shadow-glow">
              <span className="text-navy-900 font-bold text-sm">H</span>
            </div>
            <span className="font-display font-bold text-white">HireNova</span>
          </div>
          <p className="text-navy-500 text-sm">© 2026 HireNova. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Contact'].map((item) => (
              <a key={item} href="#" className="text-navy-500 hover:text-teal-400 text-sm transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}