import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineBriefcase,
  HiOutlineUsers,
  HiOutlineEye,
  HiOutlinePlusCircle,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineChartBar,
} from 'react-icons/hi';
import useAuthStore from '../../store/authStore';
import useJobStore from '../../store/jobStore';
import Loader from '../../components/common/Loader';

export default function EmployerDashboard() {
  const { user } = useAuthStore();
  const { myJobs, loading, getMyJobs } = useJobStore();

  useEffect(() => {
    getMyJobs();
  }, []);

  const totalApplicants = myJobs.reduce((sum, job) => sum + (job.applicants?.length || 0), 0);
  const openJobs = myJobs.filter((j) => j.status === 'open').length;
  const closedJobs = myJobs.filter((j) => j.status === 'closed').length;

  const stats = [
    { label: 'Jobs Posted', value: myJobs.length, icon: HiOutlineBriefcase, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
    { label: 'Total Applicants', value: totalApplicants, icon: HiOutlineUsers, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Open Jobs', value: openJobs, icon: HiOutlineCheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { label: 'Closed Jobs', value: closedJobs, icon: HiOutlineXCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  ];

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/20 to-amber-500/10 border border-teal-500/20 p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-teal-400 text-sm font-medium mb-1">Employer Dashboard 🏢</p>
            <h1 className="text-2xl font-display font-bold text-white mb-1">
              {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-navy-400 text-sm">
              {openJobs} active job listing{openJobs !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="hidden sm:flex gap-3">
            {!user?.company && (
              <Link to="/employer/company" className="btn-secondary">
                Setup Company
              </Link>
            )}
            <Link to="/employer/post-job" className="btn-primary flex items-center gap-2">
              <HiOutlinePlusCircle className="w-4 h-4" />
              Post a Job
            </Link>
          </div>
        </div>

        {!user?.company && (
          <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <p className="text-amber-400 text-sm font-medium">
              ⚠️ Create a company profile before posting jobs!
            </p>
            <Link to="/employer/company" className="text-amber-300 underline text-sm mt-1 inline-block">
              Create Company Profile →
            </Link>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`card border ${stat.bg} hover:-translate-y-1 transition-all duration-300`}>
            <div className={`w-10 h-10 rounded-xl ${stat.bg} border flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className={`text-3xl font-display font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-navy-500 mt-1 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Jobs */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Recent Listings</h2>
          <Link to="/employer/manage-jobs" className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1">
            Manage all <HiOutlineArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {myJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="font-display font-bold text-white mb-2">No jobs posted yet</h3>
            <p className="text-navy-500 text-sm mb-4">Start hiring by posting your first job</p>
            <Link to="/employer/post-job" className="btn-primary">Post a Job</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myJobs.slice(0, 5).map((job) => (
              <div key={job._id} className="flex items-center gap-4 p-4 bg-white/3 rounded-xl border border-white/5 hover:border-teal-500/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-400 font-bold text-sm">{job.title?.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">{job.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`badge ${job.status === 'open' ? 'badge-success' : 'badge-danger'}`}>
                      {job.status}
                    </span>
                    <span className="text-xs text-navy-500">{job.applicants?.length || 0} applicants</span>
                  </div>
                </div>
                <Link
                  to={`/employer/applicants/${job._id}`}
                  className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-medium"
                >
                  <HiOutlineEye className="w-4 h-4" />
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { title: 'Post a New Job', desc: 'Create a new listing', icon: HiOutlinePlusCircle, link: '/employer/post-job', gradient: 'from-teal-500/20 to-teal-600/20', border: 'border-teal-500/20', color: 'text-teal-400' },
          { title: 'Manage Jobs', desc: 'Edit or close listings', icon: HiOutlineChartBar, link: '/employer/manage-jobs', gradient: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/20', color: 'text-blue-400' },
          { title: 'Company Profile', desc: 'Update company info', icon: HiOutlineUsers, link: '/employer/company', gradient: 'from-amber-500/20 to-amber-600/20', border: 'border-amber-500/20', color: 'text-amber-400' },
        ].map((action) => (
          <Link key={action.title} to={action.link}>
            <div className={`bg-gradient-to-br ${action.gradient} border ${action.border} rounded-2xl p-5 hover:-translate-y-1 hover:shadow-glow transition-all duration-300`}>
              <action.icon className={`w-8 h-8 ${action.color} mb-3`} />
              <h3 className="font-display font-bold text-white mb-1">{action.title}</h3>
              <p className="text-navy-400 text-sm">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}