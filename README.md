# Team Task Manager (Full-Stack)

A professional, full-stack task management application with role-based access control, built for high-performance team collaboration.

## 🚀 Key Features
- **Authentication**: Secure Signup/Login using JWT and cookies.
- **Role-Based Access Control (RBAC)**: Distinct permissions for Admins and Members.
- **Project Management**: Create and manage projects (Admin only for creation).
- **Task Management**: Create, assign, and track task status.
- **Dashboard**: Real-time stats including total tasks, status breakdown, and **overdue task detection**.
- **Security**: 
    - **Rate Limiting**: Protects against brute-force attacks.
    - **Security Headers**: Uses `helmet` for secure HTTP headers.
    - **Data Sanitization**: Prevents NoSQL injection attacks.
- **Health Check**: Dedicated `/api/health` endpoint for monitoring.
- **Modern UI**: Premium dark-mode aesthetic with subtle glassmorphism and smooth animations.
- **Responsive Design**: Fully optimized for mobile and desktop.

---

## 📸 Screenshots
*(Preview of the premium Glassmorphic UI)*

| Dashboard | Project Details |
|-----------|-----------------|
| ![Dashboard](https://via.placeholder.com/400x250?text=Dashboard+Preview) | ![Project Details](https://via.placeholder.com/400x250?text=Project+Details+Preview) |

---

## 🛠️ Tech Stack
- **Frontend**: Vite + React, Vanilla CSS, Lucide React (Icons), React Hot Toast.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (Mongoose).
- **State Management**: React Context API.
- **API Client**: Axios with interceptors.

## 🔑 Demo Credentials
For quick review, you can use these pre-registered accounts (once the database is seeded or after manual registration):

**Admin Account:**
- **Email**: `admin@taskflow.com`
- **Password**: `admin123`
- **Role**: Admin (Can create projects, assign tasks, delete everything)

**Member Account:**
- **Email**: `member@taskflow.com`
- **Password**: `member123`
- **Role**: Member (Can view projects, update task statuses)

---

## 🏛️ Project Architecture
The application follows a modular architecture for maintainability and scalability.

### Backend (Node.js/Express)
- **Controllers**: Handle business logic and response formatting.
- **Models**: Mongoose schemas for data structure.
- **Routes**: Define API endpoints and map to controllers.
- **Middleware**: Handle authentication, authorization (RBAC), and global error handling.
- **Utils**: Reusable helpers for JWT and async error wrapping.

### Frontend (React)
- **Services**: Abstracted API calls using Axios.
- **Context API**: Global state management for authentication.
- **Protected Routes**: HOC for enforcing access control.
- **Vanilla CSS**: Custom-built design system with zero external UI dependencies.

---

## 🔌 API Overview

### Auth
- `POST /api/auth/signup`: Create a new user.
- `POST /api/auth/login`: Authenticate and receive a JWT cookie.
- `POST /api/auth/logout`: Clear authentication cookie.
- `GET /api/auth/profile`: Get current user details.

### Projects
- `GET /api/projects`: Get all accessible projects.
- `POST /api/projects`: Create a new project (Admin only).
- `GET /api/projects/:id`: Get project details.
- `PUT /api/projects/:id`: Update project (Admin only).
- `DELETE /api/projects/:id`: Delete project (Admin only).

### Tasks
- `POST /api/tasks`: Create a new task.
- `GET /api/tasks/project/:projectId`: Get all tasks for a project.
- `PUT /api/tasks/:id`: Update task status/details.
- `DELETE /api/tasks/:id`: Delete task (Admin only).
- `GET /api/tasks/stats`: Get dashboard statistics.

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### Backend Setup
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```
4. (Optional) Seed the database with demo data: `npm run seed`
5. Start the server: `npm start` (or `npm run dev` if nodemon is installed)

### Frontend Setup
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the development server: `npm run dev`

## 🌐 Deployment
This app is ready for deployment on **Railway**.
- Backend: Deployed as a Node.js service.
- Frontend: Deployed as a static site or Node.js service.
- Ensure all environment variables are set in the Railway dashboard.

## 📝 Assignment Requirements Covered
- [x] REST APIs + Database
- [x] Proper validations & relationships
- [x] Role-based access control (Admin/Member)
- [x] Dashboard (tasks, status, overdue)
- [x] Deployment-ready configuration
