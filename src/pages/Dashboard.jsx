/**
 * File: Dashboard.jsx
 * Author: Nick Hanson
 * Created On: December 21, 2024
 * Last Updated: December 23, 2024
 * Description: The dashboard page for the showcase site. This is were the
 *              user lands after successful login.
 *
 * Props:
 * // TODO: Add content in these comment sections
 *
 * Notes:
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 *
 * Dependencies:
 * - React
 */


// TODO: Add a welcome message or additional UI elements to enhance the experience.

import React, { useEffect } from "react";
import { trackVisit } from "../utils/visitTracker";
import { getLoggedInUser } from '../utils/auth';
import { Navigate } from "react-router-dom";
import { roleHierarchy } from "../constants/roles.js";


const Dashboard = () => {
    const user = getLoggedInUser();
    const userLevel = user?.role ? roleHierarchy[user.role] ?? 0 : 0;
    
    useEffect(() => {
        trackVisit();
    }, []);

    if (userLevel > 0) {
        let username = user.username;
        let role = user.role;

        return (
        <div>
            <h1 className="text-gray-600 dark:text-gray-300 text-4xl font-bold text-center mb-6">User Dashboard</h1>

            <h2 className="text-2xl font-bold text-center text-gray-300 dark:text-gray-200 mb-6">
            Welcome {username}, you have {role} access
            </h2>
        </div>
        )
    } else {
        return <Navigate to="/" replace />;
    }
};

export default Dashboard;