import api from './api';

export const feeAPI = {
  // Fee Structures
  getAllFeeStructures: (params) => api.get('/fees/structures', { params }),
  createFeeStructure: (data) => api.post('/fees/structures', data),
  updateFeeStructure: (id, data) => api.put(`/fees/structures/${id}`, data),
  deleteFeeStructure: (id) => api.delete(`/fees/structures/${id}`),
  
  // Invoices
  generateInvoices: (data) => api.post('/fees/invoices/generate', data),
  getAllInvoices: (params) => api.get('/fees/invoices', { params }),
  getStudentInvoices: (studentId) => api.get(`/fees/invoices/student/${studentId}`),
  
  // Payments
  recordPayment: (data) => api.post('/fees/payments', data),
  getPaymentReceipt: (id) => api.get(`/fees/payments/${id}`),
  
  // Reports
  getFeeDefaulters: (params) => api.get('/fees/defaulters', { params }),
  getFeeStats: (params) => api.get('/fees/stats', { params })
};