

import React from "react";
import styles from "./Navbar.module.css";

const LogoIcon = () => (
    <img
        src="/logo.png"
        alt="InstiReport Logo"
        style={{ width: "50px", height: "50px" }}
    />
);

export default function Navbar({ navigate, currentPage, currentUser, isDarkMode, toggleTheme }) {
    const role = currentUser?.role || "faculty";


    const NAV_ITEMS = {
        student: ["Dashboard", "Achievements", "My Portfolio", "Analytics", "Developer"],
        faculty: ["Dashboard", "Achievements", "Analytics", "Developer"],
        "project-coordinator": ["Dashboard", "Analytics", "Developer"],
        hod: ["HOD Dashboard", "Approvals", "Analytics", "Developer"],
        admin: ["Admin Dashboard", "Approvals", "Departments", "Analytics", "Developer"],
        "report-maker": ["Dashboard", "Achievements", "Reports", "Analytics", "Developer"],
        naac: ["Reports", "Analytics", "Developer"],
    };

    const navLinks = NAV_ITEMS[role] || NAV_ITEMS.faculty;

    const homePage = {
        student: "Dashboard",
        faculty: "Dashboard",
        "project-coordinator": "Dashboard",
        hod: "HOD Dashboard",
        admin: "Admin Dashboard",
        "report-maker": "Dashboard",
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
                        <div className={styles.logoIconCircle}>
                            <LogoIcon />
                        </div>
                        <span className={styles.brandName}>InstiReport</span>
                    </a>


                    <div className={styles.navLinks}>
                        {navLinks.filter(l => l !== "Developer").map((link) => (
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
                        {navLinks.includes("Developer") && (
                            <a
                                href="#"
                                onClick={() => navigate("Developer")}
                                className={`${styles.navLink} ${currentPage === "Developer" ? styles.active : ""}`}
                            >
                                Developer
                            </a>
                        )}
                        <a 
                            href="#profile" 
                            onClick={(e) => { e.preventDefault(); navigate("Profile"); }}
                            className={`${styles.navLink} ${currentPage === "Profile" ? styles.active : ""}`}
                        >
                            My Profile
                        </a>


                        {/* Theme Toggle */}
                        <div className={styles.bottomActions}>
                            <button className={styles.themeToggle} onClick={toggleTheme} title="Toggle Theme">
                                {isDarkMode ? "☀️" : "🌙"}
                            </button>

                            <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
                                Logout
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </nav>
    );
}
