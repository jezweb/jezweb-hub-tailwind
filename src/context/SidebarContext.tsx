/**
 * Sidebar Context
 * 
 * This module provides sidebar state management for the Jezweb Hub application.
 * It handles sidebar expansion, mobile responsiveness, hover states, active items,
 * and submenu toggling functionality.
 * 
 * Features:
 * - Responsive sidebar that adapts to desktop and mobile views
 * - Expandable/collapsible sidebar with hover detection
 * - Active item tracking for navigation highlighting
 * - Submenu toggle functionality for nested navigation
 * - Window resize handling for responsive behavior
 * 
 * Usage:
 * 1. Wrap your application with SidebarProvider
 * 2. Use the useSidebar hook to access sidebar state and functions
 */

import { createContext, useContext, useState, useEffect } from "react";

/**
 * Sidebar Context Type
 * 
 * Defines the shape of the sidebar context with all available
 * state properties and functions.
 */
type SidebarContextType = {
  isExpanded: boolean;        // Whether sidebar is expanded (desktop)
  isMobileOpen: boolean;      // Whether sidebar is open (mobile)
  isHovered: boolean;         // Whether sidebar is being hovered
  activeItem: string | null;  // Currently active navigation item
  openSubmenu: string | null; // Currently open submenu
  toggleSidebar: () => void;  // Toggle sidebar expanded state
  toggleMobileSidebar: () => void; // Toggle mobile sidebar
  setIsHovered: (isHovered: boolean) => void; // Set hover state
  setActiveItem: (item: string | null) => void; // Set active item
  toggleSubmenu: (item: string) => void; // Toggle submenu open/closed
};

// Create context with undefined default value
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

/**
 * useSidebar Hook
 * 
 * Custom hook to access the sidebar context.
 * 
 * @returns {SidebarContextType} Sidebar context with state and functions
 * @throws {Error} If used outside of SidebarProvider
 */
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

/**
 * SidebarProvider Component
 * 
 * Provides sidebar context to the application and handles sidebar state.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State for sidebar configuration
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Toggle sidebar expanded state (desktop)
  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  // Toggle sidebar open state (mobile)
  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  // Toggle submenu open/closed
  const toggleSubmenu = (item: string) => {
    setOpenSubmenu((prev) => (prev === item ? null : item));
  };

  return (
    <SidebarContext.Provider
      value={{
        isExpanded: isMobile ? false : isExpanded,
        isMobileOpen,
        isHovered,
        activeItem,
        openSubmenu,
        toggleSidebar,
        toggleMobileSidebar,
        setIsHovered,
        setActiveItem,
        toggleSubmenu,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
