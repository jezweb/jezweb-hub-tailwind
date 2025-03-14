import { useSidebar } from "../context/SidebarContext";

/**
 * Backdrop Component
 * 
 * This component creates a semi-transparent overlay that appears behind the mobile sidebar
 * when it's open. It serves two purposes:
 * 1. Visually indicates that the sidebar is active by dimming the main content
 * 2. Provides a clickable area to close the sidebar when clicked
 */
const Backdrop: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
      onClick={toggleMobileSidebar}
    />
  );
};

export default Backdrop;
