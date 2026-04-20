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

const fileToDataURL = (file) =>
    new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });

const compressImage = (file) =>
    new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            reject(new Error("Selected file is not an image."));
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            
            // Set up listeners BEFORE setting src
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1000;
                    const MAX_HEIGHT = 1000;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.6); // Lower quality slightly for safety
                    resolve(dataUrl);
                } catch (e) {
                    reject(new Error("Failed to process image canvas."));
                }
            };
            
            img.onerror = () => reject(new Error("Failed to load image for compression."));
            img.src = event.target.result;
            
            // Safety timeout
            setTimeout(() => reject(new Error("Image processing timed out.")), 10000);
        };
        reader.onerror = () => reject(new Error("Failed to read file."));
        reader.readAsDataURL(file);
    });


const AchievementsPage = ({ currentUser }) => {
    const userEmail = currentUser?.email || "";
    const [achievements, setAchievements] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [statusMsg, setStatusMsg] = useState('');
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

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!userEmail) {
            alert('Your session has expired. Please log in again.');
            return;
        }

        setIsLoading(true);
        setStatusMsg('Optimizing...');

        try {
            let imageURL = null;
            if (selectedFile) {
                // Check raw file size (e.g., 10MB limit for processing)
                if (selectedFile.size > 10 * 1024 * 1024) {
                    throw new Error("File is too large. Please select an image smaller than 10MB.");
                }
                
                // Show status for longer processing
                imageURL = await compressImage(selectedFile);
                setStatusMsg('Finalizing...');

                // Double check resulting size (Firestore limit is 1MB total doc size)
                if (imageURL.length > 900 * 1024) {
                    throw new Error("Compressed image is still too large. Please try a different photo.");
                }
            }

            const newAchievement = {
                ...formData,
                userEmail,
                imageURL,
                submissionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                createdAt: serverTimestamp()
            };

            setStatusMsg('Uploading...');
            
            // Timeout for database submission
            const timeoutPromise = new Promise((_, rej) => 
                setTimeout(() => rej(new Error("Upload timed out. Please check your connection.")), 15000)
            );

            const uploadPromise = addDoc(collection(db, "achievements"), newAchievement);
            const ref = await Promise.race([uploadPromise, timeoutPromise]);

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
            setSelectedFile(null);
            
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = "";
            
            alert('Achievement uploaded successfully!');

        } catch (err) {
            console.error("Achievement upload error:", err);
            alert(err.message || 'Failed to save achievement. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
            setStatusMsg('');
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

                        <div className={styles.formGroup}>
                            <label>Achievement Image</label>
                            <input 
                                className={styles.input} 
                                type="file" 
                                accept="image/*"
                                onChange={handleFileChange}
                                required
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Upload a photo of your certificate or trophy.</span>
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
                                    {statusMsg || 'Processing...'}
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
                                <div key={item.firestoreId || item.id} className={styles.achievementItem}>
                                    {item.imageURL && (
                                        <div className={styles.itemImageWrapper}>
                                            <img src={item.imageURL} alt={item.title} className={styles.itemImage} />
                                        </div>
                                    )}
                                    <div className={styles.itemContent}>
                                        <div className={styles.itemHeader}>
                                            <div className={styles.itemTitle}>{item.title}</div>

                                        <div className={`${styles.categoryBadge} ${styles[`category-${item.category.toLowerCase()}`]}`}>
                                            {item.category}
                                        </div>
                                    </div>
                                    <p className={styles.itemDesc}>{item.description}</p>
                                    <div className={styles.metadata}>
                                        {item.mentorName && <span> Mentor: {item.mentorName}</span>}
                                        {item.teamMembers && <span> Team: {item.teamMembers}</span>}
                                    </div>
                                        <div className={styles.itemFooter}>
                                            <span>📅 {item.date}</span>
                                            <span>{item.visibility}</span>
                                            <span>Verified</span>
                                        </div>
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
