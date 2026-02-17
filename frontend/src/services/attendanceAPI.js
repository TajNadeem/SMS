import api from './api';

export const attendanceAPI = {
  // Mark single attendance
  markAttendance: (data) => api.post('/attendance', data),
  
  // Bulk mark attendance
  bulkMarkAttendance: (data) => api.post('/attendance/bulk', data),
  
  // Get attendance by class
  getAttendanceByClass: (params) => api.get('/attendance/class', { params }),
  
  // Get student attendance
  getStudentAttendance: (studentId, params) => 
    api.get(`/attendance/student/${studentId}`, { params }),
  
  // Get attendance statistics
  getStats: (params) => api.get('/attendance/stats', { params }),
  
  // Get monthly report
  getMonthlyReport: (params) => api.get('/attendance/monthly-report', { params }),
  
  // Delete attendance
  deleteAttendance: (id) => api.delete(`/attendance/${id}`)
};