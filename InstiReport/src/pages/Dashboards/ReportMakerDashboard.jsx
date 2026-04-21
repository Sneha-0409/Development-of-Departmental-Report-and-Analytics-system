import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import styles from './ReportMakerDashboard.module.css';
import { db } from "../../firebase";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { useEffect, useState } from "react";

const StatCard = ({ icon, label, value, subtext, colorClass, iconClass, hoverClass }) => (
    <div className={`${styles.statCard} ${styles[hoverClass]}`}>
        <div className={styles.cardDecoration} style={{ background: `var(--${iconClass.replace('Icon', '')}-bg, ${iconClass === 'blueIcon' ? '#3b82f6' : iconClass === 'greenIcon' ? '#10b981' : iconClass === 'orangeIcon' ? '#f59e0b' : '#8b5cf6'})` }}></div>
        <div className={`${styles.statIconWrapper} ${styles[iconClass]}`}>
            {icon}
        </div>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
        <div className={`${styles.statSubtext} ${styles[colorClass]}`}>{subtext}</div>
    </div>
);

const ProgressBar = ({ label, percent }) => (
    <div className={styles.sectionItem}>
        <div className={styles.sectionLabelRow}>
            <span>{label}</span>
            <span>{percent}%</span>
        </div>
        <div className={styles.barTrack}>
            <div className={styles.barFill} style={{ width: `${percent}%` }}></div>
        </div>
    </div>
);

