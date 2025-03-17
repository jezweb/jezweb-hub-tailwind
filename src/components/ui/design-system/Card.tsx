/**
 * Card Component
 * 
 * A standardized card component for displaying information in a card layout.
 * This component provides a consistent layout for card content, with optional header and footer.
 */

import React from 'react';

interface CardProps {
  /** The content to be rendered inside the card */
  children: React.ReactNode;
  
  /** Optional header content to display at the top of the card */
  header?: React.ReactNode;
  
  /** Optional footer content to display at the bottom of the card */
  footer?: React.ReactNode;
  
  /** Whether the card should have a hover effect */
  hoverable?: boolean;
  
  /** Whether the card should have a border */
  bordered?: boolean;
  
  /** Padding size for the card content */
  padding?: 'none' | 'small' | 'medium' | 'large';
  
  /** Additional CSS classes to apply to the card */
  className?: string;
}

/**
 * Card component
 * 
 * @example
 * // Basic usage
 * <Card>
 *   <p>Card content</p>
 * </Card>
 * 
 * @example
 * // With header and footer
 * <Card
 *   header={<h3 className="text-lg font-medium">Card Title</h3>}
 *   footer={<button>Action</button>}
 * >
 *   <p>Card content</p>
 * </Card>
 * 
 * @example
 * // Hoverable card
 * <Card hoverable>
 *   <p>Card content with hover effect</p>
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  hoverable = false,
  bordered = true,
  padding = 'medium',
  className = ''
}) => {
  // Determine padding class based on the padding prop
  const paddingClass = {
    none: '',
    small: 'p-3',
    medium: 'p-6',
    large: 'p-8'
  }[padding];
  
  // Determine border class based on the bordered prop
  const borderClass = bordered
    ? 'border border-gray-200 dark:border-gray-700'
    : '';
  
  // Determine hover class based on the hoverable prop
  const hoverClass = hoverable
    ? 'transition-shadow duration-200 hover:shadow-md'
    : '';
  
  return (
    <div className={`rounded-lg bg-white shadow-sm dark:bg-gray-800 ${borderClass} ${hoverClass} ${className}`}>
      {header && (
        <div className={`border-b border-gray-200 dark:border-gray-700 ${paddingClass}`}>
          {header}
        </div>
      )}
      
      <div className={paddingClass}>
        {children}
      </div>
      
      {footer && (
        <div className={`border-t border-gray-200 dark:border-gray-700 ${paddingClass}`}>
          {footer}
        </div>
      )}
    </div>
  );
};