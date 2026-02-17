const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { syncDatabase } = require('./models');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const feeRoutes = require('./routes/feeRoutes');

const app = express();

// CORS Configuration for Production
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'https://soft.nadeemlearningcenter.org',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes with /SMS base path
app.use('/SMS/api/auth', authRoutes);
app.use('/SMS/api/students', studentRoutes);
app.use('/SMS/api/teachers', teacherRoutes);
app.use('/SMS/api/subjects', subjectRoutes);
app.use('/SMS/api/attendance', attendanceRoutes);
app.use('/SMS/api/fees', feeRoutes);

// Health check route
app.get('/SMS/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test route
app.get('/SMS/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is running!', 
    timestamp: new Date() 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server and sync database
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await syncDatabase();
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✅ CORS Origin: ${process.env.CORS_ORIGIN || 'https://soft.nadeemlearningcenter.org'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();