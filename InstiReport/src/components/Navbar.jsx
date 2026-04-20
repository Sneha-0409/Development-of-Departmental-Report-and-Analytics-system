
import React from "react";
import styles from "./Navbar.module.css";

const Icons = {
    Dashboard: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
    ),
    Reports: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
    ),
    Approvals: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    ),
    Analytics: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
    ),
    Settings: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H15a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
    )
};

const LogoIcon = () => (
    <img
        src="/logo.png"
        alt="InstiReport Logo"
        style={{ width: "48px", height: "48px", objectFit: "contain" }}
    />
);

export default function Navbar({ navigate, currentPage, currentUser, isDarkMode, toggleTheme }) {
    const role = currentUser?.role || "faculty";
    const initials = currentUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'SG';

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
    };

    // RENDER HOD PORTAL SIDEBAR
    if (role === "hod") {
        const renderHODLink = (name, iconName, badge = null) => {
            const Icon = Icons[iconName];
            const isActive = currentPage === name || (name === "Dashboard" && currentPage === "HOD Dashboard");
            return (
                <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); navigate(name === "Dashboard" ? "HOD Dashboard" : name); }}
                    className={`${styles.navLinkHOD} ${isActive ? styles.activeHOD : ""}`}
                >
                    <span className={styles.iconHOD}>{Icon && <Icon />}</span>
                    <span>{name}</span>
                    {badge && <span className={styles.badgeHOD}>{badge}</span>}
                </a>
            );
        };

        return (
            <nav className={styles.navbarHOD}>
                <div className={styles.logoContainerHOD}>
                    <div className={styles.logoIconCircleHOD}><LogoIcon /></div>
                    <div className={styles.brandInfoHOD}>
                        <span className={styles.brandNameHOD}>InstiReport</span>
                        <span className={styles.portalTitleHOD}>HOD PORTAL</span>
                    </div>
                </div>

                <div className={styles.navSectionHOD}>
                    <div className={styles.sectionLabelHOD}>OVERVIEW</div>
                    <div className={styles.navLinksHOD}>{renderHODLink("Dashboard", "Dashboard")}</div>
                </div>

                <div className={styles.navSectionHOD}>
                    <div className={styles.sectionLabelHOD}>REPORTS</div>
                    <div className={styles.navLinksHOD}>
                        {renderHODLink("Approvals", "Approvals", "3")}
                        {renderHODLink("Analytics", "Analytics")}
                    </div>
                </div>

                <div className={styles.navSectionHOD}>
                    <div className={styles.sectionLabelHOD}>SETTINGS</div>
                    <div className={styles.navLinksHOD}>{renderHODLink("Settings", "Settings")}</div>
                </div>

                <div className={styles.userProfileHOD}>
                    <div className={styles.profileCardHOD}>
                        <div className={styles.avatarHOD} style={{ background: '#6366f1' }}>{initials}</div>
                        <div className={styles.profileInfoHOD}>
                            <span className={styles.profileNameHOD}>{currentUser?.name || "Dr. Sneha G."}</span>
                            <span className={styles.profileRoleHOD}>Head of Dept — {currentUser?.department?.substring(0, 2).toUpperCase() || 'CS'}</span>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    // RENDER STANDARD SIDEBAR (For Student/Faculty)
    const NAV_ITEMS = {
        student: ["Dashboard", "Achievements", "Project", "My Portfolio", "Analytics", "Developer"],
        faculty: ["Dashboard", "Achievements", "Project", "Analytics", "Developer"],
        "project-coordinator": ["Dashboard", "Analytics", "Developer"],
        admin: ["Admin Dashboard", "Approvals", "Departments", "Analytics", "Developer"],
        "report-maker": ["Dashboard", "Achievements", "Reports", "Analytics", "Developer"],
        naac: ["Reports", "Analytics", "Developer"],
    };

    const navLinks = NAV_ITEMS[role] || NAV_ITEMS.faculty;
    const homePage = { student: "Dashboard", faculty: "Dashboard", admin: "Admin Dashboard" }[role] || "Dashboard";

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
                            <a href="#" onClick={() => navigate("Developer")} className={`${styles.navLink} ${currentPage === "Developer" ? styles.active : ""}`}>Developer</a>
                        )}
                        <a href="#profile" onClick={(e) => { e.preventDefault(); navigate("Profile"); }} className={`${styles.standardNavLink || styles.navLink} ${currentPage === "Profile" ? styles.active : ""}`}>My Profile</a>

                        <div className={styles.bottomActions}>
                            <button className={styles.themeToggle} onClick={toggleTheme}>{isDarkMode ? "☀️" : "🌙"}</button>
                            <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
