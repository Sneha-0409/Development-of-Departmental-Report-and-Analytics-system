// // // src/App.jsx

// // import React from 'react';
// // import Navbar from './components/Navbar';

// // function App() {
// //   return (
// //     <div>
// //       <Navbar />
// //       <main style={{ padding: '2rem', textAlign: 'center' }}>
// //         <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '2.5rem' }}>
// //           Your Page Content Goes Here
// //         </h1>
// //       </main>
// //     </div>
// //   );
// // }

// // export default App;

// import React, { useState } from 'react';
// import Navbar from './components/Navbar';
// import DeveloperPage from './components/DeveloperPage'; // Import the new page

// // A simple component for your main page content
// const HomePage = () => (
//   <main style={{ padding: '2rem', textAlign: 'center' }}>
//     <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '2.5rem' }}>
//       Your Page Content Goes Here
//     </h1>
//   </main>
// );

// function App() {
//   const [currentPage, setCurrentPage] = useState('Home');

//   // This function will be passed to the Navbar to change pages
//   const navigate = (page) => {
//     setCurrentPage(page);
//   };

//   // Conditionally render the page based on state
//   const renderPage = () => {
//     switch (currentPage) {
//       case 'Developer':
//         return <DeveloperPage />;
//       case 'Home':
//       default:
//         return <HomePage />;
//     }
//   };

//   return (
//     <div>
//       {/* Pass the navigate function and currentPage to the Navbar */}
//       <Navbar navigate={navigate} currentPage={currentPage} />
//       {renderPage()}
//     </div>
//   );
// }

// export default App;

// // src/App.jsx
// import React, { useState } from 'react';
// import Navbar from './components/Navbar';
// import DeveloperPage from './components/DeveloperPage';
// import LoginPage from './components/LoginPage'; // Import your login page

// // A simple component for your main page content (Dashboard Home)
// const HomePage = () => (
//   <main style={{ padding: '2rem', textAlign: 'center' }}>
//     <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '2.5rem' }}>
//       Welcome to the Dashboard
//     </h1>
//   </main>
// );

// function App() {
//   // Track login state
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [currentPage, setCurrentPage] = useState('Home');

//   // Function for login (can later be connected to backend)
//   const handleLogin = () => {
//     setIsLoggedIn(true);
//   };

//   // Function for logout
//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setCurrentPage('Home');
//   };

//   // Navigation between dashboard pages
//   const navigate = (page) => {
//     setCurrentPage(page);
//   };

//   // Render dashboard pages
//   const renderPage = () => {
//     switch (currentPage) {
//       case 'Developer':
//         return <DeveloperPage />;
//       case 'Home':
//       default:
//         return <HomePage />;
//     }
//   };

//   // If not logged in, show LoginPage
//   if (!isLoggedIn) {
//     return <LoginPage onLogin={handleLogin} />;
//   }

//   // Otherwise, show dashboard with Navbar
//   return (
//     <div>
//       <Navbar navigate={navigate} currentPage={currentPage} onLogout={handleLogout} />
//       {renderPage()}
//     </div>
//   );
// }

// export default App;

// import React, { useState } from 'react';
// import LoginPage from './components/LoginPage';
// import RegisterPage from './components/RegisterPage';
// import Dashboard from './components/Dashboard';
// import Navbar from './components/Navbar';

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   // This state controls whether we see the 'login' or 'register' page
//   const [authPage, setAuthPage] = useState('login');

//   const handleLoginSuccess = (userData) => {
//     setCurrentUser(userData);
//     setIsLoggedIn(true);
//     setCurrentPage('Dashboard'); 
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setCurrentUser(null);
//     setAuthPage('login'); // Go back to login page on logout
//   };

//   // This function determines which authentication page to render
//   const renderAuthPage = () => {
//     if (authPage === 'login') {
//       // Pass a function to LoginPage so it can switch the view to 'register'
//       return <LoginPage onLoginSuccess={handleLoginSuccess} showRegisterPage={() => setAuthPage('register')} />;
//     } else {
//       // Pass a function to RegisterPage so it can switch the view back to 'login'
//       return <RegisterPage showLoginPage={() => setAuthPage('login')} />;
//     }
//   };

//   return (
//     <div>
//       {isLoggedIn ? (
//         // When logged in, show the Dashboard and Navbar
//         <>
//           <Navbar currentUser={currentUser} />
//           <Dashboard handleLogout={handleLogout} currentUser={currentUser} />
//         </>
//       ) : (
//         // When logged out, show either the Login or Register page
//         renderAuthPage()
//       )}
//     </div>
//   );
// }

// export default App;

import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import DeveloperPage from './components/DeveloperPage'; // Make sure this is imported

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authPage, setAuthPage] = useState('login');

  // FIX 1: Add the state to track the current page for the navbar
  const [currentPage, setCurrentPage] = useState('Dashboard');

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
    // FIX 2: Set the current page to 'Dashboard' on successful login
    setCurrentPage('Dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setAuthPage('login');
  };

  // FIX 3: Add the navigate function to handle navbar clicks
  const navigate = (page) => {
    setCurrentPage(page);
  };

  const renderAuthPage = () => {
    if (authPage === 'login') {
      return <LoginPage onLoginSuccess={handleLoginSuccess} showRegisterPage={() => setAuthPage('register')} />;
    } else {
      return <RegisterPage showLoginPage={() => setAuthPage('login')} />;
    }
  };

  // Simple page renderer for when the user is logged in
  const renderPage = () => {
    switch (currentPage) {
      case 'Developer':
        return <DeveloperPage />;
      case 'Dashboard':
      default:
        return <Dashboard handleLogout={handleLogout} currentUser={currentUser} />;
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          {/* FIX 4: Pass the new 'navigate' and 'currentPage' props to the Navbar */}
          <Navbar
            currentUser={currentUser}
            navigate={navigate}
            currentPage={currentPage}
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

