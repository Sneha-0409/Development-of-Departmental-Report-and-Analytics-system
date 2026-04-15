import React, { useState } from 'react';
import styles from './FacultyDashboard.module.css';

/* ─── Mini Calendar ─── */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function MiniCalendar() {
    const today = new Date();
    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    const year  = viewDate.getFullYear();
    const month = viewDate.getMonth();

    // First day of month (0=Sun … 6=Sat) → shift to Mon-based (0=Mon)
    const firstDay = new Date(year, month, 1).getDay();
    const offset   = (firstDay === 0) ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const isToday = (d) =>
        d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    const prev = () => setViewDate(new Date(year, month - 1, 1));
    const next = () => setViewDate(new Date(year, month + 1, 1));

    return (
        <div className={styles.calendarWidget}>
            <div className={styles.calendarNav}>
                <button className={styles.calNavBtn} onClick={prev}>‹</button>
                <span className={styles.calMonthLabel}>{MONTHS[month]} {year}</span>
                <button className={styles.calNavBtn} onClick={next}>›</button>
            </div>
            <div className={styles.calGrid}>
                {DAYS.map(d => (
                    <div key={d} className={styles.calDayName}>{d}</div>
                ))}
                {cells.map((d, i) => (
                    <div
                        key={i}
                        className={`${styles.calCell} ${d === null ? styles.calEmpty : ''} ${isToday(d) ? styles.calToday : ''}`}
                    >
                        {d}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Sidebar ─── */
const reminders = [
    { title: 'Submit Mini Project Report', date: 'Due: 20 Apr 2026, Monday' },
    { title: 'Upload Certification (NPTEL)', date: 'Due: 22 Apr 2026, Wednesday' },
    { title: 'Portfolio Review by Faculty', date: 'Due: 25 Apr 2026, Saturday' },
    { title: 'Semester Activity Submission', date: 'Due: 30 Apr 2026, Thursday' },
];

const latestActivity = [
    { color: 'green',  text: 'Your achievement submission was approved',         time: 'Today, 10:30 am' },
    { color: 'yellow', text: 'Department tech fest registrations are now open',   time: 'Today, 9:00 am' },
    { color: 'red',    text: 'Mini Project Report deadline is in 3 days',        time: '17 Apr 2026, 9:00 am' },
    { color: 'red',    text: 'NPTEL Certification upload is pending',             time: '15 Apr 2026, 9:00 am' },
    { color: 'green',  text: 'Portfolio synced with faculty records successfully', time: '14 Apr 2026, 4:00 pm' },
];

function StudentSidebar({ currentUser, navigate }) {
    const name = currentUser?.name || 'Student';
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const photo = currentUser?.photoURL;

    return (
        <aside className={styles.studentSidebar}>
            {/* Profile Card */}
            <div className={styles.sideProfileCard}>
                <div className={styles.sideAvatar}>
                    {photo
                        ? <img src={photo} alt={name} className={styles.sideAvatarImg} />
                        : <span className={styles.sideAvatarInitials}>{initials}</span>
                    }
                </div>
                <h4 className={styles.sideProfileName}>{name}</h4>
                <p className={styles.sideProfileRole}>Student</p>
                <button className={styles.sideProfileBtn} onClick={() => navigate('Profile')}>
                    Profile
                </button>
            </div>

            {/* Calendar */}
            <MiniCalendar />

            {/* Reminders */}
            <div className={styles.remindersSection}>
                <h4 className={styles.remindersTitle}>Reminders</h4>
                <ul className={styles.remindersList}>
                    {reminders.map((r, i) => (
                        <li key={i} className={styles.reminderItem}>
                            <div className={styles.reminderBell}>🔔</div>
                            <div className={styles.reminderText}>
                                <span className={styles.reminderName}>{r.title}</span>
                                <span className={styles.reminderDate}>{r.date}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Latest Activity */}
            <div className={styles.activitySection}>
                <h4 className={styles.remindersTitle}>Latest Activity</h4>
                <ul className={styles.activityList}>
                    {latestActivity.map((item, i) => (
                        <li key={i} className={styles.activityItem}>
                            <div className={styles.activityDotWrapper}>
                                <div className={`${styles.activityDot} ${styles[`dot_${item.color}`]}`} />
                                {i < latestActivity.length - 1 && <div className={styles.activityLine} />}
                            </div>
                            <div className={styles.activityContent}>
                                <span className={styles.activityText}>{item.text}</span>
                                <span className={styles.activityTime}>{item.time}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}

/* ─── Main Component ─── */
const FacultyDashboard = ({ currentUser, navigate }) => {
    const role = currentUser?.role || 'faculty';
    const isStudent = role === 'student';
    const userName = currentUser?.name || (isStudent ? 'Student' : 'Professor');

    return (
        <div className={`${styles.facultyDashboard} ${isStudent ? styles.studentLayout : ''}`}>

            {/* Main Content */}
            <div className={styles.dashboardMain}>
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
                                { id: 1, title: "Achievements", category: "Certifications", value: 8, isPercentage: false, icon: "🏆", color: "#facc15", lightStart: "#fefde8", lightEnd: "#fffef7", shadowColor: "rgba(250,204,21,0.35)", navigateTo: "Achievements" },
                                { id: 2, title: "My Portfolio", category: "Coding", value: 5, isPercentage: false, icon: "</>", color: "#a855f7", lightStart: "#f3e8ff", lightEnd: "#faf5ff", shadowColor: "rgba(168,85,247,0.35)", navigateTo: "My Portfolio" },
                                { id: 3, title: "Analytics", category: "Academic", value: 92, isPercentage: true, icon: "📊", color: "#10b981", lightStart: "#dcfce7", lightEnd: "#f0fdf4", shadowColor: "rgba(16,185,129,0.35)", navigateTo: "Analytics" }
                            ].map(item => (
                                <div key={item.id} className={styles.portfolioCard} style={{ '--card-color': item.color, '--card-light-start': item.lightStart, '--card-light-end': item.lightEnd, '--card-shadow': item.shadowColor }} onClick={() => navigate(item.navigateTo)}>
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
                                        <div className={styles.arrowIcon}>→</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h3 className={styles.sectionTitle} style={{ marginTop: '3rem' }}>Know Your Contribution 🌟</h3>
                        <div className={styles.contributionSection}>
                            <div className={styles.contributionIntro}>
                                <p>Your achievements and projects aren't just records — they shape how your department grows, how faculty assess progress, and how institutions represent their students. Here's why your contribution matters:</p>
                            </div>
                            <div className={styles.contributionGrid}>
                                {[
                                    { icon: "📊", title: "Power Department Reports", desc: "Every achievement you log feeds directly into the department's annual and semester reports reviewed by HODs and accreditation bodies." },
                                    { icon: "🏅", title: "Build Your Academic Profile", desc: "Your certifications, projects, and awards are stored securely and can be referenced for scholarships, internships, and placement drives." },
                                    { icon: "🔒", title: "Verified & Trustworthy", desc: "All submissions go through a faculty-reviewed pipeline — your data is accurate, tamper-proof, and officially acknowledged." },
                                    { icon: "📈", title: "Track Your Growth", desc: "See how your progress evolves semester by semester — from your first project to your final-year portfolio." },
                                    { icon: "🤝", title: "Help Your Department Shine", desc: "Strong student data improves your department's NAAC/NBA rankings, which benefits every student in the institution." },
                                    { icon: "🎯", title: "Your Work, Your Legacy", desc: "Future students and faculty will benefit from the benchmarks you set today. Your contributions leave a lasting impact." },
                                ].map((point, i) => (
                                    <div key={i} className={styles.contributionCard}>
                                        <div className={styles.contributionIcon}>{point.icon}</div>
                                        <div className={styles.contributionText}>
                                            <h4>{point.title}</h4>
                                            <p>{point.desc}</p>
                                        </div>
                                    </div>
                                ))}
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

            {/* Right Sidebar — students only */}
            {isStudent && <StudentSidebar currentUser={currentUser} navigate={navigate} />}
        </div>
    );
};

export default FacultyDashboard;
