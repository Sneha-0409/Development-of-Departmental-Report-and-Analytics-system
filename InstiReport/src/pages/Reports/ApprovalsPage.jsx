import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp, orderBy, onSnapshot } from "firebase/firestore";
import styles from "./ApprovalsPage.module.css";

const DEPARTMENTS = [
    { id: "cse", name: "Computer Science & Engg", short: "CSE", color: "#eff6ff", text: "#3b82f6", faculty: "Dr. Ramesh Kumar" },
    { id: "it", name: "Information Technology", short: "IT", color: "#f0fdf4", text: "#22c55e", faculty: "Dr. Priya Mehta" },
    { id: "ds", name: "Data Science", short: "DS", color: "#faf5ff", text: "#a855f7", faculty: "Prof. Aniket Vaidya" },
    { id: "mech", name: "Mechanical Engineering", short: "MECH", color: "#fff7ed", text: "#f97316", faculty: "Dr. Sunita Kulkarni" },
    { id: "civil", name: "Civil Engineering", short: "CIVIL", color: "#f1f5f9", text: "#64748b", faculty: "Prof. Neha Joshi" }
];

const SECTIONS = [
    "Faculty profile & qualifications",
    "Research publications",
    "Student achievements",
    "Industry collaborations",
    "Events & workshops conducted",
    "Lab infrastructure",
    "Financial summary"
];

