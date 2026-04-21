import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp, orderBy, onSnapshot } from "firebase/firestore";
import styles from "./ApprovalsPage.module.css";

const DEPARTMENTS_DATA = [
    { id: "CSE", name: "Computer Science & Engineering", short: "CSE", color: "#eff6ff", text: "#3b82f6" },
    { id: "IT", name: "Information Technology", short: "IT", color: "#f0fdf4", text: "#22c55e" },
    { id: "EE", name: "Electrical Engineering", short: "EE", color: "#faf5ff", text: "#a855f7" },
    { id: "ME", name: "Mechanical Engineering", short: "ME", color: "#fff7ed", text: "#f97316" },
    { id: "CIVIL", name: "Civil Engineering", short: "CIVIL", color: "#f1f5f9", text: "#64748b" }
];

export default function ApprovalsPage({ currentUser }) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReportId, setSelectedReportId] = useState(null);
    const [remarks, setRemarks] = useState("");
    
    // Safety check for user department
    const deptName = currentUser?.department || "Computer Science & Engineering";

    // Find the current active department details
    const activeDeptInfo = DEPARTMENTS_DATA.find(d => 
        deptName?.toLowerCase().includes(d.id.toLowerCase()) || 
        deptName?.toLowerCase().includes(d.name.toLowerCase())
    ) || DEPARTMENTS_DATA[0];

    // Listen for reports belonging to this HOD's department
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
        }, (err) => {
            console.error("Firestore error:", err);
            setLoading(false);
        });

        return () => unsub();
    }, [deptName]);

    // Automatically select the first pending report if none is selected
    useEffect(() => {
        if (!selectedReportId && reports?.length > 0) {
            const pending = reports.find(r => r.status === "pending") || reports[0];
            setSelectedReportId(pending.firestoreId);
        }
    }, [reports, selectedReportId]);

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

    const activeReport = reports?.find(r => r.firestoreId === selectedReportId);
    
    const stats = {
        total: (reports || []).length,
        pending: (reports || []).filter(r => r?.status === "pending").length,
        approved: (reports || []).filter(r => r?.status === "approved").length
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
                    <h2>Submissions</h2>
                </div>
                
                <div className={styles.deptList}>
                    {reports?.map((report) => (
                        <div 
                            key={report.firestoreId}
                            className={`${styles.deptItem} ${selectedReportId === report.firestoreId ? styles.deptItemActive : ""}`}
                            onClick={() => setSelectedReportId(report.firestoreId)}
                        >
                            <div className={styles.deptAvatar} style={{ background: activeDeptInfo.color, color: activeDeptInfo.text }}>
                                {activeDeptInfo.short}
                            </div>
                            <div className={styles.deptInfo}>
                                <h3 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{report.department || "Internal"} Report</h3>
                                <div className={styles.deptMeta}>
                                    <span style={{ fontSize: '0.75rem' }}>By {report.submittedBy || "Staff"}</span>
                                    <span className={`${styles.statusChip} ${
                                        report.status === 'pending' ? styles.statusPending : 
                                        (report.status === 'approved' ? styles.statusApproved : styles.statusNotSubmitted)
                                    }`}>
                                        {report.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!reports || reports.length === 0) && (
                        <p style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>No reports found for your department.</p>
                    )}
                </div>
            </aside>

            <main className={styles.contentArea}>
                <header className={styles.contentHeader}>
                    <div className={styles.headerTitle}>
                        <h1>Annual Report Approvals</h1>
                        <p>Review departmental submissions and provide feedback for approval.</p>
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

                {activeReport ? (
                    <div className={styles.reportDetailPanel}>
                        <div className={styles.detailHeader}>
                            <div className={styles.detailDeptTitle}>
                                <h2>{activeReport.department} Annual Report</h2>
                                <p>Submitted on {activeReport.submittedOn ? new Date(activeReport.submittedOn.seconds * 1000).toLocaleDateString() : "Just recently"}</p>
                            </div>
                            <div className={styles.detailBadges}>
                                <span className={`${styles.statusChip} ${
                                    activeReport.status === 'pending' ? styles.statusPending : styles.statusApproved
                                }`}>
                                    {activeReport.status?.replace('_', ' ')}
                                </span>
                            </div>
                        </div>

                        {activeReport.fileDataUrl ? (
                            <div style={{ width: '100%', height: '550px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '1.5rem', background: '#f8fafc' }}>
                                <iframe 
                                    src={activeReport.fileDataUrl} 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 'none' }}
                                    title="Report Preview"
                                />
                            </div>
                        ) : (
                            <div style={{ padding: '3rem', textAlign: 'center', background: '#f1f5f9', borderRadius: '12px', marginBottom: '1.5rem' }}>
                                <p style={{ color: '#64748b' }}>No PDF preview available for this submission.</p>
                            </div>
                        )}

                        <div className={styles.remarksArea}>
                            <label>HOD Feedback & Remarks</label>
                            <textarea 
                                className={styles.textarea}
                                placeholder="Add your feedback or correction notes..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>

                        {activeReport.status === 'pending' && (
                            <div className={styles.actionGrid}>
                                <button 
                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                    style={{ background: '#10b981', color: 'white', border: 'none' }}
                                    onClick={() => updateStatus(activeReport, "approved")}
                                >
                                    ✓ Approve Report
                                </button>
                                <button 
                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                    style={{ background: '#ef4444', color: 'white', border: 'none' }}
                                    onClick={() => updateStatus(activeReport, "rejected")}
                                    disabled={!remarks.trim()}
                                >
                                    ✕ Reject
                                </button>
                                <button 
                                    className={`${styles.btn} ${styles.btnLarge}`}
                                    style={{ background: '#f59e0b', color: 'white', border: 'none', gridColumn: 'span 2' }}
                                    onClick={() => updateStatus(activeReport, "needs_revision")}
                                    disabled={!remarks.trim()}
                                >
                                    ⚠ Request Revision from Department
                                </button>
                            </div>
                        )}
                        
                        {activeReport.hodRemarks && (
                            <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#eff6ff', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                                <strong style={{ display: 'block', marginBottom: '0.4rem', color: '#1e3a8a' }}>Last Official Remarks:</strong>
                                <p style={{ color: '#1e40af', fontSize: '0.9rem' }}>{activeReport.hodRemarks}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.emptyArea}>
                        {reports?.length > 0 
                            ? "Select a report from the list on the left to start your review." 
                            : "No submissions found for your department."}
                    </div>
                )}
            </main>
        </div>
    );
}
