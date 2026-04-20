import React, { useEffect, useState } from "react";
import styles from "./DraftsPage.module.css";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function DraftsPage({ currentUser, navigate, onOpenDepartment }) {
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);

    const userEmail = currentUser?.email?.toLowerCase() || "";

    useEffect(() => {
        if (!userEmail) {
            console.warn("No user context available for fetching drafts.");
            setLoading(false);
            return;
        }

        setLoading(true);

        const draftsRef = collection(db, "drafts");
        const q = query(draftsRef, where("userEmail", "==", userEmail));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(d => ({ 
                id: d.id, 
                ...d.data(),
                displayDate: d.data().updatedAt
            }));

            // Client-side sorting
            const sorted = fetched.sort((a, b) => {
                const timeA = a.displayDate?.seconds || 0;
                const timeB = b.displayDate?.seconds || 0;
                return timeB - timeA; // Descending
            });

            setDrafts(sorted);
            setLoading(false);
        }, (error) => {
            console.error("Critical Firebase Listener Error:", error);
            setLoading(false);
            alert("Connection error: Unable to load drafts from the database.");
        });

        return () => unsubscribe();
    }, [userEmail]);

    const handleResumeDraft = (draft) => {
        if (onOpenDepartment) {
            onOpenDepartment({ name: draft.department });
        }
        navigate("ReportStructure");
    };

    const handleDeleteDraft = async (draftId) => {
        if (window.confirm("Are you sure you want to delete this draft? All unsaved progress will be lost.")) {
            try {
                await deleteDoc(doc(db, "drafts", draftId));
            } catch (err) {
                console.error("Error deleting draft:", err);
                alert("Failed to delete draft.");
            }
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
                <p>Loading your saved drafts...</p>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1>My Drafts</h1>
                <p>Resume your incomplete departmental reports from where you left off.</p>
            </div>

            <div className={styles.listContainer}>
                {drafts.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>✍️</div>
                        <h3>No drafts found</h3>
                        <p>Any reports you save as a draft will appear here.</p>
                    </div>
                ) : (
                    <div className={styles.draftList}>
                        <div className={styles.listHeader}>
                            <span className={styles.colDept}>Department</span>
                            <span className={styles.colDate}>Last Updated</span>
                            <span className={styles.colStatus}>Status</span>
                            <span className={styles.colAction}>Action</span>
                        </div>

                        {drafts.map((draft) => (
                            <div key={draft.id} className={styles.draftItem}>
                                <div className={styles.colDept}>
                                    <span className={styles.deptName}>{draft.department || "Faculty Report"}</span>
                                    <span className={styles.draftRef}>ID: {draft.id.substring(0, 8).toUpperCase()}</span>
                                </div>
                                
                                <div className={styles.colDate}>
                                    {draft.displayDate ? (
                                        typeof draft.displayDate === 'object' && draft.displayDate.seconds 
                                            ? new Date(draft.displayDate.seconds * 1000).toLocaleString('en-GB', {
                                                day: '2-digit', month: 'short', year: 'numeric', 
                                                hour: 'numeric', minute: '2-digit', hour12: true
                                              })
                                            : new Date(draft.displayDate).toLocaleString('en-GB', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                                hour: 'numeric', minute: '2-digit', hour12: true
                                              })
                                    ) : "Unknown Date"}
                                </div>

                                <div className={styles.colStatus}>
                                    <span className={styles.statusBadge}>Draft Mode</span>
                                </div>

                                <div className={styles.colAction}>
                                    <button 
                                        className={styles.resumeBtn}
                                        onClick={() => handleResumeDraft(draft)}
                                    >
                                        Resume Draft
                                    </button>
                                    <button 
                                        className={styles.deleteBtn}
                                        onClick={() => handleDeleteDraft(draft.id)}
                                        title="Delete Draft"
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
