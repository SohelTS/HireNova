import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  HiOutlineSearch,
  HiOutlineLocationMarker,
  HiOutlineFilter,
  HiOutlineX,
  HiOutlineAdjustments,
} from 'react-icons/hi';
import useJobStore from '../store/jobStore';
import JobCard from '../components/common/JobCard';
import Loader from '../components/common/Loader';

const categories = [
  'Technology', 'Marketing', 'Finance', 'Healthcare',
  'Education', 'Design', 'Sales', 'Engineering',
  'Human Resources', 'Other',
];

const jobTypes = ['full-time', 'part-time', 'contract', 'internship', 'remote'];
const experienceLevels = ['entry', 'junior', 'mid', 'senior', 'lead', 'manager'];

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    jobType: '',
    experience: '',
    page: 1,
  });

  const { jobs, loading, totalPages, currentPage, total, getJobs } = useJobStore();

  useEffect(() => {
    getJobs(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      location: '',
      category: '',
      jobType: '',
      experience: '',
      page: 1,
    });
    setSearchParams({});
  };

  const activeFiltersCount = [
    filters.category,
    filters.jobType,
    filters.experience,
    filters.location,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1 px-4 py-2 bg-slate-50 rounded-xl">
            <HiOutlineSearch className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Job title, keywords, skills..."
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              className="flex-1 outline-none bg-transparent text-slate-700 placeholder-slate-400 text-sm"
            />
            {filters.keyword && (
              <button onClick={() => handleFilterChange('keyword', '')}>
                <HiOutlineX className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 flex-1 px-4 py-2 bg-slate-50 rounded-xl">
            <HiOutlineLocationMarker className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Location..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="flex-1 outline-none bg-transparent text-slate-700 placeholder-slate-400 text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all font-semibold text-sm ${
              showFilters || activeFiltersCount > 0
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <HiOutlineAdjustments className="w-5 h-5" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-field text-sm py-2"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Job Type
                </label>
                <select
                  value={filters.jobType}
                  onChange={(e) => handleFilterChange('jobType', e.target.value)}
                  className="input-field text-sm py-2"
                >
                  <option value="">All Types</option>
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Experience
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  className="input-field text-sm py-2"
                >
                  <option value="">All Levels</option>
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-3 text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
              >
                <HiOutlineX className="w-4 h-4" />
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-600 text-sm">
          Showing <span className="font-semibold text-slate-800">{total}</span> jobs
          {filters.keyword && <span> for "<span className="text-primary-600">{filters.keyword}</span>"</span>}
        </p>
        <select
          className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          onChange={(e) => handleFilterChange('sort', e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="salary">Highest Salary</option>
        </select>
      </div>

      {/* Job Cards */}
      {loading ? (
        <Loader />
      ) : jobs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No jobs found</h3>
          <p className="text-slate-500">Try adjusting your search or filters</p>
          <button onClick={clearFilters} className="btn-primary mt-4">
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handleFilterChange('page', currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium disabled:opacity-50 hover:bg-slate-50 transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handleFilterChange('page', page)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-primary-600 text-white'
                      : 'border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handleFilterChange('page', currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium disabled:opacity-50 hover:bg-slate-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}