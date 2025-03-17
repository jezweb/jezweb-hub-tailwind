/**
 * QuoteErrorMessage Component
 * 
 * A standardized component for displaying error messages in the quotes module.
 * This component ensures consistent styling for error messages across the quotes module.
 */

import React, { ReactNode } from 'react';

interface QuoteErrorMessageProps {
  message: ReactNode;
  title?: string;
  className?: string;
  onRetry?: () => void;
}

/**
 * QuoteErrorMessage component
 * 
 * @param {ReactNode} message - Error message content
 * @param {string} title - Optional error title
 * @param {string} className - Additional CSS classes
 * @param {Function} onRetry - Optional retry handler
 */
export const QuoteErrorMessage: React.FC<QuoteErrorMessageProps> = ({
  message,
  title = 'Error',
  className = '',
  onRetry
}) => {
  return (
    <div className={`mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{title}</h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            {typeof message === 'string' ? <p>{message}</p> : message}
          </div>
          
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};