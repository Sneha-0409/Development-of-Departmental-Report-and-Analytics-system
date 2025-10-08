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

// src/App.jsx
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DeveloperPage from './components/DeveloperPage';
import LoginPage from './components/LoginPage'; // Import your login page

// A simple component for your main page content (Dashboard Home)
const HomePage = () => (
  <main style={{ padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '2.5rem' }}>
      Welcome to the Dashboard
    </h1>
  </main>
);

function App() {
  // Track login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('Home');

  // Function for login (can later be connected to backend)
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Function for logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('Home');
  };

  // Navigation between dashboard pages
  const navigate = (page) => {
    setCurrentPage(page);
  };

  // Render dashboard pages
  const renderPage = () => {
    switch (currentPage) {
      case 'Developer':
        return <DeveloperPage />;
      case 'Home':
      default:
        return <HomePage />;
    }
  };

  // If not logged in, show LoginPage
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Otherwise, show dashboard with Navbar
  return (
    <div>
      <Navbar navigate={navigate} currentPage={currentPage} onLogout={handleLogout} />
      {renderPage()}
    </div>
  );
}

export default App;
