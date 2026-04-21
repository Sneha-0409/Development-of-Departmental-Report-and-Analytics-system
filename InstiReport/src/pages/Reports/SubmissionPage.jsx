import React, { useEffect, useState } from "react";
import styles from "./SubmissionPage.module.css";
import {
    collection, query, where, onSnapshot, doc, deleteDoc
} from "firebase/firestore";
import { db } from "../../firebase";

/**
 * Status Marker Component
 * Yellow: Waiting for Approval (pending)
 * Green: Approved (approved)
 * Red: Rejected (rejected)
 */
const StatusMarker = ({ status }) => {
    const config = {
        pending: { color: "#eab308", label: "Waiting for Approval" },
        approved: { color: "#22c55e", label: "Approved" },
        rejected: { color: "#ef4444", label: "Rejected" },
        needs_revision: { color: "#f97316", label: "Needs Revision" },
        draft: { color: "#94a3b8", label: "Draft" },
    };

    const current = config[status] || config.pending;

    return (
        <div className={styles.statusWrapper}>
            <span 
                className={styles.markerDot} 
                style={{ backgroundColor: current.color }}
            />
            <span className={styles.statusLabel}>{current.label}</span>
        </div>
    );
};

export default function SubmissionPage({ currentUser }) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const userEmail = currentUser?.email?.toLowerCase() || "";
    const departmentName = currentUser?.department || "";

    useEffect(() => {
        setLoading(true);

        // Use simple equality queries that don't require Firestore indexes
        const reportsRef = collection(db, "reports");
        let q;
        
        if (userEmail) {
            q = query(reportsRef, where("userEmail", "==", userEmail));
        } else if (departmentName) {
            q = query(reportsRef, where("department", "==", departmentName));
        } else {
            // Failsafe for missing auth context
            console.warn("No user context available for filtering. Fetching all available reports.");
            q = query(reportsRef);
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(d => ({ 
                id: d.id, 
                ...d.data(),
                displayDate: d.data().submittedOn || d.data().createdAt
            }));

            // Client-side sorting to bypass the need for Firestore composite indexes
            const sorted = fetched.sort((a, b) => {
                const timeA = a.displayDate?.seconds || 0;
                const timeB = b.displayDate?.seconds || 0;
                return timeB - timeA; // Descending
            });

            setReports(sorted);
            setLoading(false);
        }, (error) => {
            console.error("Critical Firebase Listener Error:", error);
            setLoading(false);
            alert("Connection error: Unable to load submissions from the university database.");
        });

        return () => unsubscribe();
    }, [userEmail, departmentName]);

    const handleViewPDF = (report) => {
        if (!report.fileDataUrl) return alert("PDF not found for this submission.");
        
        // Handle Cloud Link (Firebase Storage)
        if (report.fileDataUrl.startsWith("http")) {
            window.open(report.fileDataUrl, "_blank");
        } else {
            // Handle Legacy Data URL
            const link = document.createElement("a");
            link.href = report.fileDataUrl;
            link.download = report.fileName || "report.pdf";
            link.click();
        }
    };

    const handleDeleteSubmission = async (reportId) => {
        if (window.confirm("Are you sure you want to delete this submission? This action cannot be undone.")) {
            try {
                await deleteDoc(doc(db, "reports", reportId));
            } catch (err) {
                console.error("Error deleting submission:", err);
                alert("Failed to delete submission.");
            }
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
                <p>Loading your submissions...</p>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1>Submissions Tracker</h1>
                <p>Monitor the status of your departmental annual report submissions.</p>
            </div>

            <div className={styles.listContainer}>
                {reports.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📄</div>
                        <h3>No submissions found</h3>
                        <p>You haven't submitted any departmental reports yet.</p>
                    </div>
                ) : (
                    <div className={styles.reportList}>
                        <div className={styles.listHeader}>
                            <span className={styles.colDept}>Department</span>
                            <span className={styles.colDate}>Submitted On</span>
                            <span className={styles.colStatus}>Status</span>
                            <span className={styles.colAction}>Action</span>
                        </div>

                        {reports.map((report) => (
                            <div key={report.id} className={styles.reportItem}>
                                <div className={styles.colDept}>
                                    <span className={styles.deptName}>{report.department || "Faculty Report"}</span>
                                    <span className={styles.reportYear}>Ref: {report.id.substring(0, 8).toUpperCase()}</span>
                                </div>
                                
                                <div className={styles.colDate}>
                                    {report.displayDate ? (
                                        typeof report.displayDate === 'object' && report.displayDate.seconds 
                                            ? new Date(report.displayDate.seconds * 1000).toLocaleString('en-GB', {
                                                day: '2-digit', month: 'short', year: 'numeric', 
                                                hour: 'numeric', minute: '2-digit', hour12: true
                                              })
                                            : new Date(report.displayDate).toLocaleString('en-GB', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                                hour: 'numeric', minute: '2-digit', hour12: true
                                              })
                                    ) : "Pending Submission"}
                                </div>

                                <div className={styles.colStatus}>
                                    <StatusMarker status={report.status} />
                                    {report.hodRemarks && (
                                        <div className={styles.hodRemarks}>
                                            <strong>HOD Feedback:</strong> {report.hodRemarks}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.colAction}>
                                    <button 
                                        className={styles.viewBtn}
                                        onClick={() => handleViewPDF(report)}
                                    >
                                        View PDF
                                    </button>
                                    <button 
                                        className={styles.deleteBtn}
                                        onClick={() => handleDeleteSubmission(report.id)}
                                        title="Delete Submission"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
