import React from 'react';

const Dashboard = ({ handleLogout }) => {
    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Welcome to Your Dashboard</h1>
            <p>You have successfully logged in.</p>
            <button
                onClick={handleLogout}
                style={{
                    marginTop: '2rem',
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    color: 'white',
                    backgroundColor: '#4F46E5',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                }}
            >
                Log Out
            </button>
        </div>
    );
};

export default Dashboard;
