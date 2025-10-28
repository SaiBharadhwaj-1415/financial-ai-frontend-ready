// src/App.jsx (Updated to include Auth Logic)



import React, { useState } from 'react';

// Import all necessary components

import LoginPage from './pages/LoginPage.jsx';

import SignupPage from './pages/SignupPage.jsx';

import Sidebar from './components/Sidebar';

// Note: Changed the import from './pages/Home' to './pages/Homes' 

import Home from './pages/Home.jsx'; 

import Dashboard from './pages/Dashboard'; 



// Define possible authentication views

const AuthView = {

    LOGIN: 'login',

    SIGNUP: 'signup',

};



export default function App() {

    // 1. Authentication State (null = logged out)

    const [user, setUser] = useState(null); 

    

    // 2. Auth View State (used when user is null)

    const [authView, setAuthView] = useState(AuthView.LOGIN); 

    

    // 3. App View State (used when user is logged in)

    const [currentPage, setCurrentPage] = useState('Assistant');



    // --- Authentication Handlers ---



    const handleLogin = (userData) => {

        // In a real app, save token here.

        setUser(userData);

        setCurrentPage('Assistant'); // Set default page after login

    };



    const handleLogout = () => {

        // In a real app, clear token here.

        setUser(null);

        setAuthView(AuthView.LOGIN); // Return to login screen

    };



    const handleSignup = (userData) => {

        // Successful sign up leads to login page

        alert(`Account created for ${userData.email}! Please log in.`);

        setAuthView(AuthView.LOGIN);

    };



    // --- Page Render Functions ---



    const renderMainPage = () => {

        switch (currentPage) {

            case 'Dashboard':

                return <Dashboard />;

            case 'Assistant':

            default:

                return <Home />;

        }

    };



    // --- Conditional Rendering for Auth ---



    if (!user) {

        // User is NOT logged in: Show Auth Forms

        if (authView === AuthView.LOGIN) {

            return (

                <LoginPage 

                    onLogin={handleLogin} 

                    onSwitchToSignup={() => setAuthView(AuthView.SIGNUP)} 

                />

            );

        } else if (authView === AuthView.SIGNUP) {

            return (

                <SignupPage 

                    onSignup={handleSignup} 

                    onSwitchToLogin={() => setAuthView(AuthView.LOGIN)} 

                />

            );

        }

    }



    // --- Main App Layout (User is Logged In) ---

    

    return (

        <div className="flex min-h-screen bg-slate-50">

            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

            

            <main className="flex-1 p-8">

                <div className="flex justify-end mb-6">

                    <button

                        onClick={handleLogout}

                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"

                    >

                        Logout

                    </button>

                </div>

                <div className="max-w-7xl mx-auto">

                    {renderMainPage()}

                </div>

            </main>

        </div>

    );

}