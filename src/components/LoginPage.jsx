import React from 'react';

// In a real React application, you would typically import fonts in your main CSS file (e.g., index.css)
// @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
// and set the font-family in your tailwind.config.js or a global stylesheet.
// For this single-file component, we'll rely on the parent project's font settings.

export default function LoginPage() {
return (
<div className="bg-gray-100 flex items-center justify-center min-h-screen" style={{ fontFamily: "'Inter', sans-serif"
    }}>
    {/* Main Login Container */}
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">

        {/* Header Section */}
        <div className="text-center">
            <div className="flex items-center justify-center mb-4">
                <img className="w-16 h-16" src="/logo.png" alt="InstiReport Logo" />
                <h1 className="ml-3 text-3xl font-bold text-gray-800">InstiReport</h1>
            </div>
            <h2 className="text-xl text-gray-600">Welcome Back!</h2>
            <p className="text-sm text-gray-500">Please select your role and sign in to continue.</p>
        </div>

        {/* Login Form */}
        <form className="space-y-6" action="#" method="POST" onSubmit={(e)=> e.preventDefault()}>
            {/* Role Selection Dropdown */}
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Login as</label>
                <div className="mt-1">
                    <select id="role" name="role" required
                        className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out">
                        <option value="" disabled defaultValue>Select your role</option>
                        <option value="hod">HOD</option>
                        <option value="admin">Admin</option>
                        <option value="nba-naac">NBA/NAAC</option>
                        <option value="report-maker">Report Maker</option>
                    </select>
                </div>
            </div>

            {/* Email Input */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="mt-1">
                    <input id="email" name="email" type="email" autoComplete="email" required
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" />
                </div>
            </div>

            {/* Password Input */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1">
                    <input id="password" name="password" type="password" autoComplete="current-password" required
                        placeholder="••••••••"
                        className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" />
                </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input id="remember-me" name="remember-me" type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                </div>

                <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Forgot your password?
                    </a>
                </div>
            </div>

            {/* Submit Button */}
            <div>
                <button type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                    Sign in
                </button>
            </div>
        </form>
    </div>
</div>
);
}