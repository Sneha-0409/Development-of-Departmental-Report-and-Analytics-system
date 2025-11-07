

import React, { useState, useEffect } from "react";

import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import DeveloperPage from "./components/DeveloperPage";
import ReportsPage from "./components/ReportsPage";
import ReportStructurePage from "./components/ReportStructurePage";
import SubmissionPage from "./components/SubmissionPage";
import AnalyticsPage from "./components/AnalyticsPage";


import HODDashboard from "./components/HODDashboard";
import ApprovalsPage from "./components/ApprovalsPage";

// Back button
import BackButton from "./components/BackButton";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authPage, setAuthPage] = useState("login");
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [selectedDept, setSelectedDept] = useState(null);

  //  Back history
  const [historyStack, setHistoryStack] = useState([]);

  const handleBack = () => {
    if (historyStack.length > 0) {
      const last = historyStack.pop();
      setHistoryStack([...historyStack]);
      setCurrentPage(last);
    }
  };

  const navigate = (page) => {
    if (page !== currentPage) {
      setHistoryStack((prev) => [...prev, currentPage]);
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("insti_user");
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setCurrentUser(u);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("insti_user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setCurrentPage("Dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("insti_user");
    setAuthPage("login");
  };

  // RENDER PAGE BASED ON ROLE
  const role = currentUser?.roles || "faculty";

  const renderPage = () => {
    if (role === "faculty") {
      switch (currentPage) {
        case "Reports": return <ReportsPage navigate={navigate} setSelectedDept={setSelectedDept} />;
        case "ReportStructure": return <ReportStructurePage dept={selectedDept} navigate={navigate} />;
        case "Submission": return <SubmissionPage currentUser={currentUser} />;
        case "Analytics": return <AnalyticsPage navigate={navigate} />;
        case "Developer": return <DeveloperPage />;
        default: return <Dashboard handleLogout={handleLogout} currentUser={currentUser} navigate={navigate} />;
      }
    }

    if (role === "hod") {
      switch (currentPage) {
        case "HOD Dashboard": return <HODDashboard />;
        case "Approvals": return <ApprovalsPage role="hod" />;
        case "Analytics": return <AnalyticsPage navigate={navigate} />;
        default: return <HODDashboard />;
      }
    }

    return null;
  };

  const renderAuthPage = () =>
    authPage === "login"
      ? <LoginPage onLoginSuccess={handleLoginSuccess} showRegisterPage={() => setAuthPage("register")} />
      : <RegisterPage showLoginPage={() => setAuthPage("login")} />;

  const hideBackOn = ["Dashboard", "HOD Dashboard", "Admin Dashboard"];

  return (
    <div>
      {isLoggedIn ? (
        <>
          <Navbar navigate={navigate} currentPage={currentPage} currentUser={currentUser} />

          {!hideBackOn.includes(currentPage) && historyStack.length > 0 && (
            <BackButton onBack={handleBack} />
          )}

          {renderPage()}
        </>
      ) : (
        renderAuthPage()
      )}
    </div>
  );
}

export default App;
