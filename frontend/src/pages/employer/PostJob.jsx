import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineBriefcase,
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlinePlus,
  HiOutlineX,
} from 'react-icons/hi';
import useJobStore from '../../store/jobStore';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const categories = [
  'Technology', 'Marketing', 'Finance', 'Healthcare',
  'Education', 'Design', 'Sales', 'Engineering',
  'Human Resources', 'Other',
];

export default function PostJob() {
  const navigate = useNavigate();
  const { createJob, loading } = useJobStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    jobType: 'full-time',
    category: 'Technology',
    experience: 'mid',
    isRemote: false,
    vacancies: 1,
    deadline: '',
    salary: { min: '', max: '', currency: 'USD', period: 'yearly' },
    skills: [],
    requirements: [],
    responsibilities: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [reqInput, setReqInput] = useState('');
  const [respInput, setRespInput] = useState('');

  if (!user?.company) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 card">
        <div className="text-5xl mb-4">🏢</div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">Company Profile Required</h3>
        <p className="text-slate-500 mb-4">
          You need to create a company profile before posting jobs
        </p>
        <button
          onClick={() => navigate('/employer/company')}
          className="btn-primary"
        >
          Create Company Profile
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('salary.')) {
      const key = name.split('.')[1];
      setFormData({ ...formData, salary: { ...formData.salary, [key]: value } });
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const addItem = (field, value, setter) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
      setter('');
    }
  };

  const removeItem = (field, value) => {
    setFormData({ ...formData, [field]: formData[field].filter((i) => i !== value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.location) {
      toast.error('Please fill in all required fields!');
      return;
    }
    const res = await createJob(formData);
    if (res.success) {
      toast.success('Job posted successfully!');
      navigate('/employer/manage-jobs');
    } else {
      toast.error(res.error || 'Failed to post job!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="page-title">Post a New Job</h1>
        <p className="text-slate-500 text-sm mt-1">Fill in the details to attract the right candidates</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card space-y-4">
          <h2 className="section-title">Basic Information</h2>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title *</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior React Developer"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Job Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role, what you're looking for..."
              rows={6}
              className="input-field resize-none"
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Job Type *</label>
              <select name="jobType" value={formData.jobType} onChange={handleChange} className="input-field">
                {['full-time', 'part-time', 'contract', 'internship', 'remote'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Experience Level *</label>
              <select name="experience" value={formData.experience} onChange={handleChange} className="input-field">
                {['entry', 'junior', 'mid', 'senior', 'lead', 'manager'].map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Vacancies</label>
              <input
                type="number"
                name="vacancies"
                value={formData.vacancies}
                onChange={handleChange}
                min={1}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Location & Salary */}
        <div className="card space-y-4">
          <h2 className="section-title">Location & Salary</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Location *</label>
              <div className="relative">
                <HiOutlineLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isRemote"
              id="isRemote"
              checked={formData.isRemote}
              onChange={handleChange}
              className="w-4 h-4 accent-primary-600"
            />
            <label htmlFor="isRemote" className="text-sm font-medium text-slate-700">
              Remote work available
            </label>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Salary Range</label>
            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <HiOutlineCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  name="salary.min"
                  value={formData.salary.min}
                  onChange={handleChange}
                  placeholder="Min"
                  className="input-field pl-9"
                />
              </div>
              <div className="relative">
                <HiOutlineCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  name="salary.max"
                  value={formData.salary.max}
                  onChange={handleChange}
                  placeholder="Max"
                  className="input-field pl-9"
                />
              </div>
              <select name="salary.period" value={formData.salary.period} onChange={handleChange} className="input-field">
                {['hourly', 'monthly', 'yearly'].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card space-y-4">
          <h2 className="section-title">Skills Required</h2>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('skills', skillInput, setSkillInput))}
              placeholder="Add required skill..."
              className="input-field flex-1"
            />
            <button type="button" onClick={() => addItem('skills', skillInput, setSkillInput)} className="btn-primary px-4">
              <HiOutlinePlus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <span key={skill} className="badge-primary flex items-center gap-1">
                {skill}
                <button type="button" onClick={() => removeItem('skills', skill)}>
                  <HiOutlineX className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="card space-y-4">
          <h2 className="section-title">Requirements</h2>
          <div className="flex gap-2">
            <input
              value={reqInput}
              onChange={(e) => setReqInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('requirements', reqInput, setReqInput))}
              placeholder="Add a requirement..."
              className="input-field flex-1"
            />
            <button type="button" onClick={() => addItem('requirements', reqInput, setReqInput)} className="btn-primary px-4">
              <HiOutlinePlus className="w-5 h-5" />
            </button>
          </div>
          <ul className="space-y-2">
            {formData.requirements.map((req) => (
              <li key={req} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 rounded-xl px-4 py-2">
                <span className="flex-1">{req}</span>
                <button type="button" onClick={() => removeItem('requirements', req)}>
                  <HiOutlineX className="w-4 h-4 text-red-400 hover:text-red-600" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Responsibilities */}
        <div className="card space-y-4">
          <h2 className="section-title">Responsibilities</h2>
          <div className="flex gap-2">
            <input
              value={respInput}
              onChange={(e) => setRespInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('responsibilities', respInput, setRespInput))}
              placeholder="Add a responsibility..."
              className="input-field flex-1"
            />
            <button type="button" onClick={() => addItem('responsibilities', respInput, setRespInput)} className="btn-primary px-4">
              <HiOutlinePlus className="w-5 h-5" />
            </button>
          </div>
          <ul className="space-y-2">
            {formData.responsibilities.map((resp) => (
              <li key={resp} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 rounded-xl px-4 py-2">
                <span className="flex-1">{resp}</span>
                <button type="button" onClick={() => removeItem('responsibilities', resp)}>
                  <HiOutlineX className="w-4 h-4 text-red-400 hover:text-red-600" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Posting Job...
              </div>
            ) : 'Post Job'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-6">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}