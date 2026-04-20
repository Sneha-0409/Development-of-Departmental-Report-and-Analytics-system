
import React, { useState } from "react";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import "./LoginPage.css";

export default function LoginPage({ onLoginSuccess, showRegisterPage }) {
    const [role, setRole] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setMessage("For security, check the Firebase Console 'users' collection to retrieve your password during development.");
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setMessage("");
        setIsLoading(true);

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        if (!trimmedEmail || !trimmedPassword || !role) {
            setMessage("Please fill in all fields.");
            setIsLoading(false);
            return;
        }

        try {
            const usersRef = collection(db, "users");
            
            // First check if the email exists to provide better feedback
            const emailQuery = query(usersRef, where("email", "==", trimmedEmail));
            const emailSnapshot = await getDocs(emailQuery);

            if (emailSnapshot.empty) {
                setMessage("No account found with this email Address.");
                setIsLoading(false);
                return;
            }

            // Then check exact credentials
            const q = query(
                usersRef, 
                where("email", "==", trimmedEmail), 
                where("password", "==", trimmedPassword), 
                where("role", "==", role)
            );
            
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0].data();
                setMessage("Login successful!");
                setTimeout(() => {
                    onLoginSuccess({
                        name: userDoc.name || trimmedEmail.split('@')[0],
                        email: userDoc.email,
                        role: userDoc.role
                    });
                }, 800);
            } else {
                // Determine what exactly is wrong
                const userDoc = emailSnapshot.docs[0].data();
                if (userDoc.password !== trimmedPassword) {
                    setMessage("Incorrect password. Please try again.");
                } else if (userDoc.role !== role) {
                    setMessage(`Access denied: This account is registered as '${userDoc.role.toUpperCase()}', not '${role.toUpperCase()}'.`);
                } else {
                    setMessage("Invalid email, password, or role.");
                }
            }
        } catch (error) {
            console.error("A network error occurred:", error);
            setMessage("Could not connect to the database.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-side-image">
                <div className="image-overlay"></div>
                <div className="brand-content">
                    <div className="logo-spark">
                        <img className="side-logo" src="/logo.png" alt="InstiReport Logo" />
                    </div>
                    <h1 className="brand-name">InstiReport</h1>
                    <p className="brand-tagline">Advanced Departmental Analytics & Integrated Reporting System</p>
                    <div className="feature-badges">
                        <span>Real-time Analytics</span>
                        <span>Automated Reports</span>
                        <span>Multi-role Access</span>
                    </div>
                </div>
            </div>
            
            <div className="login-side-form">
                <div className="login-card">
                    <div className="login-header">
                        <h2>Welcome Back</h2>
                        <p>Please enter your details to continue</p>
                    </div>

                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="input-group">
                            <label htmlFor="role">Login as</label>
                            <div className="select-wrapper">
                                <select
                                    id="role"
                                    name="role"
                                    required
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="student">Student</option>
                                    <option value="faculty">Faculty</option>
                                    <option value="project-coordinator">Project Coordinator</option>
                                    <option value="hod">HOD</option>
                                    <option value="report-maker">Report Maker</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

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

                        {message && (
                            <div className={`message-alert ${message.includes("successful") ? "success" : "error"}`}>
                                {message}
                            </div>
                        )}

                        <div className="form-options">
                            <label className="checkbox-container">
                                <input type="checkbox" id="remember-me" />
                                <span className="checkmark"></span>
                                <span className="label-text">Remember me</span>
                            </label>
                            <a href="#" className="forgot-link" onClick={handleForgotPassword}>Forgot password?</a>
                        </div>

                        <button type="submit" className="btn-login" disabled={isLoading}>
                            {isLoading ? (
                                <span className="loader-container">
                                    <span className="spinner-small"></span>
                                    Signing in...
                                </span>
                            ) : "Sign In"}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>
                            Don't have an account?{' '}
                            <a href="#" onClick={(e) => { e.preventDefault(); showRegisterPage(); }}>Create one now</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
