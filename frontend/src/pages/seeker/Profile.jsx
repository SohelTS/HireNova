import { useState, useEffect } from 'react';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlinePencil,
  HiOutlineDocumentText,
  HiOutlinePlus,
  HiOutlineX,
  HiOutlineCheck,
} from 'react-icons/hi';
import useAuthStore from '../../store/authStore';
import * as api from '../../utils/axios';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

export default function Profile() {
  const { user, getMe, loading } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        skills: user.skills || [],
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
  };

  const handleSave = async () => {
    const { updateProfile } = useAuthStore.getState();
    const res = await updateProfile(formData);
    if (res.success) {
      toast.success('Profile updated!');
      setEditing(false);
    } else {
      toast.error(res.error || 'Failed to update profile!');
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setUploading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('resume', resumeFile);
      await api.uploadResume(formDataObj);
      toast.success('Resume uploaded successfully!');
      await getMe();
      setResumeFile(null);
    } catch (err) {
      toast.error('Failed to upload resume!');
    }
    setUploading(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">My Profile</h1>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          className={editing ? 'btn-primary' : 'btn-secondary'}
        >
          {editing ? (
            <span className="flex items-center gap-2">
              <HiOutlineCheck className="w-4 h-4" /> Save Changes
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <HiOutlinePencil className="w-4 h-4" /> Edit Profile
            </span>
          )}
        </button>
      </div>

      {/* Profile Header */}
      <div className="card mb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {user?.avatar ? (
              <img src={`http://localhost:5000${user.avatar}`} alt={user?.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary-700 font-bold text-3xl">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
            <p className="text-slate-500">{user?.email}</p>
            <span className="badge-primary mt-2 inline-block capitalize">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="card mb-6">
        <h2 className="section-title mb-5">Basic Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <HiOutlineUser className="inline w-4 h-4 mr-1" /> Full Name
            </label>
            {editing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <p className="text-slate-700 py-3 px-4 bg-slate-50 rounded-xl">{user?.name || '—'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <HiOutlineMail className="inline w-4 h-4 mr-1" /> Email
            </label>
            <p className="text-slate-700 py-3 px-4 bg-slate-50 rounded-xl">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <HiOutlinePhone className="inline w-4 h-4 mr-1" /> Phone
            </label>
            {editing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="+1 234 567 890"
              />
            ) : (
              <p className="text-slate-700 py-3 px-4 bg-slate-50 rounded-xl">{user?.phone || '—'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <HiOutlineLocationMarker className="inline w-4 h-4 mr-1" /> Location
            </label>
            {editing ? (
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                placeholder="City, Country"
              />
            ) : (
              <p className="text-slate-700 py-3 px-4 bg-slate-50 rounded-xl">{user?.location || '—'}</p>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
          {editing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="input-field resize-none"
              placeholder="Tell employers about yourself..."
            />
          ) : (
            <p className="text-slate-700 py-3 px-4 bg-slate-50 rounded-xl min-h-[80px]">
              {user?.bio || '—'}
            </p>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="card mb-6">
        <h2 className="section-title mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {formData.skills.map((skill) => (
            <span key={skill} className="badge-primary flex items-center gap-1">
              {skill}
              {editing && (
                <button onClick={() => handleRemoveSkill(skill)}>
                  <HiOutlineX className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
          {formData.skills.length === 0 && (
            <p className="text-slate-400 text-sm">No skills added yet</p>
          )}
        </div>
        {editing && (
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              placeholder="Add a skill (e.g. React, Python)"
              className="input-field flex-1 py-2"
            />
            <button onClick={handleAddSkill} className="btn-primary py-2 px-4">
              <HiOutlinePlus className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Resume */}
      <div className="card">
        <h2 className="section-title mb-4">Resume</h2>
        {user?.resume ? (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200 mb-4">
            <div className="flex items-center gap-3">
              <HiOutlineDocumentText className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">Resume Uploaded</p>
                <p className="text-xs text-green-600">Click to view your resume</p>
              </div>
            </div>
            <a
              href={`http://localhost:5000${user.resume}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-2"
            >
              View
            </a>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 mb-4 text-center">
            <HiOutlineDocumentText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No resume uploaded yet</p>
          </div>
        )}
        <div className="flex gap-3">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="flex-1 text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary-50 file:text-primary-700 file:font-semibold hover:file:bg-primary-100"
          />
          {resumeFile && (
            <button
              onClick={handleResumeUpload}
              disabled={uploading}
              className="btn-primary text-sm py-2"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}