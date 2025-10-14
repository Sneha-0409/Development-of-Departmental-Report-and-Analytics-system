// import React, { useState } from 'react';
// import './RegisterPage.css'; // We'll create this file next

// const RegisterPage = ({ showLoginPage }) => {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [role, setRole] = useState('report-maker');
//     const [message, setMessage] = useState('');

//     const handleRegister = async (event) => {
//         event.preventDefault();
//         setMessage('');

//         try {
//             const response = await fetch("http://localhost:3001/api/register", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ name, email, password, role }),
//             });
//             const data = await response.json();
//             setMessage(data.message);

//             if (response.ok) {
//                 // Optionally redirect to login after a short delay
//                 setTimeout(() => {
//                     showLoginPage();
//                 }, 2000);
//             }
//         } catch (error) {
//             setMessage("Could not connect to the server.");
//         }
//     };

//     return (
//         <div className="register-page">
//             <div className="register-container">
//                 <div className="header">
//                     <img className="logo" src="/logo.png" alt="InstiReport Logo" />
//                     <h1 className="title">Create an Account</h1>
//                 </div>

//                 <form className="register-form" onSubmit={handleRegister}>
//                     <label htmlFor="name">Full Name</label>
//                     <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />

//                     <label htmlFor="email">Email Address</label>
//                     <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

//                     <label htmlFor="password">Password</label>
//                     <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

//                     <label htmlFor="role">Register as</label>
//                     <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
//                         <option value="report-maker">Report Maker</option>
//                         <option value="hod">HOD</option>
//                         <option value="nba-naac">NBA/NAAC</option>
//                         <option value="admin">Admin</option>
//                     </select>

//                     {message && <p className="message">{message}</p>}

//                     <button type="submit" className="btn-submit">Register</button>
//                 </form>

//                 <p className="footer-text">
//                     Already have an account?{' '}
//                     <a href="#" onClick={showLoginPage}>Sign In</a>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default RegisterPage;

import React, { useState } from 'react';
import './RegisterPage.css'; // We will add styles in the next step

const RegisterPage = ({ showLoginPage }) => {
    // State to hold the data for each form field
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('report-maker'); // Default role
    const [message, setMessage] = useState(''); // For success or error messages

    const handleRegister = async (event) => {
        event.preventDefault(); // Prevent the form from reloading the page
        setMessage('');

        // Basic validation
        if (!name || !email || !password || !role) {
            setMessage("Please fill out all fields.");
            return;
        }

        try {
            // Send the registration data to your backend server
            const response = await fetch("http://localhost:3001/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await response.json();
            setMessage(data.message); // Display the message from the server

            if (response.ok) {
                // If registration is successful, automatically switch to the login page after 2 seconds
                setTimeout(() => {
                    showLoginPage();
                }, 2000);
            }
        } catch (error) {
            // Handle cases where the server cannot be reached
            setMessage("Could not connect to the server. Please try again later.");
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="header">
                    <img className="logo" src="/logo.png" alt="InstiReport Logo" />
                    <h1 className="title">Create an Account</h1>
                    <p className="description">Join InstiReport to get started.</p>
                </div>

                <form className="register-form" onSubmit={handleRegister}>
                    <label htmlFor="name">Full Name</label>
                    <input id="name" type="text" placeholder="e.g., Sneha" value={name} onChange={(e) => setName(e.target.value)} required />

                    <label htmlFor="email">Email Address</label>
                    <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />

                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />

                    <label htmlFor="role">Register as</label>
                    <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
                        <option value="report-maker">Report Maker</option>
                        <option value="hod">HOD</option>
                        <option value="nba-naac">NBA/NAAC</option>
                        <option value="admin">Admin</option>
                    </select>

                    {/* This is where messages like "User registered successfully!" will appear */}
                    {message && <p className="message">{message}</p>}

                    <button type="submit" className="btn-submit">Register</button>
                </form>

                <p className="footer-text">
                    Already have an account?{' '}
                    <a href="#" onClick={showLoginPage}>Sign In</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
