/**
 * Container Component
 * 
 * A standardized container component that provides consistent padding and maximum width.
 * This component is used as a wrapper for page content to ensure consistent layout across the application.
 */

import React from 'react';

interface ContainerProps {
  /** The content to be rendered inside the container */
  children: React.ReactNode;
  
  /** Additional CSS classes to apply to the container */
  className?: string;
  
  /** Maximum width of the container (default: 'max-w-7xl') */
  maxWidth?: 'max-w-xs' | 'max-w-sm' | 'max-w-md' | 'max-w-lg' | 'max-w-xl' | 'max-w-2xl' | 'max-w-3xl' | 'max-w-4xl' | 'max-w-5xl' | 'max-w-6xl' | 'max-w-7xl' | 'max-w-full';
  
  /** Horizontal padding (default: 'px-4') */
  paddingX?: string;
  
  /** Vertical padding (default: 'py-8') */
  paddingY?: string;
}

/**
 * Container component
 * 
 * @example
 * // Basic usage
 * <Container>
 *   <h1>Page Content</h1>
 * </Container>
 * 
 * @example
 * // With custom width and padding
 * <Container maxWidth="max-w-5xl" paddingX="px-6" paddingY="py-12">
 *   <h1>Page Content</h1>
 * </Container>
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  maxWidth = 'max-w-7xl',
  paddingX = 'px-4',
  paddingY = 'py-8'
}) => {
  return (
    <div className={`container mx-auto ${maxWidth} ${paddingX} ${paddingY} ${className}`}>
      {children}
    </div>
  );
};