
import React from 'react';
import styles from './Navbar.module.css';

const LogoIcon = () => (
    <img src="/logo.png" alt="InstiReport Logo" style={{ width: '63px', height: '63px' }} />
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const Navbar = ({ navigate, currentPage, currentUser }) => {
    const navLinks = ['Dashboard', 'Reports', 'Analytics', 'Submission', 'Developer'];

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarWrapper}>
                <div className={styles.navbarContent}>

                    <a href="#" onClick={() => navigate('Home')} className={styles.logoContainer}>
                        <LogoIcon />
                        <span className={styles.brandName}>InstiReport</span>
                    </a>
                    <div className={styles.navLinks}>
                        {navLinks.map((link) => (
                            <a
                                key={link}
                                href="#"
                                onClick={() => navigate(link)}
                                className={`${styles.navLink} ${currentPage === link ? styles.active : ''}`}
                            >
                                {link}
                            </a>
                        ))}
                    </div>

                    <div className={styles.userActions}>
                        <button className={styles.searchButton} aria-label="Search">
                            <SearchIcon />
                        </button>

                        <div className={styles.profileContainer}>
                            <div className={styles.avatar}>
                                {currentUser ? currentUser.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <span className={styles.userName}>
                                {currentUser ? currentUser.name : 'Guest'}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
