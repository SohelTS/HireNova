import { useState, useEffect } from 'react';
import {
  HiOutlineOfficeBuilding,
  HiOutlineGlobeAlt,
  HiOutlineLocationMarker,
  HiOutlinePencil,
  HiOutlineCheck,
  HiOutlinePhotograph,
} from 'react-icons/hi';
import * as api from '../../utils/axios';
import useAuthStore from '../../store/authStore';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function CompanyProfile() {
  const { user, getMe } = useAuthStore();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logo, setLogo] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    industry: '',
    size: '1-10',
    founded: '',
    socialLinks: { linkedin: '', twitter: '', facebook: '' },
  });

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const res = await api.getMyCompany();
      setCompany(res.data.company);
      setFormData({
        name: res.data.company.name || '',
        description: res.data.company.description || '',
        website: res.data.company.website || '',
        location: res.data.company.location || '',
        industry: res.data.company.industry || '',
        size: res.data.company.size || '1-10',
        founded: res.data.company.founded || '',
        socialLinks: res.data.company.socialLinks || { linkedin: '', twitter: '', facebook: '' },
      });
    } catch (err) {
      setCompany(null);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('socialLinks.')) {
      const key = name.split('.')[1];
      setFormData({ ...formData, socialLinks: { ...formData.socialLinks, [key]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'socialLinks') {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });
      if (logo) data.append('logo', logo);

      if (company) {
        await api.updateCompany(company._id, data);
        toast.success('Company updated!');
      } else {
        await api.createCompany(data);
        toast.success('Company created!');
        getMe();
      }
      setEditing(false);
      fetchCompany();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save company!');
    }
    setSaving(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Company Profile</h1>
        {company && (
          <button
            onClick={() => setEditing(!editing)}
            className={editing ? 'btn-secondary' : 'btn-primary'}
          >
            {editing ? 'Cancel' : (
              <span className="flex items-center gap-2">
                <HiOutlinePencil className="w-4 h-4" /> Edit
              </span>
            )}
          </button>
        )}
      </div>

      {!company && !editing ? (
        <div className="text-center py-16 card">
          <div className="text-5xl mb-4">🏢</div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No Company Profile Yet</h3>
          <p className="text-slate-500 mb-4">
            Create your company profile to start posting jobs
          </p>
          <button onClick={() => setEditing(true)} className="btn-primary">
            Create Company Profile
          </button>
        </div>
      ) : editing || !company ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div className="card">
            <h2 className="section-title mb-4">Company Logo</h2>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center overflow-hidden">
                {logo ? (
                  <img src={URL.createObjectURL(logo)} alt="logo" className="w-full h-full object-cover" />
                ) : company?.logo ? (
                  <img src={`http://localhost:5000${company.logo}`} alt="logo" className="w-full h-full object-cover" />
                ) : (
                  <HiOutlineOfficeBuilding className="w-8 h-8 text-primary-400" />
                )}
              </div>
              <label className="btn-secondary cursor-pointer flex items-center gap-2">
                <HiOutlinePhotograph className="w-5 h-5" />
                Upload Logo
                <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} className="hidden" />
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div className="card space-y-4">
            <h2 className="section-title">Basic Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name *</label>
                <input name="name" value={formData.name} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Industry</label>
                <input name="industry" value={formData.industry} onChange={handleChange} placeholder="e.g. Technology" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Company Size</label>
                <select name="size" value={formData.size} onChange={handleChange} className="input-field">
                  {['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'].map((s) => (
                    <option key={s} value={s}>{s} employees</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                <div className="relative">
                  <HiOutlineLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input name="location" value={formData.location} onChange={handleChange} placeholder="City, Country" className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Founded Year</label>
                <input type="number" name="founded" value={formData.founded} onChange={handleChange} placeholder="e.g. 2020" className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Website</label>
                <div className="relative">
                  <HiOutlineGlobeAlt className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input name="website" value={formData.website} onChange={handleChange} placeholder="https://yourcompany.com" className="input-field pl-10" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Tell candidates about your company..." className="input-field resize-none" />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="card space-y-4">
            <h2 className="section-title">Social Links</h2>
            {['linkedin', 'twitter', 'facebook'].map((platform) => (
              <div key={platform}>
                <label className="block text-sm font-semibold text-slate-700 mb-2 capitalize">{platform}</label>
                <input
                  name={`socialLinks.${platform}`}
                  value={formData.socialLinks[platform]}
                  onChange={handleChange}
                  placeholder={`https://${platform}.com/yourcompany`}
                  className="input-field"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={saving} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
              {saving ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              ) : (
                <><HiOutlineCheck className="w-5 h-5" /> {company ? 'Update Company' : 'Create Company'}</>
              )}
            </button>
            {company && (
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary px-6">
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        /* View Mode */
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {company.logo ? (
                  <img src={`http://localhost:5000${company.logo}`} alt={company.name} className="w-full h-full object-cover" />
                ) : (
                  <HiOutlineOfficeBuilding className="w-8 h-8 text-primary-400" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{company.name}</h2>
                <p className="text-primary-600 font-medium">{company.industry}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {company.size && <span className="badge-gray">{company.size} employees</span>}
                  {company.founded && <span className="badge-gray">Founded {company.founded}</span>}
                  {company.location && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <HiOutlineLocationMarker className="w-3 h-3" />
                      {company.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {company.description && (
              <p className="mt-4 text-slate-600 leading-relaxed">{company.description}</p>
            )}
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                <HiOutlineGlobeAlt className="w-4 h-4" />
                {company.website}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}