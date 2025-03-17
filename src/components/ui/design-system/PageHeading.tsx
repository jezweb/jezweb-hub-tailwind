/**
 * PageHeading Component
 * 
 * A standardized heading component for pages.
 * This component provides a consistent layout for page titles, descriptions, and actions.
 */

import React from 'react';
import { Link } from 'react-router-dom';

interface BackLinkProps {
  /** The URL to navigate to when the back link is clicked */
  to: string;
  
  /** The label for the back link */
  label: string;
}

interface PageHeadingProps {
  /** The title of the page */
  title: string;
  
  /** Optional description text to display below the title */
  description?: string;
  
  /** Optional back link configuration */
  backLink?: BackLinkProps;
  
  /** Optional actions to display in the header (e.g., buttons) */
  actions?: React.ReactNode;
  
  /** Additional CSS classes to apply to the container */
  className?: string;
}

/**
 * PageHeading component
 * 
 * @example
 * // Basic usage
 * <PageHeading
 *   title="Page Title"
 *   description="Page description"
 * />
 * 
 * @example
 * // With back link and actions
 * <PageHeading
 *   title="Page Title"
 *   description="Page description"
 *   backLink={{
 *     to: "/previous-page",
 *     label: "Back to Previous Page"
 *   }}
 *   actions={
 *     <ActionButton variant="primary">
 *       Action
 *     </ActionButton>
 *   }
 * />
 */
export const PageHeading: React.FC<PageHeadingProps> = ({
  title,
  description,
  backLink,
  actions,
  className = ''
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {backLink && (
        <Link
          to={backLink.to}
          className="mb-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {backLink.label}
        </Link>
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
          <div className="flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};