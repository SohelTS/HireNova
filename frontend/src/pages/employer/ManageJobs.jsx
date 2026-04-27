import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineLockClosed,
  HiOutlinePlusCircle,
  HiOutlineUsers,
  HiOutlineSearch,
} from 'react-icons/hi';
import useJobStore from '../../store/jobStore';
import Loader from '../../components/common/Loader';
import * as api from '../../utils/axios';
import toast from 'react-hot-toast';

export default function ManageJobs() {
  const { myJobs, loading, getMyJobs, deleteJob } = useJobStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getMyJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job? This cannot be undone!')) return;
    const res = await deleteJob(id);
    if (res.success) {
      toast.success('Job deleted!');
    } else {
      toast.error('Failed to delete job!');
    }
  };

  const handleClose = async (id) => {
    if (!window.confirm('Close this job listing?')) return;
    try {
      await api.closeJob(id);
      toast.success('Job closed!');
      getMyJobs();
    } catch (err) {
      toast.error('Failed to close job!');
    }
  };

  const filtered = myJobs
    .filter((job) => filter === 'all' || job.status === filter)
    .filter((job) => job.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Manage Jobs</h1>
          <p className="text-slate-500 text-sm mt-1">{myJobs.length} total listings</p>
        </div>
        <Link to="/employer/post-job" className="btn-primary flex items-center gap-2">
          <HiOutlinePlusCircle className="w-5 h-5" />
          Post New Job
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'open', 'closed', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 card">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No jobs found</h3>
          <p className="text-slate-500 mb-4">
            {myJobs.length === 0 ? 'Post your first job to start hiring' : 'No jobs match your search'}
          </p>
          <Link to="/employer/post-job" className="btn-primary">Post a Job</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((job) => (
            <div key={job._id} className="card hover:shadow-card-hover transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 font-bold">{job.title?.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white text-base truncate">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className={`badge ${job.status === 'open' ? 'badge-success' : job.status === 'closed' ? 'badge-danger' : 'badge-gray'}`}>
                          {job.status}
                        </span>
                        <span className="badge-gray capitalize">{job.jobType}</span>
                        <span className="badge-gray">{job.category}</span>
                        <span className="text-xs text-slate-500">{job.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-primary-50 px-3 py-1.5 rounded-xl flex-shrink-0">
                      <HiOutlineUsers className="w-4 h-4 text-primary-600" />
                      <span className="text-sm font-bold text-primary-600">
                        {job.applicants?.length || 0}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">{job.description}</p>

                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100 flex-wrap">
                    <Link
                      to={`/employer/applicants/${job._id}`}
                      className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <HiOutlineEye className="w-4 h-4" />
                      View Applicants ({job.applicants?.length || 0})
                    </Link>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-700 font-medium"
                    >
                      <HiOutlineEye className="w-4 h-4" />
                      Preview
                    </Link>
                    {job.status === 'open' && (
                      <button
                        onClick={() => handleClose(job._id)}
                        className="flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600 font-medium"
                      >
                        <HiOutlineLockClosed className="w-4 h-4" />
                        Close Job
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium ml-auto"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}