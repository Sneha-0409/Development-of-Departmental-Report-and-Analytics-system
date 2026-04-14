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
            </header>

            <section className={styles.welcomeCard}>
                <h2>Welcome back, {!isStudent && 'Prof. '}{userName.split(' ')[0]}! 👋</h2>
                <p>
                    {isStudent 
                        ? "Check your latest portfolio highlights and academic progress below." 
                        : "You have 12 achievements logged and 2 upcoming department activities."}
                </p>
                {!isStudent && (
                    <div className={styles.welcomeStats}>
                        <div className={styles.statBadge}>
                            <span className={styles.statLabel}>Achievements</span>
                            <span className={styles.statValue}>12</span>
                        </div>
                    </div>
                )}
            </section>

            {isStudent ? (
                <>
                    <h3 className={styles.sectionTitle}>My Progress</h3>
                    <div className={styles.portfolioGrid}>
                        {[
                            { id: 1, title: "Achievements", category: "Certifications", value: 8, isPercentage: false, icon: "🏆", color: "#facc15", files: 12, comments: 4, navigateTo: "Achievements" },
                            { id: 2, title: "My Portfolio", category: "Coding", value: 5, isPercentage: false, icon: "</>", color: "#a855f7", files: 8, comments: 11, navigateTo: "My Portfolio" },
                            { id: 3, title: "Analytics", category: "Academic", value: 92, isPercentage: true, icon: "📊", color: "#10b981", files: 5, comments: 2, navigateTo: "Analytics" }
                        ].map(item => (
                            <div key={item.id} className={styles.portfolioCard} onClick={() => navigate(item.navigateTo)}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.iconBox} style={{ backgroundColor: item.color }}>{item.icon}</div>
                                    <div className={styles.titleArea}>
                                        <h4>{item.title}</h4>
                                        <span className={styles.category}>{item.category}</span>
                                    </div>
                                    <button className={styles.moreBtn}>•••</button>
                                </div>
                                <div className={styles.progressSection}>
                                    <div className={styles.progressLabel}>
                                        <span>{item.isPercentage ? 'Overall Score' : 'Items Submitted'}</span>
                                        <span className={styles.percentage}>{item.value}{item.isPercentage ? '%' : ''}</span>
                                    </div>
                                    <div className={styles.progressBarWrapper}>
                                        <div 
                                            className={styles.progressBar} 
                                            style={{ 
                                                width: `${item.isPercentage ? item.value : (item.value / 10) * 100}%`, 
                                                backgroundColor: item.color 
                                            }} 
                                        />
                                    </div>
                                </div>
                                <div className={styles.cardFooter}>
                                    <div className={styles.metaIcons}>
                                        <div className={styles.metaItem}><span>📎</span> {item.files}</div>
                                        <div className={styles.metaItem}><span>💬</span> {item.comments}</div>
                                    </div>
                                    <div className={styles.arrowIcon}>→</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h3 className={styles.sectionTitle} style={{ marginTop: '3rem' }}>Quick Actions</h3>
                    <div className={styles.actionGrid}>
                        <div className={styles.actionCard} onClick={() => navigate('Profile')}>
                            <div className={styles.iconWrapper}>👤</div>
                            <h3>My Profile</h3>
                            <p>Update your personal details and certifications.</p>
                        </div>
                        <div className={styles.actionCard} onClick={() => navigate('Achievements')}>
                            <div className={styles.iconWrapper}>🏆</div>
                            <h3>Upload Work</h3>
                            <p>Add new publications or projects to your profile.</p>
                        </div>
                    </div>
                </>
            ) : (
                <section className={styles.actionGrid}>
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
            )}
        </div>
    );
};

export default FacultyDashboard;