const ReportMakerDashboard = ({ currentUser, navigate }) => {
    const userName = currentUser?.name?.split(' ')[0] || 'User';
    const email = currentUser?.email?.toLowerCase() || "";
    const COLORS = ['#2563eb', '#f1f5f9'];
    
    // State for dynamic stats
    const [stats, setStats] = useState({
        sectionsFilled: 0,
        submitted: 0,
        pending: 0,
        activities: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!email) return;

        // 1. Fetch Submitted & Pending counts
        const reportsRef = collection(db, "reports");
        const qReports = query(reportsRef, where("userEmail", "==", email));
        
        const unsubReports = onSnapshot(qReports, (snap) => {
            const allReports = snap.docs.map(d => d.data());
            const pendingCount = allReports.filter(r => r.status === "pending").length;
            
            // Format activities from real reports
            const realActivities = allReports.slice(0, 5).map(r => ({
                dot: r.status === 'approved' ? '#10b981' : r.status === 'pending' ? '#3b82f6' : '#ef4444',
                title: r.status === 'approved' ? `HOD approved ${r.department} report` : 
                       r.status === 'needs_revision' ? `Revision requested for ${r.department}` :
                       `You submitted ${r.department} report`,
                time: r.submittedOn ? new Date(r.submittedOn.seconds * 1000).toLocaleDateString() : "Just now"
            }));

            setStats(prev => ({
                ...prev,
                submitted: snap.size,
                pending: pendingCount,
                activities: realActivities.length > 0 ? realActivities : prev.activities
            }));
            setLoading(false);
        });

        // 2. Fetch Drafts for sections filled (approximate)
        const draftsRef = collection(db, "drafts");
        const qDrafts = query(draftsRef, where("userEmail", "==", email));
        const unsubDrafts = onSnapshot(qDrafts, (snap) => {
            if (!snap.empty) {
                const draft = snap.docs[0].data();
                const filled = Object.values(draft.reportData || {}).filter(v => v && v.length > 10).length;
                setStats(prev => ({ ...prev, sectionsFilled: filled }));
            }
        });

        return () => {
            unsubReports();
            unsubDrafts();
        };
    }, [email]);

    // Mock/Default activities if none found
    const activities = stats.activities.length > 0 ? stats.activities : [
        { dot: '#10b981', title: "Welcome to InstiReport", time: "Just now" },
        { dot: '#3b82f6', title: "Start your first departmental report", time: "Today" }
    ];

    const progressData = [
        { name: 'Done', value: (stats.sectionsFilled / 7) * 100 || 10 },
        { name: 'Remaining', value: 100 - ((stats.sectionsFilled / 7) * 100 || 10) }
    ];

    // Define sections and deadlines to fix ReferenceError
    const sections = [
        { label: "Vision & Mission", percent: stats.sectionsFilled >= 1 ? 100 : 0 },
        { label: "Faculty Details", percent: stats.sectionsFilled >= 2 ? 100 : 0 },
        { label: "Student Achievements", percent: stats.sectionsFilled >= 3 ? 100 : 0 },
        { label: "Research & Pubs", percent: stats.sectionsFilled >= 4 ? 100 : 0 },
        { label: "Labs & Infra", percent: stats.sectionsFilled >= 5 ? 100 : 0 },
        { label: "Events & Activities", percent: stats.sectionsFilled >= 6 ? 100 : 0 },
        { label: "Budget & Util", percent: stats.sectionsFilled >= 7 ? 100 : 0 },
    ];

    const deadlines = [
        { day: "28", month: "Apr", title: "Monthly Progress", sub: "Status update due" },
        { day: "15", month: "May", title: "Final Draft", sub: "Annual report review" }
    ];

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.welcomeSection}>
                    <h1>Welcome back, {userName}!</h1>
                    <p>Here's your annual report overview for 2024-25.</p>
                </div>
                <div className={styles.headerActions}>
                    <div className={styles.deadlineBanner}>
                        <span className={styles.iconClock}>🕒</span>
                        <span>14 days to deadline</span>
                    </div>
                    <button className={styles.notifBtn}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    </button>
                    <button className={styles.notifBtn}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className={styles.statsRow}>
                <StatCard 
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>}
                    label="Sections Filled" 
                    value={stats.sectionsFilled} 
                    subtext="of 7 total" 
                    colorClass="greenText"
                    iconClass="blueIcon"
                    hoverClass="hoverBlue"
                />
                <StatCard 
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
                    label="Reports Submitted" 
                    value={stats.submitted} 
                    subtext="lifetime" 
                    colorClass="greenText"
                    iconClass="greenIcon"
                    hoverClass="hoverGreen"
                />
                <StatCard 
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
                    label="Pending Approval" 
                    value={stats.pending} 
                    subtext="from HOD" 
                    colorClass="orangeText"
                    iconClass="orangeIcon"
                    hoverClass="hoverOrange"
                />
                <StatCard 
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}
                    label="Upcoming Deadlines" 
                    value="2" 
                    subtext="this month" 
                    colorClass="purpleText"
                    iconClass="purpleIcon"
                    hoverClass="hoverPurple"
                />
            </div>

            {/* Main Grid */}
            <div className={styles.mainGrid}>
                <div className={styles.contentColumn}>
                    {/* Annual Report Progress */}
                    <div className={styles.dashboardCard}>
                        <div className={styles.cardHeader}>
                            <h2>Annual report progress</h2>
                            <span className={styles.statusBadge}>In progress</span>
                        </div>
                        <div className={styles.progressLayout}>
                            <div className={styles.radialWrapper}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={progressData}
                                            innerRadius={65}
                                            outerRadius={80}
                                            paddingAngle={0}
                                            dataKey="value"
                                            startAngle={90}
                                            endAngle={-270}
                                        >
                                            <Cell fill={COLORS[0]} />
                                            <Cell fill={COLORS[1]} />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className={styles.radialCenter}>
                                    <span className={styles.radialPercent}>{Math.round((stats.sectionsFilled / 7) * 100)}%</span>
                                    <span className={styles.radialLabel}>Done</span>
                                </div>
                            </div>
                            <div className={styles.sectionList}>
                                {sections.map(s => (
                                    <ProgressBar key={s.label} label={s.label} percent={s.percent} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className={styles.dashboardCard}>
                        <div className={styles.cardHeader}>
                            <h2>Quick actions</h2>
                        </div>
                        <div className={styles.actionsList}>
                            <div className={styles.actionItem} onClick={() => navigate('ReportStructure')}>
                                <div className={styles.actionIcon}>➕</div>
                                <div className={styles.actionInfo}>
                                    <h4>Continue annual report</h4>
                                    <p>3 sections remaining</p>
                                </div>
                                <span className={styles.arrowIcon}>›</span>
                            </div>
                            <div className={styles.actionItem} onClick={() => navigate('Drafts')}>
                                <div className={styles.actionIcon}>📝</div>
                                <div className={styles.actionInfo}>
                                    <h4>View my drafts</h4>
                                    <p>Last edited 2h ago</p>
                                </div>
                                <span className={styles.badgeDrafts}>5</span>
                            </div>

                        </div>
                        <button className={styles.btnPrimaryLarge} onClick={() => navigate('Reports')}>
                            + Make / Edit Annual Report
                        </button>
                    </div>
                </div>

                <div className={styles.sidebarColumn}>
                    {/* Recent Activity */}
                    <div className={styles.dashboardCard}>
                        <div className={styles.cardHeader}>
                            <h2>Recent activity</h2>
                        </div>
                        <div className={styles.activityFeed}>
                            {activities.map((a, i) => (
                                <div key={i} className={styles.activityItem}>
                                    <div className={styles.dot} style={{ background: a.dot }}></div>
                                    <div className={styles.activityContent}>
                                        <h5>{a.title}</h5>
                                        <div className={styles.activityTime}>{a.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Deadlines */}
                    <div className={styles.dashboardCard}>
                        <div className={styles.cardHeader}>
                            <h2>Upcoming deadlines</h2>
                            <span className={styles.purpleText} style={{ fontSize: '0.75rem', fontWeight: 800 }}>2 this month</span>
                        </div>
                        <div className={styles.deadlineList}>
                            {deadlines.map((d, i) => (
                                <div key={i} className={styles.deadlineItem}>
                                    <div className={styles.dateBadge}>
                                        <span className={styles.dateNumber}>{d.day}</span>
                                        <span className={styles.dateMonth}>{d.month}</span>
                                    </div>
                                    <div className={styles.deadlineInfo}>
                                        <h5>{d.title}</h5>
                                        <p>{d.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportMakerDashboard;
