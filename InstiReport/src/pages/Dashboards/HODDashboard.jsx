import React from "react";
import styles from "./HODDashboard.module.css";

export default function HODDashboard({ navigate, currentUser }) {
    const deptName = currentUser?.department || "Your Department";

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>HOD Dashboard</h1>
                <p>Welcome, {currentUser?.name} — Manage reports from your department.</p>
            </header>

            <div className={styles.grid}>

                <div className={styles.card} onClick={() => navigate("Approvals")}>
                    <div className={styles.iconBox}>📄</div>
                    <h3>Pending Approvals</h3>
                    <p className={styles.count}>6 Reports</p>
                    <span className={styles.linkText}>Review Now →</span>
                </div>

                <div className={styles.card} onClick={() => navigate("Achievements")}>
                    <div className={styles.iconBox}>🏆</div>
                    <h3>Approved Achievements</h3>
                    <p className={styles.count}>12 Total</p>
                    <span className={styles.linkText}>View List →</span>
                </div>

                <div className={styles.card}>
                    <div className={styles.iconBox}>👨‍🏫</div>
                    <h3>Total Faculty Count</h3>
                    <p className={styles.count}>24 Active</p>
                    <span className={styles.linkText}>Manage Faculty →</span>
                </div>

                <div className={styles.card} onClick={() => navigate("Analytics")}>
                    <div className={styles.iconBox}>📊</div>
                    <h3>Department Analytics</h3>
                    <p className={styles.count}>View Report Insights</p>
                    <span className={styles.linkText}>Open Analytics →</span>
                </div>


                <div className={styles.card}>
                    <div className={styles.iconBox}>🏫</div>
                    <h3>Department</h3>
                    <p className={styles.count}>{deptName}</p>
                </div>
            </div>
        </div>
    );
}
