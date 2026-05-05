# Income Manager (MERN Stack)

A full-stack Income Management application built with MongoDB, Express.js, React, and Node.js.

## Features

- User Authentication (JWT-based login/register)
- Add, Edit, Delete income entries
- View total income dashboard
- Protected routes for authenticated users

## Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT for authentication
- bcryptjs for password hashing

**Frontend:**
- React 19
- React Router for navigation
- Axios for API calls
- Chart.js for data visualization

## How to Run

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/jayaswatip/income_manager_fullstack.git
cd income_manager_fullstack

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Start the Backend Server

```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

### 3. Start the Frontend

```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

## Project Structure

```
income_manager/
├── backend/
│   ├── config/       # Database configuration
│   ├── controllers/  # Business logic (auth, income)
│   ├── middleware/   # JWT authentication middleware
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   └── server.js     # Entry point
├── frontend/
│   ├── src/
│   │   ├── pages/    # Login, Register, Dashboard, AddIncome, EditIncome
│   │   └── services/ # API service with Axios
│   └── public/
└── README.md
```



**Architecture:** Client (React) → REST API (Express) → Database (MongoDB Atlas)
