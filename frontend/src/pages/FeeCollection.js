import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { feeAPI } from '../services/feeAPI';
import { studentAPI } from '../services/studentAPI';
import './FeeCollection.css';
import Layout from '../components/Layout';

const FeeCollection = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    transactionId: '',
    chequeNumber: '',
    bankName: '',
    remarks: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const searchStudents = async () => {
    if (!searchTerm) return;

    try {
      setLoading(true);
      const response = await studentAPI.getAllStudents({ search: searchTerm, limit: 10 });
      if (response.data.success) {
        setStudents(response.data.students);
      }
    } catch (err) {
      setError('Failed to search students');
    } finally {
      setLoading(false);
    }
  };

  const selectStudent = async (student) => {
    setSelectedStudent(student);
    setStudents([]);
    setSearchTerm('');
    
    try {
      const response = await feeAPI.getStudentInvoices(student.id);
      if (response.data.success) {
        // Filter only pending and partial invoices
        const pendingInvoices = response.data.invoices.filter(
          inv => inv.status === 'pending' || inv.status === 'partial'
        );
        setInvoices(pendingInvoices);
      }
    } catch (err) {
      setError('Failed to fetch student invoices');
    }
  };

  const selectInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentData({
      ...paymentData,
      amount: invoice.balanceAmount
    });
  };

  const handlePaymentChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedInvoice) {
      setError('Please select an invoice');
      return;
    }

    if (parseFloat(paymentData.amount) <= 0) {
      setError('Payment amount must be greater than 0');
      return;
    }

    if (parseFloat(paymentData.amount) > parseFloat(selectedInvoice.balanceAmount)) {
      setError('Payment amount cannot exceed balance amount');
      return;
    }

    try {
      setLoading(true);
      
      const response = await feeAPI.recordPayment({
        invoiceId: selectedInvoice.id,
        ...paymentData
      });

      if (response.data.success) {
        setSuccess(`Payment recorded successfully! Receipt No: ${response.data.payment.receiptNumber}`);
        
        // Refresh invoices
        const invoicesResponse = await feeAPI.getStudentInvoices(selectedStudent.id);
        if (invoicesResponse.data.success) {
          const pendingInvoices = invoicesResponse.data.invoices.filter(
            inv => inv.status === 'pending' || inv.status === 'partial'
          );
          setInvoices(pendingInvoices);
        }

        // Reset form
        setSelectedInvoice(null);
        setPaymentData({
          amount: '',
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMethod: 'cash',
          transactionId: '',
          chequeNumber: '',
          bankName: '',
          remarks: ''
        });

        // Auto-hide success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  return (
    <Layout>
    <div className="fee-collection-container">
      <div className="page-header">
        <h1>💵 Fee Collection</h1>
        <button className="btn-back" onClick={() => navigate('/fees')}>
          ← Back
        </button>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Student Search */}
      <div className="search-card">
        <h3>Search Student</h3>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or admission number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchStudents()}
          />
          <button onClick={searchStudents} disabled={loading}>
            🔍 Search
          </button>
        </div>

        {students.length > 0 && (
          <div className="search-results">
            {students.map(student => (
              <div 
                key={student.id} 
                className="search-result-item"
                onClick={() => selectStudent(student)}
              >
                <div className="student-info">
                  <strong>{student.firstName} {student.lastName}</strong>
                  <span>Admission No: {student.admissionNo}</span>
                  <span>Class: {student.class} {student.section}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Student Info */}
      {selectedStudent && (
        <div className="selected-student-card">
          <h3>Student Details</h3>
          <div className="student-details">
            <div className="detail-item">
              <label>Name:</label>
              <span>{selectedStudent.firstName} {selectedStudent.lastName}</span>
            </div>
            <div className="detail-item">
              <label>Admission No:</label>
              <span>{selectedStudent.admissionNo}</span>
            </div>
            <div className="detail-item">
              <label>Class:</label>
              <span>{selectedStudent.class} {selectedStudent.section}</span>
            </div>
          </div>
        </div>
      )}

      {/* Pending Invoices */}
      {selectedStudent && invoices.length > 0 && (
        <div className="invoices-card">
          <h3>Pending Fee Invoices</h3>
          <div className="invoices-list">
            {invoices.map(invoice => (
              <div 
                key={invoice.id}
                className={`invoice-item ${selectedInvoice?.id === invoice.id ? 'selected' : ''}`}
                onClick={() => selectInvoice(invoice)}
              >
                <div className="invoice-header">
                  <span className="invoice-number">{invoice.invoiceNumber}</span>
                  <span className={`status-badge status-${invoice.status}`}>
                    {invoice.status}
                  </span>
                </div>
                <div className="invoice-details">
                  <div className="invoice-row">
                    <span>Fee Type:</span>
                    <strong>{invoice.feeType}</strong>
                  </div>
                  <div className="invoice-row">
                    <span>Academic Year:</span>
                    <strong>{invoice.academicYear}</strong>
                  </div>
                  <div className="invoice-row">
                    <span>Total Amount:</span>
                    <strong>{formatCurrency(invoice.totalAmount)}</strong>
                  </div>
                  <div className="invoice-row">
                    <span>Paid Amount:</span>
                    <strong className="text-success">{formatCurrency(invoice.paidAmount)}</strong>
                  </div>
                  <div className="invoice-row">
                    <span>Balance:</span>
                    <strong className="text-danger">{formatCurrency(invoice.balanceAmount)}</strong>
                  </div>
                  <div className="invoice-row">
                    <span>Due Date:</span>
                    <strong>{invoice.dueDate}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedStudent && invoices.length === 0 && (
        <div className="no-invoices">
          <p>No pending invoices for this student.</p>
        </div>
      )}

      {/* Payment Form */}
      {selectedInvoice && (
        <div className="payment-form-card">
          <h3>Record Payment</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Amount to Pay *</label>
                <input
                  type="number"
                  name="amount"
                  value={paymentData.amount}
                  onChange={handlePaymentChange}
                  required
                  step="0.01"
                  max={selectedInvoice.balanceAmount}
                  placeholder="Enter amount"
                />
                <small>Balance: {formatCurrency(selectedInvoice.balanceAmount)}</small>
              </div>

              <div className="form-group">
                <label>Payment Date *</label>
                <input
                  type="date"
                  name="paymentDate"
                  value={paymentData.paymentDate}
                  onChange={handlePaymentChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>Payment Method *</label>
                <select
                  name="paymentMethod"
                  value={paymentData.paymentMethod}
                  onChange={handlePaymentChange}
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                  <option value="online">Online</option>
                </select>
              </div>

              {(paymentData.paymentMethod === 'upi' || 
                paymentData.paymentMethod === 'bank_transfer' || 
                paymentData.paymentMethod === 'online') && (
                <div className="form-group">
                  <label>Transaction ID</label>
                  <input
                    type="text"
                    name="transactionId"
                    value={paymentData.transactionId}
                    onChange={handlePaymentChange}
                    placeholder="Transaction reference ID"
                  />
                </div>
              )}

              {paymentData.paymentMethod === 'cheque' && (
                <>
                  <div className="form-group">
                    <label>Cheque Number</label>
                    <input
                      type="text"
                      name="chequeNumber"
                      value={paymentData.chequeNumber}
                      onChange={handlePaymentChange}
                      placeholder="Cheque number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      value={paymentData.bankName}
                      onChange={handlePaymentChange}
                      placeholder="Bank name"
                    />
                  </div>
                </>
              )}

              <div className="form-group full-width">
                <label>Remarks</label>
                <textarea
                  name="remarks"
                  value={paymentData.remarks}
                  onChange={handlePaymentChange}
                  rows="2"
                  placeholder="Optional remarks"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Processing...' : 'Record Payment'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
    </Layout>
  );
};

export default FeeCollection;