import React from "react";
import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router-dom";

/**
 * Projects Page Component
 * 
 * This component serves as a container and router for different project types in the Jezweb Hub system.
 * It provides navigation between different project categories (Website, App, Graphics) and renders
 * the appropriate project component based on the current route.
 * 
 * Note: The navigation tabs have been removed as per requirements.
 * 
 * @returns {JSX.Element} The rendered Projects page with navigation and content area
 */
const Projects: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Projects | Jezweb Hub</title>
      </Helmet>

      <div className="mx-auto p-4 sm:p-6 lg:p-8">
        {/* Project Content Area */}
        <Outlet />
      </div>
    </>
  );
};

export default Projects;