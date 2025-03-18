/**
 * ViewToggle Component
 * 
 * A reusable component for toggling between table and card views.
 * This component is used across different project types (Website, Graphics, App, SEO, Content)
 * to provide a consistent view switching interface.
 */

import React from 'react';

interface ViewToggleProps {
  /** The current view mode */
  viewMode: 'table' | 'card';
  
  /** Function to handle view mode changes */
  onViewModeChange: (mode: 'table' | 'card') => void;
  
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * ViewToggle component
 * 
 * @example
 * <ViewToggle
 *   viewMode={viewMode}
 *   onViewModeChange={setViewMode}
 * />
 */
export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  onViewModeChange,
  className = ''
}) => {
  return (
    <div className={`flex justify-end ${className}`}>
      <div className="inline-flex rounded-md shadow-sm">
        <button
          type="button"
          onClick={() => onViewModeChange('table')}
          className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-medium ${
            viewMode === 'table'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label="Table view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Table
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange('card')}
          className={`relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium ${
            viewMode === 'card'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-label="Card view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Cards
        </button>
      </div>
    </div>
  );
};