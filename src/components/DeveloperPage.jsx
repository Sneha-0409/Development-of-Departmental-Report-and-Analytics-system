import React from 'react';
import styles from './DeveloperPage.module.css';

// CHANGE: Updated image paths to match your filenames
const snehaImage = '/sneha.jpg';
const samarthImage = '/samarth.jpg';

const DeveloperCard = ({ name, role, imageUrl }) => (
    <div className={styles.card}>
        <img src={imageUrl} alt={`Profile of ${name}`} className={styles.cardImage} />
        <h3 className={styles.cardName}>{name}</h3>
        <p className={styles.cardRole}>{role}</p>
        <div className={styles.socialLinks}>
            <a href="https://github.com/Sneha-0409/Development-of-Departmental-Report-and-Analytics-system" target="_blank" rel="noopener noreferrer" aria-label="GitHub">GH</a>
            <a href="https://www.linkedin.com/in/sneha-96228632b/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">IN</a>
        </div>
    </div>
);

const DeveloperPage = () => {
    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Meet the Minds</h1>
                <p className={styles.subtitle}>
                    The innovative minds behind the InstiReport platform.
                </p>
            </div>
            <div className={styles.cardGrid}>
                <DeveloperCard name="Sneha" role="Frontend Developer" imageUrl={snehaImage} />
                <DeveloperCard name="Samarth Khare" role="Backend Developer" imageUrl={samarthImage} />
            </div>
        </div>
    );
};

export default DeveloperPage;