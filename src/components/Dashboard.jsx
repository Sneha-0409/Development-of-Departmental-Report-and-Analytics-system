import React from 'react';
import styles from './Dashboard.module.css';



// 1. Personalized Header
const WelcomeHeader = ({ name }) => (
    <div className={styles.header}>
        <h1 className={styles.title}>Welcome, {name}!</h1>
        <p className={styles.subtitle}>Here's your activity overview for today.</p>
    </div>
);

// 2. Role-Based Quick Actions
const QuickActions = ({ role }) => {
    let actions = [];
    if (role === 'hod') {
        actions = [
            { label: 'Review Pending Reports', count: 3, icon: '📄' },
            { label: 'View Departmental Archives', icon: '🗄️' },
        ];
    } else if (role === 'admin') {
        actions = [
            { label: 'Manage Users', icon: '👥' },
            { label: 'System Analytics', icon: '📈' },
        ];
    } else if (role === 'report-maker') {
        actions = [
            { label: 'Create New Report', icon: '➕' },
            { label: 'View My Drafts', count: 5, icon: '📝' },
        ];
    }

    return (
        <div className={`${styles.card} ${styles.quickActionsCard}`}>
            <div className={styles.cardHeader}>
                <h3>🚀 Quick Actions</h3>
            </div>
            <div className={styles.actionsContainer}>
                {actions.map((action) => (
                    <button key={action.label} className={styles.actionButton}>
                        <span className={styles.actionIcon}>{action.icon}</span>
                        {action.label}
                        {action.count && (
                            <span className={styles.actionCount}>{action.count}</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

// 3. Key Statistics Card
const KeyStatistics = () => (
    <div className={`${styles.card} ${styles.statsCard}`}>
        <div className={styles.cardHeader}>
            <h3>📊 Key Statistics</h3>
        </div>
        <div className={styles.statsGrid}>
            <div className={styles.statItem}>
                <span className={styles.statValue}>12</span>
                <span className={styles.statLabel}>Reports Submitted (Month)</span>
            </div>
            <div className={styles.statItem}>
                <span className={styles.statValue}>3</span>
                <span className={styles.statLabel}>Pending Approval</span>
            </div>
            <div className={styles.statItem}>
                <span className={styles.statValue}>2</span>
                <span className={styles.statLabel}>Upcoming Deadlines</span>
            </div>
        </div>
    </div>
);

// 4. Recent Activity Feed
const RecentActivity = () => (
    <div className={`${styles.card} ${styles.activityCard}`}>
        <div className={styles.cardHeader}>
            <h3>🕒 Recent Activity</h3>
        </div>
        <ul className={styles.activityList}>
            <li>
                <div>
                    <p>⚫️ You submitted the 'Annual Sports Report.'</p>
                    <span>1 hour ago</span>
                </div>
            </li>
            <li>
                <div>
                    <p>⚫️ Dr. Smith approved the 'Q2 Financials'.</p>
                    <span>Yesterday</span>
                </div>
            </li>
            <li>
                <div>
                    <p>⚫️ A comment was added to 'Library Expansion Plan'.</p>
                    <span>Yesterday</span>
                </div>
            </li>
        </ul>
    </div>
);

// 5. Upcoming Deadlines Card
const UpcomingDeadlines = () => (
    <div className={`${styles.card} ${styles.deadlinesCard}`}>
        <div className={styles.cardHeader}>
            <h3>🗓️ Upcoming Deadlines</h3>
        </div>
        <ul className={styles.deadlineList}>
            <li>
                <span>Annual Financial Report</span>
                <strong>October 20th, 2025</strong>
            </li>
            <li>
                <span>Q3 Activities Summary</span>
                <strong>November 1st, 2025</strong>
            </li>
        </ul>
    </div>
);

// --- Main Dashboard Component ---
const Dashboard = ({ handleLogout, currentUser, navigate }) => {
    const userName = currentUser ? currentUser.name : 'User';
    const userRole = currentUser ? currentUser.role : null;

    return (
        <div className={styles.dashboard}>
            <WelcomeHeader name={userName} />
            <div className={styles.dashboardGrid}>
                {(userRole === 'hod' || userRole === 'admin' || userRole === 'report-maker') && (
                    <QuickActions role={userRole} />
                )}
                <KeyStatistics />
                <RecentActivity />
                <UpcomingDeadlines />
            </div>
            <div className={styles.ReportContainer}>
                <button
                    className={styles.ReportButton}
                    onClick={() => navigate('Reports')}
                >
                    Make Report
                </button>
            </div>
        </div>
    );
};

export default Dashboard;



