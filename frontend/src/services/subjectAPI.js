import api from './api';

export const subjectAPI = {
  // Get all subjects
  getAllSubjects: (params) => api.get('/subjects', { params }),
  
  // Get single subject
  getSubject: (id) => api.get(`/subjects/${id}`),
  
  // Create subject
  createSubject: (data) => api.post('/subjects', data),
  
  // Update subject
  updateSubject: (id, data) => api.put(`/subjects/${id}`, data),
  
  // Delete subject
  deleteSubject: (id) => api.delete(`/subjects/${id}`)
};