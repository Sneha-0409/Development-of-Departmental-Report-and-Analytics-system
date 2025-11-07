

import React from "react";
import styles from "./Navbar.module.css";

const LogoIcon = () => (
    <img
        src="/logo.png"
        alt="InstiReport Logo"
        style={{ width: "63px", height: "63px" }}
    />
);

export default function Navbar({ navigate, currentPage, currentUser }) {
    const role = currentUser?.roles || "faculty"; 

    
    const NAV_ITEMS = {
        faculty: ["Dashboard", "Reports", "Submission", "Analytics", "Developer"],
        hod: ["HOD Dashboard", "Approvals", "Analytics", "Developer"],
        admin: ["Admin Dashboard", "Approvals", "Departments", "Analytics", "Developer"],
        naac: ["Reports", "Analytics", "Developer"],
    };

    const navLinks = NAV_ITEMS[role] || NAV_ITEMS.faculty;

    const homePage = {
        faculty: "Dashboard",
        hod: "HOD Dashboard",
        admin: "Admin Dashboard",
        naac: "Reports",
    }[role];

    const handleLogout = () => {
        localStorage.clear();         
        sessionStorage.clear();       
        window.location.href = "/login";

    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarWrapper}>
                <div className={styles.navbarContent}>

                  
                    <a href="#" onClick={() => navigate(homePage)} className={styles.logoContainer}>
                        <LogoIcon />
                        <span className={styles.brandName}>InstiReport</span>
                    </a>

                    
                    <div className={styles.navLinks}>
                        {navLinks.map((link) => (
                            <a
                                key={link}
                                href="#"
                                onClick={() => navigate(link)}
                                className={`${styles.navLink} ${currentPage === link ? styles.active : ""}`}
                            >
                                {link}
                            </a>
                        ))}
                    </div>

                   
                    <div className={styles.userActions}>
                        <div className={styles.profileContainer}>
                            <div className={styles.avatar}>
                                {currentUser ? currentUser.name.charAt(0).toUpperCase() : "?"}
                            </div>
                            <span className={styles.userName}>
                                {currentUser ? currentUser.name : "Guest"}
                            </span>
                        </div>

                        
                        <button className={styles.logoutBtn} onClick={handleLogout}>
                            Logout
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
}
