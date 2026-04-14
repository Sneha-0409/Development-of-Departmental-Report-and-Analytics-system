

import React, { useState } from 'react';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import './RegisterPage.css';

const RegisterPage = ({ showLoginPage }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('report-maker');
    const [message, setMessage] = useState('');

    const handleRegister = async (event) => {
        event.preventDefault();
        setMessage('');

        if (!name || !email || !password || !role) {
            setMessage("Please fill out all fields.");
            return;
        }

        try {
            const usersRef = collection(db, "users");
            // Check if user already exists
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setMessage("A user with this email already exists.");
                return;
            }

            // Create new user
            await addDoc(usersRef, {
                name,
                email,
                password,
                role,
                createdAt: serverTimestamp()
            });

            setMessage("User registered successfully! Please log in.");
            
            setTimeout(() => {
                showLoginPage();
            }, 2000);
            
        } catch (error) {
            console.error("Error registering user:", error);
            setMessage("Could not connect to the database. Please try again later.");
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
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="project-coordinator">Project Coordinator</option>
                        <option value="hod">HOD</option>
                        <option value="report-maker">Report Maker</option>
                    </select>
                    {message && <p className="message">{message}</p>}

                    <button type="submit" className="btn-submit">Register</button>
                </form>

                <p className="footer-text">
                    Already have an account?{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); showLoginPage(); }}>Sign In</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
