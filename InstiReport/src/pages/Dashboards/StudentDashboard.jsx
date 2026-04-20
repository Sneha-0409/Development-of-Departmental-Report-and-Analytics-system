import React, { useState, useRef, useEffect } from 'react';
import styles from './StudentDashboard.module.css';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';


/* ─── Sidebar Data ─── */
const faqs = [
    { q: "How to add achievements?", a: "Go to Achievements page and click 'Add New' to log your certifications or awards." },
    { q: "Who reviews my portfolio?", a: "Your department advisor reviews all submitted items for verification." },
    { q: "Can I edit my profile?", a: "Yes, click the 'Profile' button at the top of the sidebar to update your details." }
];

// Helper to format timestamps
const formatActivityTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
        return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};





function StudentSidebar({ currentUser, navigate, reminders = [], latestActivity = [] }) {


    const name = currentUser?.name || 'Student';
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const photo = currentUser?.photoURL;

    return (
        <aside className={styles.studentSidebar}>
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

            <div className={styles.remindersSection}>
                <h4 className={styles.remindersTitle}>Reminders</h4>
                <ul className={styles.remindersList}>
                    {reminders.length > 0 ? reminders.map((r, i) => (
                        <li key={i} className={styles.reminderItem}>
                            <div className={styles.reminderBell}>🔔</div>
                            <div className={styles.reminderText}>
                                <span className={styles.reminderName}>{r.title}</span>
                                <span className={styles.reminderDate}>{r.date}</span>
                            </div>
                        </li>
                    )) : (
                        <li className={styles.emptyItem}>No pending reminders</li>
                    )}
                </ul>
            </div>
            <div className={styles.activitySection}>
                <h4 className={styles.remindersTitle}>Latest Activity</h4>
                <ul className={styles.activityList}>
                    {latestActivity.length > 0 ? latestActivity.map((item, i) => (
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
                    )) : (
                        <li className={styles.emptyItem}>No recent activity</li>
                    )}
                </ul>
            </div>








        </aside>
    );
}

