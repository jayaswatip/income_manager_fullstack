import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function RecurringTransactions() {
    const [recurring, setRecurring] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        amount: "",
        type: "income",
        category: "",
        frequency: "monthly",
        startDate: "",
        endDate: "",
        description: ""
    });

    const incomeCategories = ["Salary", "Freelance", "Investment", "Business", "Other"];
    const expenseCategories = ["Rent", "Utilities", "Subscription", "Insurance", "Loan", "Other"];

    useEffect(() => {
        fetchRecurring();
    }, []);

    const fetchRecurring = async () => {
        try {
            setLoading(true);
            const res = await API.get("/recurring/get");
            setRecurring(res.data);
        } catch {
            alert("Failed to load recurring transactions");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await API.post("/recurring/create", form);
            setShowForm(false);
            setForm({
                title: "",
                amount: "",
                type: "income",
                category: "",
                frequency: "monthly",
                startDate: "",
                endDate: "",
                description: ""
            });
            fetchRecurring();
        } catch {
            alert("Failed to create recurring transaction");
        } finally {
            setSaving(false);
        }
    };

    const toggleActive = async (id) => {
        try {
            await API.put(`/recurring/toggle/${id}`);
            fetchRecurring();
        } catch {
            alert("Failed to toggle status");
        }
    };

    const processNow = async (id) => {
        try {
            await API.put(`/recurring/process/${id}`);
            alert("Transaction processed successfully!");
            fetchRecurring();
        } catch {
            alert("Failed to process transaction");
        }
    };

    const deleteRecurring = async (id) => {
        if (!window.confirm("Are you sure you want to delete this recurring transaction?")) return;
        try {
            await API.delete(`/recurring/delete/${id}`);
            fetchRecurring();
        } catch {
            alert("Failed to delete");
        }
    };

    const getFrequencyLabel = (freq) => {
        const labels = { daily: "Daily", weekly: "Weekly", monthly: "Monthly", yearly: "Yearly" };
        return labels[freq] || freq;
    };

    const getNextDueDate = (item) => {
        const lastProcessed = item.lastProcessed ? new Date(item.lastProcessed) : new Date(item.startDate);
        const nextDate = new Date(lastProcessed);

        switch (item.frequency) {
            case "daily":
                nextDate.setDate(nextDate.getDate() + 1);
                break;
            case "weekly":
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case "monthly":
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
            case "yearly":
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                break;
        }

        return nextDate.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ margin: 0 }}>🔄 Recurring Transactions</h1>
                    <p style={{ color: 'var(--text-light)', margin: '0.5rem 0 0 0' }}>
                        Auto-generate transactions daily, weekly, monthly, or yearly
                    </p>
                </div>
                <button 
                    className="btn btn-secondary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Cancel" : "+ Add Recurring"}
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem' }}>
                <div className="stat-card" style={{ padding: '1rem' }}>
                    <div className="stat-value">{recurring.length}</div>
                    <div className="stat-label">Total Active</div>
                </div>
                <div className="stat-card" style={{ padding: '1rem' }}>
                    <div className="stat-value">{recurring.filter(r => r.type === "income").length}</div>
                    <div className="stat-label">Income</div>
                </div>
                <div className="stat-card" style={{ padding: '1rem' }}>
                    <div className="stat-value">{recurring.filter(r => r.type === "expense").length}</div>
                    <div className="stat-label">Expenses</div>
                </div>
                <div className="stat-card" style={{ padding: '1rem' }}>
                    <div className="stat-value">
                        ₹{recurring.reduce((acc, r) => acc + (r.type === "income" ? Number(r.amount) : -Number(r.amount)), 0).toLocaleString()}
                    </div>
                    <div className="stat-label">Net/Period</div>
                </div>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Add Recurring Transaction</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    className="form-control"
                                    placeholder="e.g., Monthly Salary"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Amount (₹)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter amount"
                                    value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    className="form-control"
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value, category: "" })}
                                    required
                                >
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    className="form-control"
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {(form.type === "income" ? incomeCategories : expenseCategories).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Frequency</label>
                                <select
                                    className="form-control"
                                    value={form.frequency}
                                    onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                                    required
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={form.startDate}
                                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>End Date (Optional)</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={form.endDate}
                                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label>Description (Optional)</label>
                            <textarea
                                className="form-control"
                                placeholder="Add notes..."
                                rows="2"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                        <div style={{ marginTop: '1.5rem' }}>
                            <button type="submit" className="btn btn-secondary" disabled={saving}>
                                {saving ? "Creating..." : "Create Recurring Transaction"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Recurring List */}
            {recurring.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔄</div>
                    <h3>No Recurring Transactions</h3>
                    <p style={{ color: 'var(--text-light)' }}>
                        Set up automatic salary, rent, subscriptions, or any regular payment
                    </p>
                </div>
            ) : (
                <div className="income-list">
                    {recurring.map((item) => (
                        <div key={item._id} className="income-item" style={{ 
                            opacity: item.isActive ? 1 : 0.6,
                            borderLeft: `4px solid ${item.type === "income" ? '#10b981' : '#ef4444'}`
                        }}>
                            <div className="income-info">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <h4 style={{ margin: 0 }}>{item.title}</h4>
                                    <span className={`badge ${item.type === "income" ? 'badge-freelance' : 'badge-danger'}`}>
                                        {item.type}
                                    </span>
                                    {!item.isActive && (
                                        <span className="badge" style={{ background: '#9ca3af' }}>Paused</span>
                                    )}
                                </div>
                                <div className="income-meta" style={{ marginTop: '0.5rem' }}>
                                    <span className="badge">{item.category}</span>
                                    <span>🔄 {getFrequencyLabel(item.frequency)}</span>
                                    <span>📅 Next: {getNextDueDate(item)}</span>
                                    {item.endDate && <span>⏰ Ends: {new Date(item.endDate).toLocaleDateString()}</span>}
                                </div>
                                {item.description && (
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                                        {item.description}
                                    </p>
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span className="income-amount" style={{ 
                                    color: item.type === "income" ? '#10b981' : '#ef4444',
                                    fontSize: '1.25rem'
                                }}>
                                    {item.type === "income" ? "+" : "-"}₹{Number(item.amount).toLocaleString()}
                                </span>
                                <div className="income-actions">
                                    <button
                                        className={`btn btn-sm ${item.isActive ? 'btn-outline' : 'btn-secondary'}`}
                                        onClick={() => toggleActive(item._id)}
                                        title={item.isActive ? "Pause" : "Resume"}
                                    >
                                        {item.isActive ? "⏸️" : "▶️"}
                                    </button>
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => processNow(item._id)}
                                        title="Process Now"
                                    >
                                        ⚡
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => deleteRecurring(item._id)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RecurringTransactions;
