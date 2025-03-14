"use client";

/**
 * Theme Context
 * 
 * This module provides theme management functionality for the Jezweb Hub application.
 * It implements a light/dark theme toggle with persistence in localStorage.
 * 
 * Features:
 * - Theme state management (light/dark)
 * - Theme persistence across page reloads
 * - Theme toggle functionality
 * - Automatic application of theme classes to the document
 * 
 * Usage:
 * 1. Wrap your application with ThemeProvider
 * 2. Use the useTheme hook to access theme state and toggle function
 */

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";

// Define available theme options
type Theme = "light" | "dark";

// Define the shape of our context
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

// Create the context with undefined default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider Component
 * 
 * Provides theme context to the application and handles theme persistence.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State for current theme and initialization status
  const [theme, setTheme] = useState<Theme>("light");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    // This code will only run on the client side
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme = savedTheme || "light"; // Default to light theme

    setTheme(initialTheme);
    setIsInitialized(true);
  }, []);

  // Apply theme changes to document and save to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, isInitialized]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme Hook
 * 
 * Custom hook to access the theme context.
 * 
 * @returns {ThemeContextType} Theme context containing theme state and toggle function
 * @throws {Error} If used outside of ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
