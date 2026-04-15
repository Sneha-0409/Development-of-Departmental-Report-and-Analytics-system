import React, { useState, useEffect } from 'react';
import styles from './AchievementsPage.module.css';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

const CATEGORIES = [
    "Academic",
    "Sports",
    "Technical",
    "Social",
    "Cultural",
    "Other"
];

const AchievementsPage = ({ currentUser }) => {
    const userEmail = currentUser?.email || "";
    const [achievements, setAchievements] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Academic',
        description: '',
        date: '',
        mentorName: '',
        teamMembers: '',
        visibility: 'Public'
    });

    // Load achievements from Firestore
    useEffect(() => {
        if (!userEmail) { setFetchLoading(false); return; }

        const fetchAchievements = async () => {
            setFetchLoading(true);
            try {
                const q = query(
                    collection(db, "achievements"),
                    where("userEmail", "==", userEmail)
                );
                const snapshot = await getDocs(q);
                const fetched = snapshot.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
                // Sort by createdAt descending (newest first)
                fetched.sort((a, b) => {
                    const aTime = a.createdAt?.seconds || 0;
                    const bTime = b.createdAt?.seconds || 0;
                    return bTime - aTime;
                });
                setAchievements(fetched);
            } catch (err) {
                console.error("Error fetching achievements:", err);
            } finally {
                setFetchLoading(false);
            }
        };

        fetchAchievements();
    }, [userEmail]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const newAchievement = {
                ...formData,
                userEmail,
                submissionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                createdAt: serverTimestamp()
            };

            const ref = await addDoc(collection(db, "achievements"), newAchievement);
            setAchievements(prev => [{ firestoreId: ref.id, ...newAchievement }, ...prev]);

            // Reset form
            setFormData({
                title: '',
                category: 'Academic',
                description: '',
                date: '',
                mentorName: '',
                teamMembers: '',
                visibility: 'Public'
            });
            alert('Achievement uploaded successfully!');
        } catch (err) {
            console.error("Error saving achievement:", err);
            alert('Failed to save achievement. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (fetchLoading) return (
        <div className={styles.achievementsPage} style={{display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', color:'var(--text-muted)'}}>
            ⏳ Loading your achievements...
        </div>
    );

    return (
        <div className={styles.achievementsPage}>
            <div className={styles.grid}>
                {/* Upload Form */}
                <div className={styles.card}>
                    <h2>Upload Achievement</h2>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label>Achievement Title</label>
                            <input
                                className={styles.input}
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Published Paper in IEEE Journal"
                                required
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Category</label>
                                <select
                                    className={styles.select}
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Date of Achievement</label>
                                <input
                                    className={styles.input}
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea
                                className={styles.textarea}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Tell us more about this accomplishment..."
                                required
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Upload Proof (PDF/Image)</label>
                                <input className={styles.input} type="file" disabled />
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>File upload enabled in production.</span>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Achievement Image</label>
                                <input className={styles.input} type="file" disabled />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Mentor / Faculty Name</label>
                                <input
                                    className={styles.input}
                                    type="text"
                                    name="mentorName"
                                    value={formData.mentorName}
                                    onChange={handleChange}
                                    placeholder="e.g. Dr. Rajesh Kumar"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Team Members (optional)</label>
                                <input
                                    className={styles.input}
                                    type="text"
                                    name="teamMembers"
                                    value={formData.teamMembers}
                                    onChange={handleChange}
                                    placeholder="e.g. Rahul, Sneha"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Visibility</label>
                            <div className={styles.toggleGroup}>
                                <label className={styles.toggleLabel}>
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="Public"
                                        checked={formData.visibility === 'Public'}
                                        onChange={handleChange}
                                    />
                                    Public
                                </label>
                                <label className={styles.toggleLabel}>
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="Department Only"
                                        checked={formData.visibility === 'Department Only'}
                                        onChange={handleChange}
                                    />
                                    Department Only
                                </label>
                            </div>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <div className={styles.spinner}></div>
                                    Processing...
                                </>
                            ) : (
                                'Submit Achievement'
                            )}
                        </button>
                    </form>
                </div>

                {/* My Achievements List */}
                <div className={styles.card}>
                    <h2>My Achievements</h2>
                    <div className={styles.listContainer}>
                        {achievements.length > 0 ? (
                            achievements.map(item => (
                                <div key={item.id} className={styles.achievementItem}>
                                    <div className={styles.itemHeader}>
                                        <div className={styles.itemTitle}>{item.title}</div>
                                        <div className={`${styles.categoryBadge} ${styles[`category-${item.category.toLowerCase()}`]}`}>
                                            {item.category}
                                        </div>
                                    </div>
                                    <p className={styles.itemDesc}>{item.description}</p>
                                    <div className={styles.metadata}>
                                        {item.mentorName && <span>👨‍🏫 Mentor: {item.mentorName}</span>}
                                        {item.teamMembers && <span>👥 Team: {item.teamMembers}</span>}
                                    </div>
                                    <div className={styles.itemFooter}>
                                        <span>📅 {item.date}</span>
                                        <span>👁️ {item.visibility}</span>
                                        <span>Verified</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                <span className={styles.emptyIcon}>📂</span>
                                <p>No achievements uploaded yet. Start sharing your success!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AchievementsPage;
