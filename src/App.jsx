// src/App.jsx

import React from 'react';
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '2.5rem' }}>
          Your Page Content Goes Here
        </h1>
      </main>
    </div>
  );
}

export default App;