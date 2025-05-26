/**
 * File: ToolBar.jsx
 * Author: Nick Hanson
 * Created On: May 25, 2024
 * Last Updated: May 25, 2025
 * Description: This component renders a toolbar with action buttons based on user roles.
 * It filters the actions based on the user's role and displays only those that are allowed.
 * It uses Tailwind CSS for styling.
 * 
 * Props:
 * - actions: An array of action objects, each containing a label, onClick function, and optional minLevel.
 * 
 * Dependencies:
 * - React
 * - PropTypes
 * - getLoggedInUser utility function
 * 
 * Example usage:
 * <Toolbar
 *   actions={[
 *     { label: "Add Blog", onClick: handleAddBlogClick, minLevel: 1 },
 *    { label: "User Tracking", onClick: handleUserTrackingClick, minLevel: 2 },
 *    { label: "Admin Tracking", onClick: handleAdminTrackingClick, minLevel: 3 },
 *   ]}
 * />
 * 
 * This will render a toolbar with buttons for "Add Blog", "User Tracking", and "Admin Tracking".
 * 
 * Notes:
 * - The component uses the getLoggedInUser utility function to retrieve the current user's role.
 * - The roleHierarchy constant is used to determine the user's level based on their role.
 * - The component uses PropTypes for type checking.
 * - The component is styled using Tailwind CSS classes.
 * - The buttons will only be displayed if the user's role level is greater than or equal to the specified minLevel.
 * - The onClick functions will be called when the buttons are clicked.
 * - The component will display a message if no actions are available for the user's role.
 * 
 */

import React from "react";
import { getLoggedInUser } from "../utils/auth.js";
import { roleHierarchy } from "../constants/roles.js";
import PropTypes from "prop-types";

const Toolbar = ({ actions }) => {
  const user = getLoggedInUser();
  const userLevel = user?.role ? roleHierarchy[user.role] ?? 0 : 0;

  const visibleActions = actions.filter(
    (action) => userLevel >= (action.minLevel ?? 0)
  );

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {visibleActions.length > 0 ? (
        visibleActions.map(({ label, onClick }, idx) => (
          <button
            key={idx}
            onClick={onClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition"
          >
            {label}
          </button>
        ))
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No available actions for your role.
        </p>
      )}
    </div>
  );
};

Toolbar.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      minLevel: PropTypes.number, // optional
    })
  ).isRequired,
};

export default Toolbar;