
import React, { useState } from "react";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import "./LoginPage.css";

export default function LoginPage({ onLoginSuccess, showRegisterPage }) {
    const [role, setRole] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();
        setMessage("");

        if (!email || !password || !role) {
            setMessage("Please fill in all fields.");
            return;
        }

        try {
            const usersRef = collection(db, "users");
            const q = query(
                usersRef, 
                where("email", "==", email), 
                where("password", "==", password), 
                where("role", "==", role)
            );
            
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0].data();
                setMessage("Login successful!");
                onLoginSuccess({
                    name: userDoc.name || email.split('@')[0], // fallback if name missing
                    email: userDoc.email,
                    role: userDoc.role
                });
            } else {
                setMessage("Invalid email, password, or role.");
            }
        } catch (error) {
            console.error("A network error occurred:", error);
            setMessage("Could not connect to the database.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="header">
                    <div className="logo-title">
                        <img className="logo" src="/logo.png" alt="InstiReport Logo" />
                        <h1 className="title">InstiReport</h1>
                    </div>
                    <h2 className="subtitle">Welcome Back!</h2>
                    <p className="description">
                        Please select your role and sign in to continue.
                    </p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    <label htmlFor="role">Login as</label>
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

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {message && <p className="error-message">{message}</p>}

                    <div className="form-footer">
                        <div>
                            <input type="checkbox" id="remember-me" />
                            <label htmlFor="remember-me"> Remember me</label>
                        </div>
                        <a href="#">Forgot your password?</a>
                    </div>

                    <button type="submit" className="btn-submit">
                        Sign in
                    </button>
                </form>

                <p className="footer-text">
                    Don't have an account?{' '}
                    <a href="#" onClick={showRegisterPage}>Register Here</a>
                </p>
            </div>
        </div>
    );
}



