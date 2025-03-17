/**
 * ErrorMessage Component
 * 
 * A standardized error message component for displaying error information.
 * This component provides a consistent layout for error messages across the application.
 */

import React from 'react';

interface ErrorMessageProps {
  /** The title of the error message */
  title?: string;
  
  /** The error message content */
  message: string | React.ReactNode;
  
  /** Whether to show the error icon */
  showIcon?: boolean;
  
  /** Additional CSS classes to apply to the container */
  className?: string;
  
  /** Optional action to display (e.g., retry button) */
  action?: React.ReactNode;
  
  /** Optional callback function for retry action */
  onRetry?: () => void;
}

/**
 * ErrorMessage component
 * 
 * @example
 * // Basic usage
 * <ErrorMessage
 *   title="Error Title"
 *   message="Error message details"
 * />
 * 
 * @example
 * // With action
 * <ErrorMessage
 *   title="Error Title"
 *   message="Error message details"
 *   action={
 *     <button onClick={handleRetry}>
 *       Retry
 *     </button>
 *   }
 * />
 *
 * @example
 * // With onRetry callback
 * <ErrorMessage
 *   title="Error Title"
 *   message="Error message details"
 *   onRetry={handleRetry}
 * />
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message,
  showIcon = true,
  className = '',
  action,
  onRetry
}) => {
  return (
    <div className={`mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20 ${className}`}>
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0">
            <svg 
              className="h-5 w-5 text-red-400 dark:text-red-500" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        )}
        
        <div className={showIcon ? 'ml-3' : ''}>
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{title}</h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            {typeof message === 'string' ? <p>{message}</p> : message}
          </div>
          
          {action && (
            <div className="mt-4">
              {action}
            </div>
          )}
          
          {onRetry && !action && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};