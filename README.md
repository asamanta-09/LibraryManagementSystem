# Library Management System

A full-stack Library Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Vite.

## Overview
This application provides a complete library management solution with role-based access control (Admin and User/Student roles), book inventory management, and a borrow/return tracking system.

## Tech Stack
- **Frontend**: React + Vite, React Router DOM, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing

## Project Structure

### Backend (`library-backend/`)
- `server.js` - Main Express server
- `config/db.js` - MongoDB connection configuration
- `models/` - Mongoose models (User, Book, Borrow)
- `controllers/` - Business logic for routes
- `routes/` - API endpoints
- `middleware/` - Authentication middleware

### Frontend (`library-frontend/`)
- `src/components/` - Reusable React components (Navbar, BookCard, Dashboard)
- `src/pages/` - Page components (Login, Register, BookList, AdminPanel)
- `src/api/` - Axios instance configuration
- `src/App.jsx` - Main app component with routing
- `vite.config.js` - Vite configuration

## Core Features

### User Roles
- **Admin**: Manage books, users, and issue/return operations
- **User/Student**: View, search, and borrow books

### Book Management
- Add, edit, and delete books
- Track book details (title, author, genre, publication year, quantity)
- Real-time availability tracking

### Borrow & Return System
- Users can borrow available books
- Admin can track borrowed books and update return status
- Automatic due date tracking (14 days)
- Overdue status identification

### Authentication & Authorization
- Secure registration and login using JWT
- Password hashing with bcrypt
- Protected routes with role-based access control

### Dashboards
- **Admin Dashboard**: Total books, users, borrowed books, and overdue items
- **User Dashboard**: Personal borrowed books and due dates

## Setup Instructions

### Prerequisites
You need a MongoDB database. Set the connection string in `library-backend/.env`:

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Running the Application
The application uses a startup script that runs both backend and frontend:

- Backend runs on port 3000
- Frontend runs on port 5000

### Default Credentials
Register a new account with either:
- Role: `admin` - Full management access
- Role: `user` - Student/borrower access

## API Endpoints

### Users
- POST `/api/users/register` - Register new user
- POST `/api/users/login` - User login
- GET `/api/users/profile` - Get user profile (protected)
- GET `/api/users/` - Get all users (admin only)

### Books
- GET `/api/books` - Get all books (with search/filter)
- GET `/api/books/:id` - Get book by ID
- POST `/api/books` - Create book (admin only)
- PUT `/api/books/:id` - Update book (admin only)
- DELETE `/api/books/:id` - Delete book (admin only)

### Borrows
- POST `/api/borrows` - Borrow a book (protected)
- PUT `/api/borrows/:id/return` - Return a book (protected)
- GET `/api/borrows/my-borrows` - Get user's borrows (protected)
- GET `/api/borrows/all` - Get all borrows (admin only)
- GET `/api/borrows/stats` - Get dashboard statistics (protected)

## Recent Changes
- Initial project setup with MERN stack
- Implemented user authentication with JWT
- Created book management system
- Built borrow/return tracking
- Added role-based dashboards
- Styled with responsive CSS

## Important Notes
- MongoDB connection required - update `.env` with your connection string
- Frontend configured to run on port 5000 (required for Replit)
- Backend API runs on port 3000
- CORS enabled for cross-origin requests
- All passwords are hashed before storage
- JWT tokens expire after 30 days
