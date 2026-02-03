import React, { useEffect, useState, useMemo } from "react";
import styles from "./SubmissionPage.module.css";

const STORAGE_KEY = "insti_reports";
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
    const [items, setItems] = useState([]);
    const [tab, setTab] = useState("draft");
    const [newDept, setNewDept] = useState("");
    const [newYear, setNewYear] = useState(new Date().getFullYear());
    const [newFile, setNewFile] = useState(null);
    const [showModal, setShowModal] = useState(false);

    
    const load = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const save = (arr) => localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

  
    useEffect(() => {
        const existing = load();
        const draft = localStorage.getItem(DRAFT_KEY);

        if (draft) {
            const data = JSON.parse(draft);
            const id = `${data.department}-${data.year}-${userName}`.toLowerCase().replace(/\s+/g, "-");

            if (!existing.some((x) => x.id === id)) {
                existing.push({
                    id,
                    department: data.department,
                    year: data.year,
                    fileName: data.fileName,
                    fileDataUrl: data.fileDataUrl,
                    status: "draft",
                    submittedBy: userName,
                    submittedOn: null,
                    remarks: null,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                });
                save(existing);
            }
            localStorage.removeItem(DRAFT_KEY);
        }

        setItems(existing);
    }, [userName]);

    
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

   
    const submitReport = (r) => {
        const updated = items.map((x) =>
            x.id === r.id
                ? { ...x, status: "pending", submittedOn: Date.now(), updatedAt: Date.now() }
                : x
        );
        save(updated);
        setItems(updated);

        
        fetch("/api/reports/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(r),
        }).catch(() => console.log("Backend not connected yet"));

        setTab("pending");
    };

   
    const deleteDraft = (r) => {
        const filtered = items.filter((x) => x.id !== r.id);
        save(filtered);
        setItems(filtered);
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
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        const updated = [...items, newEntry];
        save(updated);
        setItems(updated);
        setShowModal(false);
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.pageTitle}>📤 Report Submissions</h1>
            <p className={styles.pageSubtitle}>Submit completed reports for HOD approval</p>

          
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
