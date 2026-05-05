import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function AddExpense() {
    const [form, setForm] = useState({ title: "", amount: "", category: "", date: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const categories = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Health", "Education", "Other"];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post("/expense/add", form);
            navigate("/dashboard");
        } catch {
            alert("Failed to add expense");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div className="form-container" style={{ maxWidth: '500px' }}>
                <h2 className="form-title" style={{ color: 'var(--danger)' }}>Add New Expense</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            name="title"
                            className="form-control"
                            placeholder="e.g., Grocery Shopping"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Amount (₹)</label>
                        <input
                            name="amount"
                            type="number"
                            className="form-control"
                            placeholder="Enter amount"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select
                            name="category"
                            className="form-control"
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Date</label>
                        <input
                            name="date"
                            type="date"
                            className="form-control"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-danger btn-block" disabled={loading}>
                        {loading ? "Adding..." : "Add Expense"}
                    </button>
                    <Link to="/dashboard" className="btn btn-outline btn-block" style={{ marginTop: '0.5rem' }}>
                        Cancel
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default AddExpense;
