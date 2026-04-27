import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const logoutUser = () => API.post('/auth/logout');
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const uploadResume = (data) => API.put('/auth/resume', data);
export const toggleSavedJob = (jobId) => API.put(`/auth/saved-jobs/${jobId}`);
export const getSavedJobs = () => API.get('/auth/saved-jobs');

// Jobs
export const getJobs = (params) => API.get('/jobs', { params });
export const getJob = (id) => API.get(`/jobs/${id}`);
export const createJob = (data) => API.post('/jobs', data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
export const getMyJobs = () => API.get('/jobs/employer/my-jobs');
export const closeJob = (id) => API.put(`/jobs/${id}/close`);

// Applications
export const applyJob = (jobId, data) => API.post(`/applications/${jobId}`, data);
export const getMyApplications = () => API.get('/applications/my-applications');
export const getJobApplicants = (jobId) => API.get(`/applications/job/${jobId}`);
export const updateApplicationStatus = (id, data) => API.put(`/applications/${id}/status`, data);
export const deleteApplication = (id) => API.delete(`/applications/${id}`);

// Companies
export const createCompany = (data) => API.post('/companies', data);
export const getMyCompany = () => API.get('/companies/my-company');
export const updateCompany = (id, data) => API.put(`/companies/${id}`, data);
export const getAllCompanies = () => API.get('/companies');
export const getCompany = (id) => API.get(`/companies/${id}`);

export default API;