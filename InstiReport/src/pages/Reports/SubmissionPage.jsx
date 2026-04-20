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

const compressImage = (file) =>
    new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            reject(new Error("Selected file is not an image."));
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1000;
                let width = img.width;
                let height = img.height;
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.6));
            };
            img.onerror = () => reject(new Error("Failed to load image."));
            img.src = event.target.result;
        };
        reader.onerror = () => reject(new Error("Failed to read file."));
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
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");

    // Form States
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [githubLink, setGithubLink] = useState("");
    const [liveLink, setLiveLink] = useState("");
    const [isDeployed, setIsDeployed] = useState(false);
    const [projectImage, setProjectImage] = useState(null);
    const [dept, setDept] = useState("");

  
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
        if (!title || !description || !githubLink || !liveLink || !projectImage || !isDeployed) {
            return alert("Please fulfill all conditions and complete the form.");
        }
        
        setIsSubmitting(true);
        setStatusMsg("Optimizing...");
        try {
            const imageDataUrl = await compressImage(projectImage);
            setStatusMsg("Uploading...");
            
            const newEntry = {
                title,
                description,
                githubLink,
                liveLink,
                projectImage: imageDataUrl,
                department: dept,
                status: "draft",
                submittedBy: userName,
                userEmail,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            const timeoutPromise = new Promise((_, rej) => 
                setTimeout(() => rej(new Error("Upload timed out. Please check your connection.")), 15000)
            );

            const uploadPromise = addDoc(collection(db, "reports"), newEntry);
            const ref = await Promise.race([uploadPromise, timeoutPromise]);

            setItems(prev => [...prev, { firestoreId: ref.id, ...newEntry }]);
            setShowModal(false);
            
            // Reset
            setTitle("");
            setDescription("");
            setGithubLink("");
            setLiveLink("");
            setProjectImage(null);
            setIsDeployed(false);
        } catch (err) {
            console.error("Error saving project:", err);
            alert("Failed to save project. Please try again.");
        } finally {
            setIsSubmitting(false);
            setStatusMsg("");
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
                <div className={styles.emptyState}>
                    <p>No projects in this section</p>
                    <button className={styles.centerBtn} onClick={() => setShowModal(true)}>
                        + Add New Project
                    </button>
                </div>
            ) : (
                <>
                    <div className={styles.cardGrid}>
                        {list.map((r) => (
                            <div key={r.firestoreId} className={styles.card}>
                                {/* ... existing card content ... */}
                                {r.projectImage && (
                                    <div className={styles.thumbnailWrapper}>
                                        <img src={r.projectImage} alt={r.title} className={styles.thumbnail} />
                                    </div>
                                )}
                                <div className={styles.cardContent}>
                                    <div className={styles.cardHeader}>
                                        <h3>{r.title}</h3>
                                        <StatusBadge status={r.status} />
                                    </div>

                                    <p className={styles.projectDesc}>{r.description}</p>
                                    
                                    <div className={styles.linkGroup}>
                                        <a href={r.githubLink} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                                            GitHub ↗
                                        </a>
                                        <a href={r.liveLink} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                                            Live Demo ↗
                                        </a>
                                    </div>

                                    {r.remarks && (
                                        <div className={styles.remarksBox}>
                                            <strong>Feedback:</strong>
                                            <p>{r.remarks}</p>
                                        </div>
                                    )}

                                    <div className={styles.actions}>
                                        {r.status === "draft" && (
                                            <>
                                                <button onClick={() => submitReport(r)} className={styles.btnPrimary}>Submit for Review</button>
                                                <button onClick={() => deleteDraft(r)} className={styles.btnDanger}>Delete</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.actionsFooter}>
                        <button className={styles.centerBtn} onClick={() => setShowModal(true)}>
                            + Add New Project
                        </button>
                    </div>
                </>
            )}

            


            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>Share Your Project</h3>
                        <p className={styles.modalSubtitle}>Document your completed and deployed work.</p>

                        <form onSubmit={createDraft} className={styles.form}>
                            <label>
                                <span>Project Title</span>
                                <input type="text" placeholder="e.g. AI Content Generator" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </label>

                            <label>
                                <span>Description</span>
                                <textarea 
                                    placeholder="Briefly describe what your project does..." 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    className={styles.textarea}
                                    required 
                                />
                            </label>

                            <div className={styles.row}>
                                <label>
                                    <span>GitHub Repository</span>
                                    <input type="url" placeholder="https://github.com/..." value={githubLink} onChange={(e) => setGithubLink(e.target.value)} required />
                                </label>
                                <label>
                                    <span>Live Deployment</span>
                                    <input type="url" placeholder="https://..." value={liveLink} onChange={(e) => setLiveLink(e.target.value)} required />
                                </label>
                            </div>

                            <label>
                                <span>Project Screenshot/Image</span>
                                <input type="file" accept="image/*" onChange={(e) => setProjectImage(e.target.files[0])} required />
                            </label>

                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" checked={isDeployed} onChange={(e) => setIsDeployed(e.target.checked)} required />
                                <span>I confirm that this project is completed and deployed.</span>
                            </label>

                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setShowModal(false)} className={styles.btnOutline} disabled={isSubmitting}>Cancel</button>
                                <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
                                    {isSubmitting ? (statusMsg || "Saving...") : "Save Showcase Item"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
