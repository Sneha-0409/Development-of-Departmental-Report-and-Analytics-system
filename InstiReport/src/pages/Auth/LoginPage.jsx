
import React, { useState } from "react";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth, googleProvider } from '../../firebase';
import { signOut, signInWithPopup } from "firebase/auth";
import "./LoginPage.css";

export default function LoginPage({ onLoginSuccess, showRegisterPage }) {
    const [role, setRole] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggingInGoogle, setIsLoggingInGoogle] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [choosingRole, setChoosingRole] = useState(false);
    const [googleUser, setGoogleUser] = useState(null);
    const [googleDept, setGoogleDept] = useState("Computer Science & Engineering");

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
                        role: userDoc.role,
                        department: userDoc.department || (userDoc.email.includes("wednesday") ? "Mechanical Engineering" : "")
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

    const handleGoogleLogin = async () => {
        setIsLoggingInGoogle(true);
        setMessage("");
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const userEmail = result.user?.email;
            const lowercaseEmail = userEmail?.toLowerCase();
            const isDeveloper = lowercaseEmail === "samarthkhare39@gmail.com";

            if (lowercaseEmail?.endsWith("@mitsgwl.ac.in") && !isDeveloper) {
                setMessage("Login successful!");
                setTimeout(() => {
                    onLoginSuccess({
                        name: result.user.displayName || userEmail.split('@')[0],
                        email: userEmail,
                        role: "student",
                        department: "Student"
                    });
                }, 800);
            } else if (lowercaseEmail?.endsWith("@mitsgwalior.in") || isDeveloper) {
                setGoogleUser(result.user);
                setChoosingRole(true);
            } else {
                await signOut(auth);
                setMessage("Access Denied: Please use your university email.");
            }
        } catch (error) {
            console.error("Auth Error:", error);
            setMessage("Sign-in failed. Please try again.");
        } finally {
            setIsLoggingInGoogle(false);
        }
    };

    const handleSelectGoogleRole = (selectedRole) => {
        if (!googleUser) return;
        onLoginSuccess({
            name: googleUser.displayName || googleUser.email.split('@')[0],
            email: googleUser.email,
            role: selectedRole,
            department: googleDept
        });
    };

    if (choosingRole) {
        return (
            <div className="login-page">
                <div className="login-side-image">
                    <div className="image-overlay"></div>
                    <div className="brand-content">
                        <div className="logo-spark">
                            <img className="side-logo" src="/logo.png" alt="InstiReport Logo" />
                        </div>
                        <h1 className="brand-name">InstiReport</h1>
                        <p className="brand-tagline">Select your role to complete sign-in</p>
                    </div>
                </div>
                <div className="login-side-form">
                    <div className="login-card">
                        <div className="login-header">
                            <h2>Choose Your Role</h2>
                            <p>Signed in as: <strong>{googleUser?.email}</strong></p>
                        </div>
                        <div className="input-group" style={{ marginTop: '20px' }}>
                            <label htmlFor="google-dept">Select Department</label>
                            <div className="select-wrapper">
                                <select 
                                    id="google-dept" 
                                    value={googleDept} 
                                    onChange={(e) => setGoogleDept(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                                >
                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="role-selection-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '15px' }}>
                            <button onClick={() => handleSelectGoogleRole("faculty")} className="btn-role-select">Faculty</button>
                            <button onClick={() => handleSelectGoogleRole("project-coordinator")} className="btn-role-select">Coordinator</button>
                            <button onClick={() => handleSelectGoogleRole("hod")} className="btn-role-select">HOD</button>
                            <button onClick={() => handleSelectGoogleRole("report-maker")} className="btn-role-select">Report Maker</button>
                        </div>
                        
                        <button 
                            onClick={() => { setChoosingRole(false); setGoogleUser(null); signOut(auth); }} 
                            className="btn-cancel"
                            style={{ 
                                marginTop: '20px', 
                                width: '100%',
                                background: 'transparent', 
                                border: '1px dashed var(--border)', 
                                color: 'var(--text-muted)', 
                                padding: '12px', 
                                borderRadius: '8px', 
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}
                        >
                            Cancel & Sign Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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

                        <div className="login-divider">
                            <span>OR</span>
                        </div>

                        <button 
                            type="button" 
                            className="btn-google" 
                            onClick={handleGoogleLogin} 
                            disabled={isLoggingInGoogle}
                        >
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Continue with Gmail
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
