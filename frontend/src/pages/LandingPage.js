import { Link } from "react-router-dom";

function LandingPage() {
    const features = [
        {
            icon: "💰",
            title: "Income & Expense Tracking",
            description: "Track all your financial transactions with detailed categorization and insightful analytics."
        },
        {
            icon: "📊",
            title: "Visual Analytics",
            description: "Beautiful charts and graphs to understand your spending patterns and financial health."
        },
        {
            icon: "🎯",
            title: "Savings Goals",
            description: "Set and track your financial goals with visual progress indicators and milestone tracking."
        },
        {
            icon: "🔄",
            title: "Recurring Transactions",
            description: "Automate your regular income and expenses with smart recurring transaction management."
        },
        {
            icon: "📄",
            title: "PDF Reports",
            description: "Generate professional financial reports and export your data in multiple formats."
        },
        {
            icon: "🌙",
            title: "Dark Mode",
            description: "Comfortable viewing experience with a beautiful dark theme option."
        }
    ];

    const stats = [
        { value: "15+", label: "Features" },
        { value: "100%", label: "Free" },
        { value: "MERN", label: "Stack" },
        { value: "24/7", label: "Access" }
    ];

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Take Control of Your
                        <span className="gradient-text"> Finances</span>
                    </h1>
                    <p className="hero-subtitle">
                        A powerful, full-stack personal finance tracker built with the MERN stack. 
                        Track income, manage expenses, set savings goals, and generate professional reports.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Get Started Free
                        </Link>
                        <Link to="/" className="btn btn-outline btn-lg">
                            Sign In
                        </Link>
                    </div>
                    <div className="tech-stack">
                        <span>Built with:</span>
                        <div className="tech-badges">
                            <span className="tech-badge">MongoDB</span>
                            <span className="tech-badge">Express</span>
                            <span className="tech-badge">React</span>
                            <span className="tech-badge">Node.js</span>
                        </div>
                    </div>
                </div>
                <div className="hero-stats">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-box">
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Everything You Need</h2>
                    <p className="section-subtitle">
                        Comprehensive financial management tools designed for modern users
                    </p>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <h2 className="cta-title">Ready to Start?</h2>
                    <p className="cta-subtitle">
                        Join thousands of users who have transformed their financial management.
                        It's free and always will be.
                    </p>
                    <Link to="/register" className="btn btn-primary btn-lg">
                        Create Free Account
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <p>Built with ❤️ for placement preparation and learning</p>
                    <p className="footer-links">
                        <a href="https://github.com/jayaswatip/income_manager_fullstack" target="_blank" rel="noopener noreferrer">
                            View on GitHub
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
