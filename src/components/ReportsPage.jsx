

import React from 'react';
import styles from './ReportsPage.module.css';

const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
const CircuitIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>;
const BuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>;
const GearIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;

const ReportsPage = ({ navigate }) => {
    const departments = [
        { name: 'Civil Engineering', icon: <BuildingIcon />, bgImage: '/civil.jpg' },
        { name: 'Mechanical Engineering', icon: <GearIcon />, bgImage: '/mechanical.jpg' },
        { name: 'Electrical Engineering', icon: <CircuitIcon />, bgImage: '/electrical.jpg' },
        { name: 'Electronics Engineering', icon: <CircuitIcon />, bgImage: '/electronics.jpg' },
        { name: 'Computer Science & Engineering', icon: <CodeIcon />, bgImage: '/cse.jpg' },
        { name: 'Information Technology', icon: <CodeIcon />, bgImage: '/it.jpg' },
        { name: 'Centre for Artificial Intelligence', icon: <CodeIcon />, bgImage: '/ai.jpg' },
        { name: 'Centre for Internet of Things', icon: <CodeIcon />, bgImage: '/iot.jpg' },
        { name: 'Engineering Mathematics & Computing', icon: <CodeIcon />, bgImage: '/math.jpg' },
        { name: 'Centre for Computer Science and Technology', icon: <CodeIcon />, bgImage: '/cst.jpg' },
        { name: 'Chemical Engineering', icon: <BuildingIcon />, bgImage: '/chemical.jpg' },
    ];

    const handleDepartmentClick = (departmentName) => {
        if (departmentName === 'Computer Science & Engineering') {
            navigate('ReportStructureCSE');
        } else {
            alert(`${departmentName} page is not yet implemented.`);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Departmental Reports</h1>
                <p className={styles.subtitle}>Select a department to view or add new reports.</p>
            </div>

            <div className={styles.cardGrid}>
                {departments.map((dept, index) => (
                    <div
                        key={index}
                        className={styles.departmentCard}
                        style={{ backgroundImage: `url(${dept.bgImage})` }}
                        onClick={() => handleDepartmentClick(dept.name)}
                    >
                        <div className={styles.cardIcon}>{dept.icon}</div>
                        <h3 className={styles.cardTitle}>{dept.name}</h3>
                        <span className={styles.cardArrow}>→</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReportsPage;

