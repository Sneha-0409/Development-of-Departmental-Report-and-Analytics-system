import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp, orderBy, limit, onSnapshot } from "firebase/firestore";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from "./HODDashboard.module.css";

const Icons = {
    Pending: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
    ),
    Achievement: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    ),
    Faculty: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    ),
    Deadline: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
    )
};

const StatCard = ({ icon, label, value, trend, trendUp, color }) => (
    <div className={styles.statCard}>
        <div className={styles.cardDecoration} style={{ background: color }}></div>
        <div className={styles.cardIcon} style={{ background: color + '20', color: color }}>
            {icon}
        </div>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
        <div className={styles.trendBadge} style={{ color: trendUp ? '#10b981' : '#ef4444' }}>
            <span style={{fontSize: '1.2rem'}}>{trendUp ? '↑' : '↓'}</span> {trend}
        </div>
    </div>
);

export default function HODDashboard({ navigate, currentUser }) {
    const [stats, setStats] = useState({ pending: 0, approved: 0, faculty: 0 });
    const [approvals, setApprovals] = useState([]);
    const [activity, setActivity] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const deptName = currentUser?.department || "Computer Science";

    useEffect(() => {
        const reportsRef = collection(db, "reports");
        const usersRef = collection(db, "users");

        // 1. Live Listeners for Queue and Stats
        const qApprovals = query(reportsRef, where("department", "==", deptName), where("status", "==", "pending"), orderBy("createdAt", "desc"));
        const unsubApprovals = onSnapshot(qApprovals, (snap) => {
            setApprovals(snap.docs.map(d => ({ firestoreId: d.id, ...d.data() })).slice(0, 3));
            setStats(prev => ({ ...prev, pending: snap.size }));
        });

        // 3. Live Activity Feed
        const qActivity = query(reportsRef, where("department", "==", deptName), orderBy("updatedAt", "desc"), limit(4));
        const unsubActivity = onSnapshot(qActivity, (snap) => {
            setActivity(snap.docs.map(d => ({
                id: d.id,
                title: `${d.data().submittedBy || 'Faculty'} submitted ${d.data().title || 'a report'}`,
                time: d.data().updatedAt?.toDate ? d.data().updatedAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
                color: d.data().status === 'approved' ? '#10b981' : '#3b82f6'
            })));
        });

        // 4. Fetch Faculty Count Once
        const fetchFaculty = async () => {
            const qFaculty = query(usersRef, where("role", "==", "faculty"));
            const fSnap = await getDocs(qFaculty);
            setStats(prev => ({ ...prev, faculty: fSnap.size }));
        };

        const fetchStaticStats = async () => {
            const qApproved = query(reportsRef, where("department", "==", deptName), where("status", "==", "approved"));
            const aSnap = await getDocs(qApproved);
            setStats(prev => ({ ...prev, approved: aSnap.size }));

            // 5. Process Chart Data (Last 7 Days)
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const last7Days = Array.from({length: 7}, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return { name: days[d.getDay()], count: 0, rawDate: d.toDateString() };
            });

            aSnap.docs.forEach(doc => {
                const data = doc.data();
                const d = data.createdAt?.toDate ? data.createdAt.toDate().toDateString() : null;
                const match = last7Days.find(x => x.rawDate === d);
                if (match) match.count++;
            });

            setChartData(last7Days);
            setLoading(false);
        };

        fetchStaticStats();
        return () => {
            unsubApprovals();
            unsubActivity();
        };
    }, [deptName]);

    const updateStatus = async (item, newStatus) => {
        try {
            const reportRef = doc(db, "reports", item.firestoreId);
            await updateDoc(reportRef, { 
                status: newStatus, 
                updatedAt: serverTimestamp(),
                approvedBy: currentUser?.name || "HOD"
            });
            // onSnapshot will handle the state update automatically
        } catch (err) {
            console.error("Update failed:", err);
            alert("Action failed. Please try again.");
        }
    };

    const getInitials = (dept) => {
        if (!dept) return "CS";
        return dept.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    };

    if (loading) return <div className={styles.loader}>Synchronizing Department Data...</div>;

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>HoD Dashboard</h1>
                    <span className={styles.headerSubtitle}>Computer Science Department</span>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.notifBtn}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    </button>
                </div>
            </header>

            <div className={styles.statGrid}>
                <StatCard icon={<Icons.Pending />} label="Pending Approvals" value={stats.pending} trend="Live Queue" trendUp={true} color="#3b82f6" />
                <StatCard icon={<Icons.Achievement />} label="Total Achievements" value={stats.approved} trend="Department total" trendUp={true} color="#10b981" />
                <StatCard icon={<Icons.Faculty />} label="Faculty Members" value={stats.faculty} trend="Verified staff" trendUp={true} color="#f97316" />
                <StatCard icon={<Icons.Deadline />} label="Annual Deadline" value="14d" trend="Remaining time" trendUp={false} color="#ef4444" />
            </div>

            <div className={styles.midRow}>
                <div className={styles.chartCard}>
                    <div className={styles.cardHeader}>
                        <h2>Submission activity</h2>
                        <span className={styles.timeFilter}>Last 7 Days</span>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip />
                                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.completionCard}>
                    <div className={styles.cardHeader}>
                        <h2>Section completion</h2>
                    </div>
                    <div className={styles.completionList}>
                        {[
                            { label: 'Research', val: Math.min(100, stats.approved * 15), color: '#10b981' },
                            { label: 'Teaching', val: 72, color: '#3b82f6' },
                            { label: 'Events', val: 60, color: '#8b5cf6' },
                            { label: 'Industry', val: 45, color: '#f59e0b' },
                            { label: 'Finance', val: 30, color: '#ef4444' }
                        ].map(item => (
                            <div key={item.label} className={styles.completionItem}>
                                <div className={styles.completionInfo}>
                                    <span>{item.label}</span>
                                    <span>{item.val}%</span>
                                </div>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: `${item.val}%`, background: item.color }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.bottomRow}>
                <div className={styles.approvalsCard}>
                    <div className={styles.cardHeader}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
                            <h2>Review Queue</h2>
                            <span className={styles.waitingBadge}>{stats.pending} waiting</span>
                        </div>
                    </div>
                    <div className={styles.approvalList}>
                        {approvals.length === 0 ? (
                            <p style={{color: '#94a3b8', textAlign: 'center', padding: '2rem'}}>Queue is clear! Well done. ✅</p>
                        ) : (
                            approvals.map((item) => (
                                <div key={item.firestoreId} className={styles.approvalItem}>
                                    <div className={styles.deptAvatar} style={{
                                        background: '#eff6ff', 
                                        color: '#3b82f6'
                                    }}>
                                        {getInitials(item.department)}
                                    </div>
                                    <div className={styles.approvalInfo}>
                                        <h4>{item.title || "Report Submission"}</h4>
                                        <p className={styles.approvalMeta}>
                                            By {item.submittedBy || item.userEmail?.split('@')[0]} · {item.category || "General"}
                                        </p>
                                    </div>
                                    <div className={styles.approvalActions}>
                                        <button className={styles.approveBtn} onClick={() => updateStatus(item, "approved")}>Approve</button>
                                        <button className={styles.rejectBtn} onClick={() => updateStatus(item, "returned")}>Return</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className={styles.activityCard}>
                    <div className={styles.cardHeader}>
                        <h2>Recent activity</h2>
                    </div>
                    <div className={styles.activityFeed}>
                        {[
                            { title: 'New submission from Faculty', time: 'Just now', color: '#3b82f6' },
                            { title: 'Department target increased', time: '2 hrs ago', color: '#10b981' },
                            { title: 'Deadline reminder sent', time: 'Yesterday', color: '#f59e0b' },
                            { title: 'Section returned for revision', time: '2 days ago', color: '#ef4444' }
                        ].map((act, i) => (
                            <div key={i} className={styles.activityItem}>
                                <div className={styles.activityDot} style={{ background: act.color }}></div>
                                <div className={styles.activityContent}>
                                    <h4>{act.title}</h4>
                                    <span className={styles.activityTime}>{act.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
