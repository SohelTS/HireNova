import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  HiOutlineArrowLeft,
  HiOutlineDocumentText,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineDownload,
} from 'react-icons/hi';
import * as api from '../../utils/axios';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'badge-warning',
  reviewed: 'badge-primary',
  shortlisted: 'badge-success',
  rejected: 'badge-danger',
  hired: 'badge-success',
};

const statusOptions = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];

export default function Applicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const res = await api.getJobApplicants(jobId);
      setApplications(res.data.applications);
    } catch (err) {
      toast.error('Failed to load applicants!');
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (appId, status) => {
    setUpdatingId(appId);
    try {
      await api.updateApplicationStatus(appId, { status, notes: notes[appId] || '' });
      toast.success('Status updated!');
      fetchApplicants();
    } catch (err) {
      toast.error('Failed to update status!');
    }
    setUpdatingId(null);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-4 transition-colors"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          Back to Jobs
        </button>
        <h1 className="page-title">Applicants</h1>
        <p className="text-slate-500 text-sm mt-1">
          {applications.length} application{applications.length !== 1 ? 's' : ''} received
        </p>
      </div>

      {/* Applicants List */}
      {applications.length === 0 ? (
        <div className="text-center py-16 card">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No applicants yet</h3>
          <p className="text-slate-500">Share your job listing to attract candidates</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="card">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {app.applicant?.avatar ? (
                    <img
                      src={`http://localhost:5000${app.applicant.avatar}`}
                      alt={app.applicant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-primary-600 font-bold text-xl">
                      {app.applicant?.name?.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white text-lg">
                        {app.applicant?.name}
                      </h3>
                      <div className="flex flex-wrap gap-3 mt-1">
                        {app.applicant?.email && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <HiOutlineMail className="w-3.5 h-3.5" />
                            {app.applicant.email}
                          </div>
                        )}
                        {app.applicant?.phone && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <HiOutlinePhone className="w-3.5 h-3.5" />
                            {app.applicant.phone}
                          </div>
                        )}
                        {app.applicant?.location && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <HiOutlineLocationMarker className="w-3.5 h-3.5" />
                            {app.applicant.location}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={`badge ${statusColors[app.status]} flex-shrink-0`}>
                      {app.status}
                    </span>
                  </div>

                  {/* Skills */}
                  {app.applicant?.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {app.applicant.skills.slice(0, 5).map((skill) => (
                        <span key={skill} className="badge-gray text-xs">{skill}</span>
                      ))}
                      {app.applicant.skills.length > 5 && (
                        <span className="badge-gray text-xs">+{app.applicant.skills.length - 5} more</span>
                      )}
                    </div>
                  )}

                  {/* Cover Letter */}
                  {app.coverLetter && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl">
                      <p className="text-xs font-semibold text-slate-500 mb-1">Cover Letter</p>
                      <p className="text-sm text-slate-600 line-clamp-3">{app.coverLetter}</p>
                    </div>
                  )}

                  {/* Notes */}
                  <div className="mt-3">
                    <textarea
                      value={notes[app._id] || app.notes || ''}
                      onChange={(e) => setNotes({ ...notes, [app._id]: e.target.value })}
                      placeholder="Add notes about this applicant..."
                      rows={2}
                      className="input-field text-sm resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-100">
                    {/* Resume */}
                    {app.resume && (
                      <a
                        href={`http://localhost:5000${app.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        <HiOutlineDownload className="w-4 h-4" />
                        Download Resume
                      </a>
                    )}

                    {/* Status Update */}
                    <div className="flex items-center gap-2 ml-auto flex-wrap">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                        disabled={updatingId === app._id}
                        className="text-sm border border-teal-500/30 bg-navy-800 text-white rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 capitalize"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleStatusUpdate(app._id, app.status)}
                        disabled={updatingId === app._id}
                        className="btn-primary py-1.5 px-4 text-sm"
                      >
                        {updatingId === app._id ? 'Saving...' : 'Save Notes'}
                      </button>
                    </div>
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