import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Budget() {
    const [monthlyBudget, setMonthlyBudget] = useState(0);
    const [currentExpenses, setCurrentExpenses] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [budgetRes, expenseRes] = await Promise.all([
                API.get("/budget/get"),
                API.get("/expense/get")
            ]);

            setMonthlyBudget(budgetRes.data.monthlyBudget || 0);

            // Calculate current month expenses
            const now = new Date();
            const currentMonthExpenses = expenseRes.data.filter(exp => {
                const expDate = new Date(exp.date);
                return expDate.getMonth() === now.getMonth() && 
                       expDate.getFullYear() === now.getFullYear();
            });

            const totalExpenses = currentMonthExpenses.reduce((acc, exp) => acc + Number(exp.amount), 0);
            setCurrentExpenses(totalExpenses);
        } catch {
            alert("Failed to load budget data");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await API.put("/budget/update", { monthlyBudget: Number(monthlyBudget) });
            alert("Budget updated successfully!");
        } catch {
            alert("Failed to update budget");
        } finally {
            setSaving(false);
        }
    };

    const percentageUsed = monthlyBudget > 0 ? Math.min((currentExpenses / monthlyBudget) * 100, 100) : 0;
    const remaining = Math.max(monthlyBudget - currentExpenses, 0);
    const isOverBudget = currentExpenses > monthlyBudget;

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
            <div className="card">
                <h2 className="form-title">💰 Monthly Budget Settings</h2>

                <div className="form-group">
                    <label>Monthly Budget Amount (₹)</label>
                    <input
                        type="number"
                        className="form-control"
                        value={monthlyBudget}
                        onChange={(e) => setMonthlyBudget(e.target.value)}
                        placeholder="Enter your monthly budget"
                    />
                </div>

                <button 
                    className="btn btn-primary btn-block" 
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Budget"}
                </button>
            </div>

            {/* Budget Progress */}
            <div className="card" style={{ marginTop: '2rem' }}>
                <h3 className="card-title">This Month's Progress</h3>

                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Budget: ₹{Number(monthlyBudget).toLocaleString()}</span>
                        <span>Used: ₹{currentExpenses.toLocaleString()} ({percentageUsed.toFixed(1)}%)</span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{
                        width: '100%',
                        height: '30px',
                        backgroundColor: 'var(--border)',
                        borderRadius: '15px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${percentageUsed}%`,
                            height: '100%',
                            backgroundColor: isOverBudget ? 'var(--danger)' : percentageUsed > 80 ? 'var(--warning)' : 'var(--secondary)',
                            borderRadius: '15px',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div className="stat-card" style={{ padding: '1rem' }}>
                        <div className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>
                            ₹{Number(monthlyBudget).toLocaleString()}
                        </div>
                        <div className="stat-label">Budget</div>
                    </div>
                    <div className="stat-card" style={{ padding: '1rem' }}>
                        <div className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--danger)' }}>
                            ₹{currentExpenses.toLocaleString()}
                        </div>
                        <div className="stat-label">Spent</div>
                    </div>
                    <div className="stat-card" style={{ padding: '1rem' }}>
                        <div className="stat-value" style={{ fontSize: '1.25rem', color: isOverBudget ? 'var(--danger)' : 'var(--secondary)' }}>
                            ₹{remaining.toLocaleString()}
                        </div>
                        <div className="stat-label">{isOverBudget ? 'Over Budget!' : 'Remaining'}</div>
                    </div>
                </div>

                {isOverBudget && (
                    <div style={{
                        background: 'var(--danger)',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginTop: '1rem',
                        textAlign: 'center'
                    }}>
                        ⚠️ You've exceeded your monthly budget by ₹{(currentExpenses - monthlyBudget).toLocaleString()}!
                    </div>
                )}

                {percentageUsed > 80 && !isOverBudget && (
                    <div style={{
                        background: 'var(--warning)',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginTop: '1rem',
                        textAlign: 'center'
                    }}>
                        ⚠️ You've used {percentageUsed.toFixed(0)}% of your budget. Spend carefully!
                    </div>
                )}
            </div>
        </div>
    );
}

export default Budget;
