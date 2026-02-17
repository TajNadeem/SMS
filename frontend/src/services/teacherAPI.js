import api from './api';

export const teacherAPI = {
  // Get all teachers
  getAllTeachers: (params) => api.get('/teachers', { params }),
  
  // Get single teacher
  getTeacher: (id) => api.get(`/teachers/${id}`),
  
  // Create teacher
  createTeacher: (data) => api.post('/teachers', data),
  
  // Update teacher
  updateTeacher: (id, data) => api.put(`/teachers/${id}`, data),
  
  // Delete teacher
  deleteTeacher: (id) => api.delete(`/teachers/${id}`),
  
  // Assign subjects
  assignSubjects: (teacherId, subjects) => 
    api.post(`/teachers/${teacherId}/subjects`, { subjects }),
  
  // Get statistics
  getStats: () => api.get('/teachers/stats')
};