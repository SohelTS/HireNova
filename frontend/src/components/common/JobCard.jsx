import { Link } from 'react-router-dom';
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineClock,
  HiOutlineBookmark,
  HiBookmark,
} from 'react-icons/hi';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import useJobStore from '../../store/jobStore';
import toast from 'react-hot-toast';

const jobTypeColors = {
  'full-time': 'badge-success',
  'part-time': 'badge-warning',
  'contract': 'badge-teal',
  'internship': 'badge-gray',
  'remote': 'badge-teal',
};

const JobCard = ({ job }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { toggleSavedJob, savedJobs } = useJobStore();
  const [saving, setSaving] = useState(false);

  const isSaved = savedJobs?.some((s) => s._id === job._id);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to save jobs!');
      return;
    }
    setSaving(true);
    const res = await toggleSavedJob(job._id);
    if (res.success) {
      toast.success(isSaved ? 'Job removed!' : 'Job saved!');
    }
    setSaving(false);
  };

  return (
    <Link to={`/jobs/${job._id}`}>
      <div className="card card-hover group animate-slide-up relative overflow-hidden">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-amber-500/0 group-hover:from-teal-500/5 group-hover:to-amber-500/5 transition-all duration-500 rounded-2xl" />

        {/* Header */}
        <div className="flex items-start justify-between mb-4 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-700/20 border border-teal-500/20 flex items-center justify-center overflow-hidden flex-shrink-0">
              {job.company?.logo ? (
                <img src={`http://localhost:5000${job.company.logo}`} alt={job.company.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-teal-400 font-display font-bold text-lg">
                  {job.company?.name?.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-navy-400">{job.company?.name}</p>
              <h3 className="font-display font-bold text-white group-hover:text-teal-400 transition-colors text-sm">
                {job.title}
              </h3>
            </div>
          </div>

          {user?.role !== 'employer' && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="p-2 rounded-xl hover:bg-teal-500/10 transition-colors flex-shrink-0"
            >
              {isSaved ? (
                <HiBookmark className="w-5 h-5 text-teal-400" />
              ) : (
                <HiOutlineBookmark className="w-5 h-5 text-navy-400 group-hover:text-teal-400" />
              )}
            </button>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={jobTypeColors[job.jobType] || 'badge-gray'}>{job.jobType}</span>
          <span className="badge-gray">{job.experience}</span>
          {job.isRemote && <span className="badge-teal">Remote</span>}
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-navy-400">
            <HiOutlineLocationMarker className="w-3.5 h-3.5 text-teal-500" />
            <span>{job.location}</span>
          </div>
          {job.salary?.min > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <HiOutlineCurrencyDollar className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-semibold text-amber-400">
                ${job.salary?.min?.toLocaleString()} - ${job.salary?.max?.toLocaleString()}
                <span className="text-navy-500 font-normal"> /{job.salary?.period}</span>
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-navy-500">
            <HiOutlineClock className="w-3.5 h-3.5" />
            <span>{new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-navy-500">{job.applicants?.length || 0} applicants</span>
          <span className="text-xs font-bold text-teal-400 group-hover:text-teal-300 flex items-center gap-1">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;