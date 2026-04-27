import { create } from 'zustand';
import * as api from '../utils/axios';

const useJobStore = create((set) => ({
  jobs: [],
  job: null,
  myJobs: [],
  applications: [],
  savedJobs: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  total: 0,

  getJobs: async (params) => {
    set({ loading: true });
    try {
      const res = await api.getJobs(params);
      set({
        jobs: res.data.jobs,
        totalPages: res.data.pages,
        currentPage: res.data.currentPage,
        total: res.data.total,
        loading: false,
      });
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message });
    }
  },

  getJob: async (id) => {
    set({ loading: true });
    try {
      const res = await api.getJob(id);
      set({ job: res.data.job, loading: false });
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message });
    }
  },

  getMyJobs: async () => {
    set({ loading: true });
    try {
      const res = await api.getMyJobs();
      set({ myJobs: res.data.jobs, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },

  createJob: async (data) => {
    set({ loading: true });
    try {
      const res = await api.createJob(data);
      set((state) => ({
        myJobs: [res.data.job, ...state.myJobs],
        loading: false,
      }));
      return { success: true };
    } catch (err) {
      set({ loading: false });
      return { success: false, error: err.response?.data?.message };
    }
  },

  deleteJob: async (id) => {
    try {
      await api.deleteJob(id);
      set((state) => ({
        myJobs: state.myJobs.filter((job) => job._id !== id),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  },

  getMyApplications: async () => {
    set({ loading: true });
    try {
      const res = await api.getMyApplications();
      set({ applications: res.data.applications, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },

  getSavedJobs: async () => {
    try {
      const res = await api.getSavedJobs();
      set({ savedJobs: res.data.savedJobs });
    } catch (err) {
      console.log(err);
    }
  },

  toggleSavedJob: async (jobId) => {
    try {
      await api.toggleSavedJob(jobId);
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  },
}));

export default useJobStore;