# 💰 Personal Finance Tracker (MERN Stack)

A comprehensive full-stack personal finance management application with automated recurring transactions, budget tracking, savings goals, and professional PDF reporting.

![Features](https://img.shields.io/badge/Features-15+-green)
![Tech Stack](https://img.shields.io/badge/MERN-Stack-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Key Features

### 🏦 Core Financial Management
- **Income Tracking** - Add, edit, delete income entries with categories
- **Expense Tracking** - Complete expense management with budget categories
- **Net Balance** - Real-time calculation of Income - Expenses = Net Savings
- **Financial Dashboard** - Visual overview with charts and statistics

### 📊 Data Visualization & Reports
- **Interactive Charts** - Pie charts for category breakdown (Chart.js)
- **PDF Reports** - Export professional monthly financial reports (jsPDF)
- **CSV Export** - Download transaction data for analysis
- **Dark Mode** - Toggle between light/dark themes with persistence

### 🎯 Advanced Features
- **Budget Management** - Set monthly budgets with animated progress bars
- **Savings Goals** - Create goals (vacation, emergency fund, etc.) with visual tracking
- **Recurring Transactions** - Auto-generate salary, rent, subscriptions using node-cron
- **Smart Sorting** - Sort by date, amount, or category
- **Date Range Filter** - Filter transactions by custom date ranges
- **Search & Filter** - Real-time search across all transactions

### 🔐 Security & UX
- **JWT Authentication** - Secure login/register with bcrypt password hashing
- **Protected Routes** - Frontend route guards for authenticated users
- **Responsive Design** - Mobile-friendly interface
- **Toast Notifications** - User-friendly feedback instead of alerts

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | REST API framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **node-cron** | Scheduled task automation |
| **CORS** | Cross-origin resource sharing |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI library |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client with interceptors |
| **Chart.js** | Data visualization |
| **jsPDF** | PDF generation |
| **CSS Variables** | Dynamic theming (dark mode) |

## 🚀 How to Run

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)

### 1. Clone Repository
```bash
git clone https://github.com/jayaswatip/income_manager_fullstack.git
cd income_manager_fullstack
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key" > .env

npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
# App opens at http://localhost:3000
```

## 📁 Project Structure

```
income_manager/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # JWT auth logic
│   │   ├── incomeController.js    # Income CRUD
│   │   ├── expenseController.js   # Expense CRUD
│   │   ├── budgetController.js    # Budget management
│   │   ├── savingsGoalController.js # Savings goals
│   │   └── recurringTransactionController.js # Cron automation
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Income.js          # Income schema
│   │   ├── Expense.js         # Expense schema
│   │   ├── Budget.js          # Budget schema
│   │   ├── SavingsGoal.js     # Goal schema
│   │   └── RecurringTransaction.js # Recurring schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── incomeRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── savingsGoalRoutes.js
│   │   └── recurringTransactionRoutes.js
│   ├── server.js              # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js      # Navigation + dark mode
│   │   │   └── Toast.js       # Notification component
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js   # Main dashboard with charts
│   │   │   ├── AddIncome.js
│   │   │   ├── EditIncome.js
│   │   │   ├── AddExpense.js
│   │   │   ├── EditExpense.js
│   │   │   ├── Budget.js      # Budget settings
│   │   │   ├── SavingsGoals.js # Goals management
│   │   │   └── RecurringTransactions.js # Recurring setup
│   │   ├── services/
│   │   │   └── api.js         # Axios configuration
│   │   ├── utils/
│   │   │   └── pdfExport.js   # PDF generation utility
│   │   ├── App.js
│   │   └── index.css          # Global styles + dark mode
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Income
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/income/add` | Add income entry |
| GET | `/api/income/get` | Get all income |
| PUT | `/api/income/update/:id` | Update income |
| DELETE | `/api/income/delete/:id` | Delete income |

### Expense
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/expense/add` | Add expense entry |
| GET | `/api/expense/get` | Get all expenses |
| PUT | `/api/expense/update/:id` | Update expense |
| DELETE | `/api/expense/delete/:id` | Delete expense |

### Budget
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budget/get` | Get budget settings |
| PUT | `/api/budget/update` | Update budget |

### Savings Goals
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/savings-goal/create` | Create goal |
| GET | `/api/savings-goal/get` | Get all goals |
| PUT | `/api/savings-goal/update/:id` | Update goal |
| PUT | `/api/savings-goal/add-savings/:id` | Add to savings |
| DELETE | `/api/savings-goal/delete/:id` | Delete goal |

### Recurring Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/recurring/create` | Create recurring |
| GET | `/api/recurring/get` | Get all recurring |
| PUT | `/api/recurring/update/:id` | Update recurring |
| PUT | `/api/recurring/toggle/:id` | Toggle active status |
| PUT | `/api/recurring/process/:id` | Process manually |
| DELETE | `/api/recurring/delete/:id` | Delete recurring |

## 💡 Key Implementation Details

### Authentication Flow
1. User registers/logs in
2. Backend generates JWT token with user ID
3. Token stored in localStorage
4. Axios interceptor attaches token to all requests
5. Protected routes verify token via authMiddleware

### Recurring Transactions (Cron Job)
- node-cron schedules daily checks at midnight
- Compares `lastProcessed` date with frequency
- Automatically creates Income/Expense entries
- Supports: daily, weekly, monthly, yearly frequencies

### PDF Generation
- jsPDF + jspdf-autotable for professional tables
- Color-coded sections (income=green, expense=red)
- Includes summary, details, and category breakdown

### Dark Mode Implementation
- CSS variables for theming
- `data-theme` attribute on root element
- localStorage persistence
- Smooth transitions between themes

## 🎯 Skills Demonstrated

| Skill | Implementation |
|-------|---------------|
| **Full-Stack Development** | MERN stack with proper separation |
| **Authentication** | JWT with secure password hashing |
| **Database Design** | Multiple related schemas with refs |
| **REST API Design** | Proper HTTP methods and status codes |
| **Cron Jobs** | Automated recurring transactions |
| **File Generation** | PDF and CSV export functionality |
| **Data Visualization** | Chart.js integration |
| **State Management** | React hooks (useState, useEffect, useMemo) |
| **Responsive UI** | CSS Grid, Flexbox, mobile-first |
| **UX Design** | Dark mode, animations, toast notifications |

## 📝 Future Enhancements

- [ ] Data import from CSV/Excel files
- [ ] Calendar view for transactions
- [ ] Email notifications for budget alerts
- [ ] Multi-currency support
- [ ] Spending predictions with ML
- [ ] Mobile app (React Native)

## 📄 License

MIT License - feel free to use for learning or personal projects!

## 🤝 Connect

Built with ❤️ for placement preparation and full-stack learning.

**GitHub:** [jayaswatip](https://github.com/jayaswatip)

---

**Architecture:** Client (React 19) → REST API (Express) → Database (MongoDB Atlas)

**Deployment Ready:** Configure environment variables and deploy to Heroku/Vercel
