import React, { useEffect, useState, useMemo } from "react";
import styles from "./SubmissionPage.module.css";
import {
    collection, addDoc, getDocs, doc, updateDoc, deleteDoc,
    query, where, serverTimestamp, orderBy
} from "firebase/firestore";
import { db } from "../../firebase";

const DRAFT_KEY = "insti_latest_report_draft";


const fileToDataURL = (file) =>
    new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });


const StatusBadge = ({ status }) => {
    const map = {
        draft: "🟡 Draft",
        pending: "🔵 Pending Approval",
        approved: "🟢 Approved",
        rejected: "🔴 Rejected",
        needs_correction: "🟠 Needs Correction",
    };
    return <span className={`${styles.badge} ${styles[status]}`}>{map[status] || status}</span>;
};

export default function SubmissionPage({ currentUser }) {
    const userName = currentUser?.name || "Unknown User";
    const userEmail = currentUser?.email || "";
    const [items, setItems] = useState([]);
    const [tab, setTab] = useState("draft");
    const [newDept, setNewDept] = useState("");
    const [newYear, setNewYear] = useState(new Date().getFullYear());
    const [newFile, setNewFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

  
    // Load reports from Firestore on mount
    useEffect(() => {
        if (!userEmail) { setLoading(false); return; }

        const fetchReports = async () => {
            setLoading(true);
            try {
                const q = query(
                    collection(db, "reports"),
                    where("userEmail", "==", userEmail)
                );
                const snapshot = await getDocs(q);
                const fetched = snapshot.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
                setItems(fetched);

                // Handle pending draft from localStorage
                const draft = localStorage.getItem(DRAFT_KEY);
                if (draft) {
                    const data = JSON.parse(draft);
                    const localId = `${data.department}-${data.year}-${userName}`.toLowerCase().replace(/\s+/g, "-");
                    const alreadyExists = fetched.some(x => x.id === localId);
                    if (!alreadyExists) {
                        const newEntry = {
                            id: localId,
                            department: data.department,
                            year: data.year,
                            fileName: data.fileName,
                            fileDataUrl: data.fileDataUrl,
                            status: "draft",
                            submittedBy: userName,
                            userEmail,
                            submittedOn: null,
                            remarks: null,
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp(),
                        };
                        const ref = await addDoc(collection(db, "reports"), newEntry);
                        setItems(prev => [...prev, { firestoreId: ref.id, ...newEntry }]);
                    }
                    localStorage.removeItem(DRAFT_KEY);
                }
            } catch (err) {
                console.error("Error loading reports from Firestore:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [userEmail, userName]);

    
    const myItems = useMemo(
        () => items.filter((x) => x.submittedBy === userName),
        [items, userName]
    );

    
    const counts = useMemo(
        () => ({
            draft: myItems.filter((x) => x.status === "draft").length,
            pending: myItems.filter((x) => x.status === "pending").length,
            approved: myItems.filter((x) => x.status === "approved").length,
            rejected: myItems.filter((x) => x.status === "rejected").length,
            needs_correction: myItems.filter((x) => x.status === "needs_correction").length,
        }),
        [myItems]
    );

   
    const list = myItems.filter((x) => x.status === tab);

   
    const submitReport = async (r) => {
        try {
            await updateDoc(doc(db, "reports", r.firestoreId), {
                status: "pending",
                submittedOn: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            setItems(prev =>
                prev.map(x =>
                    x.firestoreId === r.firestoreId
                        ? { ...x, status: "pending", submittedOn: Date.now() }
                        : x
                )
            );
            setTab("pending");
        } catch (err) {
            console.error("Error submitting report:", err);
        }
    };

    const deleteDraft = async (r) => {
        try {
            await deleteDoc(doc(db, "reports", r.firestoreId));
            setItems(prev => prev.filter(x => x.firestoreId !== r.firestoreId));
        } catch (err) {
            console.error("Error deleting draft:", err);
        }
    };

   
    const viewPDF = (r) => {
        if (!r.fileDataUrl) return alert("PDF not stored. Please re-upload.");
        const link = document.createElement("a");
        link.href = r.fileDataUrl;
        link.download = r.fileName || "report.pdf";
        link.click();
    };


   
    const createDraft = async (e) => {
        e.preventDefault();
        if (!newDept || !newFile) return alert("Please complete the form.");
        const dataUrl = await fileToDataURL(newFile);
        const id = `${newDept}-${newYear}-${userName}`.toLowerCase().replace(/\s+/g, "-");

        const newEntry = {
            id,
            department: newDept,
            year: newYear,
            fileName: newFile.name,
            fileDataUrl: dataUrl,
            status: "draft",
            submittedBy: userName,
            userEmail,
            submittedOn: null,
            remarks: null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        try {
            const ref = await addDoc(collection(db, "reports"), newEntry);
            setItems(prev => [...prev, { firestoreId: ref.id, ...newEntry }]);
            setShowModal(false);
            // reset form
            setNewDept("");
            setNewFile(null);
        } catch (err) {
            console.error("Error saving draft:", err);
            alert("Failed to save draft. Please try again.");
        }
    };

    if (loading) return <div className={styles.page} style={{display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',color:'var(--text-muted)'}}>⏳ Loading your submissions...</div>;

    return (
        <div className={styles.page}>
            <div className={styles.tabs}>
                {["draft", "pending", "approved", "rejected", "needs_correction"].map((key) => (
                    <button
                        key={key}
                        className={`${styles.tab} ${tab === key ? styles.active : ""}`}
                        onClick={() => setTab(key)}
                    >
                        {key.replace("_", " ").toUpperCase()} <span className={styles.count}>{counts[key]}</span>
                    </button>
                ))}
            </div>

           
            {list.length === 0 ? (
                <div className={styles.emptyState}>No reports in this section</div>
            ) : (
                <div className={styles.cardGrid}>
                    {list.map((r) => (
                        <div key={r.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h3>{r.fileName}</h3>
                                <StatusBadge status={r.status} />
                            </div>

                            <p className={styles.meta}>{r.department} • {r.year}</p>

                            {r.remarks && (
                                <div className={styles.remarksBox}>
                                    <strong>HOD Remark:</strong>
                                    <p>{r.remarks}</p>
                                </div>
                            )}

                            <div className={styles.actions}>
                                <button onClick={() => viewPDF(r)} className={styles.btnOutline}>View PDF</button>

                                {r.status === "draft" && (
                                    <>
                                        <button onClick={() => submitReport(r)} className={styles.btnPrimary}>Submit</button>
                                        <button onClick={() => deleteDraft(r)} className={styles.btnDanger}>Delete</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            
            <button className={styles.fab} onClick={() => setShowModal(true)}>+ Add Submission</button>

         
            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>Add Report Submission</h3>

                        <form onSubmit={createDraft} className={styles.form}>
                            <label>
                                <span>Department</span>
                                <select value={newDept} onChange={(e) => setNewDept(e.target.value)} required>
                                    <option value="">Select department</option>
                                    <option>Computer Science & Engineering</option>
                                    <option>Information Technology</option>
                                    <option>Electrical Engineering</option>
                                    <option>Electronics Engineering</option>
                                    <option>Mechanical Engineering</option>
                                    <option>Civil Engineering</option>
                                    <option>Chemical Engineering</option>
                                </select>
                            </label>

                            <label>
                                <span>Year</span>
                                <input type="number" min="2000" max="2100" value={newYear} onChange={(e) => setNewYear(e.target.value)} required />
                            </label>

                            <label>
                                <span>Upload PDF</span>
                                <input type="file" accept="application/pdf" onChange={(e) => setNewFile(e.target.files[0])} required />
                            </label>

                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setShowModal(false)} className={styles.btnOutline}>Cancel</button>
                                <button type="submit" className={styles.btnPrimary}>Save Draft</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
