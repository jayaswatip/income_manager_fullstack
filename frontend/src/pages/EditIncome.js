import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, useParams, Link } from "react-router-dom";

function EditIncome() {
    const [form, setForm] = useState({ title: "", amount: "", category: "", date: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    const categories = ["Salary", "Freelance", "Investment", "Business", "Other"];

    useEffect(() => {
        const fetchIncome = async () => {
            try {
                const res = await API.get(`/income/get`);
                const income = res.data.find(item => item._id === id);
                if (income) {
                    setForm({
                        title: income.title,
                        amount: income.amount,
                        category: income.category,
                        date: income.date.split('T')[0]
                    });
                }
            } catch {
                alert("Failed to load income data");
            }
        };
        fetchIncome();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.put(`/income/update/${id}`, form);
            navigate("/dashboard");
        } catch {
            alert("Failed to update income");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div className="form-container" style={{ maxWidth: '500px' }}>
                <h2 className="form-title">Edit Income</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            name="title"
                            className="form-control"
                            placeholder="e.g., Monthly Salary"
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
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? "Updating..." : "Update Income"}
                    </button>
                    <Link to="/dashboard" className="btn btn-outline btn-block" style={{ marginTop: '0.5rem' }}>
                        Cancel
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default EditIncome;
