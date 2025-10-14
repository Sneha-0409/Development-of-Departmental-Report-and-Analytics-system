

import React, { useState } from 'react';

// --- Import All Your Components ---
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import DeveloperPage from './components/DeveloperPage';
import ReportsPage from './components/ReportsPage';

function App() {
  // --- State Management ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authPage, setAuthPage] = useState('login');
  const [currentPage, setCurrentPage] = useState('Dashboard');

  // --- Core Functions ---
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

  // This function changes the active page
  const navigate = (page) => {
    setCurrentPage(page);
  };

  // --- Render Logic ---
  const renderPage = () => {
    switch (currentPage) {
      case 'Developer':
        return <DeveloperPage />;
      case 'Reports':
        return <ReportsPage />;
      case 'Dashboard':
      default:
        // **THE FIX IS HERE**: We now pass the 'navigate' function to the Dashboard
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

