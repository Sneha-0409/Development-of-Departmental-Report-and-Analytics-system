import React from 'react';
import styles from './FacultyDashboard.module.css';

const FacultyDashboard = ({ currentUser, navigate }) => {
    const userName = currentUser?.name || 'Professor';

    const recentReports = [
        { id: 1, title: 'Q3 Curriculum Review 2023', category: 'Departmental', date: 'Oct 24, 2023', status: 'Approved' },
        { id: 2, title: 'Annual Research Grant Proposal', category: 'Financial', date: 'Oct 21, 2023', status: 'Pending' },
        { id: 3, title: 'Undergraduate Performance Analysis', category: 'Academic', date: 'Oct 19, 2023', status: 'Draft' },
        { id: 4, title: 'Faculty Training Workshop Feedback', category: 'Internal', date: 'Oct 15, 2023', status: 'Approved' },
    ];

    return (
        <div className={styles.facultyDashboard}>
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>Faculty Overview</h1>
                    <p className={styles.subtitle}>Welcome back, here's what's happening today.</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.notificationBtn}>🔔</button>
                    {/* New Report button removed for Faculty */}
                </div>
            </header>

            <section className={styles.welcomeCard}>
                <h2>Welcome back, Prof. {userName.split(' ')[0]}! 👋</h2>
                <p>You have 12 achievements logged and 2 upcoming department activities.</p>
                <div className={styles.welcomeStats}>
                    <div className={styles.statBadge}>
                        <span className={styles.statLabel}>Achievements</span>
                        <span className={styles.statValue}>12</span>
                    </div>
                </div>
            </section>

            <section className={styles.actionGrid}>
                {/* Start New Report action card removed for Faculty */}
                <div className={styles.actionCard} onClick={() => navigate('Profile')}>
                    <div className={styles.iconWrapper}>👤</div>
                    <h3>My Profile</h3>
                    <p>Update your personal details, certifications, and information.</p>
                </div>
                <div className={styles.actionCard} onClick={() => navigate('Achievements')}>
                    <div className={styles.iconWrapper}>🏆</div>
                    <h3>Upload Achievement</h3>
                    <p>Add publications, awards, or grants to your faculty profile.</p>
                </div>
                <div className={styles.actionCard} onClick={() => navigate('Analytics')}>
                    <div className={styles.iconWrapper}>📊</div>
                    <h3>View Analytics</h3>
                    <p>Analyze department performance metrics and trends.</p>
                </div>
            </section>
        </div>
    );
};

export default FacultyDashboard;
