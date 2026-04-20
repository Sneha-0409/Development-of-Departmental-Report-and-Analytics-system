import React, { useState } from 'react';
import styles from './ProfilePage.module.css';

export default function ProfilePage({ currentUser, setCurrentUser }) {
    const avatarLetter = currentUser ? currentUser.name.charAt(0).toUpperCase() : "U";
    
    const [isEditing, setIsEditing] = useState(false);
    const [editModeData, setEditModeData] = useState({
        name: currentUser?.name || "",
        rollNo: currentUser?.rollNo || "",
        semester: currentUser?.semester || "",
        branch: currentUser?.branch || "",
    });

    const [isChangingPwd, setIsChangingPwd] = useState(false);

    const handleSaveProfile = () => {
        const updatedUser = { ...currentUser, ...editModeData };
        setCurrentUser(updatedUser);
        localStorage.setItem("insti_user", JSON.stringify(updatedUser));
        setIsEditing(false);
    };

    const handlePasswordChange = () => {
        alert("Password updated successfully! (Mock implementation)");
        setIsChangingPwd(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Profile</h1>
                <p className={styles.subtitle}>Manage your account settings and personal information.</p>
            </div>

            <div className={styles.profileCard}>
                <div className={styles.avatarSection}>
                    <div className={styles.avatarWrapper}>
                        <img 
                            src={currentUser?.profilePic || "https://i.pravatar.cc/150?img=47"} 
                            alt="Profile" 
                            className={styles.largeAvatar} 
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div className={styles.avatarFallback} style={{ display: 'none' }}>
                            {avatarLetter}
                        </div>
                        <div className={styles.avatarOverlay}>
                            <span>📷 Change</span>
                        </div>
                    </div>
                    
                    <div className={styles.userInfo}>
                        <h2>{currentUser ? currentUser.name : "Guest User"}</h2>
                        <span className={styles.roleBadge}>{currentUser ? currentUser.role : "Guest"}</span>
                    </div>
                </div>

                {isChangingPwd ? (
                    <div className={styles.pwdForm}>
                        <h3>Change Password</h3>
                        <div className={styles.formGroup}>
                            <label>Current Password</label>
                            <input type="password" placeholder="••••••••" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>New Password</label>
                            <input type="password" placeholder="••••••••" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Confirm New Password</label>
                            <input type="password" placeholder="••••••••" />
                        </div>
                        <div className={styles.actions} style={{ marginTop: '1.5rem' }}>
                            <button className={styles.editBtn} onClick={handlePasswordChange}>Update Password</button>
                            <button className={styles.pwdBtn} onClick={() => setIsChangingPwd(false)}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={styles.detailsGrid}>
                            <div className={styles.detailBox}>
                                <span className={styles.label}>Full Name</span>
                                {isEditing ? (
                                    <input autoFocus className={styles.editInput} value={editModeData.name} onChange={e => setEditModeData({...editModeData, name: e.target.value})} />
                                ) : (
                                    <div className={styles.value}>{currentUser ? currentUser.name : "N/A"}</div>
                                )}
                            </div>
                            
                            <div className={styles.detailBox}>
                                <span className={styles.label}>Email Address</span>
                                <div className={styles.value}>{currentUser?.email || "user@instireport.edu"}</div>
                            </div>

                            {currentUser?.role?.toLowerCase() === 'student' && (
                                <>
                                    <div className={styles.detailBox}>
                                        <span className={styles.label}>Roll No.</span>
                                        {isEditing ? (
                                            <input className={styles.editInput} value={editModeData.rollNo} onChange={e => setEditModeData({...editModeData, rollNo: e.target.value})} />
                                        ) : (
                                            <div className={styles.value}>{currentUser?.rollNo || "09XXXXX"}</div>
                                        )}
                                    </div>

                                    <div className={styles.detailBox}>
                                        <span className={styles.label}>Semester</span>
                                        {isEditing ? (
                                            <input className={styles.editInput} value={editModeData.semester} onChange={e => setEditModeData({...editModeData, semester: e.target.value})} />
                                        ) : (
                                            <div className={styles.value}>{currentUser?.semester || "5th Semester"}</div>
                                        )}
                                    </div>
                                </>
                            )}

                            <div className={styles.detailBox}>
                                <span className={styles.label}>Branch</span>
                                {isEditing ? (
                                    <input className={styles.editInput} value={editModeData.branch} onChange={e => setEditModeData({...editModeData, branch: e.target.value})} />
                                ) : (
                                    <div className={styles.value}>{currentUser?.branch || "Computer Science"}</div>
                                )}
                            </div>

                            <div className={styles.detailBox}>
                                <span className={styles.label}>Account Status</span>
                                <div className={styles.value} style={{ color: "var(--success)" }}>Active</div>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            {isEditing ? (
                                <>
                                    <button className={styles.editBtn} onClick={handleSaveProfile}>Save Changes</button>
                                    <button className={styles.pwdBtn} onClick={() => setIsEditing(false)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <button className={styles.editBtn} onClick={() => setIsEditing(true)}>Edit Profile</button>
                                    <button className={styles.pwdBtn} onClick={() => setIsChangingPwd(true)}>Change Password</button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
