
import React, { useState } from 'react';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import './RegisterPage.css';

const RegisterPage = ({ showLoginPage }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('report-maker');
    const [department, setDepartment] = useState('Computer Science & Engineering');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const DEPARTMENTS = [
        "Computer Science & Engineering",
        "Information Technology",
        "Electrical Engineering",
        "Electronics Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Chemical Engineering",
        "Mathematics & Computing",
        "Artificial Intelligence",
        "Internet of Things"
    ];

    const handleRegister = async (event) => {
        event.preventDefault();
        setMessage('');
        setIsLoading(true);

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        if (!trimmedName || !trimmedEmail || !trimmedPassword || !role) {
            setMessage("Please fill out all fields.");
            setIsLoading(false);
            return;
        }

        const timeoutId = setTimeout(() => {
            setIsLoading(false);
            setMessage("Connection timeout. Please check your internet or Firebase connection.");
        }, 12000); // 12 second safety timeout

        try {
            const usersRef = collection(db, "users");
            // Check if user already exists
            const q = query(usersRef, where("email", "==", trimmedEmail));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                clearTimeout(timeoutId);
                setMessage("A user with this email already exists.");
                setIsLoading(false);
                return;
            }

            // Create new user
            await addDoc(usersRef, {
                name: trimmedName,
                email: trimmedEmail,
                password: trimmedPassword,
                role,
                department,
                createdAt: serverTimestamp()
            });

            clearTimeout(timeoutId);
            setMessage("User registered successfully! Please log in.");
            
            setTimeout(() => {
                showLoginPage();
            }, 1500);
            
        } catch (error) {
            clearTimeout(timeoutId);
            console.error("Error registering user:", error);
            setMessage("Could not connect to the database. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-side-image">
                <div className="image-overlay"></div>
                <div className="brand-content">
                    <div className="logo-spark">
                        <img className="side-logo" src="/logo.png" alt="InstiReport Logo" />
                    </div>
                    <h1 className="brand-name">Join Us</h1>
                    <p className="brand-tagline">Empower your department with data-driven insights and streamlined reporting.</p>
                    <div className="feature-list">
                        <div className="feature-item">
                            <span className="dot"></span>
                            <span>Secure Data Handling</span>
                        </div>
                        <div className="feature-item">
                            <span className="dot"></span>
                            <span>Interactive Dashboards</span>
                        </div>
                        <div className="feature-item">
                            <span className="dot"></span>
                            <span>Seamless Collaboration</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="register-side-form">
                <div className="register-card">
                    <div className="register-header">
                        <h2>Create Account</h2>
                        <p>Fill in your details to get started with InstiReport</p>
                    </div>

                    <form className="register-form" onSubmit={handleRegister}>
                        <div className="group-row">
                            <div className="input-group">
                                <label htmlFor="name">Full Name</label>
                                <input id="name" type="text" placeholder="e.g., Sneha" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <div className="group-row">
                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <div className="password-wrapper">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button 
                                        type="button" 
                                        className="password-toggle" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        title={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.413 7.243 7.451 4.5 12 4.5c4.549 0 8.587 2.743 9.964 7.178.07.232.07.465 0 .697C20.587 16.757 16.549 19.5 12 19.5c-4.549 0-8.587-2.743-9.964-7.177Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="role">Register as</label>
                                <div className="select-wrapper">
                                    <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
                                        <option value="student">Student</option>
                                        <option value="faculty">Faculty</option>
                                        <option value="project-coordinator">Project Coordinator</option>
                                        <option value="hod">HOD</option>
                                        <option value="report-maker">Report Maker</option>
                                    </select>
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="department">Department</label>
                                <div className="select-wrapper">
                                    <select id="department" value={department} onChange={(e) => setDepartment(e.target.value)} required>
                                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {message && (
                            <div className={`message-alert ${message.includes("successfully") ? "success" : "error"}`}>
                                {message}
                            </div>
                        )}

                        <button type="submit" className="btn-register" disabled={isLoading}>
                            {isLoading ? (
                                <span className="loader-container">
                                    <span className="spinner-small"></span>
                                    Creating account...
                                </span>
                            ) : "Register Account"}
                        </button>
                    </form>

                    <div className="register-footer">
                        <p>
                            Already have an account?{' '}
                            <a href="#" onClick={(e) => { e.preventDefault(); showLoginPage(); }}>Sign In</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
