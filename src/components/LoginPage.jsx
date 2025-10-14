

import React, { useState } from "react";
import "./LoginPage.css";

// The component accepts props to handle login success and to show the register page
export default function LoginPage({ onLoginSuccess, showRegisterPage }) {
    const [role, setRole] = useState("report-maker");
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
            const response = await fetch("http://localhost:3001/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ role, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || "Login successful!");
                // Pass user data up to the App component to trigger the view change
                onLoginSuccess(data.user);
            } else {
                setMessage(data.message || "Login failed!");
            }
        } catch (error) {
            console.error("A network error occurred:", error);
            setMessage("Could not connect to the server.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* --- THIS IS THE MISSING HEADER SECTION --- */}
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
                    {/* --- THESE ARE THE MISSING FORM INPUTS --- */}
                    <label htmlFor="role">Login as</label>
                    <select
                        id="role"
                        name="role"
                        required
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="hod">HOD</option>
                        <option value="admin">Admin</option>
                        <option value="nba-naac">NBA/NAAC</option>
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

                    {/* This will show messages like "Login failed!" */}
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



