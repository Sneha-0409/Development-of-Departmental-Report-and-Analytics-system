import React from 'react';
import styles from './FacultyDashboard.module.css';

const FacultyDashboard = ({ currentUser, navigate }) => {
    const role = currentUser?.role || 'faculty';
    const isStudent = role === 'student';
    const userName = currentUser?.name || (isStudent ? 'Student' : 'Professor');

    return (
        <div className={styles.facultyDashboard}>
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>{isStudent ? 'Student' : 'Faculty'} Overview</h1>
                    <p className={styles.subtitle}>Welcome back, here's what's happening today.</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.notificationBtn}>🔔</button>
                </div>
            </header>

            <section className={styles.welcomeCard}>
                <h2>Welcome back, {!isStudent && 'Prof. '}{userName.split(' ')[0]}! 👋</h2>
                <p>You have 12 achievements logged and 2 upcoming department activities.</p>
                <div className={styles.welcomeStats}>
                    <div className={styles.statBadge}>
                        <span className={styles.statLabel}>Achievements</span>
                        <span className={styles.statValue}>12</span>
                    </div>
                </div>
            </section>

            <section className={styles.actionGrid}>
                <div className={styles.actionCard} onClick={() => navigate('Profile')}>
                    <div className={styles.iconWrapper}>👤</div>
                    <h3>My Profile</h3>
                    <p>Update your personal details, certifications, and information.</p>
                </div>
                <div className={styles.actionCard} onClick={() => navigate('Achievements')}>
                    <div className={styles.iconWrapper}>🏆</div>
                    <h3>Upload Achievement</h3>
                    <p>Add publications, awards, or grants to your {isStudent ? 'student' : 'faculty'} profile.</p>
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
