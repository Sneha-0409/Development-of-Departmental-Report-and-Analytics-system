// // src/App.jsx

// import React from 'react';
// import Navbar from './components/Navbar';

// function App() {
//   return (
//     <div>
//       <Navbar />
//       <main style={{ padding: '2rem', textAlign: 'center' }}>
//         <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '2.5rem' }}>
//           Your Page Content Goes Here
//         </h1>
//       </main>
//     </div>
//   );
// }

// export default App;

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DeveloperPage from './components/DeveloperPage'; // Import the new page

// A simple component for your main page content
const HomePage = () => (
  <main style={{ padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '2.5rem' }}>
      Your Page Content Goes Here
    </h1>
  </main>
);

function App() {
  const [currentPage, setCurrentPage] = useState('Home');

  // This function will be passed to the Navbar to change pages
  const navigate = (page) => {
    setCurrentPage(page);
  };

  // Conditionally render the page based on state
  const renderPage = () => {
    switch (currentPage) {
      case 'Developer':
        return <DeveloperPage />;
      case 'Home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div>
      {/* Pass the navigate function and currentPage to the Navbar */}
      <Navbar navigate={navigate} currentPage={currentPage} />
      {renderPage()}
    </div>
  );
}

export default App;