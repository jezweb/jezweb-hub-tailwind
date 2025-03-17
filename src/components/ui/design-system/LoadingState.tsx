/**
 * LoadingState Component
 * 
 * A standardized loading state component for displaying loading indicators.
 * This component provides a consistent way to show loading states across the application.
 */

import React from 'react';

interface LoadingStateProps {
  /** Optional message to display alongside the loading indicator */
  message?: string;
  
  /** Whether the loading state should take up the full page */
  fullPage?: boolean;
  
  /** The size of the loading indicator */
  size?: 'small' | 'medium' | 'large';
  
  /** Additional CSS classes to apply to the container */
  className?: string;
}

/**
 * LoadingState component
 * 
 * @example
 * // Basic usage
 * <LoadingState message="Loading..." />
 * 
 * @example
 * // Full page loading state
 * <LoadingState message="Loading data..." fullPage />
 * 
 * @example
 * // Custom size
 * <LoadingState message="Loading..." size="large" />
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  fullPage = false,
  size = 'medium',
  className = ''
}) => {
  // Determine spinner size based on the size prop
  const spinnerSizeClass = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  }[size];
  
  // Determine container classes based on the fullPage prop
  const containerClasses = fullPage
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 z-50'
    : 'flex items-center justify-center py-8';
  
  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex items-center">
        <div className={`${spinnerSizeClass} animate-spin rounded-full border-b-2 border-gray-900 dark:border-white`}></div>
        
        {message && (
          <span className="ml-3 text-gray-700 dark:text-gray-300">{message}</span>
        )}
      </div>
    </div>
  );
};