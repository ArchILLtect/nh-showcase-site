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