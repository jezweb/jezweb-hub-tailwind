/**
 * Main Application Entry Point
 * 
 * This file serves as the entry point for the Jezweb Hub application.
 * It sets up the React application with necessary providers and wrappers:
 * 
 * - StrictMode: Enables additional checks and warnings for development
 * - ThemeProvider: Manages the application's theme (light/dark mode)
 * - AppWrapper: Provides global metadata and configuration
 * 
 * The application is rendered into the DOM element with id "root".
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <App />
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>
);
