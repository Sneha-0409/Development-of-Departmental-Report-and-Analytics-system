

// import React from "react";
// import "./LoginPage.css"; // Import CSS file

// export default function LoginPage() {
//     return (
//         <div className="login-page">
//             <div className="login-container">
//                 {/* Header Section */}
//                 <div className="header">
//                     <div className="logo-title">
//                         <img className="logo" src="/logo.png" alt="InstiReport Logo" />
//                         <h1 className="title">InstiReport</h1>
//                     </div>
//                     <h2 className="subtitle">Welcome Back!</h2>
//                     <p className="description">
//                         Please select your role and sign in to continue.
//                     </p>
//                 </div>

//                 {/* Login Form */}
//                 <form
//                     className="login-form"
//                     action="#"
//                     method="POST"
//                     onSubmit={(e) => e.preventDefault()}
//                 >
//                     {/* Role Selection */}
//                     <label htmlFor="role">Login as</label>
//                     <select id="role" name="role" required>
//                         <option value="" disabled defaultValue>
//                             Select your role
//                         </option>
//                         <option value="hod">HOD</option>
//                         <option value="admin">Admin</option>
//                         <option value="nba-naac">NBA/NAAC</option>
//                         <option value="report-maker">Report Maker</option>
//                     </select>

//                     {/* Email */}
//                     <label htmlFor="email">Email Address</label>
//                     <input
//                         id="email"
//                         name="email"
//                         type="email"
//                         placeholder="you@example.com"
//                         required
//                     />

//                     {/* Password */}
//                     <label htmlFor="password">Password</label>
//                     <input
//                         id="password"
//                         name="password"
//                         type="password"
//                         placeholder="••••••••"
//                         required
//                     />

//                     {/* Remember Me + Forgot Password */}
//                     <div className="form-footer">
//                         <div>
//                             <input type="checkbox" id="remember-me" />
//                             <label htmlFor="remember-me"> Remember me</label>
//                         </div>
//                         <a href="#">Forgot your password?</a>
//                     </div>

//                     {/* Button */}
//                     <button type="submit" className="btn-submit">
//                         Sign in
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }

// Import useState to manage form data
import React, { useState } from "react";
import "./LoginPage.css";

export default function LoginPage() {
    // 1. Add state to hold the email, password, and role
    const [role, setRole] = useState("hod"); // Default to 'hod' or an empty string
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 2. Create a function to handle the form submission
    const handleLogin = async (event) => {
        // This still prevents the page from reloading
        event.preventDefault();

        // A quick check to make sure fields are not empty
        if (!email || !password || !role) {
            alert("Please fill in all fields.");
            return;
        }

        console.log("Submitting with:", { role, email, password });

        try {
            // This is where you send the data to your backend API
            const response = await fetch("http://localhost:3000/api/login", { // <-- IMPORTANT: Change this URL to your backend's URL
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ role, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // SUCCESS: Login was successful
                alert("Login successful!");
                console.log("Success:", data);
                // Here you would typically save the token (data.token) and redirect the user
                // e.g., localStorage.setItem('token', data.token); window.location.href = '/dashboard';
            } else {
                // ERROR: The server responded with an error (e.g., wrong password)
                alert(data.message || "Login failed!");
                console.error("Login failed:", data.message);
            }
        } catch (error) {
            // NETWORK ERROR: The server could not be reached
            console.error("A network error occurred:", error);
            alert("Could not connect to the server. Please try again later.");
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

                {/* 4. Update the form's onSubmit to call your new handleLogin function */}
                <form className="login-form" onSubmit={handleLogin}>
                    <label htmlFor="role">Login as</label>
                    {/* 3. Link state to input values and add onChange handlers to update the state */}
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
            </div>
        </div>
    );
}