/**
 * QuoteContainer Component
 * 
 * A standardized container component for quote pages.
 * This component ensures consistent layout and spacing for quote pages.
 */

import React, { ReactNode } from 'react';

interface QuoteContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

/**
 * QuoteContainer component
 * 
 * @param {ReactNode} children - The content to display inside the container
 * @param {string} className - Additional CSS classes
 * @param {string} maxWidth - Maximum width of the container
 */
export const QuoteContainer: React.FC<QuoteContainerProps> = ({
  children,
  className = '',
  maxWidth = 'xl'
}) => {
  // Max width classes
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  );
};