import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import StudentForm from './pages/StudentForm';
import TeacherList from './pages/TeacherList';
import TeacherForm from './pages/TeacherForm';
import TeacherProfile from './pages/TeacherProfile';
import SubjectList from './pages/SubjectList';
import AttendanceDashboard from './pages/AttendanceDashboard';
import MarkAttendance from './pages/MarkAttendance';
import AttendanceReports from './pages/AttendanceReports';
import FeeDashboard from './pages/FeeDashboard';
import FeeCollection from './pages/FeeCollection';
import FeeInvoices from './pages/FeeInvoices';
import FeeStructures from './pages/FeeStructures';
import FeeDefaulters from './pages/FeeDefaulters';
import GenerateInvoices from './pages/GenerateInvoices';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
   <Router basename="/SMS">
        
        <Routes>
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Student Routes */}
          <Route 
            path="/students" 
            element={
              <ProtectedRoute>
                <StudentList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/students/add" 
            element={
              <ProtectedRoute>
                <StudentForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/students/edit/:id" 
            element={
              <ProtectedRoute>
                <StudentForm />
              </ProtectedRoute>
            } 
          />
          
          {/* Teacher Routes */}
          <Route 
            path="/teachers" 
            element={
              <ProtectedRoute>
                <TeacherList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teachers/add" 
            element={
              <ProtectedRoute>
                <TeacherForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teachers/edit/:id" 
            element={
              <ProtectedRoute>
                <TeacherForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teachers/view/:id" 
            element={
              <ProtectedRoute>
                <TeacherProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Subject Routes */}
          <Route 
            path="/subjects" 
            element={
              <ProtectedRoute>
                <SubjectList />
              </ProtectedRoute>
            } 
          />
          
          {/* Attendance Routes */}
          <Route 
            path="/attendance" 
            element={
              <ProtectedRoute>
                <AttendanceDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/attendance/mark" 
            element={
              <ProtectedRoute>
                <MarkAttendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/attendance/reports" 
            element={
              <ProtectedRoute>
                <AttendanceReports />
              </ProtectedRoute>
            } 
          />
          
          {/* Fee Routes */}
          <Route 
            path="/fees" 
            element={
              <ProtectedRoute>
                <FeeDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/fees/collect" 
            element={
              <ProtectedRoute>
                <FeeCollection />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/fees/invoices" 
            element={
              <ProtectedRoute>
                <FeeInvoices />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/fees/generate" 
            element={
              <ProtectedRoute>
                <GenerateInvoices />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/fees/structures" 
            element={
              <ProtectedRoute>
                <FeeStructures />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/fees/defaulters" 
            element={
              <ProtectedRoute>
                <FeeDefaulters />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;