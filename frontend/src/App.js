import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddIncome from "./pages/AddIncome";
import EditIncome from "./pages/EditIncome";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-income" element={<AddIncome />} />
        <Route path="/edit/:id" element={<EditIncome />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;