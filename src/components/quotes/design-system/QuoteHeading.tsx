/**
 * QuoteHeading Component
 * 
 * A standardized heading component for quote pages.
 * This component ensures consistent styling for page headings across the quotes module.
 */

import React, { ReactNode } from 'react';

interface QuoteHeadingProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  backLink?: {
    to: string;
    label: string;
    onClick?: () => void;
  };
  className?: string;
}

/**
 * QuoteHeading component
 * 
 * @param {string} title - The page title
 * @param {string} description - Optional description text
 * @param {ReactNode} actions - Optional action buttons
 * @param {Object} backLink - Optional back link configuration
 * @param {string} className - Additional CSS classes
 */
export const QuoteHeading: React.FC<QuoteHeadingProps> = ({
  title,
  description,
  actions,
  backLink,
  className = ''
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {backLink && (
        <button
          onClick={backLink.onClick}
          className="mb-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {backLink.label}
        </button>
      )}
      
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};