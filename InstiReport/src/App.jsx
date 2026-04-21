import React, { useState, useEffect } from "react";

import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import Dashboard from "./pages/Dashboards/Dashboard";
import Navbar from "./components/Navbar";
import DeveloperPage from "./pages/Developer/DeveloperPage";
import ReportsPage from "./pages/Reports/ReportsPage";
import ReportStructurePage from "./pages/Reports/ReportStructurePage";
import SubmissionPage from "./pages/Reports/SubmissionPage";
import DraftsPage from "./pages/Reports/DraftsPage";
import StudentProjectPage from "./pages/Projects/StudentProjectPage";
import AnalyticsPage from "./pages/Analytics/AnalyticsPage";


import HODDashboard from "./pages/Dashboards/HODDashboard";
import FacultyDashboard from "./pages/Dashboards/FacultyDashboard";
import StudentDashboard from "./pages/Dashboards/StudentDashboard";
import ApprovalsPage from "./pages/Reports/ApprovalsPage";
import AchievementsPage from "./pages/Dashboards/AchievementsPage";
import ReportMakerDashboard from "./pages/Dashboards/ReportMakerDashboard";

// Back button
import BackButton from "./components/BackButton";
import "./theme.css";

import TopNav from "./components/TopNav";
import ProfilePage from "./pages/Profile/ProfilePage";
import PortfolioPage from "./pages/Portfolio/PortfolioPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authPage, setAuthPage] = useState("login");
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [selectedDept, setSelectedDept] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

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

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

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

  const role = currentUser?.role || "faculty";

  const renderPage = () => {
    switch (role) {
      case "student":
        switch (currentPage) {
          case "Analytics": return <AnalyticsPage navigate={navigate} />;
          case "My Portfolio": return <PortfolioPage currentUser={currentUser} />;
          case "Achievements": return <AchievementsPage currentUser={currentUser} />;
          case "Project": return <StudentProjectPage currentUser={currentUser} />;
          case "Developer": return <DeveloperPage />;
          case "Profile": return <ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />;
          default: return <StudentDashboard currentUser={currentUser} navigate={navigate} />;
        }
      case "faculty":
        switch (currentPage) {
          case "Project": return <StudentProjectPage currentUser={currentUser} />;
          case "Analytics": return <AnalyticsPage navigate={navigate} />;
          case "Achievements": return <AchievementsPage currentUser={currentUser} />;
          case "Developer": return <DeveloperPage />;
          case "Profile": return <ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />;
          default: return <FacultyDashboard currentUser={currentUser} navigate={navigate} />;
        }
      case "project-coordinator":
        switch (currentPage) {
          case "Project": return <SubmissionPage currentUser={currentUser} />;
          case "Analytics": return <AnalyticsPage navigate={navigate} />;
          case "Achievements": return <AchievementsPage currentUser={currentUser} />;
          case "Developer": return <DeveloperPage />;
          case "Profile": return <ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />;
          default: return <FacultyDashboard currentUser={currentUser} navigate={navigate} />;
        }
      case "hod":
        switch (currentPage) {
          case "HOD Dashboard": return <HODDashboard navigate={navigate} currentUser={currentUser} />;
          case "Approvals": return <ApprovalsPage role="hod" currentUser={currentUser} />;
          case "Analytics": return <AnalyticsPage navigate={navigate} />;
          case "Faculty": return <AchievementsPage currentUser={currentUser} />;
          case "Settings": return <ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />;
          case "Developer": return <DeveloperPage />;
          case "Profile": return <ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />;
          default: return <HODDashboard navigate={navigate} currentUser={currentUser} />;
        }
      case "report-maker":
        switch (currentPage) {
          case "Reports": return <ReportsPage navigate={navigate} onOpenDepartment={setSelectedDept} />;
          case "Submissions": return <SubmissionPage currentUser={currentUser} navigate={navigate} />;
          case "Drafts": return <DraftsPage currentUser={currentUser} navigate={navigate} onOpenDepartment={setSelectedDept} />;
          case "Analytics": return <AnalyticsPage navigate={navigate} />;
          case "Achievements": return <AchievementsPage currentUser={currentUser} />;
          case "Profile": return <ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />;
          case "Settings": return <ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />;
          case "ReportStructure": return <ReportStructurePage dept={selectedDept} navigate={navigate} currentUser={currentUser} />;
          default: return <ReportMakerDashboard currentUser={currentUser} navigate={navigate} />;
        }
      default:
        if (currentPage === "Profile") return <ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />;
        return <Dashboard handleLogout={handleLogout} currentUser={currentUser} navigate={navigate} />;
    }
  };

  const renderAuthPage = () =>
    authPage === "login"
      ? <LoginPage onLoginSuccess={handleLoginSuccess} showRegisterPage={() => setAuthPage("register")} />
      : <RegisterPage showLoginPage={() => setAuthPage("login")} />;

  const hideBackOn = ["Dashboard", "HOD Dashboard", "Admin Dashboard"];

  return (
    <>
      {isLoggedIn ? (
        <div className="app-container">
          <Navbar
            navigate={navigate}
            currentPage={currentPage}
            currentUser={currentUser}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />

          <div className="main-content">
            {currentPage !== "Dashboard" && !["HOD Dashboard", "Reports", "ReportStructure", "Approvals", "Analytics", "Submissions", "Admin Dashboard", "Profile"].includes(currentPage) && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                padding: '2.3rem 3rem 1.5rem 3rem',
                borderBottom: '1px solid var(--border)',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  {!hideBackOn.includes(currentPage) && historyStack.length > 0 && (
                    <BackButton onBack={handleBack} />
                  )}
                  <h1 style={{
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    margin: 0,
                    background: 'linear-gradient(90deg, #1e40af, #3b82f6, #60a5fa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textTransform: 'capitalize'
                  }}>
                    {currentPage}
                  </h1>
                </div>

                <div>
                  {currentPage !== "Profile" && (
                    <TopNav currentUser={currentUser} navigate={navigate} />
                  )}
                </div>
              </div>
            )}

            {currentPage === "Dashboard" && (
                <div style={{ padding: '1rem 3rem 0 3rem' }}>
                    <TopNav currentUser={currentUser} navigate={navigate} />
                </div>
            )}

            {renderPage()}
          </div>
        </div>
      ) : (
        renderAuthPage()
      )}
    </>
  );
}

export default App;