/* ─── Main Component ─── */
const StudentDashboard = ({ currentUser, navigate }) => {
    const [showFAQ, setShowFAQ] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [dynamicReminders, setDynamicReminders] = useState([]);
    const [activities, setActivities] = useState([]);
    const userName = currentUser?.name || 'Student';
    const userEmail = currentUser?.email || '';

    useEffect(() => {
        if (!userEmail) return;

        const fetchDashboardData = async () => {
            try {
                // 1. Fetch Achievements
                const qAch = query(
                    collection(db, "achievements"),
                    where("userEmail", "==", userEmail),
                    orderBy("createdAt", "desc"),
                    limit(5)
                );
                const snapAch = await getDocs(qAch);
                const fetchedAch = snapAch.docs.map(d => ({ ...d.data(), id: d.id, source: 'achievement' }));

                // 2. Fetch Reports
                const qRep = query(
                    collection(db, "reports"),
                    where("userEmail", "==", userEmail),
                    orderBy("createdAt", "desc"),
                    limit(5)
                );
                const snapRep = await getDocs(qRep);
                const fetchedRep = snapRep.docs.map(d => ({ ...d.data(), id: d.id, source: 'report' }));

                // --- Build Activity Feed ---
                const allData = [...fetchedAch, ...fetchedRep].sort((a, b) => {
                    const timeA = a.createdAt?.seconds || 0;
                    const timeB = b.createdAt?.seconds || 0;
                    return timeB - timeA;
                }).slice(0, 5);

                const activityFeed = allData.map(item => {
                    if (item.source === 'achievement') {
                        return {
                            color: 'green',
                            text: `Logged achievement: ${item.title}`,
                            time: formatActivityTime(item.createdAt)
                        };
                    } else {
                        return {
                            color: item.status === 'approved' ? 'green' : (item.status === 'rejected' ? 'red' : 'yellow'),
                            text: `Report submission: ${item.fileName} (${item.status})`,
                            time: formatActivityTime(item.createdAt)
                        };
                    }
                });
                setActivities(activityFeed);

                // --- Build Reminders Feed ---
                const remindersList = [];
                
                // Add drafts as reminders
                const drafts = fetchedRep.filter(r => r.status === 'draft');
                drafts.forEach(d => {
                    remindersList.push({
                        title: `Finish draft: ${d.fileName}`,
                        date: 'Action Required'
                    });
                });

                // Add rejected/needs correction as reminders
                const needsAction = fetchedRep.filter(r => r.status === 'rejected' || r.status === 'needs_correction');
                needsAction.forEach(r => {
                    remindersList.push({
                        title: `Correction needed: ${r.fileName}`,
                        date: 'High Priority'
                    });
                });

                // Default informative reminders if empty
                if (remindersList.length === 0) {
                    remindersList.push({ title: 'Keep your portfolio updated', date: 'Ongoing' });
                    remindersList.push({ title: 'Check upcoming deadlines', date: 'Weekly' });
                }

                setDynamicReminders(remindersList.slice(0, 4));

            } catch (err) {
                console.error("Error fetching dashboard dynamic data:", err);
            }
        };

        fetchDashboardData();
    }, [userEmail]);



    const contributionScrollRef = useRef(null);

    const scrollContributions = (direction) => {
        if (contributionScrollRef.current) {
            const scrollAmount = 400;
            contributionScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className={styles.studentLayout}>
            <div className={styles.dashboardMain}>
                <section className={styles.welcomeCard}>
                    <h2>Welcome back, {userName.split(' ')[0]}! 👋</h2>
                    <p>Check your latest portfolio highlights and academic progress below.</p>
                </section>

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

                <div className={styles.contributionHeader}>
                    <h3 className={styles.sectionTitle}>Know Your Contribution 🌟</h3>
                    <div className={styles.scrollControls}>
                        <button className={styles.scrollBtn} onClick={() => scrollContributions('left')} aria-label="Scroll Left">←</button>
                        <button className={styles.scrollBtn} onClick={() => scrollContributions('right')} aria-label="Scroll Right">→</button>
                    </div>
                </div>
                <div className={styles.contributionSection}>
                    <div className={styles.contributionGrid} ref={contributionScrollRef}>
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
            </div>

            <StudentSidebar 
                currentUser={currentUser} 
                navigate={navigate} 
                activities={activities}
                reminders={dynamicReminders}
            />

            {/* Chat Agent FAQ */}
            <div className={styles.chatAgentWrapper}>
                <button 
                    className={`${styles.chatFab} ${showFAQ ? styles.chatFabActive : ''}`}
                    onClick={() => setShowFAQ(!showFAQ)}
                    aria-label="Toggle Support Chat"
                >
                    {showFAQ ? '✕' : '💬'}
                </button>

                {showFAQ && (
                    <div className={styles.chatWindow}>
                        <div className={styles.chatHeader}>
                            <div className={styles.chatStatus}>
                                <div className={styles.statusDot} />
                                <span>Support Agent</span>
                            </div>
                            <h5>Need help?</h5>
                        </div>
                        <div className={styles.chatBody}>
                            <p className={styles.chatIntro}>Hi there! 👋 How can I help you today?</p>
                            <div className={styles.chatFaqs}>
                                {faqs.map((faq, i) => (
                                    <div 
                                        key={i} 
                                        className={`${styles.chatFaqItem} ${expandedFaq === i ? styles.chatFaqActive : ''}`}
                                        onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                                    >
                                        <div className={styles.chatQuestionRow}>
                                            <h6 className={styles.chatQuestion}>{faq.q}</h6>
                                            <span className={styles.faqArrow}>{expandedFaq === i ? '−' : '+'}</span>
                                        </div>
                                        {expandedFaq === i && (
                                            <div className={styles.faqAnswerWrapper}>
                                                <p className={styles.chatAnswer}>{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};

export default StudentDashboard;
