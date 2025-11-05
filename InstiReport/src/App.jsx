

import React, { useState } from 'react';

// --- Import All Your Page Components ---
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import DeveloperPage from './components/DeveloperPage';
import ReportsPage from './components/ReportsPage';
import ReportStructurePageCSE from './components/ReportStructurePageCSE';
import AnalyticsPage from './components/AnalyticsPage'; // <-- add this import
import DepartmentReports from './components/DepartmentReports';
import ReportStructurePage from './components/ReportStructurePage';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authPage, setAuthPage] = useState('login');
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [selectedDept, setSelectedDept] = useState(null);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
    setCurrentPage('Dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setAuthPage('login');
  };
  const navigate = (page) => {
    console.log(`App.jsx: Navigating to page: ${page}`);
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Developer':
        return <DeveloperPage />;
      case 'Reports':
        return <ReportsPage navigate={navigate} />;
       case 'Analytics':                      // ✅ ADD THIS
      return <AnalyticsPage navigate={navigate} />;
      // case 'ReportStructureCSE':
      //   return <ReportStructurePageCSE />;
      case 'ReportStructure':
        return <ReportStructurePage dept={selectedDept} navigate={navigate} />;


      case 'DepartmentReports':
        return <DepartmentReports dept={selectedDept} navigate={navigate} />;

      case 'Dashboard':
      default:
        return <Dashboard handleLogout={handleLogout} currentUser={currentUser} navigate={navigate} />;
    }
  };

  const renderAuthPage = () => {
    if (authPage === 'login') {
      return <LoginPage onLoginSuccess={handleLoginSuccess} showRegisterPage={() => setAuthPage('register')} />;
    } else {
      return <RegisterPage showLoginPage={() => setAuthPage('login')} />;
    }
  };

  // --- Main Return ---
  return (
    <div>
      {isLoggedIn ? (
        <>
          <Navbar
            navigate={navigate}
            currentPage={currentPage}
            currentUser={currentUser}
          />
          {renderPage()}
        </>
      ) : (
        renderAuthPage()
      )}
    </div>
  );
}

export default App;