export default function ApprovalsPage({ currentUser }) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const deptName = currentUser?.department || "";

    // Filter departments to only show HOD's own department
    const filteredDepts = DEPARTMENTS.filter(d => 
        deptName.toLowerCase().includes(d.id.toLowerCase()) || 
        deptName.toLowerCase().includes(d.name.toLowerCase()) ||
        d.id === "cse" // Fallback for the demo "Computer Science" -> "CSE" mapping
    );

    const [selectedId, setSelectedId] = useState(filteredDepts[0]?.id || "cse");
    const [remarks, setRemarks] = useState("");
    const [isReviewMode, setIsReviewMode] = useState(false);

    useEffect(() => {
        if (!deptName) {
            setLoading(false);
            return;
        }

        const reportsRef = collection(db, "reports");
        const q = query(reportsRef, where("department", "==", deptName));

        const unsub = onSnapshot(q, (snap) => {
            const fetched = snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
            setReports(fetched);
            setLoading(false);
        });

        return () => unsub();
    }, [deptName]);

    const handleViewPDF = (item) => {
        if (!item?.fileDataUrl) {
            // Support for demo reports that don't have a fileDataUrl yet
            alert("No PDF file attached to this submission yet. Accessing source metadata...");
            setIsReviewMode(true);
            return;
        }
        
        const win = window.open();
        if (win) {
            win.location.href = item.fileDataUrl;
            setIsReviewMode(true); // Open review tools once PDF is launched
        } else {
            alert("Please allow popups to view the report PDF.");
        }
    };

    const updateStatus = async (item, newStatus) => {
        if (!item?.firestoreId) return;
        try {
            const reportRef = doc(db, "reports", item.firestoreId);
            await updateDoc(reportRef, {
                status: newStatus,
                hodRemarks: remarks,
                updatedAt: serverTimestamp(),
                processedBy: currentUser?.name || "Administrator"
            });
            setRemarks("");
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update report status.");
        }
    };

    const getStatusForDept = (deptId) => {
        const report = reports.find(r => r.department?.toLowerCase().includes(deptId.toLowerCase()) || r.deptId === deptId);
        if (!report) return "Not submitted";
        if (report.status === "pending") return "Pending review";
        if (report.status === "approved") return "Approved";
        return report.status;
    };

    const getReportForDept = (deptId) => {
        return reports.find(r => r.department?.toLowerCase().includes(deptId.toLowerCase()) || r.deptId === deptId);
    };

    const activeDept = filteredDepts.find(d => d.id === selectedId);
    const activeReport = getReportForDept(selectedId);
    
    const stats = {
        total: filteredDepts.length,
        pending: filteredDepts.filter(d => getStatusForDept(d.id) === "Pending review").length,
        approved: filteredDepts.filter(d => getStatusForDept(d.id) === "Approved").length
    };

    if (loading) return (
        <div className={styles.loader}>
            <div className={styles.spinner}></div>
            <p>Initializing verification console...</p>
        </div>
    );

    return (
        <div className={styles.page}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2>Department</h2>
                </div>
                
                <div className={styles.deptList}>
                    {filteredDepts.map((dept) => {
                        const status = getStatusForDept(dept.id);
                        return (
                            <div 
                                key={dept.id} 
                                className={`${styles.deptItem} ${selectedId === dept.id ? styles.deptItemActive : ""}`}
                                onClick={() => {
                                    setSelectedId(dept.id);
                                    setIsReviewMode(false);
                                }}
                            >
                                <div className={styles.deptAvatar} style={{ background: dept.color, color: dept.text }}>
                                    {dept.short}
                                </div>
                                <div className={styles.deptInfo}>
                                    <h3>{dept.name}</h3>
                                    <div className={styles.deptMeta}>
                                        <span>{dept.faculty}</span>
                                        <span className={`${styles.statusChip} ${
                                            status === "Pending review" ? styles.statusPending : 
                                            (status === "Approved" ? styles.statusApproved : styles.statusNotSubmitted)
                                        }`}>
                                            {status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>


            </aside>

            <main className={styles.contentArea}>
                <header className={styles.contentHeader}>
                    <div className={styles.headerTitle}>
                        <h1>Annual Report Approvals</h1>
                        <p>Each department - one report - review and approve or reject below</p>
                    </div>
                    <div className={styles.topStats}>
                        <div className={styles.statMiniCard}>
                            <div className={styles.miniIcon}>⏳</div>
                            <div>
                                <div className={styles.miniLabel}>Pending</div>
                                <div className={styles.miniVal}>{stats.pending}</div>
                            </div>
                        </div>
                        <div className={styles.statMiniCard}>
                            <div className={styles.miniIcon}>✅</div>
                            <div>
                                <div className={styles.miniLabel}>Approved</div>
                                <div className={styles.miniVal}>{stats.approved}</div>
                            </div>
                        </div>
                    </div>
                </header>

                {activeDept && (
                    <div className={styles.reportDetailPanel}>
                        <div className={styles.detailHeader}>
                            <div className={styles.detailDeptTitle}>
                                <h2>{activeDept.name}</h2>
                                <p>Submitted by {activeDept.faculty}</p>
                            </div>
                            <div className={styles.detailBadges}>
                                <div className={styles.metaBadge}>📄 42 pages</div>
                                <div className={styles.metaBadge}> Apr 18, 2025</div>
                                <span className={`${styles.statusChip} ${
                                    getStatusForDept(activeDept.id) === "Pending review" ? styles.statusPending : 
                                    (status === "Approved" ? styles.statusApproved : styles.statusNotSubmitted)
                                }`}>
                                    {getStatusForDept(activeDept.id)}
                                </span>
                            </div>
                        </div>

                        {!isReviewMode ? (
                            <div className={styles.reviewInvitation}>
                                <div className={styles.invitationIcon}>📑</div>
                                <h3>Ready to review the report?</h3>
                                <p>Open the submitted PDF to start the verification process.</p>
                                <button 
                                    className={`${styles.btn} ${styles.btnPrimary} ${styles.btnReview}`}
                                    onClick={() => handleViewPDF(activeReport)}
                                >
                                    🔍 Review PDF & Start Audit
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className={styles.sectionList}>
                                    <div className={styles.sectionListHeader}>REPORT SECTIONS</div>
                                    {SECTIONS.map((sec, i) => (
                                        <div key={i} className={styles.sectionItem}>
                                            <div className={styles.sectionDot}></div>
                                            {sec}
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.remarksArea}>
                                    <label>HoD Remarks <span>(if any)</span></label>
                                    <textarea 
                                        className={styles.textarea}
                                        placeholder="Add your remarks or feedback for the Department..."
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                    />
                                </div>

                                <div className={styles.actionGrid}>
                                    <button 
                                        className={`${styles.btn} ${styles.btnPrimary}`}
                                        onClick={() => updateStatus(activeReport, "approved")}
                                        disabled={!activeReport}
                                    >
                                        ✓ Approve Report
                                    </button>
                                    <button 
                                        className={`${styles.btn} ${styles.btnPrimary}`}
                                        onClick={() => updateStatus(activeReport, "rejected")}
                                        disabled={!activeReport || !remarks.trim()}
                                    >
                                        ✕ Reject
                                    </button>
                                </div>
                                <button 
                                    className={`${styles.btn} ${styles.btnLarge}`}
                                    onClick={() => updateStatus(activeReport, "needs_revision")}
                                    disabled={!activeReport || !remarks.trim()}
                                >
                                    Request revision from department
                                </button>
                            </>
                        )}

                        <div className={styles.historySection}>
                            <h4>APPROVAL HISTORY</h4>
                            <div className={styles.timeline}>
                                <div className={styles.timelineItem}>
                                    <div className={styles.timelineDotWrapper}>
                                        <div className={styles.timelineDot}></div>
                                        <div className={styles.timelineLine}></div>
                                    </div>
                                    <div className={styles.timelineContent}>
                                        <h5>Annual report submitted by {activeDept.faculty}</h5>
                                        <p>Apr 18, 2025 · 11:30 AM</p>
                                    </div>
                                </div>
                                <div className={styles.timelineItem}>
                                    <div className={styles.timelineDotWrapper}>
                                        <div className={`${styles.timelineDot} ${styles.timelineDotOngoing}`}></div>
                                    </div>
                                    <div className={styles.timelineContent}>
                                        <h5>Awaiting HOD review</h5>
                                        <p>Now</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {!activeDept && (
                    <div className={styles.emptyArea}>
                        Select a department to review its annual report
                    </div>
                )}
            </main>
        </div>
    );
}
