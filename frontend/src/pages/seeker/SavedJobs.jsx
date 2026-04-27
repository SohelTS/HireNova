import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineBookmark,
  HiOutlineTrash,
} from 'react-icons/hi';
import useJobStore from '../../store/jobStore';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function SavedJobs() {
  const { savedJobs, loading, getSavedJobs, toggleSavedJob } = useJobStore();

  useEffect(() => {
    getSavedJobs();
  }, []);

  const handleUnsave = async (jobId) => {
    await toggleSavedJob(jobId);
    toast.success('Job removed from saved!');
    getSavedJobs();
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Saved Jobs</h1>
          <p className="text-slate-500 text-sm mt-1">{savedJobs.length} saved jobs</p>
        </div>
        <Link to="/jobs" className="btn-primary text-sm py-2">Browse More</Link>
      </div>

      {savedJobs.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">🔖</div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No saved jobs yet</h3>
          <p className="text-slate-500 mb-6">Save jobs you're interested in to apply later</p>
          <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {savedJobs.map((job) => (
            <div key={job._id} className="card card-hover group relative">
              <button
                onClick={() => handleUnsave(job._id)}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-red-50 text-primary-500 hover:text-red-500 transition-colors"
              >
                <HiOutlineBookmark className="w-5 h-5 fill-current" />
              </button>

              <Link to={`/jobs/${job._id}`}>
                <div className="flex items-center gap-3 mb-4 pr-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center overflow-hidden">
                    {job.company?.logo ? (
                      <img src={`http://localhost:5000${job.company.logo}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-primary-600 font-bold">{job.company?.name?.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{job.company?.name}</p>
                    <h3 className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors">
                      {job.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <HiOutlineLocationMarker className="w-4 h-4 text-primary-400" />
                    {job.location}
                  </div>
                  {job.salary?.min > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <HiOutlineCurrencyDollar className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-semibold">
                        ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-2 mt-3">
                    <span className="badge-primary">{job.jobType}</span>
                    <span className="badge-gray">{job.experience}</span>
                  </div>
                </div>
              </Link>

              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                <Link to={`/jobs/${job._id}`} className="btn-primary flex-1 text-center text-sm py-2">
                  Apply Now
                </Link>
                <button
                  onClick={() => handleUnsave(job._id)}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}