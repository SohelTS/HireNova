import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineDocumentText,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineEye,
  HiOutlineTrash,
} from 'react-icons/hi';
import useJobStore from '../../store/jobStore';
import Loader from '../../components/common/Loader';
import * as api from '../../utils/axios';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'badge-warning',
  reviewed: 'badge-primary',
  shortlisted: 'badge-success',
  rejected: 'badge-danger',
  hired: 'badge-success',
};

export default function Applications() {
  const { applications, loading, getMyApplications } = useJobStore();

  useEffect(() => {
    getMyApplications();
  }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await api.deleteApplication(id);
      toast.success('Application withdrawn!');
      getMyApplications();
    } catch (err) {
      toast.error('Failed to withdraw application!');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">My Applications</h1>
          <p className="text-slate-500 text-sm mt-1">
            {applications.length} total applications
          </p>
        </div>
        <Link to="/jobs" className="btn-primary text-sm py-2">
          Find More Jobs
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No applications yet</h3>
          <p className="text-slate-500 mb-6">Start applying to jobs to track your progress here</p>
          <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="card hover:shadow-card-hover transition-all">
              <div className="flex items-start gap-4">
                {/* Company Logo */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {app.job?.company?.logo ? (
                    <img src={`http://localhost:5000${app.job.company.logo}`} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-primary-600 font-bold text-lg">
                      {app.job?.company?.name?.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{app.job?.title}</h3>
                      <p className="text-primary-600 font-medium text-sm">{app.job?.company?.name}</p>
                    </div>
                    <span className={`${statusColors[app.status] || 'badge-gray'} flex-shrink-0`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-3">
                    {app.job?.location && (
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <HiOutlineLocationMarker className="w-4 h-4" />
                        {app.job.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <HiOutlineClock className="w-4 h-4" />
                      Applied {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                    {app.job?.jobType && (
                      <span className="badge-gray">{app.job.jobType}</span>
                    )}
                  </div>

                  {app.coverLetter && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl">
                      <p className="text-xs font-semibold text-slate-500 mb-1">Cover Letter</p>
                      <p className="text-sm text-slate-600 line-clamp-2">{app.coverLetter}</p>
                    </div>
                  )}

                  {app.notes && (
                    <div className="mt-2 p-3 bg-primary-50 rounded-xl">
                      <p className="text-xs font-semibold text-primary-600 mb-1">Employer Note</p>
                      <p className="text-sm text-slate-600">{app.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <div className="flex gap-2">
                  {app.resume && (
                    <a
                      href={`http://localhost:5000${app.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <HiOutlineDocumentText className="w-4 h-4" />
                      View Resume
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/jobs/${app.job?._id}`}
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <HiOutlineEye className="w-4 h-4" />
                    View Job
                  </Link>
                  {app.status === 'pending' && (
                    <button
                      onClick={() => handleWithdraw(app._id)}
                      className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}