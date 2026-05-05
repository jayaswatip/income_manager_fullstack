import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { generateMonthlyReport } from "../utils/pdfExport";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function Dashboard() {
    const [income, setIncome] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [budget, setBudget] = useState({ monthlyBudget: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("income");
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            const [incomeRes, expenseRes, budgetRes] = await Promise.all([
                API.get("/income/get"),
                API.get("/expense/get"),
                API.get("/budget/get")
            ]);
            setIncome(incomeRes.data);
            setExpenses(expenseRes.data);
            setBudget(budgetRes.data);
        } catch {
            alert("Please login again");
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (id, type) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
        try {
            await API.delete(`/${type}/delete/${id}`);
            fetchData();
        } catch {
            alert(`Failed to delete ${type}`);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const currentData = activeTab === "income" ? income : expenses;

    const filteredData = useMemo(() => {
        let filtered = currentData.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = !categoryFilter || item.category === categoryFilter;
            const matchesDateFrom = !dateFrom || new Date(item.date) >= new Date(dateFrom);
            const matchesDateTo = !dateTo || new Date(item.date) <= new Date(dateTo);
            return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo;
        });

        filtered.sort((a, b) => {
            let aVal, bVal;
            if (sortBy === "date") {
                aVal = new Date(a.date);
                bVal = new Date(b.date);
            } else if (sortBy === "amount") {
                aVal = Number(a.amount);
                bVal = Number(b.amount);
            } else {
                aVal = a[sortBy]?.toLowerCase();
                bVal = b[sortBy]?.toLowerCase();
            }
            return sortOrder === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
        });

        return filtered;
    }, [currentData, search, categoryFilter, sortBy, sortOrder, dateFrom, dateTo]);

    const stats = useMemo(() => {
        const totalIncome = income.reduce((acc, item) => acc + Number(item.amount), 0);
        const totalExpenses = expenses.reduce((acc, item) => acc + Number(item.amount), 0);
        const netBalance = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0;
        
        return { 
            totalIncome, 
            totalExpenses, 
            netBalance, 
            savingsRate,
            incomeCount: income.length,
            expenseCount: expenses.length
        };
    }, [income, expenses]);

    const budgetProgress = useMemo(() => {
        const currentMonthExpenses = expenses.filter(exp => {
            const expDate = new Date(exp.date);
            const now = new Date();
            return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
        });
        const spent = currentMonthExpenses.reduce((acc, exp) => acc + Number(exp.amount), 0);
        const percentage = budget.monthlyBudget > 0 ? Math.min((spent / budget.monthlyBudget) * 100, 100) : 0;
        return { spent, percentage, remaining: Math.max(budget.monthlyBudget - spent, 0) };
    }, [expenses, budget]);

    const categories = useMemo(() => {
        const cats = {};
        currentData.forEach(item => {
            cats[item.category] = (cats[item.category] || 0) + Number(item.amount);
        });
        return cats;
    }, [currentData]);

    const pieData = {
        labels: Object.keys(categories),
        datasets: [{
            data: Object.values(categories),
            backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
        }]
    };

    const getCategoryClass = (cat, type) => {
        if (type === "income") {
            const map = { 'salary': 'badge-salary', 'freelance': 'badge-freelance', 'investment': 'badge-investment', 'business': 'badge-business' };
            return `badge ${map[cat.toLowerCase()] || 'badge-other'}`;
        }
        return 'badge badge-danger';
    };

    const exportToCSV = () => {
        const headers = ["Type", "Title", "Amount", "Category", "Date"];
        const rows = filteredData.map(item => [
            activeTab,
            item.title,
            item.amount,
            item.category,
            new Date(item.date).toLocaleDateString()
        ]);
        const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${activeTab}_export_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const uniqueCategories = [...new Set(currentData.map(i => i.category))];

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
            {/* Financial Overview */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <div className="stat-card">
                    <div className="stat-icon income">💰</div>
                    <div>
                        <div className="stat-value" style={{ color: 'var(--secondary)' }}>₹{stats.totalIncome.toLocaleString()}</div>
                        <div className="stat-label">Total Income</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fee2e2' }}>💸</div>
                    <div>
                        <div className="stat-value" style={{ color: 'var(--danger)' }}>₹{stats.totalExpenses.toLocaleString()}</div>
                        <div className="stat-label">Total Expenses</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: stats.netBalance >= 0 ? '#dcfce7' : '#fee2e2' }}>
                        {stats.netBalance >= 0 ? '📈' : '📉'}
                    </div>
                    <div>
                        <div className="stat-value" style={{ color: stats.netBalance >= 0 ? 'var(--secondary)' : 'var(--danger)' }}>
                            ₹{Math.abs(stats.netBalance).toLocaleString()}
                        </div>
                        <div className="stat-label">{stats.netBalance >= 0 ? 'Net Savings' : 'Net Deficit'}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon avg">📊</div>
                    <div>
                        <div className="stat-value">{stats.savingsRate}%</div>
                        <div className="stat-label">Savings Rate</div>
                    </div>
                </div>
            </div>

            {/* Budget Progress */}
            {budget.monthlyBudget > 0 && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Budget Progress (This Month)</span>
                        <span>₹{budgetProgress.spent.toLocaleString()} / ₹{budget.monthlyBudget.toLocaleString()}</span>
                    </div>
                    <div style={{ width: '100%', height: '25px', backgroundColor: 'var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${budgetProgress.percentage}%`,
                            height: '100%',
                            backgroundColor: budgetProgress.percentage > 90 ? 'var(--danger)' : budgetProgress.percentage > 75 ? 'var(--warning)' : 'var(--secondary)',
                            borderRadius: '12px',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                    <div style={{ textAlign: 'right', marginTop: '0.5rem', color: 'var(--text-light)' }}>
                        ₹{budgetProgress.remaining.toLocaleString()} remaining
                    </div>
                </div>
            )}

            {/* Charts */}
            {currentData.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="chart-container">
                        <h3 className="card-title">{activeTab === "income" ? "Income" : "Expense"} by Category</h3>
                        <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                </div>
            )}

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button 
                    className={`btn ${activeTab === "income" ? "btn-secondary" : "btn-outline"}`}
                    onClick={() => { setActiveTab("income"); setSearch(""); setCategoryFilter(""); }}
                >
                    💰 Income ({stats.incomeCount})
                </button>
                <button 
                    className={`btn ${activeTab === "expense" ? "btn-danger" : "btn-outline"}`}
                    onClick={() => { setActiveTab("expense"); setSearch(""); setCategoryFilter(""); }}
                >
                    💸 Expenses ({stats.expenseCount})
                </button>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="filters">
                    <input
                        type="text"
                        className="form-control search-box"
                        placeholder={`🔍 Search ${activeTab}...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="form-control category-filter"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {uniqueCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <div className="date-range">
                        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} placeholder="From" />
                        <span>to</span>
                        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} placeholder="To" />
                    </div>
                    <select
                        className="form-control sort-select"
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                            const [field, order] = e.target.value.split("-");
                            setSortBy(field);
                            setSortOrder(order);
                        }}
                    >
                        <option value="date-desc">Date (Newest)</option>
                        <option value="date-asc">Date (Oldest)</option>
                        <option value="amount-desc">Amount (High-Low)</option>
                        <option value="amount-asc">Amount (Low-High)</option>
                        <option value="category-asc">Category (A-Z)</option>
                    </select>
                    <button className="btn export-btn" onClick={exportToCSV} disabled={filteredData.length === 0}>
                        📥 CSV
                    </button>
                    <button 
                        className="btn" 
                        onClick={() => generateMonthlyReport(income, expenses, stats, budget)}
                        style={{ background: '#ff5722', color: 'white' }}
                    >
                        📄 PDF Report
                    </button>
                    <button 
                        className={`btn ${activeTab === "income" ? "btn-secondary" : "btn-danger"}`}
                        onClick={() => navigate(activeTab === "income" ? "/add-income" : "/add-expense")}
                    >
                        + Add {activeTab === "income" ? "Income" : "Expense"}
                    </button>
                </div>

                {/* Data List */}
                <div className="income-list">
                    {filteredData.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📭</div>
                            <p>No {activeTab} entries found</p>
                        </div>
                    ) : (
                        filteredData.map((item) => (
                            <div key={item._id} className="income-item">
                                <div className="income-info">
                                    <h4>{item.title}</h4>
                                    <div className="income-meta">
                                        <span className={getCategoryClass(item.category, activeTab)}>{item.category}</span>
                                        <span>{new Date(item.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span className="income-amount" style={{ color: activeTab === "income" ? 'var(--secondary)' : 'var(--danger)' }}>
                                        {activeTab === "income" ? "+" : "-"}₹{Number(item.amount).toLocaleString()}
                                    </span>
                                    <div className="income-actions">
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => navigate(activeTab === "income" ? `/edit/${item._id}` : `/edit-expense/${item._id}`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => deleteItem(item._id, activeTab)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;