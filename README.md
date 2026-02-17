# SMS
A web-based application designed to manage all aspects of school administration, the entire process of building a modern, full-stack web application from scratch to production deployment.
# Objective
Learning Objectives
- Understand full-stack web development concepts
- Build RESTful APIs with Node.js and Express
- Create responsive UIs with React
- Implement authentication and authorization
- Work with MySQL databases using Sequelize ORM
- Deploy applications to production servers
# Backend Technologies
- Node.js v16+ (JavaScript runtime for server-side development.)
- Express.js  (Web application framework for building RESTful APIs.)
- MySQL  (Relational database for storing application data.)
- Sequelize ORM (Object-Relational Mapping tool for database operations.)
# Key Packages:
- bcryptjs (Password hashing.)
- jsonwebtoken (JWT) - Authentication tokens.
- cors - Cross-Origin Resource Sharing.
- dotenv - Environment variables management.
# Frontend Technologies
- React.js (Modern JavaScript library for building user interfaces.)
- React Router (Client-side routing for single-page applications.)
- Axios (HTTP client for API requests.)
- CSS3 (Styling with modern CSS features, gradients, and animations.)
# Required Software
- Node.js LTS (v16 or higher).
- npm (comes with Node.js).
- XAMPP (for MySQL database).
- VS Code (recommended editor).
- Chrome or Edge browser.
  
# Step 1: LOCAL ENVIRONMENT SETUP
- Install Node.js (Go to https://nodejs.org/)
- Run installer, click "Next" for everything (default settings are fine)
- Open Command Prompt and verify:
-   node --version
-   npm --version
- You should see version numbers (e.g., v20.x.x and 10.x.x)

# Step 2: Create Database XAMPP MySQL
- phpMyAdmin Create a new database: Database name: school_management_db

# Step 3: Initialize Backend
- mkdir backend
- cd backend
- npm init -y
- This creates a backend folder and a package.json file.

# Step 4: Install Backend Dependencies
Still in the terminal (inside backend folder), run:
- bashnpm install express mysql2 sequelize bcryptjs jsonwebtoken dotenv cors
- npm install --save-dev nodemon

# Step 5: Configure Environment Variables
Create a file: backend/.env
- 'envPORT=5000'
- 'DB_HOST=localhost'
- 'DB_USER=root'
- 'DB_PASSWORD='
- 'DB_NAME=school_management_db'
- 'JWT_SECRET=your_super_secret_key_change_this_later'
Note: XAMPP default MySQL password is blank (empty). If you set a password, put it after DB_PASSWORD=

# Step 6: Create Basic Server
Create file: backend/server.js

# Step 7: Update package.json Scripts
Open backend/package.json and add this inside "scripts":
'json"scripts": {'
  '"start": "node server.js",'
  '"dev": "nodemon server.js"'
'}'

# Step 8: Test Backend
In terminal (make sure you're in backend folder):
`bashnpm run dev`
You should see:
`Server running on http://localhost:5000`
`Open your browser and go to: http://localhost:5000/api/test`
`You should see:`
`json{"message":"Backend is running!"}`

# Step 9: Setup Frontend (React)
`Open NEW terminal in VS Code (Click the + button in terminal panel), then:`
`npx create-react-app frontend`

# Step 10: Install Frontend Dependencies
`npm install axios react-router-dom`

# Step 11: Test Frontend
- npm start

# STEP 12: Create Database Configuration
- create a file inside it: backend/config/database.js

# STEP 13: Create Database Models
- backend/models/User.js
- Manages all models backend/models/index.js 
- Authentication Controller backend/controllers/authController.js
- Authentication Routes backend/routes/authRoutes.js

# STEP 14: FRONTEND: LOGIN & REGISTER PAGES
- Create API Service frontend/src/services/api.js
- Create Auth Context (for managing user state) frontend/src/context/AuthContext.js
- Create Login Page frontend/src/pages/Login.js
- Create Register Page frontend/src/pages/Register.js
- Create Dashboard Page frontend/src/pages/Dashboard.js
- Create CSS Files frontend/src/pages/Auth.css | frontend/src/pages/Dashboard.css

# STEP 15: Install React Router
- npm install react-router-dom







