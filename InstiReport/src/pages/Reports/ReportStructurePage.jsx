import React, { useState, useRef, useEffect } from "react";
import styles from "./ReportStructurePage.module.css";
import BackButton from "../../components/BackButton";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc } from "firebase/firestore";
import { generateSemanticPDF } from "../../utils/reportPdf";

const DEFAULT_SECTIONS = [
  "1. Vision and Mission",
  "2. Faculty and Staff Details",
  "3. Student Achievements",
  "4. Research and Publications",
  "5. Labs and Infrastructure",
  "6. Events and Activities",
  "7. Budget and Utilization",
];

const AccordionItem = ({ title, content, onContentChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.accordionItem}>
      <button className={styles.accordionHeader} onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        <span className={`${styles.accordionIcon} ${isOpen ? styles.open : ""}`}>▼</span>
      </button>
      {isOpen && (
        <div className={styles.accordionContent}>
          <textarea
            className={styles.editTextarea}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={`Enter details for "${title}" here...`}
          />
        </div>
      )}
    </div>
  );
};

export default function ReportStructurePage({ dept, navigate, currentUser }) {
  const departmentName = dept?.name ?? "CSE Department";
  const [reportData, setReportData] = useState(
    DEFAULT_SECTIONS.reduce((obj, section) => ({ ...obj, [section]: "" }), {})
  );
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const exportRef = useRef();

  // Load existing draft if any
  useEffect(() => {
    const loadDraft = async () => {
      const email = currentUser?.email?.toLowerCase() || "unknown@university.edu";
      const draftId = `draft_${email}_${departmentName}`.replace(/[^a-zA-Z0-9_]/g, '_');
      const draftRef = doc(db, "drafts", draftId);
      
      try {
        const draftSnap = await getDoc(draftRef);
        if (draftSnap.exists()) {
          const data = draftSnap.data();
          if (data.reportData) {
            // Merge existing data with defaults in case of missing fields
            setReportData(prev => ({ ...prev, ...data.reportData }));
          }
        }
      } catch (err) {
        console.error("Error loading draft:", err);
      }
    };
    if (currentUser?.email) {
      loadDraft();
    }
  }, [currentUser?.email, departmentName]);

  const handleSectionChange = (section, value) => {
    setReportData((prev) => ({ ...prev, [section]: value }));
  };

  const handleSaveDraft = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setStatusMsg("Saving draft...");

    try {
      const email = currentUser?.email?.toLowerCase() || "unknown@university.edu";
      const draftId = `draft_${email}_${departmentName}`.replace(/[^a-zA-Z0-9_]/g, '_');
      const draftRef = doc(db, "drafts", draftId);

      await setDoc(draftRef, {
        department: departmentName,
        userEmail: email,
        reportData: reportData,
        updatedAt: serverTimestamp()
      }, { merge: true });

      setStatusMsg("Draft saved successfully!");
      setTimeout(() => {
        setStatusMsg("");
        setIsSubmitting(false);
      }, 1500);
    } catch (err) {
      console.error("Error saving draft:", err);
      alert("Failed to save draft. Check your connection.");
      setIsSubmitting(false);
      setStatusMsg("");
    }
  };

  const generatePDF = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setStatusMsg("Generating official semantic report...");

    try {
      // Use the native generator instead of html2canvas
      const doc = await generateSemanticPDF(reportData, {
        departmentName,
        submittedBy: currentUser?.name || "Faculty Member",
        userEmail: currentUser?.email || "faculty@university.edu",
        date: new Date().toLocaleDateString('en-US', { 
            month: 'long', day: 'numeric', year: 'numeric' 
        })
      });

      setStatusMsg("Submitting lightweight report to database...");
      
      const pdfDataUrl = doc.output('datauristring');
      
      // Save directly to Firestore (This will be ~30KB, safe under 1MB)
      await addDoc(collection(db, "reports"), {
        department: currentUser?.department || departmentName,
        userEmail: currentUser?.email?.toLowerCase() || "unknown@university.edu",
        submittedBy: currentUser?.name || "Faculty Member",
        status: "pending",
        fileDataUrl: pdfDataUrl,
        fileName: `${departmentName}_AnnualReport.pdf`,
        submittedOn: serverTimestamp(),
        createdAt: serverTimestamp()
      });

      // Removed local download; users will view/download from the Submissions Tracker
      
      setStatusMsg("Submission successful!");
      setTimeout(() => {
        setIsSubmitting(false);
        setIsReviewing(false);
        navigate("Submissions");
      }, 1000);

    } catch (err) {
      console.error("Submission Error:", err);
      alert(`Submission Failed: ${err.message}. Native PDF engine failed.`);
      setIsSubmitting(false);
      setStatusMsg("");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.breadcrumbs}>
          <span>Reports / </span>
          <strong>{departmentName}</strong>
        </div>
        <h1 className={styles.title}>Annual Report Editor</h1>
        <p className={styles.subtitle}>Fill out each section to complete the report.</p>
      </header>

      <div className={styles.accordion}>
        {DEFAULT_SECTIONS.map((section) => (
          <AccordionItem
            key={section}
            title={section}
            content={reportData[section]}
            onContentChange={(value) => handleSectionChange(section, value)}
          />
        ))}
      </div>

      <div className={styles.actionButtons}>
        <button 
          className={styles.secondaryButton} 
          onClick={handleSaveDraft}
          disabled={isSubmitting}
        >
          {isSubmitting && statusMsg.includes("draft") ? "Saving..." : "Save as Draft"}
        </button>
        <button className={styles.primaryButton} onClick={() => setIsReviewing(true)}>
          Review & Submit Report
        </button>
      </div>
      
      {statusMsg && !isReviewing && (
          <div className={styles.submitStatus} style={{ marginTop: '1rem' }}>{statusMsg}</div>
      )}

      {isReviewing && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <div className={styles.modalContent}>
              <div ref={exportRef} className={styles.pdfExportArea}>
                <div className={styles.pdfHeader}>
                  <img
                    src="/header.jpg"
                    alt="Header"
                    className={styles.headerLogo}
                    crossOrigin="anonymous"
                  />
                </div>

                <div className={styles.pdfBody}>
                  <h2 className={styles.modalTitle}>Annual Report</h2>
                  <h3 className={styles.modalSubtitle}>{departmentName}</h3>

                  <p className={styles.reportDate}>
                    Date of Report:{" "}
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  {Object.keys(reportData).map((title, index) => (
                    <React.Fragment key={title}>
                      <div className={styles.reviewSection}>
                        <h4>{title}</h4>
                        <p className={styles.reportContentText}>{reportData[title] || "No content provided."}</p>
                      </div>

                      {index < Object.keys(reportData).length - 1 && (
                        <hr className={styles.sectionSeparator} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className={styles.modalActions}>
                {statusMsg && <div className={styles.submitStatus}>{statusMsg}</div>}
                <div className={styles.buttonRow}>
                  <button className={styles.secondaryButton} onClick={() => setIsReviewing(false)} disabled={isSubmitting}>
                    Close
                  </button>
                  <button className={styles.primaryButton} onClick={generatePDF} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
