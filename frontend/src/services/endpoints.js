import { api } from './api.js';

/* ---- Public ---- */
export const fetchSettings = (opts) => api.get('/settings', undefined, opts);
export const fetchServices = (opts) => api.get('/services', undefined, opts);
export const fetchProjects = (params, opts) => api.get('/projects', params, opts);
export const fetchProject = (slug, opts) => api.get(`/projects/${encodeURIComponent(slug)}`, undefined, opts);
export const fetchReviews = (params, opts) => api.get('/reviews', params, opts);
export const fetchGoogleReviews = (opts) => api.get('/reviews/google', undefined, opts);
export const submitReview = (data) => api.post('/reviews', data);
export const submitEnquiry = (data) => api.post('/enquiries', data);

/* ---- Auth ---- */
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
export const fetchMe = (opts) => api.get('/auth/me', undefined, opts);
export const changePassword = (data) => api.post('/auth/password', data);

/* ---- Admin ---- */
export const admin = {
  stats: (opts) => api.get('/admin/stats', undefined, opts),

  enquiries: (params, opts) => api.get('/admin/enquiries', params, opts),
  updateEnquiry: (id, data) => api.patch(`/admin/enquiries/${id}`, data),
  deleteEnquiry: (id) => api.del(`/admin/enquiries/${id}`),

  projects: (params, opts) => api.get('/admin/projects', params, opts),
  project: (id, opts) => api.get(`/admin/projects/${id}`, undefined, opts),
  createProject: (data) => api.post('/admin/projects', data),
  updateProject: (id, data) => api.put(`/admin/projects/${id}`, data),
  setProjectFlags: (id, data) => api.patch(`/admin/projects/${id}`, data),
  deleteProject: (id) => api.del(`/admin/projects/${id}`),

  reviews: (params, opts) => api.get('/admin/reviews', params, opts),
  moderateReview: (id, status) => api.patch(`/admin/reviews/${id}`, { status }),
  deleteReview: (id) => api.del(`/admin/reviews/${id}`),

  services: (opts) => api.get('/admin/services', undefined, opts),
  createService: (data) => api.post('/admin/services', data),
  updateService: (id, data) => api.put(`/admin/services/${id}`, data),
  deleteService: (id) => api.del(`/admin/services/${id}`),

  updateSettings: (data) => api.put('/admin/settings', data),

  users: (opts) => api.get('/admin/users', undefined, opts),
  createUser: (data) => api.post('/admin/users', data),
  deleteUser: (id) => api.del(`/admin/users/${id}`),

  uploadImages: (files, folder = 'projects') => {
    const form = new FormData();
    for (const file of files) form.append('images', file);
    return api.post(`/admin/uploads?folder=${folder}`, form);
  },
};
