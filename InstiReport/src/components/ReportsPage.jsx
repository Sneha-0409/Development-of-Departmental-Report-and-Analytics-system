

import React from "react";
import styles from "./ReportsPage.module.css";

// --- Icons ---
const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
);
const CircuitIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
);
const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
);
const GearIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);

const DEPARTMENTS = [
  { id: "civil", name: "Civil Engineering", icon: <BuildingIcon />, bg: "/cse.jpg" },
  { id: "me", name: "Mechanical Engineering", icon: <GearIcon />, bg: "/cse.jpg" },
  { id: "ee", name: "Electrical Engineering", icon: <CircuitIcon />, bg: "/cse.jpg" },
  { id: "ece", name: "Electronics Engineering", icon: <CircuitIcon />, bg: "/cse.jpg" },
  { id: "cse", name: "Computer Science & Engineering", icon: <CodeIcon/>, bg: "/cse.jpg" },
  { id: "it", name: "Information Technology", icon: <CodeIcon />, bg: "/cse.jpg" },
  { id: "ai", name: "Centre for Artificial Intelligence", icon: <CodeIcon />, bg: "/cse.jpg" },
  { id: "iot", name: "Centre for Internet of Things", icon: <CodeIcon />, bg: "/cse.jpg" },
  { id: "emc", name: "Engineering Mathematics & Computing", icon: <CodeIcon />, bg: "/cse.jpg" },
  { id: "ccst", name: "Centre for Computer Science and Technology", icon: <CodeIcon />, bg: "/cse.jpg" },
  { id: "che", name: "Chemical Engineering", icon: <BuildingIcon />, bg: "/cse.jpg" },
];

export default function ReportsPage({ navigate, onOpenDepartment }) {

  const openDept = (dept) => {
    if (typeof onOpenDepartment === "function") onOpenDepartment(dept);
    navigate("ReportStructure");  
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainHeader}>
        <h1>Departmental Reports</h1>
        <p>Choose a department to view, submit or manage reports</p>
      </div>

      <div className={styles.cardGrid}>
        {DEPARTMENTS.map((dept) => (
          <div
            key={dept.id}
            className={styles.departmentCard}
            style={{ backgroundImage: `url(${dept.bg})` }}
            onClick={() => openDept(dept)}
          >
            <div className={styles.cardIcon}>{dept.icon}</div>
            <h3 className={styles.cardTitle}>{dept.name}</h3>
            <span className={styles.cardArrow}>→</span>
          </div>
        ))}
      </div>
    </div>
  );
}


