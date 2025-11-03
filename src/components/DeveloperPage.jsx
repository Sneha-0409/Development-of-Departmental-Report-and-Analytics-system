


import React from 'react';
import styles from './DeveloperPage.module.css';

const snehaImage = '/sneha.jpg';
const samarthImage = '/samarth.jpg';

const DeveloperCard = ({ name, role, githubLink, linkedinLink, imageUrl }) => (
    <div className={styles.card}>
        <img src={imageUrl} alt={`Profile of ${name}`} className={styles.cardImage} />
        <h3 className={styles.cardName}>{name}</h3>
        <p className={styles.cardRole}>{role}</p>
        <div className={styles.socialLinks}>
            <a href={githubLink} target="_blank" rel="noopener noreferrer" aria-label="GitHub">GH</a>
            <a href={linkedinLink} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">IN</a>
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
                <DeveloperCard
                    name="Sneha"
                    role="Frontend Developer"
                    imageUrl={snehaImage}
                    githubLink="https://github.com/Sneha-0409/Development-of-Departmental-Report-and-Analytics-system"
                    linkedinLink="https://www.linkedin.com/in/sneha-96228632b/"
                />
                <DeveloperCard
                    name="Samarth Khare"
                    role="Backend Developer"
                    imageUrl={samarthImage}
                    githubLink="https://github.com/Samarth-Khare" 
                    linkedinLink="https://www.linkedin.com/in/samarth-khare-3b22152a6?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B9Cj6BuOaRlWC3JyACYxfvA%3D%3D" // replace with actual link
                />
            </div>
        </div>
    );
};

export default DeveloperPage;
