
// // src/components/Navbar.jsx
// import React from 'react';
// import styles from './Navbar.module.css';

// // ... (LogoIcon and SearchIcon components can remain the same) ...
// const LogoIcon = () => (
//     <img src="/logo.png" alt="InstiReport Logo" style={{ width: '63px', height: '63px' }} />
// );

// const SearchIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//         <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//     </svg>
// );

// // UPDATE 1: Accept 'currentUser' as a prop
// const Navbar = ({ navigate, currentPage, currentUser }) => {
//     const navLinks = ['Home', 'Dashboard', 'Reports', "Analytics", 'Submission', 'Developer'];

//     return (
//         <nav className={styles.navbar}>
//             <div className={styles.navbarWrapper}>
//                 <div className={styles.navbarContent}>

//                     <a href="#" onClick={() => navigate('Home')} className={styles.logoContainer}>
//                         <LogoIcon />
//                         <span className={styles.brandName}>InstiReport</span>
//                     </a>

//                     <div className={styles.navLinks}>
//                         {/* ... (your nav links map function remains the same) ... */}
//                     </div>

//                     <div className={styles.userActions}>
//                         <button className={styles.searchButton} aria-label="Search">
//                             <SearchIcon />
//                         </button>

//                         <div className={styles.profileContainer}>
//                             {/* UPDATE 2: Display the first letter of the user's name */}
//                             <div className={styles.avatar}>
//                                 {currentUser ? currentUser.name.charAt(0).toUpperCase() : '?'}
//                             </div>
//                             {/* UPDATE 3: Display the full name of the user */}
//                             <span className={styles.userName}>
//                                 {currentUser ? currentUser.name : 'Guest'}
//                             </span>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;
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
    // The list of pages to display in the navbar
    const navLinks = ['Dashboard', 'Reports', 'Analytics', 'Submission', 'Developer'];

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarWrapper}>
                <div className={styles.navbarContent}>

                    <a href="#" onClick={() => navigate('Home')} className={styles.logoContainer}>
                        <LogoIcon />
                        <span className={styles.brandName}>InstiReport</span>
                    </a>

                    {/* THIS IS THE ADDED SECTION to display the navigation links */}
                    <div className={styles.navLinks}>
                        {navLinks.map((link) => (
                            <a
                                key={link}
                                href="#"
                                onClick={() => navigate(link)}
                                // This applies a special style if the link matches the current page
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
