import React from 'react';

/**
 * JezwebHub Dashboard Component
 * 
 * This component serves as the main dashboard for the Jezweb Hub application.
 * It provides a clean, empty layout that can be extended with specific modules
 * as needed.
 */
const JezwebHubDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <div className="col-span-full">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
            Welcome to Jezweb Hub
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            This is your dashboard. You can add modules and components here as needed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JezwebHubDashboard;