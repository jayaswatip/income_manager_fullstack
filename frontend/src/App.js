import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddIncome from "./pages/AddIncome";
import EditIncome from "./pages/EditIncome";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";
import Budget from "./pages/Budget";
import SavingsGoals from "./pages/SavingsGoals";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-income" element={<AddIncome />} />
        <Route path="/edit/:id" element={<EditIncome />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/edit-expense/:id" element={<EditExpense />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/savings-goals" element={<SavingsGoals />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;