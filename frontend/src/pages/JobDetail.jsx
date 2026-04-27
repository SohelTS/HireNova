import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineClock,
  HiOutlineBriefcase,
  HiOutlineUsers,
  HiOutlineBookmark,
  HiBookmark,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineExternalLink,
  HiOutlineCalendar,
} from 'react-icons/hi';
import useJobStore from '../store/jobStore';
import useAuthStore from '../store/authStore';
import Loader from '../components/common/Loader';
import * as api from '../utils/axios';
import toast from 'react-hot-toast';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { job, loading, getJob, toggleSavedJob, savedJobs } = useJobStore();
  const { isAuthenticated, user } = useAuthStore();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);

  const isSaved = savedJobs?.some((s) => s._id === id);

  useEffect(() => {
    getJob(id);
  }, [id]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save jobs!');
      return;
    }
    await toggleSavedJob(id);
    toast.success(isSaved ? 'Job removed!' : 'Job saved!');
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to apply!');
      navigate('/login');
      return;
    }
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('coverLetter', coverLetter);
      if (resume) formData.append('resume', resume);
      await api.applyJob(id, formData);
      setApplied(true);
      setShowApplyForm(false);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply!');
    }
    setApplying(false);
  };

  if (loading) return <Loader />;
  if (!job) return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">😕</div>
      <h3 className="text-xl font-bold text-slate-700">Job not found</h3>
      <Link to="/jobs" className="btn-primary mt-4 inline-block">Browse Jobs</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-6 transition-colors"
      >
        <HiOutlineArrowLeft className="w-5 h-5" />
        Back to Jobs
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                {job.company?.logo ? (
                  <img
                    src={`http://localhost:5000${job.company.logo}`}
                    alt={job.company.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-primary-600 font-bold text-2xl">
                    {job.company?.name?.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-800 mb-1">{job.title}</h1>
                <p className="text-primary-600 font-semibold">{job.company?.name}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="badge-primary">{job.jobType}</span>
                  <span className="badge-gray">{job.experience} level</span>
                  <span className="badge-gray">{job.category}</span>
                  {job.isRemote && <span className="badge-success">Remote</span>}
                  <span className={`badge ${job.status === 'open' ? 'badge-success' : 'badge-danger'}`}>
                    {job.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <HiOutlineLocationMarker className="w-4 h-4 text-primary-500" />
                <span>{job.location}</span>
              </div>
              {job.salary?.min > 0 && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <HiOutlineCurrencyDollar className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-green-600">
                    ${job.salary.min.toLocaleString()}+
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <HiOutlineUsers className="w-4 h-4 text-blue-500" />
                <span>{job.applicants?.length || 0} applicants</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <HiOutlineClock className="w-4 h-4 text-orange-500" />
                <span>{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="section-title mb-4">Job Description</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          {job.requirements?.length > 0 && (
            <div className="card">
              <h2 className="section-title mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <HiOutlineCheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities?.length > 0 && (
            <div className="card">
              <h2 className="section-title mb-4">Responsibilities</h2>
              <ul className="space-y-2">
                {job.responsibilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <HiOutlineCheckCircle className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className="card">
              <h2 className="section-title mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span key={i} className="badge-primary">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Apply Form */}
          {showApplyForm && (
            <div className="card border-2 border-primary-200 animate-slide-up">
              <h2 className="section-title mb-4">Submit Application</h2>
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell the employer why you're a great fit..."
                    rows={5}
                    className="input-field resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Resume (PDF)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResume(e.target.files[0])}
                    className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary-50 file:text-primary-700 file:font-semibold hover:file:bg-primary-100"
                  />
                  {user?.resume && (
                    <p className="text-xs text-slate-500 mt-1">
                      Or we'll use your profile resume if no file is uploaded
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={applying} className="btn-primary">
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Card */}
          <div className="card sticky top-24">
            {job.salary?.min > 0 && (
              <div className="text-center mb-4 p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Salary Range</p>
                <p className="text-2xl font-bold text-green-600">
                  ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                </p>
                <p className="text-sm text-slate-500">per {job.salary.period}</p>
              </div>
            )}

            { user?.role !== 'employer' && (
              <>
                {applied ? (
                  <div className="flex items-center justify-center gap-2 py-3 bg-teal-500/10 rounded-xl text-teal-400 font-semibold border border-teal-500/30">
                    <HiOutlineCheckCircle className="w-5 h-5" />
                    Application Submitted!
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/login');
                        return;
                      }
                      setShowApplyForm(!showApplyForm);
                    }}
                    disabled={job.status !== 'open'}
                    className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {job.status !== 'open' ? 'Job Closed' : showApplyForm ? 'Hide Form' : 'Apply Now'}
                  </button>
                )}

                <button
                  onClick={handleSave}
                  className="w-full flex items-center justify-center gap-2 mt-3 py-3 border border-white/10 rounded-xl hover:border-teal-500/30 hover:bg-teal-500/10 transition-all font-semibold text-navy-300 hover:text-teal-400"
                >
                  {isSaved ? (
                    <><HiBookmark className="w-5 h-5 text-teal-400" /> Saved</>
                  ) : (
                    <><HiOutlineBookmark className="w-5 h-5" /> Save Job</>
                  )}
                </button>
              </>
            )}

            {/* Job Details */}
            <div className="mt-6 space-y-3 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <HiOutlineBriefcase className="w-4 h-4 text-primary-500" />
                <span className="text-slate-500">Job Type:</span>
                <span className="font-medium text-slate-700 capitalize">{job.jobType}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <HiOutlineUsers className="w-4 h-4 text-primary-500" />
                <span className="text-slate-500">Vacancies:</span>
                <span className="font-medium text-slate-700">{job.vacancies}</span>
              </div>
              {job.deadline && (
                <div className="flex items-center gap-3 text-sm">
                  <HiOutlineCalendar className="w-4 h-4 text-red-500" />
                  <span className="text-slate-500">Deadline:</span>
                  <span className="font-medium text-red-600">
                    {new Date(job.deadline).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Company Card */}
          {job.company && (
            <div className="card">
              <h3 className="section-title mb-4">About Company</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center overflow-hidden">
                  {job.company?.logo ? (
                    <img
                      src={`http://localhost:5000${job.company.logo}`}
                      alt={job.company.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-primary-600 font-bold">
                      {job.company?.name?.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{job.company.name}</p>
                  <p className="text-sm text-slate-500">{job.company.industry}</p>
                </div>
              </div>
              {job.company.description && (
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {job.company.description}
                </p>
              )}
              <div className="mt-4 space-y-2">
                {job.company.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <HiOutlineLocationMarker className="w-4 h-4" />
                    {job.company.location}
                  </div>
                )}
                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                  >
                    <HiOutlineExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                )}
                {job.company.size && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <HiOutlineUsers className="w-4 h-4" />
                    {job.company.size} employees
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}