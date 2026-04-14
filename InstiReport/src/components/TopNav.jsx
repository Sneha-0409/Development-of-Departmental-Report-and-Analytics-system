import React from 'react';
import styles from './TopNav.module.css';

export default function TopNav({ currentUser, navigate }) {
    return (
        <div className={styles.topNav}>
            {/* Mail Icon */}
            <button className={styles.iconButton} aria-label="Messages">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
            </button>

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
