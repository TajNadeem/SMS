import api from './api';

export const studentAPI = {
  // Get all students
  getAllStudents: (params) => api.get('/students', { params }),
  
  // Get single student
  getStudent: (id) => api.get(`/students/${id}`),
  
  // Create student
  createStudent: (data) => api.post('/students', data),
  
  // Update student
  updateStudent: (id, data) => api.put(`/students/${id}`, data),
  
  // Delete student
  deleteStudent: (id) => api.delete(`/students/${id}`),
  
  // Get statistics
  getStats: () => api.get('/students/stats')
};