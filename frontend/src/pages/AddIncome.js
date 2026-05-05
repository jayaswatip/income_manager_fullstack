import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function AddIncome() {
    const [form, setForm] = useState({ title: "", amount: "", category: "", date: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const categories = ["Salary", "Freelance", "Investment", "Business", "Other"];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post("/income/add", form);
            navigate("/dashboard");
        } catch {
            alert("Failed to add income");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div className="form-container" style={{ maxWidth: '500px' }}>
                <h2 className="form-title">Add New Income</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            name="title"
                            className="form-control"
                            placeholder="e.g., Monthly Salary"
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
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? "Adding..." : "Add Income"}
                    </button>
                    <Link to="/dashboard" className="btn btn-outline btn-block" style={{ marginTop: '0.5rem' }}>
                        Cancel
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default AddIncome;