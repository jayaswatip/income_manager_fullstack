import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function Dashboard() {
    const [income, setIncome] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const navigate = useNavigate();

    const fetchIncome = async () => {
        try {
            setLoading(true);
            const res = await API.get("/income/get");
            setIncome(res.data);
        } catch {
            alert("Please login again");
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    const deleteIncome = async (id) => {
        if (!window.confirm("Are you sure you want to delete this income?")) return;
        try {
            await API.delete(`/income/delete/${id}`);
            fetchIncome();
        } catch {
            alert("Failed to delete");
        }
    };

    useEffect(() => {
        fetchIncome();
    }, []);

    const filteredIncome = useMemo(() => {
        return income.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = !categoryFilter || item.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [income, search, categoryFilter]);

    const stats = useMemo(() => {
        const total = income.reduce((acc, item) => acc + Number(item.amount), 0);
        const count = income.length;
        const avg = count > 0 ? total / count : 0;
        return { total, count, avg };
    }, [income]);

    const categories = useMemo(() => {
        const cats = {};
        income.forEach(item => {
            cats[item.category] = (cats[item.category] || 0) + Number(item.amount);
        });
        return cats;
    }, [income]);

    const monthlyData = useMemo(() => {
        const months = {};
        income.forEach(item => {
            const month = new Date(item.date).toLocaleString('default', { month: 'short' });
            months[month] = (months[month] || 0) + Number(item.amount);
        });
        return months;
    }, [income]);

    const pieData = {
        labels: Object.keys(categories),
        datasets: [{
            data: Object.values(categories),
            backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
        }]
    };

    const barData = {
        labels: Object.keys(monthlyData),
        datasets: [{
            label: 'Income by Month',
            data: Object.values(monthlyData),
            backgroundColor: '#6366f1',
        }]
    };

    const getCategoryClass = (cat) => {
        const map = {
            'salary': 'badge-salary',
            'freelance': 'badge-freelance',
            'investment': 'badge-investment',
            'business': 'badge-business'
        };
        return `badge ${map[cat.toLowerCase()] || 'badge-other'}`;
    };

    const uniqueCategories = [...new Set(income.map(i => i.category))];

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
            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon income">💰</div>
                    <div>
                        <div className="stat-value">₹{stats.total.toLocaleString()}</div>
                        <div className="stat-label">Total Income</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon count">📊</div>
                    <div>
                        <div className="stat-value">{stats.count}</div>
                        <div className="stat-label">Total Entries</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon avg">📈</div>
                    <div>
                        <div className="stat-value">₹{Math.round(stats.avg).toLocaleString()}</div>
                        <div className="stat-label">Average Income</div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            {income.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="chart-container">
                        <h3 className="card-title">Income by Category</h3>
                        <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                    <div className="chart-container">
                        <h3 className="card-title">Monthly Income</h3>
                        <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="card">
                <div className="filters">
                    <input
                        type="text"
                        className="form-control search-box"
                        placeholder="🔍 Search income..."
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
                    <button className="btn btn-secondary" onClick={() => navigate("/add-income")}>
                        + Add Income
                    </button>
                </div>

                {/* Income List */}
                <div className="income-list">
                    {filteredIncome.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📭</div>
                            <p>No income entries found</p>
                        </div>
                    ) : (
                        filteredIncome.map((item) => (
                            <div key={item._id} className="income-item">
                                <div className="income-info">
                                    <h4>{item.title}</h4>
                                    <div className="income-meta">
                                        <span className={getCategoryClass(item.category)}>{item.category}</span>
                                        <span>{new Date(item.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span className="income-amount">₹{Number(item.amount).toLocaleString()}</span>
                                    <div className="income-actions">
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => navigate(`/edit/${item._id}`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => deleteIncome(item._id)}
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