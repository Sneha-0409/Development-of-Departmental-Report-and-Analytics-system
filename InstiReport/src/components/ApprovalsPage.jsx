import React, { useEffect, useState } from "react";
import styles from "./ApprovalsPage.module.css";

const STORAGE_KEY = "insti_submissions_v1";

export default function ApprovalsPage({ currentUser }) {
    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(null);
    const [remarks, setRemarks] = useState("");

    const deptName = currentUser?.department || "";

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const filtered = stored.filter(
            (item) => item.department === deptName && item.status === "pending"
        );
        setItems(filtered);
    }, [deptName]);

    const updateStatus = (item, newStatus, remarksText = null) => {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const updated = all.map((x) =>
            x.id === item.id
                ? { ...x, status: newStatus, remarks: remarksText, updatedAt: Date.now() }
                : x
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setItems(updated.filter((x) => x.department === deptName && x.status === "pending"));
        setSelected(null);
    };

    const handleViewPDF = (item) => {
        const win = window.open();
        if (win) win.location.href = item.fileDataUrl;
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>Pending Approvals</h1>
                <p>Review and approve reports submitted by your department faculty.</p>
            </header>

            {items.length === 0 ? (
                <p className={styles.empty}>✅ No pending reports right now.</p>
            ) : (
                <div className={styles.list}>
                    {items.map((item) => (
                        <div key={item.id} className={styles.card}>
                            <div className={styles.top}>
                                <div>
                                    <h3>{item.fileName}</h3>
                                    <p>{item.submittedBy} — {item.year}</p>
                                </div>
                                <button className={styles.viewBtn} onClick={() => handleViewPDF(item)}>View PDF</button>
                            </div>

                            <div className={styles.actions}>
                                <button className={styles.approveBtn} onClick={() => updateStatus(item, "approved")}>
                                    ✅ Approve
                                </button>
                                <button className={styles.rejectBtn} onClick={() => setSelected(item)}>
                                    ❌ Reject / Send Back
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            
            {selected && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Remarks for {selected.fileName}</h3>

                        <textarea
                            className={styles.textarea}
                            placeholder="Write reason for rejection or correction request..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />

                        <div className={styles.modalActions}>
                            <button className={styles.closeBtn} onClick={() => setSelected(null)}>Cancel</button>
                            <button
                                className={styles.sendBackBtn}
                                onClick={() => {
                                    updateStatus(selected, "rejected", remarks);
                                    setRemarks("");
                                }}
                            >
                                Send Back for Correction
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
