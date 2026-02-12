import React, { useState, useEffect } from 'react';
import styles from './AchievementsPage.module.css';

const CATEGORIES = [
    "Academic",
    "Sports",
    "Technical",
    "Social",
    "Cultural",
    "Other"
];

const AchievementsPage = ({ currentUser }) => {
    const [achievements, setAchievements] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Academic',
        description: '',
        date: '',
        mentorName: '',
        teamMembers: '',
        visibility: 'Public'
    });

    // Mock initial achievements for demonstration
    useEffect(() => {
        const savedAchievements = localStorage.getItem(`achievements_${currentUser?.email}`);
        if (savedAchievements) {
            setAchievements(JSON.parse(savedAchievements));
        } else {
            const initialData = [
                {
                    id: 1,
                    title: 'Best Research Paper Award 2023',
                    category: 'Technical',
                    description: 'Received for the paper "AI in Healthcare" at the International Tech Summit.',
                    date: '2023-11-15',
                    mentorName: 'Dr. Rajesh Kumar',
                    teamMembers: '',
                    visibility: 'Public',
                    submissionDate: 'Nov 18, 2023'
                },
                {
                    id: 2,
                    title: 'Patent on Smart Irrigation Systems',
                    category: 'Technical',
                    description: 'Patent filed for IoT-based automated irrigation system for arid regions.',
                    date: '2023-12-05',
                    mentorName: 'Prof. Anita Sharma',
                    teamMembers: 'Rahul, Sneha',
                    visibility: 'Department Only',
                    submissionDate: 'Dec 10, 2023'
                }
            ];
            setAchievements(initialData);
            localStorage.setItem(`achievements_${currentUser?.email}`, JSON.stringify(initialData));
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            const newAchievement = {
                ...formData,
                id: Date.now(),
                submissionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            };

            const updatedList = [newAchievement, ...achievements];
            setAchievements(updatedList);
            localStorage.setItem(`achievements_${currentUser?.email}`, JSON.stringify(updatedList));

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
            setIsLoading(false);
            alert('Achievement uploaded successfully!');
        }, 1500);
    };

    return (
        <div className={styles.achievementsPage}>
            <header className={styles.header}>
                <h1>Professional Achievements</h1>
                <p>Manage and showcase your career milestones and accomplishments.</p>
            </header>

            <div className={styles.grid}>
                {/* Upload Form */}
                <div className={styles.card}>
                    <h2><span style={{ fontSize: '1.2em' }}>🚀</span> Upload Achievement</h2>
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
                    <h2><span style={{ fontSize: '1.2em' }}>🏆</span> My Achievements</h2>
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
