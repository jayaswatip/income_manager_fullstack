import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, useParams, Link } from "react-router-dom";

function EditExpense() {
    const [form, setForm] = useState({ title: "", amount: "", category: "", date: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    const categories = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Health", "Education", "Other"];

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const res = await API.get(`/expense/get`);
                const expense = res.data.find(item => item._id === id);
                if (expense) {
                    setForm({
                        title: expense.title,
                        amount: expense.amount,
                        category: expense.category,
                        date: expense.date.split('T')[0]
                    });
                }
            } catch {
                alert("Failed to load expense data");
            }
        };
        fetchExpense();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.put(`/expense/update/${id}`, form);
            navigate("/dashboard");
        } catch {
            alert("Failed to update expense");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div className="form-container" style={{ maxWidth: '500px' }}>
                <h2 className="form-title" style={{ color: 'var(--danger)' }}>Edit Expense</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            name="title"
                            className="form-control"
                            placeholder="e.g., Grocery Shopping"
                            value={form.title}
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
                            value={form.amount}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select
                            name="category"
                            className="form-control"
                            value={form.category}
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
                            value={form.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-danger btn-block" disabled={loading}>
                        {loading ? "Updating..." : "Update Expense"}
                    </button>
                    <Link to="/dashboard" className="btn btn-outline btn-block" style={{ marginTop: '0.5rem' }}>
                        Cancel
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default EditExpense;
