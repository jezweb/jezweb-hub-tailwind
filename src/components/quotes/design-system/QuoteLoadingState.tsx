/**
 * QuoteLoadingState Component
 * 
 * A standardized component for displaying loading states in the quotes module.
 * This component ensures consistent styling for loading states across the quotes module.
 */

import React from 'react';

interface QuoteLoadingStateProps {
  message?: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * QuoteLoadingState component
 * 
 * @param {string} message - Optional loading message
 * @param {string} className - Additional CSS classes
 * @param {string} size - Size of the loading spinner
 */
export const QuoteLoadingState: React.FC<QuoteLoadingStateProps> = ({
  message = 'Loading...',
  className = '',
  size = 'medium'
}) => {
  // Size classes
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-gray-900 dark:border-white ${sizeClasses[size]}`}></div>
      {message && <span className="ml-2">{message}</span>}
    </div>
  );
};