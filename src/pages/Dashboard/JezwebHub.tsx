import React from "react";

/**
 * JezwebHubDashboard Component
 * 
 * This component serves as the main dashboard for the Jezweb Hub application.
 * It provides a clean, minimal interface that can be extended with specific modules
 * as needed for the Jezweb Hub functionality.
 * 
 * @returns {JSX.Element} The rendered JezwebHub dashboard
 */
const JezwebHubDashboard: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Welcome to Jezweb Hub
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Your central dashboard for managing websites, clients, and projects
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Quick Stats Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
            Quick Stats
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Active Websites</span>
              <span className="font-medium text-gray-900 dark:text-white">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Open Tickets</span>
              <span className="font-medium text-gray-900 dark:text-white">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Active Projects</span>
              <span className="font-medium text-gray-900 dark:text-white">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">New Leads</span>
              <span className="font-medium text-gray-900 dark:text-white">0</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              No recent activity to display.
            </p>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="flex flex-col space-y-3">
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Create New Ticket
            </button>
            <button className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
              Add New Client
            </button>
            <button className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
              Start New Project
            </button>
            <button className="rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
              Add Website
            </button>
          </div>
        </div>
      </div>

      {/* Additional Dashboard Content */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Tasks */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
            Upcoming Tasks
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              No upcoming tasks to display.
            </p>
          </div>
        </div>

        {/* Recent Notes */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
            Recent Notes
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              No recent notes to display.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JezwebHubDashboard;