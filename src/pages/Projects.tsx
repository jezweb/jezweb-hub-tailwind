import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

/**
 * Projects Page Component
 * 
 * This component serves as a container for all project types in the Jezweb Hub system.
 * The component uses nested routing to render the appropriate project component based on the URL.
 * 
 * @returns {JSX.Element} The rendered Projects page
 */
const Projects: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to default tab if on the base projects route
  useEffect(() => {
    if (location.pathname === '/projects') {
      navigate('/projects/website', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Helmet>
        <title>Projects | Jezweb Hub</title>
      </Helmet>

      {/* Render the nested route component */}
      <Outlet />
    </div>
  );
};

export default Projects;