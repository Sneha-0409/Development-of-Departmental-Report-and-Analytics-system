import React, { useState, useEffect, useMemo } from 'react';
import styles from './PortfolioPage.module.css';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

export default function PortfolioPage({ currentUser }) {
    const userEmail = currentUser?.email || "";
    const [achievements, setAchievements] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        if (!userEmail) { setLoading(false); return; }

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Achievements
                const qAch = query(collection(db, "achievements"), where("userEmail", "==", userEmail));
                const snapAch = await getDocs(qAch);
                const fetchedAch = snapAch.docs.map(d => ({ 
                    id: d.id, 
                    type: 'achievement',
                    dateSort: d.data().createdAt?.seconds || 0,
                    ...d.data() 
                }));

                // Fetch Reports (Projects)
                const qRep = query(collection(db, "reports"), where("userEmail", "==", userEmail));
                const snapRep = await getDocs(qRep);
                const fetchedRep = snapRep.docs.map(d => ({ 
                    id: d.id, 
                    type: 'submission',
                    dateSort: d.data().createdAt?.seconds || 0,
                    ...d.data() 
                }));

                setAchievements(fetchedAch);
                setReports(fetchedRep);
            } catch (err) {
                console.error("Error fetching portfolio data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userEmail]);

    const consolidatedFeed = useMemo(() => {
        const combined = [...achievements, ...reports];
        return combined.sort((a, b) => b.dateSort - a.dateSort);
    }, [achievements, reports]);

    const filteredFeed = consolidatedFeed.filter(item => {
        if (activeTab === 'all') return true;
        return item.type === activeTab;
    });

    const portfolioSummary = [
        {
            id: 1,
            title: "Achievements",
            category: "Certifications",
            value: achievements.length,
            target: 10,
            icon: "🏆",
            color: "#facc15",
            type: 'achievement'
        },
        {
            id: 2,
            title: "Submissions",
            category: "Projects",
            value: reports.length,
            target: 15,
            icon: "</>",
            color: "#a855f7",
            type: 'submission'
        },
        {
            id: 3,
            title: "Performance",
            category: "Academic",
            value: 92,
            isPercentage: true,
            icon: "📊",
            color: "#10b981"
        }
    ];

    if (loading) return <div className={styles.loading}>⏳ Initializing Portfolio Dashboard...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Portfolio</h1>
                <p className={styles.subtitle}>Click on any project or achievement to explore deep-dive details.</p>
            </div>
            
            <div className={styles.cardGrid}>
                {portfolioSummary.map(item => (
                    <div key={item.id} className={styles.card} onClick={() => item.type && setActiveTab(item.type)}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconBox} style={{ backgroundColor: item.color }}>
                                {item.icon}
                            </div>
                            <div className={styles.titleArea}>
                                <h3>{item.title}</h3>
                                <span className={styles.category}>{item.category}</span>
                            </div>
                        </div>

                        <div className={styles.progressSection}>
                            <div className={styles.progressLabel}>
                                <span>{item.isPercentage ? 'Current Score' : 'Total Count'}</span>
                                <span className={styles.percentage}>{item.value}{item.isPercentage ? '%' : ''}</span>
                            </div>
                            <div className={styles.progressBarWrapper}>
                                <div 
                                    className={styles.progressBar} 
                                    style={{ 
                                        width: `${item.isPercentage ? item.value : Math.min((item.value / item.target) * 100, 100)}%`, 
                                        backgroundColor: item.color 
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <section className={styles.showcaseSection}>
                <div className={styles.showcaseHeader}>
                    <h2>Activity Showcase</h2>
                    <div className={styles.filterBar}>
                        {['all', 'achievement', 'submission'].map(tab => (
                            <button 
                                key={tab}
                                className={`${styles.filterLink} ${activeTab === tab ? styles.activeFilter : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.showcaseGrid}>
                    {filteredFeed.length > 0 ? (
                        filteredFeed.map(item => (
                            <div key={item.id} className={styles.showcaseCard} onClick={() => setSelectedItem(item)}>
                                <div className={styles.showcaseThumbnail} style={{ background: item.type === 'achievement' ? 'linear-gradient(45deg, #facc1522, #facc1555)' : 'linear-gradient(45deg, #a855f722, #a855f755)' }}>
                                    <span className={styles.largeIcon}>{item.type === 'achievement' ? '🏆' : '📂'}</span>
                                    <div className={styles.cardOverlay}>
                                        <button className={styles.openBtn}>Open Details</button>
                                    </div>
                                </div>
                                <div className={styles.showcaseContent}>
                                    <span className={styles.itemTag}>{item.type === 'achievement' ? 'Achievement' : 'Project Submission'}</span>
                                    <h4>{item.title || item.fileName}</h4>
                                    <p className={styles.itemDesc}>{item.description || `Submitted for ${item.department}`}</p>
                                    <div className={styles.itemInfo}>
                                        <span>📅 {item.date || item.year}</span>
                                        {item.status && <span className={styles.statusBadge}>{item.status}</span>}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <p>No activity records found in this category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Detail Modal */}
            {selectedItem && (
                <div className={styles.modalOverlay} onClick={() => setSelectedItem(null)}>
                    <div className={styles.modalBody} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeModal} onClick={() => setSelectedItem(null)}>×</button>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalIconBox} style={{ background: selectedItem.type === 'achievement' ? '#facc15' : '#a855f7' }}>
                                {selectedItem.type === 'achievement' ? '🏆' : '📂'}
                            </div>
                            <div className={styles.modalTitleArea}>
                                <span className={styles.modalCategory}>{selectedItem.category || selectedItem.department}</span>
                                <h2>{selectedItem.title || selectedItem.fileName}</h2>
                            </div>
                        </div>

                        <div className={styles.modalContent}>
                            <div className={styles.detailSection}>
                                <h3>Description</h3>
                                <p>{selectedItem.description || `A detailed report submission for the ${selectedItem.department} department, documented for the academic year ${selectedItem.year}.`}</p>
                            </div>

                            <div className={styles.detailGrid}>
                                <div className={styles.detailBlock}>
                                    <span className={styles.detailLabel}>Date</span>
                                    <span className={styles.detailValue}>{selectedItem.date || selectedItem.year}</span>
                                </div>
                                <div className={styles.detailBlock}>
                                    <span className={styles.detailLabel}>Status</span>
                                    <span className={styles.detailValue} style={{ textTransform: 'capitalize' }}>{selectedItem.status || 'Verified'}</span>
                                </div>
                                {selectedItem.mentorName && (
                                    <div className={styles.detailBlock}>
                                        <span className={styles.detailLabel}>Facuty/Mentor</span>
                                        <span className={styles.detailValue}>{selectedItem.mentorName}</span>
                                    </div>
                                )}
                                {selectedItem.teamMembers && (
                                    <div className={styles.detailBlock}>
                                        <span className={styles.detailLabel}>Team Members</span>
                                        <span className={styles.detailValue}>{selectedItem.teamMembers}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className={styles.modalActions}>
                                {selectedItem.type === 'submission' && (
                                    <button className={styles.primaryAction}>Download PDF</button>
                                )}
                                <button className={styles.secondaryAction} onClick={() => setSelectedItem(null)}>Close View</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
