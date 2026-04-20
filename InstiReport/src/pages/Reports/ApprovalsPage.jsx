import { db } from "../../firebase";
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore";

export default function ApprovalsPage({ currentUser }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [remarks, setRemarks] = useState("");

    const deptName = currentUser?.department || "";

    useEffect(() => {
        if (!deptName) {
            setLoading(false);
            return;
        }

        const fetchApprovedItems = async () => {
            setLoading(true);
            try {
                const q = query(
                    collection(db, "reports"),
                    where("department", "==", deptName),
                    where("status", "==", "pending")
                );
                const snapshot = await getDocs(q);
                const fetched = snapshot.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
                setItems(fetched);
            } catch (err) {
                console.error("Error fetching approvals:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchApprovedItems();
    }, [deptName]);

    const updateStatus = async (item, newStatus, remarksText = null) => {
        try {
            const reportRef = doc(db, "reports", item.firestoreId);
            await updateDoc(reportRef, {
                status: newStatus,
                remarks: remarksText,
                updatedAt: serverTimestamp()
            });

            // Update local state
            setItems(prev => prev.filter(x => x.firestoreId !== item.firestoreId));
            setSelected(null);
        } catch (err) {
            console.error("Error updating report status:", err);
            alert("Failed to update status. Please try again.");
        }
    };

    const handleViewPDF = (item) => {
        if (!item.fileDataUrl) return alert("PDF not found.");
        const win = window.open();
        if (win) win.location.href = item.fileDataUrl;
    };

    if (loading) return <div className={styles.loader}>⏳ Loading pending reports...</div>;

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>Pending Approvals</h1>
                <p>Review and approve reports submitted by your department faculty — {deptName}</p>
            </header>

            {items.length === 0 ? (
                <div className={styles.emptyContainer}>
                    <p className={styles.empty}>✅ All caught up! No pending reports right now.</p>
                </div>
            ) : (
                <div className={styles.list}>
                    {items.map((item) => (
                        <div key={item.firestoreId} className={styles.card}>
                            <div className={styles.top}>
                                <div className={styles.info}>
                                    <h3>{item.title || item.fileName || "Untitled Report"}</h3>
                                    <p className={styles.subInfo}>
                                        <span className={styles.author}>{item.submittedBy}</span> • {item.year || "2024"}
                                    </p>
                                </div>
                                <button className={styles.viewBtn} onClick={() => handleViewPDF(item)}>View Report</button>
                            </div>

                            <div className={styles.actions}>
                                <button className={styles.approveBtn} onClick={() => updateStatus(item, "approved")}>
                                    ✅ Approve
                                </button>
                                <button className={styles.rejectBtn} onClick={() => setSelected(item)}>
                                    ❌ Needs Correction
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selected && (
                <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h3>Feedback for {selected.title || selected.fileName}</h3>
                        <p className={styles.modalMeta}>Send this back to {selected.submittedBy} for corrections.</p>

                        <textarea
                            className={styles.textarea}
                            placeholder="Provide specific details on what needs to be corrected..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />

                        <div className={styles.modalActions}>
                            <button className={styles.closeBtn} onClick={() => setSelected(null)}>Cancel</button>
                            <button
                                className={styles.sendBackBtn}
                                onClick={() => {
                                    updateStatus(selected, "needs_correction", remarks);
                                    setRemarks("");
                                }}
                                disabled={!remarks.trim()}
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
