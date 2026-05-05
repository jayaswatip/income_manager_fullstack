import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function SavingsGoals() {
    const [goals, setGoals] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [addAmount, setAddAmount] = useState({});
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        targetAmount: "",
        currentAmount: "0",
        deadline: "",
        category: "",
        description: ""
    });

    const categories = ["Emergency Fund", "Vacation", "Education", "Vehicle", "Home", "Investment", "Wedding", "Other"];

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            setLoading(true);
            const res = await API.get("/savings-goal/get");
            setGoals(res.data);
        } catch {
            alert("Failed to load goals");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await API.post("/savings-goal/create", form);
            setShowForm(false);
            setForm({ title: "", targetAmount: "", currentAmount: "0", deadline: "", category: "", description: "" });
            fetchGoals();
        } catch {
            alert("Failed to create goal");
        } finally {
            setSaving(false);
        }
    };

    const handleAddSavings = async (goalId) => {
        const amount = addAmount[goalId];
        if (!amount || amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        try {
            await API.put(`/savings-goal/add-savings/${goalId}`, { amount: Number(amount) });
            setAddAmount({ ...addAmount, [goalId]: "" });
            fetchGoals();
        } catch {
            alert("Failed to add savings");
        }
    };

    const deleteGoal = async (id) => {
        if (!window.confirm("Are you sure you want to delete this goal?")) return;
        try {
            await API.delete(`/savings-goal/delete/${id}`);
            fetchGoals();
        } catch {
            alert("Failed to delete goal");
        }
    };

    const calculateProgress = (current, target) => {
        return Math.min((current / target) * 100, 100);
    };

    const calculateDaysLeft = (deadline) => {
        const today = new Date();
        const target = new Date(deadline);
        const diffTime = target - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const totalTarget = goals.reduce((acc, goal) => acc + Number(goal.targetAmount), 0);
    const totalSaved = goals.reduce((acc, goal) => acc + Number(goal.currentAmount), 0);
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

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
                <h1 style={{ margin: 0 }}>🎯 Savings Goals</h1>
                <button 
                    className="btn btn-secondary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Cancel" : "+ Create Goal"}
                </button>
            </div>

            {/* Overall Progress */}
            {goals.length > 0 && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0 }}>Overall Progress</h3>
                        <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                            ₹{totalSaved.toLocaleString()} / ₹{totalTarget.toLocaleString()}
                        </span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '30px',
                        backgroundColor: 'var(--border)',
                        borderRadius: '15px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${overallProgress}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, #6366f1, #8b5cf6)`,
                            borderRadius: '15px',
                            transition: 'width 0.5s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                        }}>
                            {overallProgress.toFixed(0)}%
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--text-light)' }}>
                        {goals.length} active goals
                    </div>
                </div>
            )}

            {/* Create Goal Form */}
            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Create New Savings Goal</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Goal Title</label>
                                <input
                                    className="form-control"
                                    placeholder="e.g., Europe Vacation"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Target Amount (₹)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter target amount"
                                    value={form.targetAmount}
                                    onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                                    required
                                />
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
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Target Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={form.deadline}
                                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label>Description (Optional)</label>
                            <textarea
                                className="form-control"
                                placeholder="Add notes about this goal..."
                                rows="2"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                        <div style={{ marginTop: '1.5rem' }}>
                            <button type="submit" className="btn btn-secondary" disabled={saving}>
                                {saving ? "Creating..." : "Create Goal"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Goals Grid */}
            {goals.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
                    <h3>No Savings Goals Yet</h3>
                    <p style={{ color: 'var(--text-light)' }}>
                        Create your first goal to start tracking your savings journey!
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {goals.map((goal) => {
                        const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
                        const daysLeft = calculateDaysLeft(goal.deadline);
                        const isCompleted = goal.currentAmount >= goal.targetAmount;

                        return (
                            <div key={goal._id} className="card" style={{ position: 'relative' }}>
                                {isCompleted && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        background: '#10b981',
                                        color: 'white',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600
                                    }}>
                                        ✓ Completed
                                    </div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '2rem' }}>
                                        {goal.category === 'Vacation' && '🏖️'}
                                        {goal.category === 'Emergency Fund' && '🚨'}
                                        {goal.category === 'Education' && '🎓'}
                                        {goal.category === 'Vehicle' && '🚗'}
                                        {goal.category === 'Home' && '🏠'}
                                        {goal.category === 'Investment' && '📈'}
                                        {goal.category === 'Wedding' && '💒'}
                                        {goal.category === 'Other' && '🎯'}
                                    </span>
                                    <div>
                                        <h4 style={{ margin: 0 }}>{goal.title}</h4>
                                        <span className="badge" style={{ fontSize: '0.7rem' }}>{goal.category}</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 600 }}>₹{Number(goal.currentAmount).toLocaleString()}</span>
                                        <span style={{ color: 'var(--text-light)' }}>
                                            of ₹{Number(goal.targetAmount).toLocaleString()}
                                        </span>
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        height: '20px',
                                        backgroundColor: 'var(--border)',
                                        borderRadius: '10px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${progress}%`,
                                            height: '100%',
                                            background: isCompleted 
                                                ? 'linear-gradient(90deg, #10b981, #34d399)'
                                                : progress > 75 
                                                    ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                                                    : 'linear-gradient(90deg, #3b82f6, #6366f1)',
                                            borderRadius: '10px',
                                            transition: 'width 0.5s ease'
                                        }} />
                                    </div>
                                    <div style={{ textAlign: 'center', marginTop: '0.25rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
                                        {progress.toFixed(1)}% completed
                                    </div>
                                </div>

                                {/* Stats */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                    <span style={{ color: daysLeft < 30 ? 'var(--danger)' : 'var(--text-light)' }}>
                                        {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today!' : `${Math.abs(daysLeft)} days overdue`}
                                    </span>
                                    <span style={{ color: 'var(--text-light)' }}>
                                        ₹{(goal.targetAmount - goal.currentAmount).toLocaleString()} to go
                                    </span>
                                </div>

                                {/* Quick Add Savings */}
                                {!isCompleted && (
                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Add amount"
                                            style={{ flex: 1 }}
                                            value={addAmount[goal._id] || ""}
                                            onChange={(e) => setAddAmount({ ...addAmount, [goal._id]: e.target.value })}
                                        />
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => handleAddSavings(goal._id)}
                                        >
                                            Add
                                        </button>
                                    </div>
                                )}

                                {/* Description */}
                                {goal.description && (
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '1rem', fontStyle: 'italic' }}>
                                        "{goal.description}"
                                    </p>
                                )}

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        className="btn btn-sm btn-outline"
                                        style={{ flex: 1 }}
                                        onClick={() => deleteGoal(goal._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default SavingsGoals;
