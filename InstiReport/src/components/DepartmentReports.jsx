import React from "react";
import styles from "./ReportsPage.module.css"; // reuse same tokens for now

export default function DepartmentReports({ dept, navigate }) {
  if (!dept) {
    return (
      <div className={styles.pageContainer}>
        <p>Select a department from Reports.</p>
        <button className={styles.viewBtn} onClick={()=>navigate("Reports")}>← Back to Reports</button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{dept.name}</h1>
          <p className={styles.subtitle}>Reports · Submissions · Approvals</p>
        </div>
        <div>
          <button className={styles.viewBtn} onClick={()=>navigate("Reports")}>← Back</button>
          <button className={styles.viewBtn} style={{marginLeft:8}} onClick={()=>alert("New report form coming soon!")}>+ New Report</button>
        </div>
      </div>

      {/* Quick stats (placeholder) */}
      <div className={styles.cardGrid}>
        <div className={styles.departmentCard} style={{backgroundImage:`url(${dept.bg})`}}>
          <div className={styles.badge}>KPI</div>
          <h3 className={styles.cardTitle}>Total Reports (year)</h3>
          <span className={styles.cardArrow}>12</span>
        </div>
        <div className={styles.departmentCard} style={{backgroundImage:`url(${dept.bg})`}}>
          <div className={styles.badge}>KPI</div>
          <h3 className={styles.cardTitle}>Pending Approvals</h3>
          <span className={styles.cardArrow}>3</span>
        </div>
        <div className={styles.departmentCard} style={{backgroundImage:`url(${dept.bg})`}}>
          <div className={styles.badge}>KPI</div>
          <h3 className={styles.cardTitle}>Upcoming Deadlines</h3>
          <span className={styles.cardArrow}>2</span>
        </div>
      </div>

      {/* Table placeholder */}
      <div className={styles.listWrap} style={{marginTop:"1rem"}}>
        <div className={styles.row}><div className={styles.rowLeft}><div className={styles.rowThumb} style={{backgroundImage:`url(${dept.bg})`}}/><div><div className={styles.rowName}>Annual Activities Report</div><div className={styles.rowMeta}>Submitted by: HOD · 20 Oct 2025</div></div></div><div className={styles.rowRight}>Approved</div></div>
        <div className={styles.row}><div className={styles.rowLeft}><div className={styles.rowThumb} style={{backgroundImage:`url(${dept.bg})`}}/><div><div className={styles.rowName}>Q3 Events Summary</div><div className={styles.rowMeta}>Submitted by: Faculty · 10 Oct 2025</div></div></div><div className={styles.rowRight}>Pending</div></div>
        <div className={styles.row}><div className={styles.rowLeft}><div className={styles.rowThumb} style={{backgroundImage:`url(${dept.bg})`}}/><div><div className={styles.rowName}>Budget Utilization (H1)</div><div className={styles.rowMeta}>Submitted by: Finance · 01 Aug 2025</div></div></div><div className={styles.rowRight}>Approved</div></div>
      </div>
    </div>
  );
}
