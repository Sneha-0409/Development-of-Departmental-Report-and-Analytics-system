import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import styles from "./ReportStructurePage.module.css";

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

export default function ReportStructurePage({ dept, navigate }) {
  const departmentName = dept?.name ?? "Unknown Department";
  const [reportData, setReportData] = useState(
    DEFAULT_SECTIONS.reduce((obj, section) => ({ ...obj, [section]: "" }), {})
  );
  const [isReviewing, setIsReviewing] = useState(false);
  const exportRef = useRef();

  const handleSectionChange = (section, value) => {
    setReportData((prev) => ({ ...prev, [section]: value }));
  };

  const generatePDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");

    pdf.html(exportRef.current, {
      callback: (doc) => {
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          const footerText = `Page ${i} of ${totalPages}`;
          doc.setFontSize(10);
          const pageWidth = doc.internal.pageSize.getWidth();
          const textWidth = doc.getTextWidth(footerText);
          doc.text(footerText, (pageWidth - textWidth) / 2, 290);
        }
        doc.save(`${departmentName} - Annual Report.pdf`);
      },
      x: 20,
      y: 20,
      width: 170,
      windowWidth: 1000,
      html2canvas: { scale: 0.26, useCORS: true }
    });
  };

  return (
    <div className={styles.pageContainer}>
      {/* ✅ UI stays visible */}
      <header className={styles.header}>
        <div className={styles.breadcrumbs}>
          Reports / <strong>{departmentName}</strong>
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
        <button className={styles.secondaryButton}>Save as Draft</button>
        <button className={styles.primaryButton} onClick={() => setIsReviewing(true)}>
          Review & Submit Report
        </button>
      </div>

      {/* ✅ HIDDEN PDF EXPORT AREA */}
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
                        {reportData[title] && (
                          <p className={styles.reportContentText}>{reportData[title]}</p>
                        )}
                      </div>

                      {index < Object.keys(reportData).length - 1 && (
                        <hr className={styles.sectionSeparator} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className={styles.modalActions}>
                <button className={styles.secondaryButton} onClick={() => setIsReviewing(false)}>
                  Close
                </button>
                <button className={styles.primaryButton} onClick={generatePDF}>
                  Generate PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
