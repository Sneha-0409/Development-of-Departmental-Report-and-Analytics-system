import React, { useState, useRef, useEffect } from 'react';
import styles from './TopNav.module.css';

export default function TopNav({ currentUser, navigate }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef(null);
    const [notifications, setNotifications] = useState([
        { id: 1, text: "Dr. Smith approved your report.", time: "10 mins ago" },
        { id: 2, text: "New department guideline uploaded.", time: "2 hours ago" }
    ]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleNotifications = () => setShowNotifications(!showNotifications);

    const markAllAsRead = (e) => {
        e.stopPropagation();
        setNotifications([]);
    };

    const viewAllNotifications = () => {
        alert("Opening Full Notification Center... (Mock)");
        setShowNotifications(false);
    };

    return (
        <div className={styles.topNav}>
            {/* Notification Bell */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button className={styles.iconButton} aria-label="Notifications" onClick={toggleNotifications}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    {/* Notification Badge */}
                    {notifications.length > 0 && (
                        <span className={styles.badge}>{notifications.length}</span>
                    )}
                </button>

                {/* Dropdown Menu */}
                {showNotifications && (
                    <div className={styles.notificationsDropdown}>
                        <div className={styles.dropdownHeader}>
                            <span>Notifications</span>
                            {notifications.length > 0 && (
                                <span style={{ fontSize: '0.8rem', color: 'var(--accent)', cursor: 'pointer' }} onClick={markAllAsRead}>
                                    Mark all as read
                                </span>
                            )}
                        </div>
                        <ul className={styles.dropdownList}>
                            {notifications.length === 0 ? (
                                <li className={styles.dropdownItem} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No new notifications! 🎉
                                </li>
                            ) : (
                                notifications.map(notif => (
                                    <li key={notif.id} className={styles.dropdownItem}>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500 }}>
                                            {notif.text}
                                        </p>
                                        <span className={styles.notifTime}>{notif.time}</span>
                                    </li>
                                ))
                            )}
                        </ul>
                        <div className={styles.dropdownFooter} onClick={viewAllNotifications}>
                            View all notifications
                        </div>
                    </div>
                )}
            </div>

            {/* Profile Avatar */}
            <div 
                className={styles.avatarContainer} 
                onClick={() => navigate && navigate("Profile")}
                title="Go to Profile"
            >
                {/* Fallback to generic placeholder image for demo purposes */}
                <img 
                    src="https://i.pravatar.cc/150?img=47" 
                    alt="Profile" 
                    className={styles.profilePic} 
                />
            </div>
        </div>
    );
}
