import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineBriefcase,
  HiOutlineDocumentText,
  HiOutlineBookmark,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineArrowRight,
  HiOutlineLocationMarker,
  HiOutlineTrendingUp,
} from 'react-icons/hi';
import useAuthStore from '../../store/authStore';
import useJobStore from '../../store/jobStore';
import Loader from '../../components/common/Loader';

const statusColors = {
  pending: 'badge-warning',
  reviewed: 'badge-teal',
  shortlisted: 'badge-success',
  rejected: 'badge-danger',
  hired: 'badge-success',
};

export default function SeekerDashboard() {
  const { user } = useAuthStore();
  const { applications, savedJobs, jobs, loading, getMyApplications, getSavedJobs, getJobs } = useJobStore();

  useEffect(() => {
    getMyApplications();
    getSavedJobs();
    getJobs({ limit: 6 });
  }, []);

  const stats = [
    { label: 'Applications', value: applications.length, icon: HiOutlineDocumentText, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
    { label: 'Saved Jobs', value: savedJobs.length, icon: HiOutlineBookmark, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Shortlisted', value: applications.filter((a) => a.status === 'shortlisted').length, icon: HiOutlineCheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { label: 'Hired', value: applications.filter((a) => a.status === 'hired').length, icon: HiOutlineBriefcase, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  ];

  const profileCompletion = [user?.name, user?.email, user?.phone, user?.bio, user?.resume, user?.skills?.length > 0].filter(Boolean).length;

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/20 to-amber-500/10 border border-teal-500/20 p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-teal-400 text-sm font-medium mb-1">Welcome back 👋</p>
              <h1 className="text-2xl font-display font-bold text-white mb-1">
                {user?.name?.split(' ')[0]}
              </h1>
              <p className="text-navy-400 text-sm">
                {applications.length === 0
                  ? 'Start applying to jobs today!'
                  : `${applications.length} active application${applications.length > 1 ? 's' : ''}`}
              </p>
            </div>
            <Link to="/jobs" className="btn-primary hidden sm:flex items-center gap-2">
              Browse Jobs <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Profile completion */}
          <div className="mt-5 bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-navy-300 font-medium">Profile Completion</span>
              <span className="text-sm font-bold text-teal-400">{Math.round((profileCompletion / 6) * 100)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-teal-500 to-teal-400 rounded-full h-2 transition-all duration-700"
                style={{ width: `${(profileCompletion / 6) * 100}%` }}
              />
            </div>
            {!user?.resume && (
              <p className="text-navy-500 text-xs mt-2 flex items-center gap-1">
                <HiOutlineTrendingUp className="w-3 h-3 text-amber-400" />
                Upload your resume to boost your profile
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`card border ${stat.bg} group hover:-translate-y-1 transition-all duration-300`}>
            <div className={`w-10 h-10 rounded-xl ${stat.bg} border flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className={`text-3xl font-display font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-navy-500 mt-1 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Recent Applications</h2>
            <Link to="/seeker/applications" className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1">
              View all <HiOutlineArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-navy-500 text-sm mb-3">No applications yet</p>
              <Link to="/jobs" className="btn-primary text-sm py-2 px-4">Find Jobs</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 4).map((app) => (
                <div key={app._id} className="flex items-center gap-3 p-3 bg-white/3 rounded-xl border border-white/5 hover:border-teal-500/20 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-400 font-bold text-sm">
                      {app.job?.company?.name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{app.job?.title}</p>
                    <p className="text-xs text-navy-500 truncate">{app.job?.company?.name}</p>
                  </div>
                  <span className={`badge ${statusColors[app.status]} flex-shrink-0`}>{app.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Jobs */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Recommended Jobs</h2>
            <Link to="/jobs" className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1">
              View all <HiOutlineArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">💼</div>
              <p className="text-navy-500 text-sm">No jobs available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 4).map((job) => (
                <Link key={job._id} to={`/jobs/${job._id}`}>
                  <div className="flex items-center gap-3 p-3 bg-white/3 rounded-xl border border-white/5 hover:border-teal-500/20 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-teal-400 font-bold text-sm">{job.company?.name?.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm truncate group-hover:text-teal-400 transition-colors">
                        {job.title}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-navy-500">
                        <HiOutlineLocationMarker className="w-3 h-3" />
                        {job.location}
                      </div>
                    </div>
                    <span className="badge-teal flex-shrink-0">{job.jobType}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Saved Jobs */}
      {savedJobs.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Saved Jobs</h2>
            <Link to="/seeker/saved-jobs" className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1">
              View all <HiOutlineArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {savedJobs.slice(0, 4).map((job) => (
              <Link key={job._id} to={`/jobs/${job._id}`}>
                <div className="flex items-center gap-3 p-3 bg-white/3 rounded-xl border border-white/5 hover:border-amber-500/20 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <HiOutlineBookmark className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate group-hover:text-amber-400 transition-colors">
                      {job.title}
                    </p>
                    <p className="text-xs text-navy-500 truncate">{job.company?.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}